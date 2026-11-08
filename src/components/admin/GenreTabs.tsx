import type { BeforeListServerProps } from 'payload'

import { artistListHref, readSelection } from './artistTabs'

// 관리자 화면 아티스트 목록 위: 분야별(가수 · 모델 · 배우 · 전문가) 단추와 장르별 단추.
// 분야를 고르면 그 분야의 아티스트만 보이고, 장르 단추도 그 분야의 장르만 나온다.
// 누르면 목록 주소에 거르기 조건(where)을 붙인다. 꾸밈은 app/(payload)/custom.scss

type Tab = { key: string; label: string; total: number; href: string }

const idOf = (value: unknown) => String(typeof value === 'object' && value !== null ? (value as { id: number }).id : value)

function TabRow({ label, hint, tabs, active }: { label: string; hint: string; tabs: Tab[]; active: string }) {
  return (
    <nav className="cubit-genres" aria-label={label}>
      <p className="cubit-genres__hint">{hint}</p>
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

export async function GenreTabs({ payload, searchParams }: BeforeListServerProps) {
  const [{ docs: categories }, { docs: genres }, { docs: artists }] = await Promise.all([
    payload.find({ collection: 'artist-categories', sort: 'sortOrder', depth: 0, limit: 100, locale: 'ko' }),
    // 장르 이름은 관리자가 정한 영어 원문 그대로 (K-Pop · K-Ballad …)
    payload.find({ collection: 'artist-genres', sort: '_order', depth: 0, limit: 100, locale: 'en' }),
    payload.find({ collection: 'artists', depth: 0, pagination: false, select: { genres: true, categories: true }, draft: true }),
  ])

  const selection = readSelection(searchParams as Record<string, unknown> | undefined)
  const { category } = selection
  const inCategory = artists.filter((artist) => category === 'all' || (artist.categories ?? []).some((c) => idOf(c) === category))

  const categoryTabs: Tab[] = [
    { key: 'all', label: '전체', total: artists.length, href: artistListHref({ category: 'all', genre: 'all' }) },
    ...categories.map((c) => ({
      key: String(c.id),
      label: c.name,
      total: artists.filter((artist) => (artist.categories ?? []).some((x) => idOf(x) === String(c.id))).length,
      href: artistListHref({ category: String(c.id), genre: 'all' }),
    })),
  ]

  const count = new Map<string, number>()
  for (const artist of inCategory) {
    const ids = (artist.genres ?? []).map(idOf)
    if (!ids.length) count.set('none', (count.get('none') ?? 0) + 1)
    for (const id of ids) count.set(id, (count.get(id) ?? 0) + 1)
  }
  const shownGenres = genres.filter((g) => category === 'all' || idOf(g.category) === category)
  const genreTabs: Tab[] = [
    { key: 'all', label: '전체', total: inCategory.length, href: artistListHref({ category, genre: 'all' }) },
    ...shownGenres.map((g) => ({ key: String(g.id), label: g.name, total: count.get(String(g.id)) ?? 0, href: artistListHref({ category, genre: String(g.id) }) })),
    { key: 'none', label: '장르 없음', total: count.get('none') ?? 0, href: artistListHref({ category, genre: 'none' }) },
  ]

  return (
    <>
      <TabRow label="분야별 보기" hint="분야별 보기" tabs={categoryTabs} active={category} />
      <TabRow label="장르별 보기" hint="장르별 보기 · 숫자는 그룹과 멤버를 모두 센 수" tabs={genreTabs} active={selection.genre} />
    </>
  )
}
