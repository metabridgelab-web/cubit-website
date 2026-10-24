import { Info } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader, PageShell } from '@/components/site/Hud'
import type { LocaleCode } from '@/constants/locales'
import { getPage, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata } from '@/lib/page'

import { Blocks } from './Blocks'

// 섹션별 작은 HUD 라벨 (장식)
const EYEBROW: Record<string, string> = {
  company: 'Company // Profile',
  business: 'Business // Service',
  studio: 'Studio // Production',
  trust: 'Trust // Principles',
  join: 'Join // Opportunities',
  investors: 'Investors // Relations',
  legal: 'Legal // Policy',
}

// 관리자 화면 "페이지"로 만든 소개 페이지 (회사 소개 · 연혁 · 오시는 길 · 비즈니스 소개 · 정책 등)
// 정책(legal) 페이지는 읽기 편하게 폭을 좁히고, 번역 검수 전이면 영어 원문임을 알린다.
export async function PageView({ locale, slug, section }: { locale: LocaleCode; slug: string; section: string }) {
  const [result, labels] = await Promise.all([getPage(slug, locale, section), getUiLabels(locale)])
  if (!result) notFound()
  const { page, servedLocale } = result
  const hero = mediaUrl(page.heroImage, 'hero')
  const legal = section === 'legal'

  return (
    <PageShell>
      <article lang={servedLocale} className={legal ? 'mx-auto max-w-4xl' : undefined}>
        <PageHeader eyebrow={EYEBROW[section] ?? section} title={page.title} />

        {servedLocale !== locale ? (
          <p lang={locale} role="note" className="mb-10 flex items-start gap-3 rounded-xl border border-cyan/30 bg-cyan/5 p-4 text-sm text-white/70">
            <Info size={18} className="shrink-0 text-cyan" aria-hidden />
            {labels.common.originalNotice}
          </p>
        ) : null}

        {page.intro ? <p className={`mb-16 max-w-3xl leading-relaxed text-white/70 ${legal ? 'text-lg' : 'text-xl md:text-2xl'}`}>{page.intro}</p> : null}

        {hero ? (
          <div className="relative mb-24 overflow-hidden rounded-2xl border border-line">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={hero} alt="" className="max-h-[70vh] w-full object-cover" />
            <div className="scanlines absolute inset-0 opacity-40" />
            <span className="hud-bracket start-5 top-5 border-e-0 border-b-0" />
            <span className="hud-bracket end-5 bottom-5 border-s-0 border-t-0" />
          </div>
        ) : null}

        <Blocks
          blocks={page.layout}
          locale={locale}
          labels={{ close: labels.common.close, viewAllPhotos: labels.artist.viewAllPhotos, openMap: labels.common.openMap }}
        />
      </article>
    </PageShell>
  )
}

export const pageViewMetadata = async (locale: LocaleCode, slug: string, section: string, path: string): Promise<Metadata> => {
  const result = await getPage(slug, locale, section)
  return pageMetadata(locale, path, { title: result?.page.title, description: result?.page.intro })
}
