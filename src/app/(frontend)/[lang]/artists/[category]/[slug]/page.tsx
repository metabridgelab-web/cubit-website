import { RichText } from '@payloadcms/richtext-lexical/react'
import { Lightning, WarningCircle } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArtistHeroImage } from '@/components/artists/ArtistHeroImage'
import { Gallery, VideoGrid } from '@/components/artists/MediaViewer'
import { PostRow } from '@/components/home/Sections'
import { HudHeading } from '@/components/site/Hud'
import { SocialIcon } from '@/components/site/SocialIcon'
import { localePath } from '@/i18n'
import { getArtist, getPosts, getUiLabels } from '@/lib/data'
import { fitHeadline } from '@/lib/fit'
import { mediaUrl, pageMetadata, resolveLocale, youtubeId, type LangParams } from '@/lib/page'
import type { ArtistCategory } from '@/payload-types'

type Params = LangParams & { category: string; slug: string }

const dot = (date?: string | null, length = 10) => date?.slice(0, length).replaceAll('-', '.') ?? ''

// 아티스트 이름: 화면 폭의 90% 안, 최대 10rem
const nameSize = (name: string) => fitHeadline(name, { maxRem: 10, widthVw: 90 })

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { category, slug } = await params
  const artist = await getArtist(slug, locale)
  return pageMetadata(locale, `/artists/${category}/${slug}`, { title: artist?.name })
}

// 아티스트 상세 (design/04_아티스트-상세): 큰 사진과 이름 · 프로필 · 자기소개 · 사진 모음 · 뮤직비디오 · 캠페인 견적
export default async function ArtistPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const [artist, labels] = await Promise.all([getArtist(slug, locale), getUiLabels(locale)])
  if (!artist) notFound()

  const news = await getPosts(locale, { artistId: artist.id, limit: 5 })
  const categories = (artist.categories ?? []).filter((c): c is ArtistCategory => typeof c === 'object')
  const disclaimers = categories.flatMap((c) => (c.disclaimer ? [c.disclaimer] : []))
  // 상세 페이지 사진이 있으면 그것을, 없으면 대표 사진을 크게 보여 준다
  const hero = mediaUrl(artist.detailPhoto, 'hero') ?? mediaUrl(artist.profilePhoto, 'hero')
  const genres = (artist.genres ?? []).flatMap((g) => (typeof g === 'object' ? [g.name] : []))
  const profile = [
    artist.birthday ? { label: labels.artist.birthday, value: dot(artist.birthday) } : null,
    artist.debutDate ? { label: labels.artist.debut, value: dot(artist.debutDate) } : null,
    artist.nationality ? { label: labels.artist.nationality, value: artist.nationality } : null,
    ...(artist.extraInfo ?? []).map((row) => ({ label: row.label, value: row.value })),
  ].filter(Boolean) as { label: string; value: string }[]
  const gallery = (artist.gallery ?? []).flatMap((image) => {
    const thumb = mediaUrl(image, 'card')
    const full = mediaUrl(image, 'large')
    return thumb && full ? [{ thumb, full, alt: (typeof image === 'object' && image.alt) || artist.name }] : []
  })
  const videos = (artist.videos ?? []).flatMap((video) => {
    const id = youtubeId(video.youtubeUrl)
    return id ? [{ id: video.id ?? id, youtubeId: id, title: video.title, date: dot(video.releaseDate, 7) }] : []
  })

  return (
    <article>
      <section className="relative flex min-h-[90vh] items-end overflow-hidden px-5 pt-32 pb-16 md:items-center md:px-24 md:pb-0">
        {hero ? (
          <div className="absolute inset-y-0 end-0 z-0 w-full md:w-[60%]">
            <div className="scanlines absolute inset-0 z-10" />
            <ArtistHeroImage src={hero} alt={artist.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent md:bg-gradient-to-r md:from-black md:via-transparent md:to-black rtl:md:bg-gradient-to-l" />
          </div>
        ) : null}
        <div className="relative z-10 w-full">
          <p className="tracking-wide-cjk mb-4 font-mono text-[11px] tracking-[0.5em] text-cyan uppercase">
            {[...categories.map((c) => c.name), ...genres].join(' · ')} {'// CUBIT'}
          </p>
          <h1
            className="bg-gradient-to-b from-white to-white/20 bg-clip-text leading-[0.8] font-black tracking-[-0.05em] text-transparent uppercase"
            style={{ fontSize: nameSize(artist.name) }}
          >
            {artist.name}
          </h1>
          {artist.socials?.length ? (
            <ul className="mt-8 flex flex-wrap gap-4">
              {artist.socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-all hover:border-cyan hover:text-cyan"
                  >
                    <SocialIcon platform={social.platform} />
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
          {disclaimers.map((text) => (
            <p key={text} role="note" className="mt-8 flex max-w-xl items-start gap-3 rounded-xl border border-pink/40 bg-pink/5 p-4 text-sm text-white/80">
              <WarningCircle size={20} className="shrink-0 text-pink" aria-hidden />
              <span>
                <strong className="me-2 font-mono text-[10px] tracking-[0.15em] text-pink uppercase">{labels.artist.notice}</strong>
                {text}
              </span>
            </p>
          ))}
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-[1600px] px-5 pb-48 md:px-24">
        <div className="grid grid-cols-12 gap-y-20 lg:gap-x-20">
          <div className="col-span-12 lg:col-span-5">
            {profile.length ? (
              <section className="mb-20">
                <HudHeading tag="Profile_data" title={labels.artist.profile} />
                <dl>
                  {profile.map((row) => (
                    <div key={row.label} className="flex justify-between gap-6 border-b border-white/5 py-3">
                      <dt className="font-mono text-[10px] text-white/40 uppercase">{row.label}</dt>
                      <dd className="text-end font-mono text-[11px]">{row.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {artist.intro ? (
              <section>
                <HudHeading tag="Transmission // Intro" title={labels.artist.introduction} />
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                  <div className="prose-cubit text-lg leading-relaxed text-white/60">
                    <RichText data={artist.intro} />
                  </div>
                  <p className="mt-8 flex items-center gap-4">
                    <span className="h-px w-12 bg-pink" />
                    <span className="font-mono text-[10px] tracking-widest text-pink uppercase">{artist.name}</span>
                  </p>
                </div>
              </section>
            ) : null}
          </div>

          {gallery.length ? (
            <section className="col-span-12 lg:col-span-7">
              <HudHeading
                tag="Visual_archive"
                title={labels.artist.gallery}
                aside={<span className="font-mono text-[9px] text-white/40">COUNT: {String(gallery.length).padStart(2, '0')}</span>}
              />
              <Gallery images={gallery} viewAllLabel={labels.artist.viewAllPhotos} closeLabel={labels.common.close} />
            </section>
          ) : null}
        </div>

        {videos.length ? (
          <section className="mt-32">
            <HudHeading tag="Digital_releases" title={labels.artist.musicVideos} size="lg" />
            <VideoGrid videos={videos} closeLabel={labels.common.close} />
          </section>
        ) : null}

        {news.docs.length ? (
          <section className="mt-32">
            <HudHeading tag="Feed" title={labels.artist.relatedNews} size="lg" />
            <ul>
              {news.docs.map((post) => (
                <li key={post.id}>
                  <PostRow locale={locale} post={post} pinnedLabel={labels.home.pinned} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-6 z-40 flex justify-center px-5 md:bottom-10">
        <Link href={localePath(locale, `/business/campaign?talent=${artist.id}`)} className="btn-irid max-w-full px-5 py-3 text-xs shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:px-8 md:py-4 md:text-sm">
          <Lightning size={20} weight="fill" aria-hidden />
          {labels.artist.quoteWithArtist}
        </Link>
      </div>
    </article>
  )
}
