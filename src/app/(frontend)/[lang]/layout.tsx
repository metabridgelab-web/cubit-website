import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { PreviewBanner } from '@/components/site/PreviewBanner'
import { SiteFooter } from '@/components/site/SiteFooter'
import { SiteHeader } from '@/components/site/SiteHeader'
import { allowIndexing, textDirection } from '@/i18n'
import { getSiteSettings } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

import { fontVariables } from './fonts'
import './site.css'

export const viewport: Viewport = { themeColor: '#000000', colorScheme: 'dark' }

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const settings = await getSiteSettings(locale)
  return {
    ...(await pageMetadata(locale, '/')),
    title: { default: settings.siteName, template: `%s | ${settings.siteName}` },
    icons: { icon: '/brand/cubit-logo.png' },
    // 오픈 전에는 페이지마다 "검색에 넣지 말 것" 표시도 단다
    ...(allowIndexing() ? {} : { robots: { index: false, follow: false } }),
  }
}

// 언어별 사이트의 바탕. <html lang>과 글 방향(아랍어는 오른쪽→왼쪽)을 언어에 맞춘다.
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  return (
    <html lang={locale} dir={textDirection(locale)} className={fontVariables}>
      <body className="bg-black text-white">
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
        <PreviewBanner />
      </body>
    </html>
  )
}
