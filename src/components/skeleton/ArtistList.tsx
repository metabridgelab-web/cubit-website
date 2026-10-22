import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getArtistCategories, getArtists, getUiLabels } from '@/lib/data'
import { mediaUrl } from '@/lib/page'
import type { ArtistCategory } from '@/payload-types'

// 아티스트 목록 (전체 또는 카테고리별). 디자인 적용 전 임시 모양.
export async function ArtistList({ locale, category }: { locale: LocaleCode; category?: ArtistCategory }) {
  const [labels, categories, artists] = await Promise.all([
    getUiLabels(locale),
    getArtistCategories(locale),
    getArtists(locale, { categoryId: category?.id }),
  ])
  return (
    <>
      <h1>{category?.name ?? labels.home.artists}</h1>
      <nav aria-label={labels.home.artists}>
        <ul>
          <li>
            <Link href={localePath(locale, '/artists')} aria-current={!category ? 'page' : undefined}>
              {labels.common.viewAll}
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link href={localePath(locale, `/artists/${c.slug}`)} aria-current={c.id === category?.id ? 'page' : undefined}>
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <ul>
        {artists.map((artist) => {
          const first = artist.categories?.find((c) => typeof c === 'object')
          const slug = category?.slug ?? (typeof first === 'object' ? first.slug : '')
          const photo = mediaUrl(artist.profilePhoto, 'card')
          return (
            <li key={artist.id}>
              <Link href={localePath(locale, `/artists/${slug}/${artist.slug}`)}>
                {photo ? <img src={photo} alt={artist.name} width={200} loading="lazy" /> : null}
                <span>{artist.name}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}
