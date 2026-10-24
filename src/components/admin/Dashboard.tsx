import type { CollectionSlug, GlobalSlug, Payload, SanitizedPermissions, TypedUser, Where } from 'payload'

// 관리자 첫 화면 위쪽: 인사 · 확인할 일(새 견적 요청 · 새 문의 · 임시저장 글) · 자주 쓰는 바로가기.
// 계정 권한에 맞는 카드만 보인다 (예: 영업 담당자에게만 견적 요청 카드). 꾸밈은 app/(payload)/custom.scss

type Props = { payload: Payload; user: TypedUser | null; permissions: SanitizedPermissions }

const ADMIN = '/admin'

type Stat = { label: string; hint: string; collection: CollectionSlug; where: Where; query: string; tone: 'cyan' | 'pink' | 'lime' }

const STATS: Stat[] = [
  {
    label: '새 견적 요청',
    hint: '캠페인 빌더로 들어온 요청 중 아직 "접수" 상태',
    collection: 'quote-requests',
    where: { status: { equals: 'received' } },
    query: 'where[status][equals]=received',
    tone: 'lime',
  },
  {
    label: '새 문의',
    hint: '제휴 · 언론 · 투자 · 사칭 신고 · 지원 중 아직 "접수" 상태',
    collection: 'inquiries',
    where: { status: { equals: 'received' } },
    query: 'where[status][equals]=received',
    tone: 'pink',
  },
  {
    label: '임시저장 글',
    hint: '아직 게시하지 않은 뉴스 · 공지',
    collection: 'posts',
    where: { _status: { equals: 'draft' } },
    query: 'where[_status][equals]=draft',
    tone: 'cyan',
  },
]

type Shortcut = { label: string; text: string; href: string; collection?: CollectionSlug; global?: GlobalSlug; create?: boolean }

const SHORTCUTS: Shortcut[] = [
  { label: '아티스트 추가', text: '사진 · 정보 · 자기소개 · 뮤직비디오', href: '/collections/artists/create', collection: 'artists', create: true },
  { label: '뉴스 · 공지 쓰기', text: '예약 게시와 상단 고정도 여기서', href: '/collections/posts/create', collection: 'posts', create: true },
  { label: '홈 영상 슬라이드', text: '첫 화면 영상 · 순서 · 노출 기간', href: '/collections/home-slides', collection: 'home-slides' },
  { label: '작업 사례 추가', text: '브랜드 캠페인 결과물', href: '/collections/case-studies/create', collection: 'case-studies', create: true },
  { label: '페이지', text: '회사 소개 · 연혁 · 정책 · TRUST', href: '/collections/pages', collection: 'pages' },
  { label: '메뉴', text: '오른쪽 위 전체 화면 메뉴', href: '/globals/navigation', global: 'navigation' },
  { label: '사이트 설정', text: '회사 정보 · SNS · 언어 켜고 끄기', href: '/globals/site-settings', global: 'site-settings' },
  { label: '사이트 고정 문구', text: '버튼 · 제목 같은 짧은 글', href: '/globals/ui-labels-common', global: 'ui-labels-common' as GlobalSlug },
]

export async function Dashboard({ payload, user, permissions }: Props) {
  const name = (user as { name?: string; email?: string } | null)?.name || user?.email?.split('@')[0] || ''

  // 권한이 있는 것만 센다 (방문자 권한 규칙을 그대로 적용)
  const stats = (
    await Promise.all(
      STATS.filter((s) => permissions.collections?.[s.collection]?.read).map(async (s) => {
        try {
          const { totalDocs } = await payload.count({ collection: s.collection, where: s.where, overrideAccess: false, user })
          return { ...s, count: totalDocs }
        } catch {
          return null
        }
      }),
    )
  ).filter((s) => s !== null)

  const shortcuts = SHORTCUTS.filter((s) => {
    if (s.collection) {
      const p = permissions.collections?.[s.collection]
      return s.create ? p?.create : p?.read
    }
    return s.global ? permissions.globals?.[s.global]?.read : true
  })

  return (
    <section className="cubit-dash">
      <div className="cubit-dash__hero">
        <div>
          <p className="cubit-dash__eyebrow">CUBIT ENTERTAINMENT // ADMIN</p>
          <h1 className="cubit-dash__title">{name ? `${name}님, 안녕하세요` : '안녕하세요'}</h1>
          <p className="cubit-dash__lead">영어로 쓰고 저장하면 나머지 11개 언어로 자동 번역됩니다.</p>
        </div>
        <a className="cubit-dash__site" href="/en" target="_blank" rel="noopener noreferrer">
          사이트 보기 ↗
        </a>
      </div>

      {stats.length ? (
        <>
          <h2 className="cubit-dash__heading">확인할 일</h2>
          <ul className="cubit-dash__stats">
            {stats.map((s) => (
              <li key={s.collection}>
                <a className={`cubit-stat cubit-stat--${s.tone}`} href={`${ADMIN}/collections/${s.collection}?${s.query}`}>
                  <span className="cubit-stat__count">{s.count}</span>
                  <span className="cubit-stat__label">{s.label}</span>
                  <span className="cubit-stat__hint">{s.hint}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      {shortcuts.length ? (
        <>
          <h2 className="cubit-dash__heading">바로가기</h2>
          <ul className="cubit-dash__shortcuts">
            {shortcuts.map((s) => (
              <li key={s.href}>
                <a className="cubit-card" href={`${ADMIN}${s.href}`}>
                  <span className="cubit-card__label">
                    {s.label} <span aria-hidden>→</span>
                  </span>
                  <span className="cubit-card__text">{s.text}</span>
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <h2 className="cubit-dash__heading">전체 목록</h2>
    </section>
  )
}
