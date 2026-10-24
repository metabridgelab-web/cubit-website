import { ArrowRight, ShieldCheck } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { ContactForm } from '@/components/forms/ContactForm'
import { HudHeading, PageHeader, PageShell } from '@/components/site/Hud'
import { SocialIcon } from '@/components/site/SocialIcon'
import { localePath } from '@/i18n'
import { getInvestors, getSiteSettings, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/trust/report', { title: labels.trust.reportTitle, description: labels.trust.reportIntro })
}

// TRUST > 사칭 신고: 신고 양식(문의함 "사칭 신고" 유형) + 공식 채널 목록 + 공식 토큰 주소 안내
export default async function ReportPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [labels, settings, investors] = await Promise.all([getUiLabels(locale), getSiteSettings(locale), getInvestors(locale)])
  const privacy = (settings.policyLinks ?? []).find((page) => typeof page === 'object')

  return (
    <PageShell>
      <PageHeader eyebrow="Trust // Imposter_Watch" title={labels.trust.reportTitle} />
      <p className="-mt-4 mb-16 max-w-3xl text-xl leading-relaxed text-white/70">{labels.trust.reportIntro}</p>

      <div className="grid grid-cols-12 gap-y-16 lg:gap-x-16">
        <section className="col-span-12 lg:col-span-8">
          <ContactForm
            mode="report"
            locale={locale}
            labels={{
              contact: labels.contact as Record<string, string>,
              campaign: labels.campaign as Record<string, string>,
              forms: labels.forms as Record<string, string>,
              trust: labels.trust as Record<string, string>,
            }}
            privacyHref={privacy && typeof privacy === 'object' ? localePath(locale, `/legal/${privacy.slug}`) : null}
          />
        </section>

        <aside className="col-span-12 space-y-10 lg:col-span-4">
          <div>
            <HudHeading tag="Verified_Channels" title={labels.trust.officialChannels} />
            <p className="mb-6 text-sm text-white/50">{labels.trust.officialHint}</p>
            {settings.socials?.length ? (
              <ul className="space-y-3">
                {settings.socials.map((social) => (
                  <li key={social.id}>
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 rounded-xl border border-line px-4 py-3 transition-colors hover:border-cyan">
                      <SocialIcon platform={social.platform} />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold">{social.platform}</span>
                        <span className="block truncate font-mono text-[10px] text-white/40">{social.url.replace(/^https?:\/\//, '')}</span>
                      </span>
                      <ShieldCheck size={18} className="ms-auto shrink-0 text-cyan" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          {investors ? (
            <Link href={localePath(locale, '/investors/official')} className="flex items-center justify-between gap-4 rounded-2xl border border-pink/30 bg-pink/5 p-6 transition-colors hover:border-pink">
              <span className="font-bold">{labels.trust.tokenAddresses}</span>
              <ArrowRight size={16} className="shrink-0 text-pink rtl:rotate-180" aria-hidden />
            </Link>
          ) : null}
        </aside>
      </div>
    </PageShell>
  )
}
