// 기본 데이터 넣기: 아티스트 카테고리 · 게시판과 분류 · 메뉴.
// 영어 원문과 한국어 번역을 함께 넣는다. 여러 번 실행해도 이미 있는 항목은 갱신만 한다.
// 실행: npm run seed
import { getPayload, type Where } from 'payload'

import config from '../payload.config'

const payload = await getPayload({ config })

type SeedCollection = 'artist-categories' | 'boards' | 'post-categories'
type Localized = { en: string; ko: string }

// 영어 또는 한국어 이름으로 찾고, 없으면 영어로 만든 뒤 한국어 번역을 채운다
const upsert = async (
  collection: SeedCollection,
  findBy: (locale: 'en' | 'ko') => Where,
  en: Record<string, unknown>,
  ko: Record<string, unknown>,
) => {
  let existing = (await payload.find({ collection, where: findBy('en'), locale: 'en', limit: 1, depth: 0 })).docs[0]
  existing ??= (await payload.find({ collection, where: findBy('ko'), locale: 'ko', limit: 1, depth: 0 })).docs[0]

  const doc = existing
    ? await payload.update({ collection, id: existing.id, locale: 'en', data: en as never, depth: 0 })
    : await payload.create({ collection, locale: 'en', data: en as never, depth: 0 })
  await payload.update({ collection, id: doc.id, locale: 'ko', data: ko as never, depth: 0 })
  payload.logger.info(`${existing ? '갱신' : '추가'}: ${collection} ${JSON.stringify(en.name)}`)
  return doc
}

const categories: (Localized & { slug: string; sortOrder: number; disclaimer?: Localized })[] = [
  { slug: 'singers', en: 'Singers', ko: '가수', sortOrder: 1 },
  { slug: 'models', en: 'Models', ko: '모델', sortOrder: 2 },
  { slug: 'actors', en: 'Actors', ko: '배우', sortOrder: 3 },
  {
    slug: 'doctors',
    en: 'Doctors',
    ko: '전문의',
    sortOrder: 4,
    disclaimer: {
      en: 'This is an AI character, not a real doctor. It does not diagnose or prescribe.',
      ko: 'AI 캐릭터이며 실제 의사가 아닙니다. 진단·처방을 하지 않습니다.',
    },
  },
]

for (const { slug, en, ko, sortOrder, disclaimer } of categories) {
  await upsert(
    'artist-categories',
    () => ({ slug: { equals: slug } }),
    { name: en, slug, generateSlug: false, sortOrder, disclaimer: disclaimer?.en },
    { name: ko, disclaimer: disclaimer?.ko },
  )
}

const boards: (Localized & { slug: string; sortOrder: number; categories: Localized[] })[] = [
  {
    slug: 'news',
    en: 'News',
    ko: '뉴스',
    sortOrder: 1,
    categories: [
      { en: 'Music', ko: '음악' },
      { en: 'Campaign', ko: '캠페인' },
      { en: 'Activity', ko: '활동' },
      { en: 'Press', ko: '보도자료' },
    ],
  },
  {
    slug: 'notice',
    en: 'Notice',
    ko: '공지사항',
    sortOrder: 2,
    categories: [
      { en: 'Official Statement', ko: '공식 입장' },
      { en: 'Legal Action', ko: '법적 대응' },
      { en: 'Impersonation Alert', ko: '사칭 주의' },
      { en: 'Event', ko: '이벤트' },
    ],
  },
]

for (const board of boards) {
  const created = await upsert(
    'boards',
    () => ({ slug: { equals: board.slug } }),
    { name: board.en, slug: board.slug, generateSlug: false, sortOrder: board.sortOrder },
    { name: board.ko },
  )
  for (const [index, category] of board.categories.entries()) {
    await upsert(
      'post-categories',
      (locale): Where => ({ board: { equals: created.id }, name: { equals: category[locale] } }),
      { name: category.en, board: created.id, sortOrder: index + 1 },
      { name: category.ko },
    )
  }
}

// 메뉴: 영어로 저장한 뒤, 같은 줄(id)에 한국어 이름을 채운다
const menu: (Localized & { url: string; items: (Localized & { url: string })[] })[] = [
  {
    en: 'ARTISTS',
    ko: 'ARTISTS',
    url: '/artists',
    items: [
      { en: 'Singers', ko: '가수', url: '/artists/singers' },
      { en: 'Models', ko: '모델', url: '/artists/models' },
      { en: 'Actors', ko: '배우', url: '/artists/actors' },
      { en: 'Doctors', ko: '전문의', url: '/artists/doctors' },
    ],
  },
  {
    en: 'COMPANY',
    ko: 'COMPANY',
    url: '/about',
    items: [
      { en: 'About Us', ko: '회사 소개', url: '/about' },
      { en: 'History', ko: '연혁', url: '/about/history' },
      { en: 'Location', ko: '오시는 길', url: '/about/location' },
    ],
  },
  {
    en: 'BUSINESS',
    ko: 'BUSINESS',
    url: '/business',
    items: [
      { en: 'Overview', ko: '개요', url: '/business' },
      { en: 'Talent Licensing', ko: '탤런트 사용 계약', url: '/business/licensing' },
      { en: 'Brand-Exclusive AI Talent', ko: '브랜드 전속 AI 탤런트 제작', url: '/business/custom' },
      { en: 'Campaign Builder', ko: '캠페인 빌더', url: '/business/campaign' },
      { en: 'Case Studies', ko: '작업 사례', url: '/business/works' },
    ],
  },
  {
    en: 'NEWS',
    ko: 'NEWS',
    url: '/news',
    items: [
      { en: 'News', ko: '뉴스', url: '/news' },
      { en: 'Notice', ko: '공지사항', url: '/news/notice' },
    ],
  },
  { en: 'CONTACT', ko: 'CONTACT', url: '/contact', items: [] },
]

const savedMenu = await payload.updateGlobal({
  slug: 'navigation',
  locale: 'en',
  depth: 0,
  data: {
    ctaLabel: 'Get a campaign quote',
    sections: menu.map(({ en, url, items }) => ({
      label: en,
      url,
      items: items.map((item) => ({ label: item.en, url: item.url })),
    })),
  },
})
await payload.updateGlobal({
  slug: 'navigation',
  locale: 'ko',
  depth: 0,
  data: {
    ctaLabel: '캠페인 견적 받기',
    sections: (savedMenu.sections ?? []).map((section, sectionIndex) => ({
      ...section,
      label: menu[sectionIndex].ko,
      items: (section.items ?? []).map((item, itemIndex) => ({ ...item, label: menu[sectionIndex].items[itemIndex].ko })),
    })),
  },
})
payload.logger.info('갱신: 메뉴')

payload.logger.info('기본 데이터 넣기 완료')
process.exit(0)
