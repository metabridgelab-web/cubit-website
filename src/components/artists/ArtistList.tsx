import Link from 'next/link'

import { PageHeader, PageShell } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getArtistCategories, getArtists, getGenres, getUiLabels } from '@/lib/data'
import type { ArtistCategory } from '@/payload-types'

import { ArtistTile } from './ArtistTile'
import { GenreSelect } from './GenreSelect'

// 아티스트 목록 (design/03_아티스트-목록): 카테고리 탭 + (장르가 있는 카테고리면) 장르 선택 상자 + 세로형 카드 격자
export async function ArtistList({ locale, category, genreSlug }: { locale: LocaleCode; category?: ArtistCategory; genreSlug?: string }) {
  const [labels, categories, genres] = await Promise.all([
    getUiLabels(locale),
    getArtistCategories(locale),
    category ? getGenres(category.id, locale) : Promise.resolve([]),
  ])
  const genre = genres.find((g) => g.slug === genreSlug) ?? null
  const artists = await getArtists(locale, { categoryId: category?.id, genreId: genre?.id })
  const tabs = [{ id: 0, name: labels.common.all, href: '/artists' }, ...categories.map((c) => ({ id: c.id, name: c.name, href: `/artists/${c.slug}` }))]
  const activeId = category?.id ?? 0

  return (
    <PageShell>
      <PageHeader eyebrow="Directory // Talent database" title={category?.name ?? labels.home.artists} />

      <nav aria-label={labels.home.artists} className="mb-12 flex gap-2 overflow-x-auto overflow-y-hidden border-b border-white/10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={localePath(locale, tab.href)}
            aria-current={tab.id === activeId ? 'page' : undefined}
            className={`relative shrink-0 px-4 py-2 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors ${
              tab.id === activeId
                ? 'text-white after:absolute after:inset-x-4 after:-bottom-px after:h-px after:bg-gradient-to-r after:from-cyan after:to-pink'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>

      {category && genres.length ? (
        <div className="-mt-4 mb-10 flex justify-end">
          <GenreSelect
            label={labels.artist.genre}
            allLabel={labels.common.all}
            basePath={localePath(locale, `/artists/${category.slug}`)}
            genres={genres.map((g) => ({ slug: g.slug ?? String(g.id), name: g.name }))}
            current={genre?.slug ?? null}
          />
        </div>
      ) : null}

      {artists.length ? (
        <>
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artists.map((artist) => (
              <li key={artist.id}>
                <ArtistTile locale={locale} artist={artist} categorySlug={category?.slug} />
              </li>
            ))}
          </ul>
          <p className="hud-label mt-12">
            {labels.artist.entries}: {String(artists.length).padStart(2, '0')}
          </p>
        </>
      ) : (
        <p className="hud-label py-24 text-center">{labels.common.empty}</p>
      )}
    </PageShell>
  )
}
