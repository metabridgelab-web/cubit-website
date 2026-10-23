import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { ArtistList } from '@/components/artists/ArtistList'
import { getArtistCategory } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { category: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { category: slug } = await params
  const category = await getArtistCategory(slug, locale)
  return pageMetadata(locale, `/artists/${slug}`, { title: category?.name })
}

export default async function ArtistCategoryPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const category = await getArtistCategory((await params).category, locale)
  if (!category) notFound()
  return <ArtistList locale={locale} category={category} />
}
