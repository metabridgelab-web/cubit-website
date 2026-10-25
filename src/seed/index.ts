// 기본 데이터 넣기: 아티스트 카테고리 · 가수 장르 · 게시판과 분류 · 메뉴 · 시작용 소개 페이지 · 계열사 · 스튜디오 단계.
// 영어 원문과 한국어 번역을 함께 넣는다. 여러 번 실행해도 이미 있는 항목은 갱신만 한다.
// 실행: npm run seed
import { getPayload, type GlobalSlug, type Where } from 'payload'

import { UI_LABEL_GROUPS, uiLabelSlug } from '../globals/UiLabels'
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

// 가수 장르 20개: 비어 있을 때만 넣는다 (관리자 화면 "아티스트 관리 → 장르"에서 고친 내용은 덮어쓰지 않음)
const SINGER_GENRES = [
  'K-Pop', 'K-Ballad', 'Retro K-Pop', 'Pop', 'Rock', 'Electronic / Dance', 'Hip-Hop / Rap', 'R&B - Soul / Funk', 'Popera', 'Musical',
  'Trot Music', 'Jazz', 'Blues', 'Classical', 'Folk / Acoustic', 'Country', 'Latin', 'World Music', 'Religious / Gospel', 'Soundtrack / Instrumental',
]
const singers = (await payload.find({ collection: 'artist-categories', where: { slug: { equals: 'singers' } }, limit: 1, depth: 0 })).docs[0]
if (singers && !(await payload.count({ collection: 'artist-genres' })).totalDocs) {
  for (const name of SINGER_GENRES) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    await payload.create({ collection: 'artist-genres', locale: 'en', depth: 0, data: { name, slug, generateSlug: false, category: singers.id } })
  }
  payload.logger.info(`추가: 가수 장르 ${SINGER_GENRES.length}개`)
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
      { en: 'Family', ko: '레이블·브랜드·계열사', url: '/about/family' },
      { en: 'Location', ko: '오시는 길', url: '/about/location' },
    ],
  },
  {
    en: 'STUDIO',
    ko: 'STUDIO',
    url: '/studio',
    items: [
      { en: 'Production Process', ko: '제작 과정 공개', url: '/studio#process' },
      { en: 'Technology Showcase', ko: '기술 쇼케이스', url: '/studio#showcase' },
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
    // "투자자 정보 > 공개"를 켜기 전에는 사이트에서 자동으로 숨겨진다
    en: 'INVESTORS',
    ko: 'INVESTORS',
    url: '/investors',
    items: [
      { en: 'Overview', ko: '프로젝트 개요', url: '/investors' },
      { en: 'Token Info', ko: '토큰 정보', url: '/investors/token' },
      { en: 'Whitepaper', ko: '백서', url: '/investors/whitepaper' },
      { en: 'Roadmap', ko: '로드맵', url: '/investors/roadmap' },
      { en: 'Disclosures', ko: '공시', url: '/investors/disclosure' },
      { en: 'Security Audit', ko: '보안 감사', url: '/investors/audit' },
      { en: 'Official Addresses', ko: '공식 주소 안내', url: '/investors/official' },
      { en: 'Risk Notice', ko: '위험 고지', url: '/investors/disclaimer' },
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
  {
    en: 'TRUST',
    ko: 'TRUST',
    url: '/trust',
    items: [
      { en: 'AI Content Labeling', ko: 'AI 표시 원칙', url: '/trust/ai-label' },
      { en: 'Data Principles', ko: '데이터 원칙', url: '/trust/data' },
      { en: 'Report Impersonation', ko: '사칭 신고', url: '/trust/report' },
    ],
  },
  {
    en: 'JOIN US',
    ko: 'JOIN US',
    url: '/join',
    items: [
      { en: 'Creator Partners', ko: '크리에이터 파트너 모집', url: '/join/creators' },
      { en: 'Careers', ko: '채용', url: '/join/careers' },
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
const starterPages: { slug: string; section: 'company' | 'business' | 'legal' | 'trust'; title: string; intro: string; reviewRequired?: boolean; layout: Record<string, unknown>[] }[] = [
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
  {
    slug: 'ai-label',
    section: 'trust',
    title: 'AI Content Labeling',
    intro: 'All of our artists are AI. We label AI-generated content clearly so that fans and partners always know what they are seeing.',
    reviewRequired: true,
    layout: [{ blockType: 'text', heading: 'How we label', body: richText('[Replace with the labeling rules: where and how the AI label appears on music, video, images, and social posts. Confirm after legal review.]') }],
  },
  {
    slug: 'data',
    section: 'trust',
    title: 'Data Principles',
    intro: 'How we source training data, secure rights, and handle the likeness and voice of real people.',
    reviewRequired: true,
    layout: [{ blockType: 'text', heading: 'Our principles', body: richText('[Replace with the data principles: data sources, how rights are secured, and the rules for using the likeness or voice of real people. Confirm after legal review.]') }],
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

// 계열사 6곳: 비어 있을 때만 만든다. 홈 슬라이드에 올린 소개 영상과 대표 이미지를 그대로 연결한다.
if (!(await payload.count({ collection: 'family' })).totalDocs) {
  const slides = (await payload.find({ collection: 'home-slides', depth: 0, limit: 50 })).docs
  for (const name of ['CUBIT ENTERTAINMENT', 'CUBITER', 'VIONA', 'ANIMA-X', 'EXIMAX', 'EXORA']) {
    const slide = slides.find((s) => s.headline === name)
    await payload.create({
      collection: 'family',
      locale: 'en',
      depth: 0,
      data: {
        name,
        kind: 'affiliate',
        description: `[Replace with a short introduction of ${name}.]`,
        film: typeof slide?.videoFile === 'number' ? slide.videoFile : undefined,
        poster: typeof slide?.poster === 'number' ? slide.poster : undefined,
      },
    })
  }
  payload.logger.info('추가: 계열사 6곳')
}

// STUDIO 제작 과정 3단계: 비어 있을 때만 만든다 (사진·영상은 관리자 화면에서 올린다)
if (!(await payload.count({ collection: 'studio-items' })).totalDocs) {
  const steps = [
    { title: 'Planning', description: 'Story, look, and voice are designed first: who the artist is, how they sound, and what they stand for.' },
    { title: 'Creation & Performance', description: 'The artist is generated and performs: music, video, and photo shoots made in our AI production pipeline.' },
    { title: 'Review', description: 'Our team checks every release for quality, rights, and clear AI labeling before it goes out.' },
  ]
  for (const step of steps) {
    await payload.create({ collection: 'studio-items', locale: 'en', depth: 0, data: { kind: 'process', ...step } })
  }
  payload.logger.info('추가: 스튜디오 제작 과정 3단계')
}

// 하단 정책 링크가 비어 있으면 정책 페이지 세 개를 연결한다
const settings = await payload.findGlobal({ slug: 'site-settings', depth: 0 })
if (!settings.policyLinks?.length) {
  await payload.updateGlobal({ slug: 'site-settings', locale: 'en', depth: 0, data: { policyLinks: legalIds } })
  payload.logger.info('갱신: 하단 정책 링크')
}

// 사이트 고정 문구와 비즈니스 문구를 한 번 저장해서 기본값(영어)이 자동 번역되게 한다
for (const group of UI_LABEL_GROUPS) await payload.updateGlobal({ slug: uiLabelSlug(group) as GlobalSlug, locale: 'en', data: {} })
await payload.updateGlobal({ slug: 'business-settings', locale: 'en', data: {} })
payload.logger.info('갱신: 사이트 고정 문구 · 비즈니스 문구')

payload.logger.info('기본 데이터 넣기 완료')
process.exit(0)
