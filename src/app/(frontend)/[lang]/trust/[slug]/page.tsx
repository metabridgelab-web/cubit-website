import type { Metadata } from 'next'

import { PageView, pageViewMetadata } from '@/components/pages/PageView'
import { resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { slug: string }

// /trust/ai-label, /trust/data … TRUST 섹션의 원칙 페이지
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  return pageViewMetadata(await resolveLocale(params), slug, 'trust', `/trust/${slug}`)
}

export default async function TrustDetailPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  return <PageView locale={locale} slug={(await params).slug} section="trust" />
}
