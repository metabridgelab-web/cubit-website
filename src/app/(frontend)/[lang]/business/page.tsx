import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { BrandsRow, BuilderBar, ServiceGrid, WorkCard } from '@/components/business/Parts'
import { HudHeading, PageHeader, PageShell } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getBusinessSettings, getCaseStudies, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const business = await getBusinessSettings(locale)
  return pageMetadata(locale, '/business', { title: business.headline })
}

// BUSINESS 개요 (수익화 핵심): 세 가지 방법 · 캠페인 빌더 바 · 최근 작업 사례 · 함께한 브랜드
export default async function BusinessPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [business, labels, works] = await Promise.all([getBusinessSettings(locale), getUiLabels(locale), getCaseStudies(locale, 3)])
  return (
    <PageShell>
      <PageHeader eyebrow={`Business // ${business.eyebrow ?? 'For brands'}`} title={business.headline ?? 'Business'} />

      <ServiceGrid locale={locale} labels={labels} business={business} />
      <div className="mt-6">
        <BuilderBar locale={locale} labels={labels} business={business} />
      </div>

      {works.length ? (
        <section className="mt-28">
          <HudHeading
            tag="Case_Archive"
            title={labels.business.works}
            size="lg"
            aside={
              <Link href={localePath(locale, '/business/works')} className="btn-line">
                {labels.common.viewAll} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
              </Link>
            }
          />
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((work) => (
              <li key={work.id}>
                <WorkCard locale={locale} work={work} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {business.brands?.length ? (
        <div className="mt-24 border-t border-white/10 pt-10">
          <BrandsRow labels={labels} business={business} />
        </div>
      ) : null}
    </PageShell>
  )
}
