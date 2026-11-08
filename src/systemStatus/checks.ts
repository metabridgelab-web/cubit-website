import Anthropic from '@anthropic-ai/sdk'
import { sql } from '@payloadcms/db-postgres'
import type { Payload } from 'payload'

import { parseFeed, videoIdFromUrl } from '../channelVideos/match'

// 관리자 화면 "오늘의 시스템 점검": 사이트가 기대는 서비스가 지금 제대로 도는지 하나씩 확인한다.
// 확인할 방법이 없는 것(예: Vercel · Cloudflare 요금)은 "확인 불가"로 두고 확인할 곳의 주소를 붙인다.

export type CheckState = 'ok' | 'warn' | 'pay' | 'down' | 'unknown'
export type Check = { key: string; name: string; state: CheckState; detail: string; link?: string; linkLabel?: string }
export type StatusReport = { checkedAt: string; checks: Check[]; todo: { label: string; count: number; href: string }[] }

const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?playlist_id=UULFX5DIoR5z5kPRTZD_03KGjw'
const TIMEOUT = 8000

const withTimeout = (ms = TIMEOUT) => AbortSignal.timeout(ms)
const rows = async (payload: Payload, query: ReturnType<typeof sql>) =>
  ((await payload.db.drizzle.execute(query)) as { rows: Record<string, unknown>[] }).rows

// 각 점검이 실패해도 나머지는 계속한다
const safe = async (key: string, name: string, run: () => Promise<Omit<Check, 'key' | 'name'>>): Promise<Check> => {
  try {
    return { key, name, ...(await run()) }
  } catch (error) {
    return { key, name, state: 'down', detail: `확인 중 오류: ${error instanceof Error ? error.message.slice(0, 120) : String(error)}` }
  }
}

const site = async (): Promise<Omit<Check, 'key' | 'name'>> => {
  const message = process.env.VERCEL_GIT_COMMIT_MESSAGE?.split('\n')[0]
  return {
    state: 'ok',
    detail: message ? `작동 중 · 지금 버전: ${message.slice(0, 70)}` : '작동 중',
    link: 'https://vercel.com/dashboard',
    linkLabel: 'Vercel 요금 · 배포 보기',
  }
}

const database = async (payload: Payload): Promise<Omit<Check, 'key' | 'name'>> => {
  const started = Date.now()
  const [size] = await rows(payload, sql`select pg_database_size(current_database())::bigint as bytes`)
  const ms = Date.now() - started
  const mb = Math.round(Number(size.bytes) / 1024 / 1024)
  // Neon 무료 요금제는 512MB까지. 유료 요금제면 한도가 훨씬 크다 (요금제는 여기서 알 수 없다)
  const nearFreeLimit = mb >= 450
  return {
    state: ms > 3000 || nearFreeLimit ? 'warn' : 'ok',
    detail: `${ms > 3000 ? '응답이 느립니다' : '정상'} · 응답 ${ms}ms · 사용 용량 ${mb}MB${mb >= 300 ? ` (무료 요금제라면 한도 512MB${nearFreeLimit ? '에 거의 찼습니다' : ''})` : ''}`,
    link: 'https://console.neon.tech',
    linkLabel: 'Neon 요금 · 용량 보기',
  }
}

const storage = async (payload: Payload): Promise<Omit<Check, 'key' | 'name'>> => {
  const { docs } = await payload.find({ collection: 'media', sort: '-createdAt', limit: 1, depth: 0 })
  const url = (docs[0] as { url?: string | null } | undefined)?.url
  if (!url) return { state: 'unknown', detail: '확인할 사진이 없습니다' }
  const absolute = url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_SERVER_URL ?? ''}${url}`
  const response = await fetch(absolute, { method: 'HEAD', signal: withTimeout(), cache: 'no-store' })
  return response.ok
    ? { state: 'ok', detail: '사진 · 파일이 정상으로 열립니다', link: 'https://dash.cloudflare.com', linkLabel: 'Cloudflare 요금 보기' }
    : { state: 'down', detail: `최근 올린 사진이 열리지 않습니다 (응답 ${response.status})`, link: 'https://dash.cloudflare.com', linkLabel: 'Cloudflare 보기' }
}

const stream = async (payload: Payload): Promise<Omit<Check, 'key' | 'name'>> => {
  const { docs } = await payload.find({
    collection: 'home-slides',
    where: { and: [{ active: { equals: true } }, { videoSource: { equals: 'stream' } }] },
    depth: 0,
    limit: 50,
  })
  const ids = docs.map((slide) => (slide as { streamId?: string | null }).streamId?.trim()).filter(Boolean) as string[]
  if (!ids.length) return { state: 'ok', detail: 'Cloudflare Stream을 쓰는 대문 영상이 없습니다' }
  const results = await Promise.all(
    ids.map((id) => fetch(`https://videodelivery.net/${id}/manifest/video.m3u8`, { signal: withTimeout(), cache: 'no-store' }).then((r) => r.ok).catch(() => false)),
  )
  const broken = results.filter((ok) => !ok).length
  return {
    state: broken ? 'down' : 'ok',
    detail: broken ? `대문 영상 ${ids.length}개 중 ${broken}개가 재생되지 않습니다` : `대문 영상 ${ids.length}개 모두 재생 가능`,
    link: 'https://dash.cloudflare.com',
    linkLabel: 'Stream 사용량 · 요금 보기',
  }
}

// 자동 번역에 쓰는 Claude API. 아주 짧은 요청을 한 번 보내 크레딧과 키를 확인한다 (한 번에 0.01원 수준).
let claudeCache: { at: number; result: Omit<Check, 'key' | 'name'> } | null = null
const claude = async (): Promise<Omit<Check, 'key' | 'name'>> => {
  const link = 'https://platform.claude.com/settings/billing'
  if (!process.env.ANTHROPIC_API_KEY) return { state: 'down', detail: 'API 키가 설정되어 있지 않아 자동 번역이 멈춰 있습니다', link, linkLabel: 'Claude Console 보기' }
  if (claudeCache && Date.now() - claudeCache.at < 10 * 60 * 1000) return claudeCache.result
  let result: Omit<Check, 'key' | 'name'>
  try {
    await new Anthropic({ maxRetries: 0, timeout: TIMEOUT }).messages.create({
      model: 'claude-haiku-5-5',
      max_tokens: 1,
      messages: [{ role: 'user', content: 'ok' }],
    })
    result = { state: 'ok', detail: '자동 번역 가능 · 크레딧 있음', link, linkLabel: 'Claude 크레딧 · 요금 보기' }
  } catch (error) {
    const status = (error as { status?: number }).status
    const message = String((error as { message?: string }).message ?? '')
    if (/credit balance/i.test(message)) result = { state: 'pay', detail: '크레딧이 바닥나 자동 번역이 멈춰 있습니다. 충전이 필요합니다', link, linkLabel: '크레딧 충전하기' }
    else if (status === 401 || status === 403) result = { state: 'down', detail: 'API 키가 맞지 않아 자동 번역이 멈춰 있습니다', link, linkLabel: 'Claude Console 보기' }
    else if (status === 429 || status === 529 || status === 503) result = { state: 'warn', detail: 'Claude가 잠시 바쁩니다. 번역은 조금 늦어질 수 있습니다', link: 'https://status.claude.com', linkLabel: 'Claude 상태 보기' }
    else throw error
  }
  claudeCache = { at: Date.now(), result }
  return result
}

// 예약 작업(자동 번역 · 알림 메일 · 예약 게시)을 1분마다 실행하는 Vercel 정기 호출
const jobs = async (payload: Payload): Promise<Omit<Check, 'key' | 'name'>> => {
  const [stat] = await rows(
    payload,
    sql`select
      count(*) filter (where completed_at is null and has_error is not true)::int as open,
      extract(epoch from now() - min(created_at) filter (where completed_at is null and has_error is not true))::int as oldest,
      count(*) filter (where has_error and updated_at > now() - interval '1 day')::int as failed
    from payload_jobs`,
  )
  const open = Number(stat.open)
  const oldestMinutes = Math.round(Number(stat.oldest ?? 0) / 60)
  const failed = Number(stat.failed)
  if (open && oldestMinutes >= 30) return { state: 'down', detail: `작업 ${open}개가 ${oldestMinutes}분째 처리되지 않았습니다. 정기 호출이 멈췄을 수 있습니다` }
  if (failed) return { state: 'warn', detail: `최근 하루 동안 실패한 작업 ${failed}개 (번역 · 메일 등)${open ? ` · 대기 ${open}개` : ''}` }
  return { state: 'ok', detail: open ? `정상 · 처리 중인 작업 ${open}개` : '정상 · 밀린 작업 없음' }
}

// 1시간마다 도는 유튜브 새 영상 자동 등록
const youtube = async (payload: Payload): Promise<Omit<Check, 'key' | 'name'>> => {
  const link = 'https://studio.youtube.com'
  const response = await fetch(FEED_URL, { signal: withTimeout(), cache: 'no-store' })
  if (!response.ok) return { state: 'unknown', detail: `유튜브 채널을 읽지 못했습니다 (응답 ${response.status})`, link, linkLabel: '유튜브 스튜디오' }
  const feed = parseFeed(await response.text())
  const { docs: artists } = await payload.find({ collection: 'artists', depth: 0, limit: 0, pagination: false, select: { videos: true } })
  const { docs: reviews } = await payload.find({ collection: 'channel-video-reviews', depth: 0, limit: 0, pagination: false, select: { youtubeId: true } })
  const known = new Set([
    ...artists.flatMap((artist) => (artist.videos ?? []).map((video) => videoIdFromUrl(video.youtubeUrl))),
    ...reviews.map((review) => review.youtubeId),
  ])
  // 올라온 지 1시간 반이 넘었는데 아직 어디에도 없으면 자동 등록이 멈춘 것
  const missed = feed.filter((video) => !known.has(video.id) && Date.now() - Date.parse(video.published) > 90 * 60 * 1000)
  if (missed.length) return { state: 'down', detail: `올라온 지 1시간 반이 넘은 영상 ${missed.length}개가 아직 등록되지 않았습니다. 자동 등록이 멈췄을 수 있습니다` }
  return { state: 'ok', detail: '정상 · 새 영상은 1시간 안에 자동으로 들어갑니다', link, linkLabel: '유튜브 스튜디오' }
}

// 문의 · 견적 알림 메일 (Resend)
const email = async (): Promise<Omit<Check, 'key' | 'name'>> => {
  const link = 'https://resend.com/emails'
  const key = process.env.RESEND_API_KEY
  if (!key) return { state: 'down', detail: '메일 키가 없어 문의 알림 메일이 나가지 않습니다', link, linkLabel: 'Resend 보기' }
  const response = await fetch('https://api.resend.com/domains', { headers: { Authorization: `Bearer ${key}` }, signal: withTimeout(), cache: 'no-store' })
  const body = (await response.json().catch(() => ({}))) as { name?: string; message?: string; data?: { name: string; status: string }[] }
  // 발송 전용 키는 도메인 목록을 못 읽지만 키 자체는 유효하다
  if (response.status === 401 && /restricted/i.test(`${body.name} ${body.message}`)) return { state: 'ok', detail: '메일 발송 가능', link, linkLabel: 'Resend 보기' }
  if (response.status === 401 || response.status === 403) return { state: 'down', detail: '메일 키가 맞지 않아 알림 메일이 나가지 않습니다', link, linkLabel: 'Resend 보기' }
  if (!response.ok) return { state: 'unknown', detail: `메일 서비스 응답 ${response.status}`, link, linkLabel: 'Resend 보기' }
  const pending = (body.data ?? []).filter((domain) => domain.status !== 'verified')
  return pending.length
    ? { state: 'warn', detail: `인증이 끝나지 않은 메일 도메인: ${pending.map((d) => d.name).join(', ')}`, link: 'https://resend.com/domains', linkLabel: '도메인 인증 보기' }
    : { state: 'ok', detail: '메일 발송 가능', link, linkLabel: 'Resend 보기' }
}

const todo = async (payload: Payload) => {
  const count = async (collection: 'quote-requests' | 'inquiries' | 'channel-video-reviews', where: object) =>
    (await payload.count({ collection, where: where as never })).totalDocs
  const [quotes, inquiries, videos] = await Promise.all([
    count('quote-requests', { status: { equals: 'received' } }).catch(() => 0),
    count('inquiries', { status: { equals: 'received' } }).catch(() => 0),
    count('channel-video-reviews', { status: { equals: 'pending' } }).catch(() => 0),
  ])
  return [
    { label: '새 견적 요청', count: quotes, href: '/admin/collections/quote-requests?where[status][equals]=received' },
    { label: '새 문의', count: inquiries, href: '/admin/collections/inquiries?where[status][equals]=received' },
    { label: '확인할 유튜브 영상', count: videos, href: '/admin/collections/channel-video-reviews?where[status][equals]=pending' },
  ]
}

export const runSystemChecks = async (payload: Payload): Promise<StatusReport> => {
  const checks = await Promise.all([
    safe('site', '사이트 (Vercel)', site),
    safe('database', '데이터베이스 (Neon)', () => database(payload)),
    safe('storage', '사진 · 파일 저장소 (Cloudflare R2)', () => storage(payload)),
    safe('stream', '대문 영상 (Cloudflare Stream)', () => stream(payload)),
    safe('claude', '자동 번역 (Claude API)', claude),
    safe('jobs', '예약 작업 (번역 · 알림 · 예약 게시)', () => jobs(payload)),
    safe('youtube', '유튜브 자동 등록', () => youtube(payload)),
    safe('email', '문의 알림 메일 (Resend)', email),
  ])
  return { checkedAt: new Date().toISOString(), checks, todo: await todo(payload) }
}
