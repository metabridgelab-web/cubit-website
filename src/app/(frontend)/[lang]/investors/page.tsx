import type { Metadata } from 'next'

import { InvestorsView, investorsMetadata } from '@/components/pages/InvestorsView'
import { resolveLocale, type LangParams } from '@/lib/page'

// INVESTORS 프로젝트 개요. 관리자 "투자자 정보 > 공개"가 꺼져 있으면 404.
export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  return investorsMetadata(await resolveLocale(params), 'overview')
}

export default async function InvestorsPage({ params }: { params: Promise<LangParams> }) {
  return <InvestorsView locale={await resolveLocale(params)} tab="overview" />
}
