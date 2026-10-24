import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getInvestors, getSiteSettings, getUiLabels } from '@/lib/data'

// 모든 페이지 하단: 회사 정보(법적 표시) · 정책 링크(+ 투자자 정보 공개 중이면 위험 고지) · AI 생성 표시 · 저작권만 둔다.
// 로고 · 견적 버튼 · 메뉴 바로가기는 두지 않는다 (상단 로고와 오른쪽 위 메뉴 버튼으로 충분)
export async function SiteFooter({ locale }: { locale: LocaleCode }) {
  const [settings, investors, labels] = await Promise.all([getSiteSettings(locale), getInvestors(locale), getUiLabels(locale)])
  const companyRows = [settings.companyName, settings.ceo && `CEO ${settings.ceo}`, settings.address, settings.businessNumber, settings.email, settings.phone].filter(
    Boolean,
  ) as string[]
  // 정책 링크는 한 줄에 놓고 양 끝을 아래 줄(AI 표시 · 저작권)과 맞춘다. 휴대폰에서는 두 칸씩.
  const links = [
    ...(settings.policyLinks ?? []).flatMap((page) => (typeof page === 'object' ? [{ href: `/legal/${page.slug}`, label: page.title }] : [])),
    ...(investors ? [{ href: '/investors/disclaimer', label: labels.investors.disclaimer }] : []),
  ]

  return (
    <footer className="relative border-t border-white/10 bg-black px-5 pt-12 pb-10 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
        {companyRows.length ? (
          <div className="flex flex-col gap-1.5 text-sm text-white/50">
            {companyRows.map((row) => (
              <p key={row} className="whitespace-pre-line">
                {row}
              </p>
            ))}
          </div>
        ) : null}

        {links.length ? (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 md:flex md:justify-between">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={localePath(locale, link.href)} className="text-sm text-white/60 transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}

        <div
          className={`flex flex-col gap-3 font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase md:flex-row md:justify-between ${
            companyRows.length || links.length ? 'border-t border-white/10 pt-8' : ''
          }`}
        >
          <p>{settings.aiNotice}</p>
          <p>{settings.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
