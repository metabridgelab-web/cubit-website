import { notFound, redirect } from 'next/navigation'

import { localePath } from '@/i18n'
import { getArtistCategories } from '@/lib/data'
import { resolveLocale, type LangParams } from '@/lib/page'

// "전체" 목록은 두지 않는다: /artists 로 오면 첫 번째 카테고리(가수)로 보낸다
export default async function ArtistsPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [first] = await getArtistCategories(locale)
  if (!first) notFound()
  redirect(localePath(locale, `/artists/${first.slug}`))
}
