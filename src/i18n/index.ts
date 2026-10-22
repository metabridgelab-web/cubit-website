import { DEFAULT_LOCALE, LOCALES, type LocaleCode } from '../constants/locales'

export const LOCALE_CODES = LOCALES.map((l) => l.code) as LocaleCode[]

export const isLocale = (value: string | undefined | null): value is LocaleCode =>
  Boolean(value) && LOCALE_CODES.includes(value as LocaleCode)

export const textDirection = (locale: LocaleCode): 'rtl' | 'ltr' =>
  LOCALES.find((l) => l.code === locale)?.rtl ? 'rtl' : 'ltr'

// 언어가 붙은 사이트 주소. localePath('ja', '/artists') → '/ja/artists'
export const localePath = (locale: LocaleCode, path = '/') => {
  const clean = path.startsWith('/') ? path : `/${path}`
  return clean === '/' ? `/${locale}` : `/${locale}${clean}`
}

export const SITE_URL = (process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').replace(/\/$/, '')

// 검색엔진용 언어별 주소(hreflang). 같은 페이지의 12개 언어 주소와 기본(x-default) 주소를 알려준다.
export const languageAlternates = (path: string, locales: LocaleCode[] = LOCALE_CODES) => ({
  ...Object.fromEntries(locales.map((code) => [code, `${SITE_URL}${localePath(code, path)}`])),
  'x-default': `${SITE_URL}${localePath(DEFAULT_LOCALE, path)}`,
})

// 브라우저 언어 설정(Accept-Language)에서 지원하는 언어를 고른다. 예: "ko-KR,ko;q=0.9,en;q=0.8" → ko
export const pickLocale = (acceptLanguage: string | null | undefined): LocaleCode => {
  if (!acceptLanguage) return DEFAULT_LOCALE
  const ranked = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, ...params] = part.trim().split(';')
      const q = params.find((p) => p.trim().startsWith('q='))
      return { tag: tag.toLowerCase(), q: q ? Number(q.split('=')[1]) || 0 : 1 }
    })
    .sort((a, b) => b.q - a.q)
  for (const { tag } of ranked) {
    const base = tag.split('-')[0]
    if (isLocale(base)) return base
  }
  return DEFAULT_LOCALE
}

export const LOCALE_COOKIE = 'NEXT_LOCALE'
