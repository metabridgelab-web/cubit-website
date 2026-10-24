import type { Metadata } from 'next'

import { JoinView } from '@/components/pages/JoinView'
import { getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/join/creators', { title: labels.join.creators })
}

export default async function Page({ params }: { params: Promise<LangParams> }) {
  return <JoinView locale={await resolveLocale(params)} kind="creator" />
}
