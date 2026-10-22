import { RichText } from '@payloadcms/richtext-lexical/react'
import Link from 'next/link'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { mediaUrl, youtubeId } from '@/lib/page'
import type { Page } from '@/payload-types'

// 소개 페이지의 블록(글·사진·영상·연혁·오시는 길·버튼)을 차례대로 그린다. 디자인 적용 전 임시 모양.
export function Blocks({ blocks, locale }: { blocks: Page['layout']; locale: LocaleCode }) {
  return (
    <>
      {(blocks ?? []).map((block) => {
        switch (block.blockType) {
          case 'text':
            return (
              <section key={block.id}>
                {block.heading ? <h2>{block.heading}</h2> : null}
                {block.body ? <RichText data={block.body} /> : null}
              </section>
            )
          case 'image':
            return (
              <figure key={block.id}>
                {(block.images ?? []).map((image, index) => {
                  const src = mediaUrl(image, 'large')
                  const alt = typeof image === 'object' ? (image.alt ?? '') : ''
                  return src ? <img key={index} src={src} alt={alt} loading="lazy" /> : null
                })}
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            )
          case 'video': {
            const id = youtubeId(block.youtubeUrl)
            const file = mediaUrl(block.file)
            return (
              <figure key={block.id}>
                {id ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={block.caption ?? 'Video'}
                    allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : file ? (
                  <video src={file} controls playsInline />
                ) : null}
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            )
          }
          case 'timeline':
            return (
              <ol key={block.id}>
                {(block.items ?? []).map((item) => (
                  <li key={item.id}>
                    <strong>
                      {item.year}
                      {item.month ? `.${item.month}` : ''}
                    </strong>{' '}
                    {item.text}
                  </li>
                ))}
              </ol>
            )
          case 'location':
            return (
              <section key={block.id}>
                {(block.offices ?? []).map((office) => (
                  <address key={office.id}>
                    <strong>{office.name}</strong>
                    <p>{office.address}</p>
                    {office.phone ? <p>{office.phone}</p> : null}
                    {office.email ? <p>{office.email}</p> : null}
                    {office.mapUrl ? (
                      <a href={office.mapUrl} target="_blank" rel="noopener noreferrer">
                        Map
                      </a>
                    ) : null}
                  </address>
                ))}
              </section>
            )
          case 'cta':
            return (
              <p key={block.id}>
                {block.text}{' '}
                {block.url ? (
                  block.url.startsWith('/') ? (
                    <Link href={localePath(locale, block.url)}>{block.label}</Link>
                  ) : (
                    <a href={block.url}>{block.label}</a>
                  )
                ) : null}
              </p>
            )
          default:
            return null
        }
      })}
    </>
  )
}
