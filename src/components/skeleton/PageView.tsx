import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { LocaleCode } from '@/constants/locales'
import { getPage } from '@/lib/data'
import { mediaUrl, pageMetadata } from '@/lib/page'

import { Blocks } from './Blocks'

// 관리자 화면 "페이지"로 만든 소개 페이지를 그린다. 디자인 적용 전 임시 모양.
export async function PageView({ locale, slug, section }: { locale: LocaleCode; slug: string; section: string }) {
  const result = await getPage(slug, locale, section)
  if (!result) notFound()
  const { page, servedLocale } = result
  const hero = mediaUrl(page.heroImage, 'hero')
  return (
    <article lang={servedLocale}>
      {hero ? <img src={hero} alt="" /> : null}
      <h1>{page.title}</h1>
      {page.intro ? <p>{page.intro}</p> : null}
      <Blocks blocks={page.layout} locale={locale} />
    </article>
  )
}

export const pageViewMetadata = async (locale: LocaleCode, slug: string, section: string, path: string): Promise<Metadata> => {
  const result = await getPage(slug, locale, section)
  return pageMetadata(locale, path, { title: result?.page.title, description: result?.page.intro })
}
