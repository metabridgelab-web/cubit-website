import type { MetadataRoute } from 'next'

import { allowIndexing, SITE_URL } from '@/i18n'

// 검색엔진 안내 (/robots.txt). 관리자 화면과 API는 수집하지 않게 한다.
// 실제 도메인으로 옮기기 전(ALLOW_INDEXING이 없을 때)에는 전체를 막아 검색에 뜨지 않게 한다.
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing()) return { rules: { userAgent: '*', disallow: '/' } }
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
