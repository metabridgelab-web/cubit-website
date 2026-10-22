import type { Metadata } from 'next'

import { getArtists, getBusinessSettings } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const business = await getBusinessSettings(locale)
  return pageMetadata(locale, '/business/campaign', { title: business.builderCtaLabel })
}

// 캠페인 빌더 자리. 입력 양식은 디자인과 함께 만든다.
// 접수는 이미 동작한다: POST /api/quote-requests?locale=<언어> (스팸 차단 · 알림 메일 포함)
export default async function CampaignBuilderPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [business, artists] = await Promise.all([getBusinessSettings(locale), getArtists(locale)])
  return (
    <>
      <h1>{business.builderCtaLabel}</h1>
      <ol>
        {artists.map((artist) => (
          <li key={artist.id}>{artist.name}</li>
        ))}
      </ol>
    </>
  )
}
