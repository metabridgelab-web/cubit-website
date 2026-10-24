import { ArrowRight, Play, PushPin } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import type { getBusinessSettings, getNewReleases, getUiLabels } from '@/lib/data'
import { youtubeId } from '@/lib/page'
import { ArtistTile } from '@/components/artists/ArtistTile'
import { BrandsRow, BuilderBar, ServiceGrid, ViewCasesLink } from '@/components/business/Parts'
import type { Artist, ArtistCategory, Post } from '@/payload-types'

// 홈 첫 화면 아래 섹션들. 디자인 파일에 없던 부분이라 design/03·08의 부품(HUD 라벨, 유리 카드, 무지개빛 버튼)으로 맞춰 만들었다.

type Labels = Awaited<ReturnType<typeof getUiLabels>>
const dot = (date?: string | null) => date?.slice(0, 10).replaceAll('-', '.') ?? ''

export function SectionHeading({ index, eyebrow, title, action }: { index: number; eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-b border-white/10 pb-6 md:mb-14">
      <div>
        <p className="hud-label mb-4 text-cyan!">
          {String(index).padStart(2, '0')} // {eyebrow}
        </p>
        <h2 className="text-[clamp(2.25rem,6vw,4.5rem)] leading-none font-black tracking-[-0.03em] uppercase">{title}</h2>
      </div>
      {action}
    </div>
  )
}

const ViewAll = ({ href, label }: { href: string; label: string }) => (
  <Link href={href} className="btn-line">
    {label} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
  </Link>
)

const Wrap = ({ children, id }: { children: ReactNode; id?: string }) => (
  <section id={id} className="px-5 py-24 md:px-10 md:py-32">
    <div className="mx-auto max-w-[1600px]">{children}</div>
  </section>
)

export function NewReleaseSection({ index, locale, labels, releases }: { index: number; locale: LocaleCode; labels: Labels; releases: Awaited<ReturnType<typeof getNewReleases>> }) {
  if (!releases.length) return null
  return (
    <Wrap>
      <SectionHeading index={index} eyebrow="Latest transmissions" title={labels.home.newRelease} action={<ViewAll href={localePath(locale, '/artists')} label={labels.common.viewAll} />} />
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {releases.map((video) => {
          const id = youtubeId(video.youtubeUrl)
          return (
            <li key={video.id}>
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer" className="group block">
                <div className="relative mb-4 aspect-video overflow-hidden border border-white/10 bg-[#111]">
                  {id ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
                  ) : null}
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-black/40 backdrop-blur transition group-hover:border-cyan group-hover:text-cyan">
                      <Play size={20} weight="fill" aria-hidden />
                    </span>
                  </span>
                </div>
                <p className="hud-label mb-1">{dot(video.releaseDate)}</p>
                <p className="text-lg font-black uppercase">{video.artist.name}</p>
                <p className="text-sm text-white/60">{video.title}</p>
              </a>
            </li>
          )
        })}
      </ul>
    </Wrap>
  )
}

export function ArtistsSection({ index, locale, labels, artists, categories }: { index: number; locale: LocaleCode; labels: Labels; artists: Artist[]; categories: ArtistCategory[] }) {
  if (!artists.length) return null
  return (
    <Wrap>
      <SectionHeading index={index} eyebrow="Talent database" title={labels.home.artists} action={<ViewAll href={localePath(locale, '/artists')} label={labels.common.viewAll} />} />
      <ul className="mb-10 flex flex-wrap gap-2">
        {categories.map((c) => (
          <li key={c.id}>
            <Link href={localePath(locale, `/artists/${c.slug}`)} className="rounded-full border border-white/15 px-4 py-2 font-mono text-[11px] tracking-[0.15em] text-white/70 uppercase transition-colors hover:border-cyan hover:text-cyan">
              {c.name}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-6">
        {artists.map((artist) => (
          <li key={artist.id}>
            <ArtistTile locale={locale} artist={artist} />
          </li>
        ))}
      </ul>
    </Wrap>
  )
}

// BUSINESS (수익화 필수): 세 가지 방법 · 캠페인 빌더 바 · 함께한 브랜드
export function BusinessSection({ index, locale, labels, business }: { index: number; locale: LocaleCode; labels: Labels; business: Awaited<ReturnType<typeof getBusinessSettings>> }) {
  return (
    <Wrap id="business">
      <SectionHeading index={index} eyebrow={business.eyebrow ?? 'For brands'} title={business.headline ?? ''} />
      <ServiceGrid locale={locale} labels={labels} business={business} />
      <div className="mt-6">
        <BuilderBar locale={locale} labels={labels} business={business} />
      </div>
      <div className="mt-10">
        <BrandsRow labels={labels} business={business} action={<ViewCasesLink locale={locale} label={labels.business.viewCases} />} />
      </div>
    </Wrap>
  )
}

export function PostRow({ locale, post, pinnedLabel }: { locale: LocaleCode; post: Post; pinnedLabel: string }) {
  const category = typeof post.category === 'object' && post.category ? post.category.name : null
  return (
    <Link href={localePath(locale, `/news/article/${post.slug}`)} className="group grid gap-3 border-b border-white/10 py-7 md:grid-cols-[180px_1fr_auto] md:items-baseline md:gap-10">
      <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-[0.15em] uppercase">
        {post.pinned ? (
          <span className="flex items-center gap-1 rounded-full bg-pink/15 px-2 py-0.5 text-pink">
            <PushPin size={10} weight="fill" aria-hidden /> {pinnedLabel}
          </span>
        ) : null}
        {category ? <span className="text-cyan">{category}</span> : null}
      </p>
      <div>
        <p className="text-lg font-bold transition-colors group-hover:text-cyan md:text-xl">{post.title}</p>
        {post.excerpt ? <p className="mt-2 line-clamp-2 text-sm text-white/50">{post.excerpt}</p> : null}
      </div>
      <time dateTime={post.publishedAt} className="font-mono text-[11px] text-white/40">
        {dot(post.publishedAt)}
      </time>
    </Link>
  )
}

export function PostsSection({ index, locale, labels, title, eyebrow, posts, href }: { index: number; locale: LocaleCode; labels: Labels; title: string; eyebrow: string; posts: Post[]; href: string }) {
  if (!posts.length) return null
  return (
    <Wrap>
      <SectionHeading index={index} eyebrow={eyebrow} title={title} action={<ViewAll href={localePath(locale, href)} label={labels.common.viewAll} />} />
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <PostRow locale={locale} post={post} pinnedLabel={labels.home.pinned} />
          </li>
        ))}
      </ul>
    </Wrap>
  )
}
