import type { Metadata } from 'next'

import { NewsList, type ListSearch } from '@/components/news/NewsList'
import { getBoard } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const board = await getBoard('news', locale)
  return pageMetadata(locale, '/news', { title: board?.name })
}

// /news = "뉴스" 게시판
export default async function NewsPage({ params, searchParams }: { params: Promise<LangParams>; searchParams: Promise<ListSearch> }) {
  const locale = await resolveLocale(params)
  return <NewsList locale={locale} boardSlug="news" basePath="/news" search={await searchParams} />
}
