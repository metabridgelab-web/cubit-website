import { draftMode } from 'next/headers'

// 미리보기 끝내기: 초안 보기를 끄고 보던 페이지로 돌아간다 (같은 사이트 주소만)
export async function POST(request: Request) {
  ;(await draftMode()).disable()
  const site = new URL(request.url)
  const back = new URL(request.headers.get('referer') ?? '/', site)
  return Response.redirect(back.origin === site.origin ? back.href : site.origin, 303)
}
