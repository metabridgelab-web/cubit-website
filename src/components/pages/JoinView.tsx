import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowUpRight, CaretDown, WarningOctagon } from '@phosphor-icons/react/dist/ssr'

import { ContactForm } from '@/components/forms/ContactForm'
import { HudHeading, PageHeader, PageShell } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getOpenings, getSiteSettings, getUiLabels } from '@/lib/data'

const dot = (date?: string | null) => date?.slice(0, 10).replaceAll('-', '.') ?? ''

// 사칭 모집 주의 안내 (JOIN US 모든 페이지 위쪽)
export function RecruitNotice({ text }: { text: string }) {
  return (
    <p role="note" className="mb-16 flex items-start gap-4 rounded-2xl border border-pink/20 bg-pink/5 p-6 text-sm leading-relaxed text-white/70">
      <WarningOctagon size={24} className="shrink-0 text-pink" aria-hidden />
      {text}
    </p>
  )
}

// JOIN US > 크리에이터 파트너 모집 · 채용: 공고 목록(눌러서 펼치기) + 지원 양식(문의함 "지원" 유형)
export async function JoinView({ locale, kind }: { locale: LocaleCode; kind: 'creator' | 'career' }) {
  const [openings, labels, settings] = await Promise.all([getOpenings(kind, locale), getUiLabels(locale), getSiteSettings(locale)])
  const j = labels.join
  const privacy = (settings.policyLinks ?? []).find((page) => typeof page === 'object')
  const open = openings.filter((o) => o.status === 'open')
  // 이 사이트에서 지원받는 공고만 지원 분야 버튼으로 보여준다 (외부 채용 사이트 공고는 제외)
  const positions = open.filter((o) => !o.applyUrl).map((o) => o.title)

  return (
    <PageShell>
      <PageHeader eyebrow={`Join_Us // ${kind === 'creator' ? 'Creator_Network' : 'Careers'}`} title={kind === 'creator' ? j.creators : j.careers} />
      <p className="-mt-4 mb-10 max-w-3xl text-xl leading-relaxed text-white/70 md:text-2xl">{kind === 'creator' ? j.creatorsIntro : j.careersIntro}</p>
      <RecruitNotice text={j.notice} />

      <section className="mb-24">
        {openings.length ? (
          <ul className="border-t border-white/10">
            {openings.map((opening) => {
              const closed = opening.status !== 'open'
              const meta = [opening.location, opening.employment].filter(Boolean).join(' · ')
              return (
                <li key={opening.id} className="border-b border-white/10">
                  <details className={`group ${closed ? 'opacity-50' : ''}`}>
                    <summary className="grid cursor-pointer list-none gap-3 py-7 md:grid-cols-[1fr_auto_auto] md:items-center md:gap-10 [&::-webkit-details-marker]:hidden">
                      <div>
                        <p className="text-xl font-bold transition-colors group-hover:text-cyan md:text-2xl">{opening.title}</p>
                        {meta ? <p className="mt-1 font-mono text-[11px] text-white/50 uppercase">{meta}</p> : null}
                      </div>
                      <p className="flex items-center gap-4 font-mono text-[10px] tracking-[0.1em] uppercase">
                        {opening.deadline ? (
                          <span className="text-white/50">
                            {j.deadline} {dot(opening.deadline)}
                          </span>
                        ) : null}
                        <span className={`rounded-full border px-3 py-1 ${closed ? 'border-white/20 text-white/50' : 'border-lime/40 bg-lime/10 text-lime'}`}>{closed ? j.closed : j.open}</span>
                      </p>
                      <CaretDown size={18} className="hidden text-white/50 transition-transform group-open:rotate-180 md:block" aria-hidden />
                    </summary>
                    <div className="pb-10">
                      {opening.summary ? <p className="mb-6 max-w-3xl text-lg text-white/70">{opening.summary}</p> : null}
                      {opening.description ? (
                        <div className="prose-cubit mb-8 max-w-3xl text-white/70">
                          <RichText data={opening.description} />
                        </div>
                      ) : null}
                      {!closed ? (
                        opening.applyUrl ? (
                          <a href={opening.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-irid">
                            {j.apply} <ArrowUpRight size={16} aria-hidden />
                          </a>
                        ) : (
                          <a href="#apply" className="btn-irid">
                            {j.apply} <ArrowUpRight size={16} aria-hidden />
                          </a>
                        )
                      ) : null}
                    </div>
                  </details>
                </li>
              )
            })}
          </ul>
        ) : (
          <p className="glass rounded-2xl p-10 text-white/60">{j.noOpenings}</p>
        )}
      </section>

      <section id="apply" className="max-w-4xl scroll-mt-28">
        <HudHeading tag="Application_Uplink" title={j.applyTitle} size="lg" />
        <ContactForm
          mode="apply"
          positions={positions}
          locale={locale}
          labels={{
            contact: labels.contact as Record<string, string>,
            campaign: labels.campaign as Record<string, string>,
            forms: labels.forms as Record<string, string>,
            join: j as Record<string, string>,
          }}
          privacyHref={privacy && typeof privacy === 'object' ? localePath(locale, `/legal/${privacy.slug}`) : null}
        />
      </section>
    </PageShell>
  )
}
