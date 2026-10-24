import type { MetadataRoute } from 'next'

import { DEFAULT_LOCALE } from '@/constants/locales'
import { INVESTOR_TABS } from '@/constants/investors'
import { languageAlternates, localePath, SITE_URL } from '@/i18n'
import {
  getArtistCategories,
  getArtists,
  getCaseStudies,
  getEnabledLocales,
  getInvestors,
  getPagesBySection,
  getPosts,
} from '@/lib/data'

// 검색엔진용 사이트맵 (/sitemap.xml). 주소마다 12개 언어 주소를 함께 알려준다.
// 새 아티스트 · 글 · 페이지가 생기면 자동으로 들어간다. 1시간마다 다시 만든다.
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = await getEnabledLocales()
  const [categories, artists, posts, works, company, business, legal, trust, investors] = await Promise.all([
    getArtistCategories(DEFAULT_LOCALE),
    getArtists(DEFAULT_LOCALE),
    getPosts(DEFAULT_LOCALE, { limit: 1000 }),
    getCaseStudies(DEFAULT_LOCALE, 1000),
    getPagesBySection('company', DEFAULT_LOCALE),
    getPagesBySection('business', DEFAULT_LOCALE),
    getPagesBySection('legal', DEFAULT_LOCALE),
    getPagesBySection('trust', DEFAULT_LOCALE),
    getInvestors(DEFAULT_LOCALE),
  ])

  const paths: { path: string; lastModified?: string }[] = [
    { path: '/' },
    { path: '/artists' },
    { path: '/news' },
    { path: '/news/notice' },
    { path: '/business' },
    { path: '/business/works' },
    { path: '/business/campaign' },
    { path: '/contact' },
    { path: '/about/family' },
    { path: '/studio' },
    { path: '/trust' },
    { path: '/trust/report' },
    { path: '/join' },
    { path: '/join/creators' },
    { path: '/join/careers' },
    ...(investors ? INVESTOR_TABS.map((tab) => ({ path: tab === 'overview' ? '/investors' : `/investors/${tab}` })) : []),
    ...categories.map((c) => ({ path: `/artists/${c.slug}` })),
    ...artists.map((a) => {
      const first = a.categories?.find((c) => typeof c === 'object')
      return { path: `/artists/${typeof first === 'object' ? first.slug : 'all'}/${a.slug}`, lastModified: a.updatedAt }
    }),
    ...posts.docs.map((p) => ({ path: `/news/article/${p.slug}`, lastModified: p.updatedAt })),
    ...works.map((w) => ({ path: `/business/works/${w.slug}`, lastModified: w.updatedAt })),
    ...company.map((p) => ({ path: p.slug === 'about' ? '/about' : `/about/${p.slug}`, lastModified: p.updatedAt })),
    ...business.map((p) => ({ path: `/business/${p.slug}`, lastModified: p.updatedAt })),
    ...legal.map((p) => ({ path: `/legal/${p.slug}`, lastModified: p.updatedAt })),
    ...trust.map((p) => ({ path: `/trust/${p.slug}`, lastModified: p.updatedAt })),
  ]

  return paths.map(({ path, lastModified }) => ({
    url: `${SITE_URL}${localePath(DEFAULT_LOCALE, path)}`,
    lastModified,
    alternates: { languages: languageAlternates(path, locales) },
  }))
}
