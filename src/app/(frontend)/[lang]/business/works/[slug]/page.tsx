import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowLeft, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ArtistTile } from '@/components/artists/ArtistTile'
import { Gallery } from '@/components/artists/MediaViewer'
import { monthDot } from '@/components/business/Parts'
import { HudHeading, PageShell } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getCaseStudy, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'
import type { Artist, Media } from '@/payload-types'

type Params = LangParams & { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const work = await getCaseStudy(slug, locale)
  return pageMetadata(locale, `/business/works/${slug}`, { title: work?.title, description: work?.summary })
}

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <dt className="mb-1 text-[10px] tracking-[0.15em] text-white/40 uppercase">{label}</dt>
    <dd className="text-base text-white">{value}</dd>
  </div>
)

// 작업 사례 상세: 브랜드 · 캠페인 이름 · 대표 이미지 · 내용 · 결과물 · 참여 탤런트 · "비슷한 캠페인 문의"
export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const [work, labels] = await Promise.all([getCaseStudy((await params).slug, locale), getUiLabels(locale)])
  if (!work) notFound()

  const hero = mediaUrl(work.thumbnail, 'hero')
  const logo = mediaUrl(work.brandLogo, 'thumbnail')
  const talents = (work.talents ?? []).filter((t): t is Artist => typeof t === 'object')
  const media = (work.gallery ?? []).filter((m): m is Media => typeof m === 'object')
  const videos = media.filter((m) => m.mimeType?.startsWith('video'))
  const images = media.flatMap((m) => {
    const thumb = mediaUrl(m, 'card')
    const full = mediaUrl(m, 'large')
    return !m.mimeType?.startsWith('video') && thumb && full ? [{ thumb, full, alt: m.alt ?? '' }] : []
  })
  // 참여 탤런트를 미리 고른 채로 캠페인 빌더를 연다
  const builder = `/business/campaign${talents.length ? `?${talents.map((t) => `talent=${t.id}`).join('&')}` : ''}`

  return (
    <PageShell>
      <article>
        <Link href={localePath(locale, '/business/works')} className="mb-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/50 uppercase hover:text-cyan">
          <ArrowLeft size={12} aria-hidden className="rtl:rotate-180" /> {labels.business.works}
        </Link>

        <header className="mb-12 md:mb-16">
          <p className="hud-label mb-4 flex flex-wrap items-center gap-4 text-cyan!">
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="h-6 w-auto opacity-80" />
            ) : null}
            <span>{work.brandName}</span>
            {work.date ? <span className="text-white/40">{`// ${monthDot(work.date)}`}</span> : null}
          </p>
          <h1 className="max-w-5xl bg-gradient-to-b from-white to-white/40 bg-clip-text text-[clamp(2.5rem,7vw,5rem)] leading-[0.95] font-black tracking-[-0.04em] break-words text-transparent">
            {work.title}
          </h1>
          {work.summary ? <p className="mt-8 max-w-3xl text-xl leading-relaxed text-white/70 md:text-2xl">{work.summary}</p> : null}
        </header>

        {hero ? (
          <div className="relative mb-20 overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="" className="max-h-[75vh] w-full object-cover" />
            <div className="scanlines absolute inset-0 opacity-40" />
            <span className="hud-bracket start-5 top-5 border-e-0 border-b-0" />
            <span className="hud-bracket end-5 bottom-5 border-s-0 border-t-0" />
          </div>
        ) : null}

        <div className="grid gap-16 lg:grid-cols-[1fr_320px]">
          <div className="min-w-0">
            {work.content ? (
              <div className="prose-cubit max-w-3xl text-lg leading-relaxed text-white/70">
                <RichText data={work.content} />
              </div>
            ) : null}
          </div>
          <dl className="glass h-fit space-y-6 rounded-2xl p-8 font-mono text-xs lg:sticky lg:top-32">
            <Meta label={labels.business.client} value={work.brandName} />
            {work.date ? <Meta label="Date" value={monthDot(work.date)} /> : null}
            {talents.length ? <Meta label={labels.business.talent} value={talents.map((t) => t.name).join(', ')} /> : null}
          </dl>
        </div>

        {videos.length ? (
          <section className="mt-24 grid gap-6 md:grid-cols-2">
            {videos.map((video) => (
              <video key={video.id} src={video.url ?? undefined} controls playsInline preload="metadata" className="aspect-video w-full rounded-2xl border border-line bg-black object-cover" />
            ))}
          </section>
        ) : null}

        {images.length ? (
          <section className="mt-24">
            <HudHeading tag="Output // Deliverables" title={labels.artist.gallery} />
            <Gallery images={images} viewAllLabel={labels.artist.viewAllPhotos} closeLabel={labels.common.close} />
          </section>
        ) : null}

        {talents.length ? (
          <section className="mt-24">
            <HudHeading tag="Talent // Assigned" title={labels.business.talent} />
            <ul className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {talents.map((talent) => (
                <li key={talent.id}>
                  <ArtistTile locale={locale} artist={talent} groupLabel={labels.artist.group} />
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-24 flex flex-col items-start justify-between gap-6 rounded-2xl border border-lime/60 p-8 md:flex-row md:items-center">
          <p className="text-2xl font-black tracking-tight">{labels.business.similar}</p>
          <Link href={localePath(locale, builder)} className="btn-irid shrink-0">
            {labels.common.getQuote} <ArrowUpRight size={16} aria-hidden />
          </Link>
        </section>
      </article>
    </PageShell>
  )
}
