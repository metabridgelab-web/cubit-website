import type { Metadata } from 'next'

import { ArtistList } from '@/components/skeleton/ArtistList'
import { getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/artists', { title: labels.home.artists })
}

export default async function ArtistsPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  return <ArtistList locale={locale} />
}
