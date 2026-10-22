import Link from 'next/link'
import { notFound } from 'next/navigation'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getBoard, getPostCategories, getPosts, getUiLabels } from '@/lib/data'

export type ListSearch = { category?: string; page?: string; q?: string }

// 게시판 목록: 분류 · 검색 · 쪽 넘기기. 디자인 적용 전 임시 모양.
export async function PostList({ locale, boardSlug, basePath, search }: { locale: LocaleCode; boardSlug: string; basePath: string; search: ListSearch }) {
  const board = await getBoard(boardSlug, locale)
  if (!board) notFound()
  const page = Math.max(1, Number(search.page) || 1)
  const categoryId = Number(search.category) || undefined
  const [labels, categories, posts] = await Promise.all([
    getUiLabels(locale),
    getPostCategories(board.id, locale),
    getPosts(locale, { boardId: board.id, categoryId, search: search.q, page }),
  ])
  const href = (params: Record<string, string | number | undefined>) => {
    const query = new URLSearchParams(
      Object.entries({ category: categoryId, q: search.q, ...params }).flatMap(([k, v]) => (v ? [[k, String(v)]] : [])),
    ).toString()
    return `${localePath(locale, basePath)}${query ? `?${query}` : ''}`
  }

  return (
    <>
      <h1>{board.name}</h1>
      <nav>
        <ul>
          <li>
            <Link href={href({ category: undefined, page: undefined })}>{labels.common.viewAll}</Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={href({ category: c.id, page: undefined })} aria-current={c.id === categoryId ? 'page' : undefined}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <form action={localePath(locale, basePath)}>
        <input type="search" name="q" defaultValue={search.q} aria-label="Search" />
      </form>
      <ul>
        {posts.docs.map((post) => (
          <li key={post.id}>
            {post.pinned ? '* ' : ''}
            <Link href={localePath(locale, `/news/article/${post.slug}`)}>{post.title}</Link>{' '}
            {typeof post.category === 'object' && post.category ? `[${post.category.name}] ` : ''}
            {post.publishedAt?.slice(0, 10)}
          </li>
        ))}
      </ul>
      <nav aria-label="Pagination">
        {posts.hasPrevPage ? <Link href={href({ page: page - 1 })}>{labels.common.prev}</Link> : null}{' '}
        {page} / {posts.totalPages || 1}{' '}
        {posts.hasNextPage ? <Link href={href({ page: page + 1 })}>{labels.common.next}</Link> : null}
      </nav>
    </>
  )
}
