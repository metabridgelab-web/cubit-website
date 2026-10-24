import type { Metadata } from 'next'

import { PageView, pageViewMetadata } from '@/components/pages/PageView'
import { resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { slug: string }

// /about/history, /about/location … COMPANY 섹션의 페이지
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  return pageViewMetadata(await resolveLocale(params), slug, 'company', `/about/${slug}`)
}

export default async function CompanyPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  return <PageView locale={locale} slug={(await params).slug} section="company" />
}
