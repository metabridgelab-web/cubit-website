import type { Metadata } from 'next'

import { PageView, pageViewMetadata } from '@/components/skeleton/PageView'
import { resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { slug: string }

// /business/licensing, /business/custom … BUSINESS 섹션의 소개 페이지
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  return pageViewMetadata(await resolveLocale(params), slug, 'business', `/business/${slug}`)
}

export default async function BusinessDetailPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  return <PageView locale={locale} slug={(await params).slug} section="business" />
}
