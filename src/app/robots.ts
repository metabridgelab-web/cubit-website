import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/i18n'

// 검색엔진 안내 (/robots.txt). 관리자 화면과 API는 수집하지 않게 한다.
// 임시 주소(개발·미리보기)에서는 전체를 막아 검색에 뜨지 않게 한다.
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === 'production' || process.env.ALLOW_INDEXING === 'true'
  if (!isProduction) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
