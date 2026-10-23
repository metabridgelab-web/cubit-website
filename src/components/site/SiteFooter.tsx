import { ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getNavigation, getSiteSettings, getUiLabels } from '@/lib/data'
import { mediaUrl } from '@/lib/page'

import { DEFAULT_LOGO } from './SiteHeader'
import { SocialIcon } from './SocialIcon'

// 모든 페이지 하단: 회사 정보(법적 표시) · 메뉴 바로가기 · 정책 링크 · AI 생성 표시 · 저작권
export async function SiteFooter({ locale }: { locale: LocaleCode }) {
  const [settings, nav, labels] = await Promise.all([getSiteSettings(locale), getNavigation(locale), getUiLabels(locale)])
  const logo = mediaUrl(settings.logoDark, 'thumbnail') ?? mediaUrl(settings.logo, 'thumbnail') ?? DEFAULT_LOGO
  const companyRows = [settings.companyName, settings.ceo && `CEO ${settings.ceo}`, settings.address, settings.businessNumber, settings.email, settings.phone].filter(
    Boolean,
  ) as string[]

  return (
    <footer className="relative border-t border-white/10 bg-black px-5 pt-16 pb-10 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Link href={localePath(locale)} className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" width={56} height={56} className="h-14 w-14" />
            <span className="font-black tracking-[0.4em] uppercase">{settings.siteName}</span>
          </Link>
          <div className="flex flex-wrap items-center gap-8">
            <Link href={localePath(locale, '/business/campaign')} className="btn-irid">
              {nav.ctaLabel ?? labels.common.getQuote} <ArrowUpRight size={16} aria-hidden />
            </Link>
            <ul className="flex gap-5 text-white/50">
              {(settings.socials ?? []).map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="transition-colors hover:text-cyan">
                    <SocialIcon platform={social.platform} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-1.5 text-sm text-white/50 lg:col-span-2">
            {companyRows.map((row) => (
              <p key={row} className="whitespace-pre-line">
                {row}
              </p>
            ))}
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-col gap-2.5">
              {nav.sections.map((section) => (
                <li key={section.id}>
                  <Link href={localePath(locale, section.url ?? '/')} className="font-mono text-xs tracking-[0.15em] text-white/60 uppercase transition-colors hover:text-cyan">
                    {section.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ul className="flex flex-col gap-2.5">
            {(settings.policyLinks ?? []).map((page) =>
              typeof page === 'object' ? (
                <li key={page.id}>
                  <Link href={localePath(locale, `/legal/${page.slug}`)} className="text-sm text-white/60 transition-colors hover:text-white">
                    {page.title}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/10 pt-8 font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase md:flex-row md:justify-between">
          <p>{settings.aiNotice}</p>
          <p>{settings.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
