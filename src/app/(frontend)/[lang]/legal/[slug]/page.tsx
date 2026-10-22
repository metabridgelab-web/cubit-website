import type { Metadata } from 'next'

import { PageView, pageViewMetadata } from '@/components/skeleton/PageView'
import { resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { slug: string }

// /legal/privacy, /legal/cookies … 정책 페이지 (검수 전에는 영어 원문으로 보인다)
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  return pageViewMetadata(await resolveLocale(params), slug, 'legal', `/legal/${slug}`)
}

export default async function LegalPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  return <PageView locale={locale} slug={(await params).slug} section="legal" />
}
