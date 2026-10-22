'use client'

import { usePathname } from 'next/navigation'

import { LOCALES, type LocaleCode } from '@/constants/locales'

// 지금 보는 페이지를 다른 언어로 바꾼다. 고른 언어는 1년간 기억해서 다음 방문 때도 그 언어로 연다.
export function LanguageSwitcher({ locale, enabled, label }: { locale: LocaleCode; enabled: LocaleCode[]; label: string }) {
  const pathname = usePathname() ?? `/${locale}`
  const rest = pathname.split('/').slice(2).join('/')

  return (
    <nav aria-label={label}>
      <ul>
        {LOCALES.filter((l) => enabled.includes(l.code)).map((l) => (
          <li key={l.code}>
            <a
              href={`/${l.code}${rest ? `/${rest}` : ''}`}
              hrefLang={l.code}
              lang={l.code}
              aria-current={l.code === locale ? 'true' : undefined}
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${l.code}; path=/; max-age=31536000; samesite=lax`
              }}
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
