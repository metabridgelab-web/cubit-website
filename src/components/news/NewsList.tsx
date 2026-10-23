import { MagnifyingGlass, PushPin } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PageHeader, PageShell } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getBoard, getPostCategories, getPosts, getUiLabels } from '@/lib/data'
import { mediaUrl } from '@/lib/page'
import type { Post } from '@/payload-types'

export type ListSearch = { category?: string; page?: string; q?: string }

const dot = (date?: string | null) => date?.slice(0, 10).replaceAll('-', '.') ?? ''
const categoryName = (post: Post) => (typeof post.category === 'object' && post.category ? post.category.name : null)

// 게시판 목록 (design/08_뉴스-목록): 분류 탭 · 검색 · 고정 글(Priority) · 글 카드 · 쪽 넘기기
export async function NewsList({ locale, boardSlug, basePath, search }: { locale: LocaleCode; boardSlug: string; basePath: string; search: ListSearch }) {
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
  const pinned = page === 1 ? posts.docs.filter((p) => p.pinned) : []
  const entries = posts.docs.filter((p) => !pinned.includes(p))
  const tabs = [{ id: 0, name: labels.common.all }, ...categories.map((c) => ({ id: c.id, name: c.name }))]

  return (
    <PageShell>
      <PageHeader eyebrow={labels.news.eyebrow} title={board.name} />

      <div className="mb-12 flex flex-wrap items-end justify-between gap-6 border-b border-white/10">
        <nav aria-label={board.name} className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={href({ category: tab.id || undefined, page: undefined })}
              aria-current={(categoryId ?? 0) === tab.id ? 'page' : undefined}
              className={`relative shrink-0 px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors ${
                (categoryId ?? 0) === tab.id
                  ? 'text-white after:absolute after:inset-x-4 after:-bottom-px after:h-px after:bg-gradient-to-r after:from-cyan after:to-pink'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
        <form action={localePath(locale, basePath)} className="mb-3 flex items-center gap-2 rounded-full border border-line px-4 py-2 focus-within:border-cyan">
          {categoryId ? <input type="hidden" name="category" value={categoryId} /> : null}
          <MagnifyingGlass size={14} className="text-white/40" aria-hidden />
          <input type="search" name="q" defaultValue={search.q} placeholder={labels.news.search} aria-label={labels.news.search} className="w-40 bg-transparent font-mono text-[11px] text-white placeholder:text-white/30 focus:outline-none" />
        </form>
      </div>

      {pinned.length ? (
        <section className="mb-16">
          <p className="mb-6 font-mono text-[9px] tracking-[0.1em] text-pink uppercase">Priority_transmissions // {labels.news.priority}</p>
          <ul className="grid gap-4 md:grid-cols-2">
            {pinned.map((post) => (
              <li key={post.id}>
                <Link href={localePath(locale, `/news/article/${post.slug}`)} className="group flex h-full flex-col gap-3 rounded-2xl border border-pink/30 bg-pink/[0.04] p-6 transition-colors hover:border-pink">
                  <span className="flex items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
                    <span className="flex items-center gap-1 rounded-full bg-pink/15 px-2 py-0.5 text-pink">
                      <PushPin size={10} weight="fill" aria-hidden /> {labels.home.pinned}
                    </span>
                    {categoryName(post) ? <span className="text-cyan">{categoryName(post)}</span> : null}
                  </span>
                  <span className="text-lg font-bold transition-colors group-hover:text-pink">{post.title}</span>
                  <time dateTime={post.publishedAt} className="mt-auto font-mono text-[11px] text-white/40">
                    {dot(post.publishedAt)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="mb-6 font-mono text-[9px] tracking-[0.1em] text-cyan uppercase">Latest_feed // {labels.news.archive}</p>
      {entries.length ? (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {entries.map((post) => {
            const thumb = mediaUrl(post.thumbnail, 'card')
            return (
              <li key={post.id}>
                <Link href={localePath(locale, `/news/article/${post.slug}`)} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-[#0a0a0a] transition-all hover:-translate-y-1 hover:border-cyan">
                  {thumb ? (
                    <span className="block aspect-video overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                    </span>
                  ) : null}
                  <span className="flex flex-1 flex-col gap-3 p-6">
                    <span className="flex justify-between font-mono text-[10px] tracking-[0.15em] uppercase">
                      <span className="text-cyan">{categoryName(post) ?? board.name}</span>
                      <span className="text-white/30">#{String(post.id).padStart(5, '0')}</span>
                    </span>
                    <span className="text-xl font-bold transition-colors group-hover:text-cyan">{post.title}</span>
                    {post.excerpt ? <span className="line-clamp-3 text-sm text-white/50">{post.excerpt}</span> : null}
                    <time dateTime={post.publishedAt} className="mt-auto pt-2 font-mono text-[11px] text-white/40">
                      {dot(post.publishedAt)}
                    </time>
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      ) : pinned.length ? null : (
        <p className="hud-label py-24 text-center">{labels.common.empty}</p>
      )}

      {posts.totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2 font-mono text-xs">
          {Array.from({ length: posts.totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={href({ page: n === 1 ? undefined : n })}
              aria-current={n === page ? 'page' : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${n === page ? 'border-cyan bg-cyan font-bold text-black' : 'border-line text-white/60 hover:border-white'}`}
            >
              {String(n).padStart(2, '0')}
            </Link>
          ))}
        </nav>
      ) : null}
    </PageShell>
  )
}
