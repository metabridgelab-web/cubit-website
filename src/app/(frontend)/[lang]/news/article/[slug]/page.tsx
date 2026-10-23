import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, PushPin } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PostRow } from '@/components/home/Sections'
import { ArtistTile } from '@/components/artists/ArtistTile'
import { HudHeading } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getPost, getPosts, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'
import type { Artist } from '@/payload-types'

type Params = LangParams & { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const post = await getPost(slug, locale)
  return pageMetadata(locale, `/news/article/${slug}`, { title: post?.title, description: post?.excerpt })
}

// 게시글 상세 (모든 게시판 공통). design/08과 같은 부품으로 맞춘 화면.
export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const [post, labels] = await Promise.all([getPost(slug, locale), getUiLabels(locale)])
  if (!post) notFound()

  const board = typeof post.board === 'object' ? post.board : null
  const listPath = board?.slug === 'news' ? '/news' : `/news/${board?.slug ?? ''}`
  const category = typeof post.category === 'object' && post.category ? post.category.name : null
  const thumbnail = mediaUrl(post.thumbnail, 'hero')
  const artists = (post.artists ?? []).filter((a): a is Artist => typeof a === 'object')
  const more = board ? (await getPosts(locale, { boardId: board.id, limit: 4 })).docs.filter((p) => p.id !== post.id).slice(0, 3) : []

  return (
    <article className="mx-auto max-w-[1600px] px-5 pt-28 pb-32 md:px-16 md:pt-36">
      <Link href={localePath(locale, listPath)} className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/50 uppercase hover:text-cyan">
        <ArrowLeft size={14} aria-hidden className="rtl:rotate-180" /> {board?.name ?? labels.common.back}
      </Link>

      <header className="mx-auto max-w-4xl">
        <p className="mb-6 flex flex-wrap items-center gap-3 font-mono text-[10px] tracking-[0.15em] uppercase">
          {post.pinned ? (
            <span className="flex items-center gap-1 rounded-full bg-pink/15 px-2 py-0.5 text-pink">
              <PushPin size={10} weight="fill" aria-hidden /> {labels.home.pinned}
            </span>
          ) : null}
          {category ? <span className="text-cyan">{category}</span> : null}
          <time dateTime={post.publishedAt} className="text-white/40">
            {post.publishedAt?.slice(0, 10).replaceAll('-', '.')}
          </time>
        </p>
        <h1 className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-[clamp(2rem,5vw,3.75rem)] leading-[1.05] font-black tracking-[-0.03em] text-transparent">
          {post.title}
        </h1>
        {post.excerpt ? <p className="mt-6 text-lg text-white/60">{post.excerpt}</p> : null}
      </header>

      {thumbnail ? (
        <div className="relative mx-auto mt-12 max-w-5xl overflow-hidden rounded-2xl border border-line">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={thumbnail} alt="" className="w-full object-cover" />
          <div className="scanlines absolute inset-0 opacity-40" />
        </div>
      ) : null}

      {post.content ? (
        <div className="prose-cubit mx-auto mt-12 max-w-3xl text-lg leading-relaxed text-white/70">
          <RichText data={post.content} />
        </div>
      ) : null}

      {artists.length ? (
        <section className="mx-auto mt-24 max-w-5xl">
          <HudHeading tag="Linked_talent" title={labels.home.artists} />
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {artists.map((artist) => (
              <li key={artist.id}>
                <ArtistTile locale={locale} artist={artist} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {more.length ? (
        <section className="mx-auto mt-24 max-w-5xl">
          <HudHeading tag="Feed" title={labels.news.more} />
          <ul>
            {more.map((p) => (
              <li key={p.id}>
                <PostRow locale={locale} post={p} pinnedLabel={labels.home.pinned} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  )
}
