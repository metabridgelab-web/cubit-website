import type { BeforeListServerProps } from 'payload'

// 관리자 화면 아티스트 목록 위: 장르별로 나눠 보는 단추 (전체 · K-Pop · K-Ballad … · 장르 없음).
// 누르면 목록 주소에 거르기 조건(where)을 붙여 그 장르의 아티스트만 보인다. 꾸밈은 app/(payload)/custom.scss

const LIST = '/admin/collections/artists'

export async function GenreTabs({ payload, searchParams }: BeforeListServerProps) {
  const [{ docs: genres }, { docs: artists }] = await Promise.all([
    // 장르 이름은 관리자가 정한 영어 원문 그대로 (K-Pop · K-Ballad …)
    payload.find({ collection: 'artist-genres', sort: '_order', depth: 0, limit: 100, locale: 'en' }),
    payload.find({ collection: 'artists', depth: 0, pagination: false, select: { genres: true }, draft: true }),
  ])

  const count = new Map<number | 'none', number>()
  for (const artist of artists) {
    const ids = (artist.genres ?? []).map((g) => (typeof g === 'object' ? g.id : g))
    if (!ids.length) count.set('none', (count.get('none') ?? 0) + 1)
    for (const id of ids) count.set(id, (count.get(id) ?? 0) + 1)
  }

  // 지금 고른 장르: 주소의 where 조건에서 읽는다 (where[…][genres][in][0]=3 처럼 펼친 꼴과 { where: {…} } 꼴 모두)
  const query = Object.entries(searchParams ?? {})
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('&')
  const active = /genres(\]\[exists\]="false"|":\{"exists":"false")/.test(query)
    ? 'none'
    : (query.match(/genres(?:\]\[in\]\[0\]="|":\{"in":\["?)(\d+)/)?.[1] ?? (/where/.test(query) ? null : 'all'))

  const tabs = [
    { key: 'all', label: '전체', total: artists.length, href: LIST },
    ...genres.map((g) => ({ key: String(g.id), label: g.name, total: count.get(g.id) ?? 0, href: `${LIST}?where[or][0][and][0][genres][in][0]=${g.id}` })),
    { key: 'none', label: '장르 없음', total: count.get('none') ?? 0, href: `${LIST}?where[or][0][and][0][genres][exists]=false` },
  ]

  return (
    <nav className="cubit-genres" aria-label="장르별 보기">
      <p className="cubit-genres__hint">장르별 보기 · 숫자는 그룹과 멤버를 모두 센 수</p>
      <ul>
        {tabs.map((tab) => (
          <li key={tab.key}>
            <a
              href={tab.href}
              aria-current={tab.key === active ? 'page' : undefined}
              className={`cubit-genres__tab${tab.total ? '' : ' cubit-genres__tab--empty'}`}
            >
              {tab.label}
              <span>{tab.total}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
