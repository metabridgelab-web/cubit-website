// 기본 데이터 넣기: 아티스트 카테고리 · 게시판과 분류 · 메뉴 · 시작용 소개 페이지.
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
    slug: 'experts',
    en: 'Experts',
    ko: '전문가',
    sortOrder: 4,
    disclaimer: {
      en: 'This is an AI character, not a licensed professional. Content is for information only and is not professional advice.',
      ko: 'AI 캐릭터이며 실제 자격을 가진 전문가가 아닙니다. 정보 제공용이며 전문적인 조언을 대신하지 않습니다.',
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
      { en: 'Experts', ko: '전문가', url: '/artists/experts' },
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

// 시작용 소개 페이지 (COMPANY · BUSINESS · 정책). 없을 때만 만들고, 관리자 화면에서 고친 내용은 덮어쓰지 않는다.
// [Replace …] 표시가 있는 글은 실제 내용으로 바꿔야 한다. 정책 문서는 법률 검토 후 게시할 본문으로 교체한다.
const text = (value: string) => ({ type: 'text', version: 1, text: value, format: 0, detail: 0, mode: 'normal', style: '' })
const richText = (...paragraphs: string[]) => ({
  root: {
    type: 'root',
    version: 1,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    children: paragraphs.map((value) => ({ type: 'paragraph', version: 1, direction: 'ltr' as const, format: '' as const, indent: 0, textFormat: 0, children: [text(value)] })),
  },
})

const LEGAL_NOTE = 'This policy is being prepared. The final text will be published here after legal review.'
const starterPages: { slug: string; section: 'company' | 'business' | 'legal'; title: string; intro: string; reviewRequired?: boolean; layout: Record<string, unknown>[] }[] = [
  {
    slug: 'about',
    section: 'company',
    title: 'About CUBIT',
    intro: 'CUBIT ENTERTAINMENT is a global entertainment company. Every artist on our roster is an AI talent.',
    layout: [
      { blockType: 'text', heading: 'Who we are', body: richText('[Replace with the company introduction.]') },
      { blockType: 'text', heading: 'Our family', body: richText('CUBITER · VIONA · ANIMA-X · EXIMAX · EXORA · CUBIT ENTERTAINMENT', '[Replace with a short introduction of each company.]') },
      { blockType: 'cta', text: 'Work with our artists on your next campaign.', label: 'Start a campaign', url: '/business/campaign' },
    ],
  },
  {
    slug: 'history',
    section: 'company',
    title: 'History',
    intro: 'Milestones of CUBIT ENTERTAINMENT.',
    layout: [{ blockType: 'timeline', items: [{ year: '20XX', text: '[Replace with a company milestone.]' }, { year: '20XX', text: '[Replace with a company milestone.]' }] }],
  },
  {
    slug: 'location',
    section: 'company',
    title: 'Location',
    intro: 'Visit or contact our offices.',
    layout: [{ blockType: 'location', offices: [{ name: 'Head Office', address: '[Replace with the office address.]' }] }],
  },
  {
    slug: 'licensing',
    section: 'business',
    title: 'Talent Licensing',
    intro: 'Feature our AI talent in ads, video, and social right away. Usage rights are set by purpose, period, and region, so contracts move fast.',
    layout: [
      { blockType: 'text', heading: 'How it works', body: richText('Choose the talent, tell us where and how long the content will run, and we prepare the usage terms and a quote.', '[Replace with details of the licensing process.]') },
      { blockType: 'cta', text: 'Tell us about your campaign and get a quote.', label: 'Open the campaign builder', url: '/business/campaign' },
    ],
  },
  {
    slug: 'custom',
    section: 'business',
    title: 'Brand-Exclusive AI Talent',
    intro: 'We create an AI talent made only for your brand, from story and look to voice. From short campaigns to long-term IP.',
    layout: [
      { blockType: 'text', heading: 'What we build', body: richText('[Replace with details of the custom talent service: process, timeline, and what the brand receives.]') },
      { blockType: 'cta', text: 'Talk to us about a talent made for your brand.', label: 'Contact us', url: '/contact' },
    ],
  },
  { slug: 'privacy', section: 'legal', title: 'Privacy Policy', intro: LEGAL_NOTE, reviewRequired: true, layout: [] },
  { slug: 'cookies', section: 'legal', title: 'Cookie Policy', intro: LEGAL_NOTE, reviewRequired: true, layout: [] },
  { slug: 'terms', section: 'legal', title: 'Terms of Use', intro: LEGAL_NOTE, reviewRequired: true, layout: [] },
]

const legalIds: number[] = []
for (const page of starterPages) {
  const where: Where = { and: [{ slug: { equals: page.slug } }, { section: { equals: page.section } }] }
  let doc = (await payload.find({ collection: 'pages', where, depth: 0, limit: 1, draft: true })).docs[0]
  if (!doc) {
    doc = await payload.create({ collection: 'pages', locale: 'en', draft: false, depth: 0, data: { ...page, generateSlug: false, _status: 'published' } as never })
    payload.logger.info(`추가: 페이지 /${page.slug}`)
  }
  if (page.section === 'legal') legalIds.push(doc.id)
}

// 하단 정책 링크가 비어 있으면 정책 페이지 세 개를 연결한다
const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
if (!settings.policyLinks?.length) {
  await payload.updateGlobal({ slug: 'site-settings', locale: 'en', depth: 0, data: { policyLinks: legalIds } })
  payload.logger.info('갱신: 하단 정책 링크')
}

// 사이트 고정 문구와 비즈니스 문구를 한 번 저장해서 기본값(영어)이 자동 번역되게 한다
await payload.updateGlobal({ slug: 'ui-labels', locale: 'en', data: {} })
await payload.updateGlobal({ slug: 'business-settings', locale: 'en', data: {} })
payload.logger.info('갱신: 사이트 고정 문구 · 비즈니스 문구')

payload.logger.info('기본 데이터 넣기 완료')
process.exit(0)
