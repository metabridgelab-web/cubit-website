import config from '@payload-config'
import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload, type Payload } from 'payload'

import { DEFAULT_LOCALE } from '@/constants/locales'
import { isLocale, localePath } from '@/i18n'

// 관리자 화면의 "미리보기" 버튼이 여는 주소: /preview?collection=artists&id=81&locale=ko
// 로그인한 관리자만 초안 보기를 켤 수 있다. 켜지면 그 브라우저에서만 게시 전 초안이 보인다.

const text = (body: string, status: number) => new Response(body, { status, headers: { 'content-type': 'text/plain; charset=utf-8' } })

// 문서가 실제 사이트의 어느 주소에 보이는지
const pathOf = async (payload: Payload, collection: string | null, id: number): Promise<string | null> => {
  const read = { id, draft: true, depth: 1, overrideAccess: true, disableErrors: true } as const
  if (collection === 'artists') {
    const doc = await payload.findByID({ collection: 'artists', ...read })
    if (!doc) return null
    const first = doc.categories?.find((c) => typeof c === 'object')
    return `/artists/${typeof first === 'object' ? first.slug : 'all'}/${doc.slug}`
  }
  if (collection === 'case-studies') {
    const doc = await payload.findByID({ collection: 'case-studies', ...read })
    return doc ? `/business/works/${doc.slug}` : null
  }
  if (collection === 'pages') {
    const doc = await payload.findByID({ collection: 'pages', ...read })
    if (!doc) return null
    if (doc.section === 'company') return doc.slug === 'about' ? '/about' : `/about/${doc.slug}`
    if (doc.section === 'business' || doc.section === 'legal' || doc.section === 'trust') return `/${doc.section}/${doc.slug}`
    return `/${doc.section}`
  }
  return null
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return text('관리자 화면에 로그인한 뒤 "미리보기"를 눌러 주세요.', 401)

  const path = await pathOf(payload, params.get('collection'), Number(params.get('id')))
  if (!path) return text('미리볼 문서를 찾지 못했습니다. 먼저 "초안 저장"을 눌러 주세요.', 404)

  const locale = params.get('locale')
  ;(await draftMode()).enable()
  redirect(localePath(isLocale(locale) ? locale : DEFAULT_LOCALE, path))
}
