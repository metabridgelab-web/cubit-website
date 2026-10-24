import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getEnabledLocales, getInvestors, getNavigation, getSiteSettings, getUiLabels } from '@/lib/data'
import { mediaUrl } from '@/lib/page'

import { HeaderBar } from './HeaderBar'
import { LanguageMenu } from './LanguageMenu'

// 관리자 화면의 메뉴 · 사이트 설정 · 고정 문구를 읽어서 상단 바와 전체 화면 메뉴에 넘긴다
export async function SiteHeader({ locale }: { locale: LocaleCode }) {
  const [settings, nav, labels, enabled, investors] = await Promise.all([
    getSiteSettings(locale),
    getNavigation(locale),
    getUiLabels(locale),
    getEnabledLocales(),
    getInvestors(locale),
  ])
  // 투자자 정보가 공개 전이면 INVESTORS 메뉴를 숨긴다
  const sections = nav.sections.filter((section) => investors || !section.url?.startsWith('/investors'))
  const href = (url?: string | null) => (url?.startsWith('http') ? url : localePath(locale, url ?? '/'))

  return (
    <HeaderBar
      homeHref={localePath(locale)}
      siteName={settings.siteName}
      menuLabel={labels.common.menu}
      closeLabel={labels.common.close}
      sections={sections.map((section) => ({
        id: section.id ?? section.label,
        label: section.label,
        href: href(section.url),
        preview: mediaUrl(section.previewImage, 'large'),
        items: (section.items ?? []).map((item) => ({ id: item.id ?? item.label ?? '', label: item.label ?? '', href: href(item.url) })),
      }))}
      cta={{ label: nav.ctaLabel ?? labels.common.getQuote, href: localePath(locale, '/business/campaign') }}
      socials={(settings.socials ?? []).map((s) => ({ id: s.id ?? s.url, platform: s.platform, url: s.url }))}
      copyright={settings.copyright ?? ''}
      languageMenu={<LanguageMenu locale={locale} enabled={enabled} label={labels.common.language} />}
    />
  )
}
