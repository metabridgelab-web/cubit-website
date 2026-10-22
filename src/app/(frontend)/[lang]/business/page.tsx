import type { Metadata } from 'next'
import Link from 'next/link'

import { localePath } from '@/i18n'
import { getBusinessSettings, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const business = await getBusinessSettings(locale)
  return pageMetadata(locale, '/business', { title: business.headline })
}

// BUSINESS 개요 (수익화 핵심): 세 가지 방법 · 캠페인 빌더 바 · 함께한 브랜드. 디자인 적용 전 임시 모양.
export default async function BusinessPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [business, labels] = await Promise.all([getBusinessSettings(locale), getUiLabels(locale)])
  return (
    <>
      <p>{business.eyebrow}</p>
      <h1>{business.headline}</h1>
      <ol>
        {(business.services ?? []).map((service) => (
          <li key={service.id}>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
            {service.url ? <Link href={localePath(locale, service.url)}>{labels.common.readMore}</Link> : null}
          </li>
        ))}
      </ol>
      <Link href={localePath(locale, '/business/campaign')}>{business.builderCtaLabel}</Link>
      <ul>
        {(business.brands ?? []).map((brand) => {
          const logo = mediaUrl(brand.logo, 'thumbnail')
          return <li key={brand.id}>{logo ? <img src={logo} alt={brand.name} /> : brand.name}</li>
        })}
      </ul>
      <Link href={localePath(locale, '/business/works')}>{labels.common.viewAll}</Link>
    </>
  )
}
