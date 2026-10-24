import type { Metadata } from 'next'

import { BuilderBar, WorkCard } from '@/components/business/Parts'
import { PageHeader, PageShell } from '@/components/site/Hud'
import { getBusinessSettings, getCaseStudies, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/business/works', { title: labels.business.works })
}

// 작업 사례 목록: 카드 격자 + 맨 아래 캠페인 빌더 바
export default async function WorksPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [works, labels, business] = await Promise.all([getCaseStudies(locale, 60), getUiLabels(locale), getBusinessSettings(locale)])
  return (
    <PageShell>
      <PageHeader eyebrow="Business // Case_Archive" title={labels.business.works} aside={<p>ENTRIES: {String(works.length).padStart(3, '0')}</p>} />

      {works.length ? (
        <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((work) => (
            <li key={work.id}>
              <WorkCard locale={locale} work={work} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="glass rounded-2xl p-12 text-center font-mono text-sm tracking-[0.15em] text-white/50 uppercase">{labels.common.empty}</p>
      )}

      <div className="mt-24">
        <BuilderBar locale={locale} labels={labels} business={business} />
      </div>
    </PageShell>
  )
}
