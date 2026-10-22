import type { Metadata } from 'next'

import { PostList, type ListSearch } from '@/components/skeleton/PostList'
import { getBoard } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { board: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { board: slug } = await params
  const board = await getBoard(slug, locale)
  return pageMetadata(locale, `/news/${slug}`, { title: board?.name })
}

// /news/notice 처럼 뉴스 외의 게시판. 관리자 화면에서 새 게시판을 만들면 /news/새주소 로 바로 열린다.
export default async function BoardPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<ListSearch> }) {
  const locale = await resolveLocale(params)
  const { board } = await params
  return <PostList locale={locale} boardSlug={board} basePath={`/news/${board}`} search={await searchParams} />
}
