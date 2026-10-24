import type { Metadata } from 'next'

import { PageView, pageViewMetadata } from '@/components/pages/PageView'
import { resolveLocale, type LangParams } from '@/lib/page'

// /about = 관리자 화면 "페이지"에서 주소가 about 이고 섹션이 COMPANY인 페이지
export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  return pageViewMetadata(await resolveLocale(params), 'about', 'company', '/about')
}

export default async function AboutPage({ params }: { params: Promise<LangParams> }) {
  return <PageView locale={await resolveLocale(params)} slug="about" section="company" />
}
