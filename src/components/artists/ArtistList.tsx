import Link from 'next/link'

import { PageHeader, PageShell } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getArtistCategories, getArtists, getUiLabels } from '@/lib/data'
import type { ArtistCategory } from '@/payload-types'

import { ArtistTile } from './ArtistTile'

// 아티스트 목록 (design/03_아티스트-목록): 카테고리 탭 + 세로형 카드 격자
export async function ArtistList({ locale, category }: { locale: LocaleCode; category?: ArtistCategory }) {
  const [labels, categories, artists] = await Promise.all([
    getUiLabels(locale),
    getArtistCategories(locale),
    getArtists(locale, { categoryId: category?.id }),
  ])
  const tabs = [{ id: 0, name: labels.common.all, href: '/artists' }, ...categories.map((c) => ({ id: c.id, name: c.name, href: `/artists/${c.slug}` }))]
  const activeId = category?.id ?? 0

  return (
    <PageShell>
      <PageHeader eyebrow="Directory // Talent database" title={category?.name ?? labels.home.artists} />

      <nav aria-label={labels.home.artists} className="mb-12 flex gap-2 overflow-x-auto border-b border-white/10">
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
