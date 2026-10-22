import type { Metadata } from 'next'
import Link from 'next/link'

import { localePath } from '@/i18n'
import { getCaseStudies } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), '/business/works', { title: 'Case Studies' })
}

// 작업 사례 목록. 디자인 적용 전 임시 모양.
export default async function WorksPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const works = await getCaseStudies(locale)
  return (
    <ul>
      {works.map((work) => {
        const thumb = mediaUrl(work.thumbnail, 'card')
        return (
          <li key={work.id}>
            <Link href={localePath(locale, `/business/works/${work.slug}`)}>
              {thumb ? <img src={thumb} alt="" width={240} loading="lazy" /> : null}
              <span>
                {work.brandName} — {work.title}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}
