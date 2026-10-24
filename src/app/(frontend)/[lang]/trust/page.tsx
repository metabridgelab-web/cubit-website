import { ArrowRight, ShieldWarning } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader, PageShell } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getPagesBySection, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/trust', { title: labels.trust.title, description: labels.trust.intro })
}

// TRUST: 신뢰 원칙 페이지들(관리자 "페이지"의 TRUST 섹션) + 사칭 신고
export default async function TrustPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [pages, labels] = await Promise.all([getPagesBySection('trust', locale), getUiLabels(locale)])
  return (
    <PageShell>
      <PageHeader eyebrow="Trust // Principles" title={labels.trust.title} />
      <p className="-mt-4 mb-16 max-w-3xl text-xl leading-relaxed text-white/70 md:text-2xl">{labels.trust.intro}</p>
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {pages.map((page, index) => (
          <li key={page.id}>
            <Link href={localePath(locale, `/trust/${page.slug}`)} className="group flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-line bg-white/[0.02] p-8 transition-all hover:-translate-y-1 hover:border-cyan/40 hover:bg-white/[0.04]">
              <div>
                <p className="font-mono text-[10px] text-cyan">{String(index + 1).padStart(2, '0')}</p>
                <h2 className="mt-6 text-2xl font-black tracking-tight">{page.title}</h2>
                {page.intro ? <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/50">{page.intro}</p> : null}
              </div>
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-cyan uppercase">
                {labels.common.readMore} <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
              </span>
            </Link>
          </li>
        ))}
        <li>
          <Link href={localePath(locale, '/trust/report')} className="group flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-pink/30 bg-pink/5 p-8 transition-all hover:-translate-y-1 hover:border-pink">
            <div>
              <ShieldWarning size={28} className="text-pink" aria-hidden />
              <h2 className="mt-6 text-2xl font-black tracking-tight">{labels.trust.reportTitle}</h2>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">{labels.trust.reportIntro}</p>
            </div>
            <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-pink uppercase">
              {labels.trust.sendReport} <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
            </span>
          </Link>
        </li>
      </ul>
    </PageShell>
  )
}
