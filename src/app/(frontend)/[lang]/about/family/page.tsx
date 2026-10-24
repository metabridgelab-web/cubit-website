import { ArrowRight, Buildings, Storefront, VinylRecord } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { FilmButton } from '@/components/media/Interactive'
import { PageHeader, PageShell } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getFamily, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, streamSource, youtubeId, type LangParams } from '@/lib/page'
import type { Artist, Family } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/about/family', { title: labels.family.title })
}

const KIND_ICON = { label: VinylRecord, brand: Storefront, affiliate: Buildings } as const
const KIND_COLOR = { label: 'text-cyan', brand: 'text-pink', affiliate: 'text-lime' } as const

type Labels = Awaited<ReturnType<typeof getUiLabels>>

// 카드 한 장 (design/05 family-card): 로고 · 이름 · 소개 · 소개 영상 · 소속 아티스트 얼굴 또는 사업 분야 · 공식 사이트
function FamilyCard({ entry, locale, labels }: { entry: Family; locale: LocaleCode; labels: Labels }) {
  const Icon = KIND_ICON[entry.kind]
  const logo = mediaUrl(entry.logo, 'thumbnail')
  const stream = streamSource(entry.streamId)
  const poster = mediaUrl(entry.poster, 'card') ?? stream?.thumbnail
  const film = { src: mediaUrl(entry.film) ?? stream?.hls, youtubeId: youtubeId(entry.youtubeUrl), title: entry.name }
  const hasFilm = Boolean(film.src || film.youtubeId)
  const artists = (entry.artists ?? []).filter((a): a is Artist => typeof a === 'object')

  return (
    <article className="group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white/[0.02] p-8 transition-all duration-500 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]">
      <span className="absolute inset-x-0 top-0 h-0.5 bg-[linear-gradient(90deg,transparent,var(--color-cyan),transparent)] opacity-0 transition-opacity group-hover:opacity-100" />
      <div>
        {hasFilm ? (
          <FilmButton film={film} closeLabel={labels.common.close} label={labels.family.watchFilm} className="mb-8">
            <span className="relative block aspect-video overflow-hidden rounded-xl border border-white/5 bg-[#111]">
              {poster ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={poster} alt="" loading="lazy" className="h-full w-full object-cover brightness-75 grayscale transition duration-500 group-hover:scale-105 group-hover:brightness-90 group-hover:grayscale-0" />
              ) : null}
              <span className="scanlines absolute inset-0" />
            </span>
          </FilmButton>
        ) : null}
        <div className="mb-6 flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-line bg-[#111]">
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className="h-full w-full object-contain p-1.5" />
          ) : (
            <Icon size={24} className={KIND_COLOR[entry.kind]} aria-hidden />
          )}
        </div>
        <h3 className="mb-3 text-xl font-bold uppercase">{entry.name}</h3>
        {entry.description ? <p className="mb-6 text-sm leading-relaxed whitespace-pre-line text-white/50">{entry.description}</p> : null}
      </div>
      <div className="mt-4 flex items-center justify-between gap-4">
        {artists.length ? (
          <ul className="flex">
            {artists.slice(0, 4).map((artist) => {
              const photo = mediaUrl(artist.profilePhoto, 'thumbnail')
              const category = artist.categories?.find((c) => typeof c === 'object')
              return (
                <li key={artist.id} className="-ms-2 h-7 w-7 overflow-hidden rounded-full border-[1.5px] border-black bg-[#222] first:ms-0">
                  <Link href={localePath(locale, `/artists/${typeof category === 'object' ? category.slug : 'all'}/${artist.slug}`)} title={artist.name}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {photo ? <img src={photo} alt={artist.name} className="h-full w-full object-cover" /> : null}
                  </Link>
                </li>
              )
            })}
            {artists.length > 4 ? (
              <li className="-ms-2 flex h-7 w-7 items-center justify-center rounded-full border-[1.5px] border-black bg-zinc-800 font-mono text-[8px] text-white/60">+{artists.length - 4}</li>
            ) : null}
          </ul>
        ) : (
          <span className="font-mono text-[9px] tracking-[0.1em] text-white/40 uppercase">{entry.tagline}</span>
        )}
        {entry.website ? (
          <a href={entry.website} target="_blank" rel="noopener noreferrer" className="flex shrink-0 items-center gap-2 font-mono text-[10px] tracking-[0.1em] text-cyan uppercase transition-all group-hover:gap-3">
            {labels.family.visit} <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
          </a>
        ) : null}
      </div>
    </article>
  )
}

// COMPANY > 레이블 · 브랜드 · 계열사 (design/05): 구분별로 카드 묶음
export default async function FamilyPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [entries, labels] = await Promise.all([getFamily(locale), getUiLabels(locale)])
  const groups = [
    { kind: 'label', title: labels.family.labels },
    { kind: 'brand', title: labels.family.brands },
    { kind: 'affiliate', title: labels.family.affiliates },
  ]
    .map((group) => ({ ...group, entries: entries.filter((e) => e.kind === group.kind) }))
    .filter((group) => group.entries.length)

  return (
    <PageShell>
      <PageHeader
        eyebrow="Company // Family_Tree"
        title={labels.family.title}
        aside={<p>NODE_COUNT: <span className="text-lime">{String(entries.length).padStart(2, '0')}</span></p>}
      />
      {groups.length ? (
        groups.map((group, index) => (
          <section key={group.kind} className="mb-28 last:mb-0">
            <div className="mb-10 border-s-2 border-cyan ps-5">
              <p className="font-mono text-[9px] tracking-[0.1em] text-cyan uppercase">ENTITY_CLASS_{String(index + 1).padStart(2, '0')}</p>
              <h2 className="bg-gradient-to-r from-white to-white/40 bg-clip-text text-[2.5rem] leading-tight font-black tracking-[-0.04em] text-transparent uppercase">{group.title}</h2>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {group.entries.map((entry) => (
                <FamilyCard key={entry.id} entry={entry} locale={locale} labels={labels} />
              ))}
            </div>
          </section>
        ))
      ) : (
        <p className="glass rounded-2xl p-12 text-center font-mono text-sm tracking-[0.15em] text-white/50 uppercase">{labels.common.empty}</p>
      )}
    </PageShell>
  )
}
