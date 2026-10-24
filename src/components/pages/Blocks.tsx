import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

import { Gallery } from '@/components/artists/MediaViewer'
import { HudHeading } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { mediaUrl, youtubeId } from '@/lib/page'
import type { Page } from '@/payload-types'

type Labels = { close: string; viewAllPhotos: string; openMap: string }

// 관리자 화면 "페이지"의 블록(글·사진·영상·연혁·오시는 길·버튼)을 사이트 디자인으로 그린다
export function Blocks({ blocks, locale, labels }: { blocks: Page['layout']; locale: LocaleCode; labels: Labels }) {
  return (
    <div className="flex flex-col gap-24">
      {(blocks ?? []).map((block, index) => {
        switch (block.blockType) {
          case 'text':
            return (
              <section key={block.id}>
                {block.heading ? <HudHeading tag={`SEC_${String(index + 1).padStart(2, "0")}`} title={block.heading} /> : null}
                {block.body ? (
                  <div className="prose-cubit max-w-3xl text-lg leading-relaxed text-white/70">
                    <RichText data={block.body} />
                  </div>
                ) : null}
              </section>
            )

          case 'image': {
            const images = (block.images ?? []).flatMap((image) => {
              const thumb = mediaUrl(image, 'card')
              const full = mediaUrl(image, 'large')
              return thumb && full ? [{ thumb, full, alt: (typeof image === 'object' && image.alt) || '' }] : []
            })
            return (
              <figure key={block.id}>
                {images.length === 1 ? (
                  <div className="relative overflow-hidden rounded-2xl border border-line">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={images[0].full} alt={images[0].alt} loading="lazy" className="w-full object-cover" />
                    <div className="scanlines absolute inset-0 opacity-40" />
                  </div>
                ) : (
                  <Gallery images={images} viewAllLabel={labels.viewAllPhotos} closeLabel={labels.close} />
                )}
                {block.caption ? <figcaption className="hud-label mt-4">{block.caption}</figcaption> : null}
              </figure>
            )
          }

          case 'video': {
            const id = youtubeId(block.youtubeUrl)
            const file = mediaUrl(block.file)
            return (
              <figure key={block.id}>
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-[#0a0a0a]">
                  {id ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${id}?rel=0`}
                      title={block.caption ?? 'Video'}
                      loading="lazy"
                      allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                    />
                  ) : file ? (
                    <video src={file} controls playsInline preload="metadata" className="h-full w-full object-cover" />
                  ) : null}
                </div>
                {block.caption ? <figcaption className="hud-label mt-4">{block.caption}</figcaption> : null}
              </figure>
            )
          }

          case 'timeline':
            return (
              <section key={block.id}>
                <ol className="relative ms-2 border-s border-cyan/40">
                  {(block.items ?? []).map((item) => (
                    <li key={item.id} className="relative mb-12 ps-10 last:mb-0">
                      <span className="absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full bg-cyan shadow-[0_0_12px_var(--color-cyan)]" />
                      <p className="font-mono text-sm text-cyan">
                        {item.year}
                        {item.month ? <span className="text-white/40">.{item.month.padStart(2, '0')}</span> : null}
                      </p>
                      <p className="mt-2 max-w-2xl text-lg whitespace-pre-line text-white/80">{item.text}</p>
                    </li>
                  ))}
                </ol>
              </section>
            )

          case 'location':
            return (
              <section key={block.id} className="grid gap-6 md:grid-cols-2">
                {(block.offices ?? []).map((office) => (
                  <address key={office.id} className="glass relative overflow-hidden rounded-2xl p-8 not-italic">
                    <span className="hud-bracket start-4 top-4 border-e-0 border-b-0 opacity-60" />
                    <span className="hud-bracket end-4 bottom-4 border-s-0 border-t-0 opacity-60" />
                    <p className="font-mono text-[10px] tracking-[0.15em] text-cyan uppercase">{office.name}</p>
                    <p className="mt-4 text-xl leading-snug font-bold whitespace-pre-line">{office.address}</p>
                    <div className="mt-6 space-y-2 font-mono text-xs text-white/60">
                      {office.phone ? (
                        <p className="flex items-center gap-3">
                          <Phone size={16} className="text-cyan" aria-hidden />
                          <a href={`tel:${office.phone.replace(/\s/g, '')}`}>{office.phone}</a>
                        </p>
                      ) : null}
                      {office.email ? (
                        <p className="flex items-center gap-3">
                          <EnvelopeSimple size={16} className="text-cyan" aria-hidden />
                          <a href={`mailto:${office.email}`}>{office.email}</a>
                        </p>
                      ) : null}
                    </div>
                    <a
                      href={office.mapUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-line mt-8"
                    >
                      <MapPin size={14} aria-hidden /> {labels.openMap}
                    </a>
                  </address>
                ))}
              </section>
            )

          case 'cta':
            return (
              <section
                key={block.id}
                className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-[linear-gradient(90deg,rgba(0,243,255,0.08),rgba(255,0,229,0.08))] p-8 md:flex-row md:items-center"
              >
                {block.text ? <p className="max-w-xl text-xl font-bold">{block.text}</p> : null}
                {block.url ? (
                  block.url.startsWith('/') ? (
                    <Link href={localePath(locale, block.url)} className="btn-irid shrink-0">
                      {block.label} <ArrowUpRight size={16} aria-hidden />
                    </Link>
                  ) : (
                    <a href={block.url} target="_blank" rel="noopener noreferrer" className="btn-irid shrink-0">
                      {block.label} <ArrowUpRight size={16} aria-hidden />
                    </a>
                  )
                ) : null}
              </section>
            )

          default:
            return null
        }
      })}
    </div>
  )
}
