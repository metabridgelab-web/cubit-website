import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getCaseStudy } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const work = await getCaseStudy(slug, locale)
  return pageMetadata(locale, `/business/works/${slug}`, { title: work?.title, description: work?.summary })
}

// 작업 사례 상세. 디자인 적용 전 임시 모양.
export default async function WorkPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const work = await getCaseStudy((await params).slug, locale)
  if (!work) notFound()
  return (
    <article>
      <p>{work.brandName}</p>
      <h1>{work.title}</h1>
      {work.summary ? <p>{work.summary}</p> : null}
      <ul>
        {(work.talents ?? []).map((talent) => (typeof talent === 'object' ? <li key={talent.id}>{talent.name}</li> : null))}
      </ul>
      {work.content ? <RichText data={work.content} /> : null}
      {(work.gallery ?? []).map((item, index) => {
        const src = mediaUrl(item, 'large')
        const isVideo = typeof item === 'object' && item.mimeType?.startsWith('video')
        if (!src) return null
        return isVideo ? <video key={index} src={src} controls playsInline /> : <img key={index} src={src} alt="" loading="lazy" />
      })}
    </article>
  )
}
