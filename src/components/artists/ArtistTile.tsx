import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { mediaUrl } from '@/lib/page'
import type { Artist, ArtistCategory } from '@/payload-types'

// 아티스트 카드 (design/03): 흑백 사진 → 마우스를 올리면 컬러 + 살짝 떠오름, 오른쪽 위에 카테고리 표시.
// 그룹이면 이름 위에 "GROUP · 멤버 수"를 붙인다.
export function ArtistTile({ locale, artist, categorySlug, groupLabel = 'Group' }: { locale: LocaleCode; artist: Artist; categorySlug?: string; groupLabel?: string }) {
  const categories = (artist.categories ?? []).filter((c): c is ArtistCategory => typeof c === 'object')
  const slug = categorySlug ?? categories[0]?.slug ?? 'all'
  const photo = mediaUrl(artist.profilePhoto, 'card')

  return (
    <Link
      href={localePath(locale, `/artists/${slug}/${artist.slug}`)}
      className="group relative block aspect-[3/4] overflow-hidden rounded-lg border border-line bg-[#0a0a0a] transition-all duration-500 ease-out-expo hover:-translate-y-1 hover:border-white/30"
    >
      {photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt={artist.name}
          loading="lazy"
          className="h-full w-full object-cover brightness-[0.7] grayscale transition-all duration-700 ease-out-expo group-hover:scale-105 group-hover:brightness-100 group-hover:grayscale-0"
        />
      ) : null}
      {categories.length ? (
        <span className="absolute end-5 top-5 translate-x-2.5 bg-black/40 px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-cyan uppercase opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 rtl:-translate-x-2.5">
          {categories.map((c) => c.name).join(' · ')}
        </span>
      ) : null}
      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6">
        {artist.kind === 'group' ? (
          <span className="mb-1 block font-mono text-[10px] tracking-[0.15em] text-cyan uppercase">
            {groupLabel} · {String(artist.members?.length ?? 0).padStart(2, '0')}
          </span>
        ) : null}
        <span className="block text-2xl font-black tracking-[-0.02em] break-words uppercase">{artist.name}</span>
      </span>
    </Link>
  )
}
