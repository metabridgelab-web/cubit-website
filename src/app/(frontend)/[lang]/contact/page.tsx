import { EnvelopeSimple, Lightning, MapPin, Phone } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/forms/ContactForm'
import { HudHeading, PageHeader, PageShell } from '@/components/site/Hud'
import { SocialIcon } from '@/components/site/SocialIcon'
import { localePath } from '@/i18n'
import { getSiteSettings, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/contact', { title: labels.contact.title })
}

// CONTACT (design/09_CONTACT): 캠페인 빌더 안내 · 문의 양식 · 사무실 정보 · 공식 채널
export default async function ContactPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [labels, settings] = await Promise.all([getUiLabels(locale), getSiteSettings(locale)])
  const privacy = (settings.policyLinks ?? []).find((page) => typeof page === 'object')

  return (
    <PageShell>
      <PageHeader eyebrow={labels.contact.eyebrow} title={labels.contact.title} />

      <div className="mb-16 flex flex-col items-start justify-between gap-8 rounded-2xl border border-white/10 bg-[linear-gradient(90deg,rgba(0,243,255,0.08),rgba(255,0,229,0.08))] p-8 md:flex-row md:items-center">
        <div>
          <h2 className="text-2xl font-black tracking-tight uppercase">{labels.contact.fastTitle}</h2>
          <p className="mt-1 max-w-lg text-white/60">{labels.contact.fastText}</p>
        </div>
        <Link href={localePath(locale, '/business/campaign')} className="btn-irid shrink-0 px-9 py-3.5">
          {labels.contact.fastButton} <Lightning size={16} weight="fill" aria-hidden />
        </Link>
      </div>

      <div className="grid grid-cols-12 gap-y-16 lg:gap-x-16">
        <section className="col-span-12 lg:col-span-8">
          <HudHeading tag="Direct_channel" title={labels.contact.formTitle} size="lg" />
          <ContactForm
            locale={locale}
            labels={{
              contact: labels.contact as Record<string, string>,
              campaign: labels.campaign as Record<string, string>,
              forms: labels.forms as Record<string, string>,
            }}
            privacyHref={privacy && typeof privacy === 'object' ? localePath(locale, `/legal/${privacy.slug}`) : null}
          />
        </section>

        <aside className="col-span-12 space-y-12 lg:col-span-4">
          <HudHeading tag="Geographic_anchor" title={labels.contact.office} size="lg" />
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-line bg-[#0a0a0a] bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]">
            <div className="scanlines absolute inset-0" />
            <span className="absolute top-1/2 left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2">
              <span className="absolute inset-0 animate-ping rounded-full bg-cyan opacity-75" />
              <span className="absolute inset-0 rounded-full bg-cyan shadow-[0_0_15px_var(--color-cyan)]" />
            </span>
            {settings.address ? (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute start-4 bottom-4 z-10 flex items-center gap-1 border border-cyan/30 bg-black/60 px-2 py-1 font-mono text-[9px] text-cyan uppercase backdrop-blur-md hover:border-cyan"
              >
                <MapPin size={12} aria-hidden /> Google Maps
              </a>
            ) : null}
          </div>
          {settings.companyName || settings.address || settings.phone || settings.email ? (
            <div>
              {settings.companyName ? <p className="mb-2 font-mono text-[10px] text-white/50 uppercase">{settings.companyName}</p> : null}
              {settings.address ? <p className="text-xl leading-tight font-bold whitespace-pre-line">{settings.address}</p> : null}
              <div className="mt-6 space-y-2 font-mono text-xs text-white/60">
                {settings.phone ? (
                  <p className="flex items-center gap-3">
                    <Phone size={16} className="text-cyan" aria-hidden />
                    <a href={`tel:${settings.phone.replace(/\s/g, '')}`}>{settings.phone}</a>
                  </p>
                ) : null}
                {settings.email ? (
                  <p className="flex items-center gap-3">
                    <EnvelopeSimple size={16} className="text-cyan" aria-hidden />
                    <a href={`mailto:${settings.email}`}>{settings.email}</a>
                  </p>
                ) : null}
              </div>
            </div>
          ) : null}
          {settings.socials?.length ? (
            <div>
              <p className="mb-4 font-mono text-[10px] text-white/50 uppercase">{labels.contact.channels}</p>
              <ul className="flex flex-wrap gap-4">
                {settings.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.platform}
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition-all hover:border-cyan hover:text-cyan"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </PageShell>
  )
}
