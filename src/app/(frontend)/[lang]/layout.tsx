import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter, SiteHeader } from '@/components/skeleton/SiteChrome'
import { textDirection } from '@/i18n'
import { getSiteSettings } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

import './skeleton.css'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const settings = await getSiteSettings(locale)
  return {
    ...(await pageMetadata(locale, '/')),
    title: { default: settings.siteName, template: `%s | ${settings.siteName}` },
  }
}

// 언어별 사이트의 바탕. <html lang>과 글 방향(아랍어는 오른쪽→왼쪽)을 언어에 맞춘다.
export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  return (
    <html lang={locale} dir={textDirection(locale)}>
      <body>
        <SiteHeader locale={locale} />
        <main>{children}</main>
        <SiteFooter locale={locale} />
      </body>
    </html>
  )
}
