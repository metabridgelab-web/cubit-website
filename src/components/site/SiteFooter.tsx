import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getSiteSettings } from '@/lib/data'

// 모든 페이지 하단: 회사 정보(법적 표시) · 정책 링크 · AI 생성 표시 · 저작권만 둔다.
// 로고 · 견적 버튼 · 메뉴 바로가기는 두지 않는다 (상단 로고와 오른쪽 위 메뉴 버튼으로 충분)
export async function SiteFooter({ locale }: { locale: LocaleCode }) {
  const settings = await getSiteSettings(locale)
  const companyRows = [settings.companyName, settings.ceo && `CEO ${settings.ceo}`, settings.address, settings.businessNumber, settings.email, settings.phone].filter(
    Boolean,
  ) as string[]
  const policies = (settings.policyLinks ?? []).filter((page) => typeof page === 'object')

  return (
    <footer className="relative border-t border-white/10 bg-black px-5 pt-12 pb-10 md:px-10">
      <div className="mx-auto flex max-w-[1600px] flex-col gap-10">
        {companyRows.length || policies.length ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-1.5 text-sm text-white/50 lg:col-span-2">
              {companyRows.map((row) => (
                <p key={row} className="whitespace-pre-line">
                  {row}
                </p>
              ))}
            </div>
            <ul className="flex flex-col gap-2.5 lg:col-start-4">
              {policies.map((page) =>
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
        ) : null}

        <div
          className={`flex flex-col gap-3 font-mono text-[10px] tracking-[0.1em] text-white/40 uppercase md:flex-row md:justify-between ${
            companyRows.length || policies.length ? 'border-t border-white/10 pt-8' : ''
          }`}
        >
          <p>{settings.aiNotice}</p>
          <p>{settings.copyright}</p>
        </div>
      </div>
    </footer>
  )
}
