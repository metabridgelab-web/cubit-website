import { ArrowRight } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'

import { RecruitNotice } from '@/components/pages/JoinView'
import { PageHeader, PageShell } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getOpenings, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/join', { title: labels.join.title, description: labels.join.intro })
}

// JOIN US: 크리에이터 파트너 모집 · 채용 두 갈래
export default async function JoinPage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [labels, creators, careers] = await Promise.all([getUiLabels(locale), getOpenings('creator', locale), getOpenings('career', locale)])
  const j = labels.join
  const cards = [
    { href: '/join/creators', title: j.creators, text: j.creatorsIntro, open: creators.filter((o) => o.status === 'open').length, accent: 'hover:border-cyan text-cyan' },
    { href: '/join/careers', title: j.careers, text: j.careersIntro, open: careers.filter((o) => o.status === 'open').length, accent: 'hover:border-pink text-pink' },
  ]
  return (
    <PageShell>
      <PageHeader eyebrow="Join_Us // Open_Channels" title={j.title} />
      <p className="-mt-4 mb-10 max-w-3xl text-xl leading-relaxed text-white/70 md:text-2xl">{j.intro}</p>
      <RecruitNotice text={j.notice} />
      <ul className="grid gap-6 md:grid-cols-2">
        {cards.map((card, index) => (
          <li key={card.href}>
            <Link href={localePath(locale, card.href)} className={`group flex h-full min-h-[280px] flex-col justify-between rounded-2xl border border-line bg-white/[0.02] p-8 transition-all hover:-translate-y-1 md:p-10 ${card.accent.split(' ')[0]}`}>
              <div>
                <p className="flex items-center justify-between font-mono text-[10px] tracking-[0.1em] uppercase">
                  <span className={card.accent.split(' ')[1]}>{String(index + 1).padStart(2, '0')}</span>
                  <span className="rounded-full border border-lime/40 bg-lime/10 px-3 py-1 text-lime">
                    {j.open} · {card.open}
                  </span>
                </p>
                <h2 className="mt-8 text-[clamp(2rem,4vw,3rem)] leading-none font-black tracking-[-0.03em] uppercase">{card.title}</h2>
                <p className="mt-4 max-w-md text-white/60">{card.text}</p>
              </div>
              <span className={`mt-10 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] uppercase ${card.accent.split(' ')[1]}`}>
                {labels.common.viewAll} <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </PageShell>
  )
}
