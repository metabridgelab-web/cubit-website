import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { InvestorsView, investorsMetadata } from '@/components/pages/InvestorsView'
import { INVESTOR_TABS, type InvestorTab } from '@/constants/investors'
import { resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { tab: string }

const asTab = (tab: string) => (INVESTOR_TABS.includes(tab as InvestorTab) && tab !== 'overview' ? (tab as InvestorTab) : null)

// /investors/token, /investors/whitepaper … 투자자 정보 탭
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const tab = asTab((await params).tab)
  return tab ? investorsMetadata(await resolveLocale(params), tab) : {}
}

export default async function InvestorTabPage({ params }: { params: Promise<Params> }) {
  const tab = asTab((await params).tab)
  if (!tab) notFound()
  return <InvestorsView locale={await resolveLocale(params)} tab={tab} />
}
