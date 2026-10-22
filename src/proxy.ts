import { NextResponse, type NextRequest } from 'next/server'

import { isLocale, LOCALE_COOKIE, pickLocale } from './i18n'

// 언어가 빠진 주소로 들어오면 언어를 붙여 보낸다.
// 순서: 방문자가 고른 언어(쿠키) → 브라우저 언어 → 영어
// 예: /artists → /ko/artists (한국어 브라우저)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const first = pathname.split('/')[1]
  if (isLocale(first)) return

  const saved = request.cookies.get(LOCALE_COOKIE)?.value
  const locale = isLocale(saved) ? saved : pickLocale(request.headers.get('accept-language'))
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  // 관리자 화면 · API · Next.js 내부 파일 · 확장자가 있는 파일(이미지 등)은 건드리지 않는다
  matcher: ['/((?!admin|api|_next|next|media|favicon\\.ico|robots\\.txt|sitemap\\.xml|.*\\..*).*)'],
}
