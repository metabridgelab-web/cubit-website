import type { Metadata } from 'next'
import Link from 'next/link'

import { localePath } from '@/i18n'
import { getBusinessSettings, getSiteSettings } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  return pageMetadata(await resolveLocale(params), '/contact', { title: 'Contact' })
}

// CONTACT 자리. 문의 양식은 디자인과 함께 만든다.
// 접수는 이미 동작한다: POST /api/inquiries?locale=<언어> (스팸 차단 · 알림 메일 포함)
export default async function ContactPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [settings, business] = await Promise.all([getSiteSettings(locale), getBusinessSettings(locale)])
  return (
    <>
      <h1>Contact</h1>
      <p>
        <Link href={localePath(locale, '/business/campaign')}>{business.builderCtaLabel}</Link>
      </p>
      {settings.email ? <p>{settings.email}</p> : null}
      {settings.phone ? <p>{settings.phone}</p> : null}
      {settings.address ? <p>{settings.address}</p> : null}
    </>
  )
}
