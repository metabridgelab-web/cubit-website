// 관리자 화면 아티스트 목록 위의 분야 · 장르 단추가 쓰는 주소 만들기와 읽기.
// 목록 주소에 거르기 조건(where)을 붙인다: 분야는 categories, 장르는 genres.

export const ARTIST_LIST = '/admin/collections/artists'

// 'all' = 고르지 않음, 'none' = 장르 없음, 그 밖에는 id
export type Selection = { category: string; genre: string }

export const artistListHref = ({ category, genre }: Selection) => {
  const conditions: string[] = []
  if (category !== 'all') conditions.push(`[categories][in][0]=${category}`)
  if (genre === 'none') conditions.push('[genres][exists]=false')
  else if (genre !== 'all') conditions.push(`[genres][in][0]=${genre}`)
  if (!conditions.length) return ARTIST_LIST
  return `${ARTIST_LIST}?${conditions.map((condition, index) => `where[or][0][and][${index}]${condition}`).join('&')}`
}

// 주소의 where 조건에서 지금 고른 분야와 장르를 읽는다.
// 펼친 꼴(where[…][genres][in][0]=3)과 묶은 꼴({ where: { or: [...] } }) 모두 읽는다.
export const readSelection = (searchParams?: Record<string, unknown>): Selection => {
  const query = Object.entries(searchParams ?? {})
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&')
  const id = (field: string) => query.match(new RegExp(`${field}(?:\\]\\[in\\]\\[0\\]="|":\\{"in":\\["?)(\\d+)`))?.[1]
  const genreNone = /genres(\]\[exists\]="false"|":\{"exists":"false")/.test(query)
  return {
    category: id('categories') ?? 'all',
    genre: genreNone ? 'none' : (id('genres') ?? 'all'),
  }
}
