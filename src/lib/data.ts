import 'server-only'

import config from '@payload-config'
import { getPayload, type GlobalSlug, type Where } from 'payload'
import { cache } from 'react'

import { DEFAULT_LOCALE, TRANSLATION_TARGETS, type LocaleCode } from '@/constants/locales'
import { UI_LABEL_GROUPS, uiLabelSlug, type UiLabelsData } from '@/globals/UiLabels'

// 홈페이지 화면이 쓰는 데이터를 꺼내오는 곳.
// 디자인이 정해지면 화면(컴포넌트)은 여기 함수들만 불러 쓰면 된다.
// - 방문자 권한으로 읽는다(overrideAccess: false): 게시된 글만 보이고 접수함 등은 보이지 않는다
// - 번역이 비어 있으면 영어 원문이 대신 나온다
// - cache(): 한 번의 화면 요청 안에서 같은 데이터를 두 번 읽지 않는다

const payload = cache(async () => getPayload({ config }))

const PUBLIC = { overrideAccess: false } as const

export const getEnabledLocales = cache(async (): Promise<LocaleCode[]> => {
  const settings = await (await payload()).findGlobal({ slug: 'site-settings', depth: 0, ...PUBLIC })
  const enabled = (settings.enabledLocales as LocaleCode[] | null | undefined) ?? TRANSLATION_TARGETS
  return [DEFAULT_LOCALE, ...TRANSLATION_TARGETS.filter((code) => enabled.includes(code))]
})

export const getSiteSettings = cache(async (locale: LocaleCode) =>
  (await payload()).findGlobal({ slug: 'site-settings', locale, depth: 1, ...PUBLIC }),
)

export const getNavigation = cache(async (locale: LocaleCode) => {
  const nav = await (await payload()).findGlobal({ slug: 'navigation', locale, depth: 0, ...PUBLIC })
  return { ...nav, sections: (nav.sections ?? []).filter((section) => !section.hidden) }
})

// 사이트 고정 문구: 묶음별 관리자 페이지를 모두 읽어 { common: {...}, home: {...}, ... } 하나로 합친다
export const getUiLabels = cache(async (locale: LocaleCode): Promise<UiLabelsData> => {
  const p = await payload()
  const groups = await Promise.all(
    UI_LABEL_GROUPS.map(async (group) => [group, await p.findGlobal({ slug: uiLabelSlug(group) as GlobalSlug, locale, depth: 0, ...PUBLIC })] as const),
  )
  return Object.fromEntries(groups) as unknown as UiLabelsData
})

export const getHomeSettings = cache(async () =>
  (await payload()).findGlobal({ slug: 'home-settings', depth: 0, ...PUBLIC }),
)

export const getBusinessSettings = cache(async (locale: LocaleCode) =>
  (await payload()).findGlobal({ slug: 'business-settings', locale, depth: 1, ...PUBLIC }),
)

// 홈 첫 화면 슬라이드: 노출 중이고 노출 기간 안에 있는 것만, 관리자가 정한 순서대로
export const getHomeSlides = cache(async (locale: LocaleCode) => {
  const now = new Date().toISOString()
  const where: Where = {
    and: [
      { active: { equals: true } },
      { or: [{ startAt: { exists: false } }, { startAt: { less_than_equal: now } }] },
      { or: [{ endAt: { exists: false } }, { endAt: { greater_than: now } }] },
    ],
  }
  const { docs } = await (await payload()).find({ collection: 'home-slides', where, sort: '_order', locale, depth: 2, limit: 20, ...PUBLIC })
  return docs
})

export const getArtistCategories = cache(async (locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'artist-categories', sort: 'sortOrder', locale, depth: 0, limit: 50, ...PUBLIC })
  return docs
})

export const getArtistCategory = cache(async (slug: string, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'artist-categories', where: { slug: { equals: slug } }, locale, depth: 0, limit: 1, ...PUBLIC })
  return docs[0] ?? null
})

export const getArtists = cache(
  async (locale: LocaleCode, options: { categoryId?: number; genreId?: number; featured?: boolean; limit?: number } = {}) => {
    const conditions: Where[] = []
    if (options.categoryId) conditions.push({ categories: { contains: options.categoryId } })
    if (options.genreId) conditions.push({ genres: { contains: options.genreId } })
    if (options.featured) conditions.push({ featured: { equals: true } })
    const { docs } = await (await payload()).find({
      collection: 'artists',
      where: conditions.length ? { and: conditions } : undefined,
      sort: 'sortOrder',
      locale,
      depth: 1,
      limit: options.limit ?? 100,
      ...PUBLIC,
    })
    return docs
  },
)

// 카테고리 안의 장르 (관리자가 정한 순서대로)
export const getGenres = cache(async (categoryId: number, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'artist-genres', where: { category: { equals: categoryId } }, sort: '_order', locale, depth: 0, limit: 100, ...PUBLIC })
  return docs
})

export const getArtist = cache(async (slug: string, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'artists', where: { slug: { equals: slug } }, locale, depth: 2, limit: 1, ...PUBLIC })
  return docs[0] ?? null
})

// NEW RELEASE: 모든 아티스트의 뮤직비디오를 공개일 최신순으로 모은다
export const getNewReleases = cache(async (locale: LocaleCode, limit = 8) => {
  const artists = await getArtists(locale)
  return artists
    .flatMap((artist) => (artist.videos ?? []).map((video) => ({ ...video, artist })))
    .sort((a, b) => (b.releaseDate ?? '').localeCompare(a.releaseDate ?? ''))
    .slice(0, limit)
})

export const getBoard = cache(async (slug: string, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'boards', where: { slug: { equals: slug } }, locale, depth: 0, limit: 1, ...PUBLIC })
  return docs[0] ?? null
})

export const getPostCategories = cache(async (boardId: number, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({
    collection: 'post-categories',
    where: { board: { equals: boardId } },
    sort: 'sortOrder',
    locale,
    depth: 0,
    limit: 50,
    ...PUBLIC,
  })
  return docs
})

// 게시판 글 목록: 고정 글이 먼저, 그다음 최신순
export const getPosts = cache(
  async (
    locale: LocaleCode,
    options: { boardId?: number; categoryId?: number; artistId?: number; search?: string; page?: number; limit?: number } = {},
  ) => {
    const conditions: Where[] = []
    if (options.boardId) conditions.push({ board: { equals: options.boardId } })
    if (options.categoryId) conditions.push({ category: { equals: options.categoryId } })
    if (options.artistId) conditions.push({ artists: { contains: options.artistId } })
    if (options.search) conditions.push({ title: { like: options.search } })
    return (await payload()).find({
      collection: 'posts',
      where: conditions.length ? { and: conditions } : undefined,
      sort: ['-pinned', '-publishedAt'],
      locale,
      depth: 1,
      page: options.page ?? 1,
      limit: options.limit ?? 12,
      ...PUBLIC,
    })
  },
)

export const getPost = cache(async (slug: string, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'posts', where: { slug: { equals: slug } }, locale, depth: 2, limit: 1, ...PUBLIC })
  return docs[0] ?? null
})

export const getCaseStudies = cache(async (locale: LocaleCode, limit = 24) => {
  const { docs } = await (await payload()).find({ collection: 'case-studies', sort: '-date', locale, depth: 1, limit, ...PUBLIC })
  return docs
})

export const getCaseStudy = cache(async (slug: string, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'case-studies', where: { slug: { equals: slug } }, locale, depth: 2, limit: 1, ...PUBLIC })
  return docs[0] ?? null
})

// 소개 페이지. "번역 검수 필수 문서"는 해당 언어가 검수 완료되기 전까지 영어 원문을 보여준다.
export const getPage = cache(async (slug: string, locale: LocaleCode, section?: string) => {
  const where: Where = section ? { and: [{ slug: { equals: slug } }, { section: { equals: section } }] } : { slug: { equals: slug } }
  const find = async (l: LocaleCode) =>
    (await (await payload()).find({ collection: 'pages', where, locale: l, depth: 2, limit: 1, ...PUBLIC })).docs[0] ?? null

  const page = await find(locale)
  if (!page || locale === DEFAULT_LOCALE || !page.reviewRequired) return page ? { page, servedLocale: locale } : null
  const reviewed = page.translationStatus?.some((row) => row.locale === locale && row.status === 'reviewed')
  if (reviewed) return { page, servedLocale: locale }
  const original = await find(DEFAULT_LOCALE)
  return original ? { page: original, servedLocale: DEFAULT_LOCALE } : null
})

export const getPagesBySection = cache(async (section: string, locale: LocaleCode) => {
  const { docs } = await (await payload()).find({
    collection: 'pages',
    where: { section: { equals: section } },
    locale,
    depth: 0,
    limit: 100,
    sort: 'createdAt',
    select: { title: true, slug: true, intro: true, updatedAt: true },
    ...PUBLIC,
  })
  return docs
})

// 레이블 · 브랜드 · 계열사 (숨기지 않은 것만, 관리자가 정한 순서대로)
export const getFamily = cache(async (locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'family', where: { hidden: { not_equals: true } }, sort: '_order', locale, depth: 2, limit: 100, ...PUBLIC })
  return docs
})

// STUDIO: 제작 과정 단계 · 전후 비교 · 보유 기술
export const getStudioItems = cache(async (locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'studio-items', where: { hidden: { not_equals: true } }, sort: '_order', locale, depth: 1, limit: 100, ...PUBLIC })
  return docs
})

// JOIN US: 크리에이터 모집 · 채용 공고 (모집 중인 것 먼저)
export const getOpenings = cache(async (kind: 'creator' | 'career', locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'openings', where: { kind: { equals: kind } }, sort: '_order', locale, depth: 0, limit: 100, ...PUBLIC })
  return [...docs.filter((d) => d.status === 'open'), ...docs.filter((d) => d.status !== 'open')]
})

// INVESTORS: "공개"가 꺼져 있으면 null (메뉴와 페이지를 숨긴다)
export const getInvestors = cache(async (locale: LocaleCode) => {
  const investors = await (await payload()).findGlobal({ slug: 'investors', locale, depth: 1, ...PUBLIC })
  return investors.visible ? investors : null
})

export const getDisclosures = cache(async (locale: LocaleCode) => {
  const { docs } = await (await payload()).find({ collection: 'disclosures', sort: '-date', locale, depth: 1, limit: 200, ...PUBLIC })
  return docs
})
