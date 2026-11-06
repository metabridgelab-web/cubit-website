import { NextResponse, type NextRequest } from 'next/server'

import { DEFAULT_LOCALE } from '@/constants/locales'
import { getArtistCategories, getArtistSearchIndex } from '@/lib/data'

// 아티스트 목록의 이름 검색이 처음 쓰일 때 받아 가는 목록. 게시된 아티스트만 담기고, 5분 동안 재사용한다.
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('category')
  const category = (await getArtistCategories(DEFAULT_LOCALE)).find((c) => c.slug === slug)
  if (!category) return NextResponse.json({ error: 'Unknown category' }, { status: 404 })
  return NextResponse.json(await getArtistSearchIndex(category.id), {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=3600' },
  })
}
