import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getEnabledLocales, getNavigation, getSiteSettings, getUiLabels } from '@/lib/data'

import { LanguageSwitcher } from './LanguageSwitcher'

// 디자인 적용 전 임시 뼈대 화면. 디자인 파일이 오면 이 파일을 디자인대로 바꾼다.
// 데이터(메뉴 · 회사 정보 · 언어 목록)는 그대로 쓰고 모양만 바꾸면 된다.

export async function SiteHeader({ locale }: { locale: LocaleCode }) {
  const [settings, nav, labels, enabled] = await Promise.all([
    getSiteSettings(locale),
    getNavigation(locale),
    getUiLabels(locale),
    getEnabledLocales(),
  ])
  return (
    <header>
      <Link href={localePath(locale)}>{settings.siteName}</Link>
      <details>
        <summary>{labels.common.menu}</summary>
        <nav aria-label="Main">
          <ul>
            {nav.sections.map((section) => (
              <li key={section.id}>
                {section.url ? <Link href={localePath(locale, section.url)}>{section.label}</Link> : section.label}
                {section.items?.length ? (
                  <ul>
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <Link href={localePath(locale, item.url ?? '/')}>{item.label}</Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
          <Link href={localePath(locale, '/business/campaign')}>{nav.ctaLabel}</Link>
        </nav>
      </details>
      <LanguageSwitcher locale={locale} enabled={enabled} label={labels.common.language} />
    </header>
  )
}

export async function SiteFooter({ locale }: { locale: LocaleCode }) {
  const settings = await getSiteSettings(locale)
  return (
    <footer>
      <p>{settings.companyName}</p>
      {settings.ceo ? <p>CEO {settings.ceo}</p> : null}
      {settings.address ? <p>{settings.address}</p> : null}
      {settings.businessNumber ? <p>{settings.businessNumber}</p> : null}
      <ul>
        {(settings.socials ?? []).map((social) => (
          <li key={social.id}>
            <a href={social.url} target="_blank" rel="noopener noreferrer">
              {social.platform}
            </a>
          </li>
        ))}
      </ul>
      <ul>
        {(settings.policyLinks ?? []).map((page) =>
          typeof page === 'object' ? (
            <li key={page.id}>
              <Link href={localePath(locale, `/legal/${page.slug}`)}>{page.title}</Link>
            </li>
          ) : null,
        )}
      </ul>
      <p>{settings.aiNotice}</p>
      <p>{settings.copyright}</p>
    </footer>
  )
}
