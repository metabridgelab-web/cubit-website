import { createHash } from 'crypto'
import {
  APIError,
  type CollectionAfterChangeHook,
  type CollectionBeforeChangeHook,
  type Field,
  type PayloadRequest,
  type TaskConfig,
} from 'payload'

import { hasRole } from '../access'
import { CAMPAIGN_LANGUAGES, CAMPAIGN_REGIONS, CAMPAIGN_USAGES, labelOf } from '../constants/campaign'
import { DEFAULT_LOCALE, LOCALE_OPTIONS, LOCALES, type LocaleCode } from '../constants/locales'

// 방문자가 보내는 접수(견적 요청 · 문의) 공통 처리
// - 스팸 막기: 숨은 칸(봇만 채움) · 같은 곳에서 1시간에 5건까지 (첨부 파일은 15개까지)
// - 접수 후: 담당자 알림 메일 + 요청자 접수 확인 메일 (작업 대기열에서 보내고, 실패하면 다시 시도)

export const NOTIFY_TASK = 'notifySubmission'
type InboxSlug = 'quote-requests' | 'inquiries'

const staffOnly = ({ req }: { req: PayloadRequest }) => hasRole(req, 'sales')

// 같은 곳에서 1시간에 보낼 수 있는 개수를 세기 위한 칸 (접속 주소를 그대로 저장하지 않고 암호화한 값)
export const ipHashField: Field = {
  name: 'ipHash',
  type: 'text',
  index: true,
  admin: { hidden: true },
  access: { read: staffOnly, update: () => false },
}

export const submissionFields: Field[] = [
  {
    name: 'submittedLocale',
    label: '접수 언어',
    type: 'select',
    options: LOCALE_OPTIONS,
    admin: { position: 'sidebar', readOnly: true, description: '요청자가 사이트를 보던 언어. 접수 확인 메일이 이 언어로 갑니다.' },
  },
  {
    // 사람은 보지 못하는 칸. 채워져 있으면 자동 프로그램(봇)이 보낸 것으로 본다.
    name: 'website',
    type: 'text',
    admin: { hidden: true },
    access: { read: () => false, update: () => false },
  },
  ipHashField,
]

// 배포 플랫폼(Vercel)이 직접 붙이는 주소를 먼저 믿고, 없으면 일반 프록시 주소를 쓴다
const clientIp = (req: PayloadRequest) =>
  req.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() ||
  req.headers.get('x-real-ip') ||
  req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
  'unknown'

const hashIp = (ip: string) =>
  createHash('sha256')
    .update(`${process.env.PAYLOAD_SECRET ?? ''}:${ip}`)
    .digest('hex')
    .slice(0, 32)

// 같은 방문자(IP)가 한 시간에 maxPerHour번 넘게 보내면 막는다. 방문자 구분값(ipHash)을 돌려준다.
export const assertSubmissionRate = async (req: PayloadRequest, slug: InboxSlug | 'attachments', maxPerHour: number) => {
  const ipHash = hashIp(clientIp(req))
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { totalDocs } = await req.payload.count({
    collection: slug,
    where: { ipHash: { equals: ipHash }, createdAt: { greater_than: since } },
    overrideAccess: true,
    req,
  })
  if (totalDocs >= maxPerHour) {
    throw new APIError('Too many submissions. Please try again later.', 429, undefined, true)
  }
  return ipHash
}

export const ATTACHMENTS_PER_HOUR = 15

export const guardSubmission =
  (slug: InboxSlug | 'attachments', { maxPerHour = 5 }: { maxPerHour?: number } = {}): CollectionBeforeChangeHook =>
  async ({ data, operation, req }) => {
    if (operation !== 'create' || req.user) return data

    if (slug !== 'attachments' && data.website) throw new APIError('Submission rejected.', 400, undefined, true)

    const ipHash = await assertSubmissionRate(req, slug, maxPerHour)

    if (slug === 'attachments') return { ...data, ipHash }

    const locale = LOCALES.some((l) => l.code === req.locale) ? (req.locale as LocaleCode) : DEFAULT_LOCALE
    // 접수 언어는 요청 주소의 ?locale= 값(방문자가 보던 언어)으로 정한다
    return { ...data, ipHash, website: null, submittedLocale: locale }
  }

export const queueNotification =
  (slug: InboxSlug): CollectionAfterChangeHook =>
  async ({ doc, operation, req }) => {
    if (operation !== 'create') return doc
    await req.payload.jobs.queue({ task: NOTIFY_TASK, input: { slug, id: String(doc.id) }, req })
    return doc
  }

const escapeHtml = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

const table = (rows: [string, unknown][]) =>
  `<table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([label, value]) => `<tr><td style="color:#666;vertical-align:top">${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`)
    .join('')}</table>`

const TYPE_LABELS: Record<string, string> = { partnership: '제휴', press: '언론', investment: '투자', other: '기타', report: '사칭 신고', application: '지원' }

export const notifyTask: TaskConfig = {
  slug: NOTIFY_TASK,
  label: '접수 알림 메일',
  retries: 3,
  inputSchema: [
    { name: 'slug', type: 'text', required: true },
    { name: 'id', type: 'text', required: true },
  ],
  handler: async ({ input: rawInput, req: runnerReq }) => {
    const { payload } = runnerReq
    const input = rawInput as { slug: InboxSlug; id: string }
    const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
    const siteName = settings.siteName ?? 'CUBIT ENTERTAINMENT'
    const adminUrl = `${process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}/admin/collections/${input.slug}/${input.id}`

    if (input.slug === 'quote-requests') {
      const doc = await payload.findByID({ collection: 'quote-requests', id: input.id, depth: 1, overrideAccess: true })
      const locale = (doc.submittedLocale as LocaleCode | null) ?? DEFAULT_LOCALE
      const business = await payload.findGlobal({ slug: 'business-settings', locale, depth: 0 })
      const talentNames = (doc.talents ?? []).map((t) => (typeof t === 'object' ? t.name : t)).join(', ')
      // 아티스트를 고르지 않은 요청 (공개된 아티스트가 없을 때)
      const talents = talentNames || '탤런트 미지정'

      const summary = table([
        ['회사명', doc.companyName],
        ['담당자', doc.contactName],
        ['이메일', doc.email],
        ['연락처', doc.phone],
        ['탤런트', talents],
        ['용도', (doc.usage ?? []).map((u) => labelOf(CAMPAIGN_USAGES, u)).join(', ')],
        ['기간', [doc.periodStart?.slice(0, 10), doc.periodEnd?.slice(0, 10)].filter(Boolean).join(' ~ ')],
        ['지역', [...(doc.regions ?? []).map((r) => labelOf(CAMPAIGN_REGIONS, r)), ...(doc.regionsOther ?? [])].join(', ')],
        ['언어', (doc.languages ?? []).map((l) => labelOf(CAMPAIGN_LANGUAGES, l)).join(', ')],
        ['요청 사항', doc.message],
      ])

      if (business.notifyEmails?.length) {
        await payload.sendEmail({
          to: business.notifyEmails,
          subject: `[견적 요청] ${doc.companyName} · ${talents}`,
          html: `<p>새 견적 요청이 들어왔습니다.</p>${summary}<p><a href="${adminUrl}">관리자 화면에서 보기</a></p>`,
        })
      }
      await payload.sendEmail({
        to: doc.email,
        subject: `${siteName} — Quote request received`,
        html: `<p>${escapeHtml(business.confirmationMessage)}</p>${table([
          ['Company', doc.companyName],
          ['Talent', talentNames || '—'],
        ])}<p>${escapeHtml(siteName)}</p>`,
      })
    } else {
      const doc = await payload.findByID({ collection: 'inquiries', id: input.id, depth: 0, overrideAccess: true })
      const summary = table([
        ['유형', TYPE_LABELS[doc.type] ?? doc.type],
        ['회사명', doc.companyName],
        ['담당자', doc.contactName],
        ['이메일', doc.email],
        ['연락처', doc.phone],
        ['지원 분야', doc.position],
        ['신고 대상', doc.reportedUrl],
        ['내용', doc.message],
        ['첨부 파일', doc.attachments?.length ? `${doc.attachments.length}개 (관리자 화면에서 확인)` : ''],
      ])
      if (settings.notifyEmails?.length) {
        await payload.sendEmail({
          to: settings.notifyEmails,
          subject: `[문의 · ${TYPE_LABELS[doc.type] ?? doc.type}] ${doc.companyName || doc.contactName}`,
          html: `<p>새 문의가 들어왔습니다.</p>${summary}<p><a href="${adminUrl}">관리자 화면에서 보기</a></p>`,
        })
      }
      await payload.sendEmail({
        to: doc.email,
        subject: `${siteName} — We received your message`,
        html: `<p>Thank you for contacting ${escapeHtml(siteName)}. Our team will get back to you soon.</p><p>${escapeHtml(siteName)}</p>`,
      })
    }
    return { output: {} }
  },
}
