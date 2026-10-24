import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import type { ReactNode } from 'react'

import type { LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import type { getBusinessSettings, getUiLabels } from '@/lib/data'
import { mediaUrl } from '@/lib/page'
import type { CaseStudy } from '@/payload-types'

// BUSINESS 부품: 홈의 BUSINESS 섹션과 /business 개요 · 작업 사례 페이지가 같이 쓴다

type Labels = Awaited<ReturnType<typeof getUiLabels>>
type Business = Awaited<ReturnType<typeof getBusinessSettings>>

// 작업 사례는 "진행 시기"를 월까지만 입력한다 → 2026.09
export const monthDot = (date?: string | null) => date?.slice(0, 7).replace('-', '.') ?? ''

// 세 가지 방법 (라이선싱 · 맞춤 제작 · 캠페인)
export function ServiceGrid({ locale, labels, business }: { locale: LocaleCode; labels: Labels; business: Business }) {
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {(business.services ?? []).map((service, i) => (
        <li key={service.id} className="glass group relative flex flex-col rounded-2xl p-8 transition-colors hover:border-cyan/50">
          <span className="font-mono text-xs text-white/40">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="mt-6 mb-3 text-2xl font-black tracking-[-0.01em]">{service.title}</h3>
          <p className="flex-1 text-sm leading-relaxed text-white/60">{service.description}</p>
          {service.url ? (
            <Link href={localePath(locale, service.url)} className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-cyan uppercase">
              {labels.common.readMore} <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
            </Link>
          ) : null}
        </li>
      ))}
    </ol>
  )
}

// 캠페인 빌더로 가는 연두색 바: 4단계 안내 + 버튼
export function BuilderBar({ locale, labels, business }: { locale: LocaleCode; labels: Labels; business: Business }) {
  const steps = [labels.business.step1, labels.business.step2, labels.business.step3, labels.business.step4]
  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-lime/60 p-6 md:p-8 lg:flex-row lg:items-center">
      <ol className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, i) => (
          <li key={step} className="flex items-baseline gap-3 text-sm">
            <span className="font-mono text-lime">{i + 1}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <Link href={localePath(locale, '/business/campaign')} className="btn-irid shrink-0">
        {business.builderCtaLabel} <ArrowUpRight size={16} aria-hidden />
      </Link>
    </div>
  )
}

// 함께한 브랜드 로고 줄
export function BrandsRow({ labels, business, action }: { labels: Labels; business: Business; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
      {business.brands?.length ? <p className="hud-label">{labels.business.brandsTitle}</p> : null}
      <ul className="flex flex-wrap items-center gap-x-10 gap-y-6">
        {(business.brands ?? []).map((brand) => {
          const logo = mediaUrl(brand.logo, 'thumbnail')
          const content = logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt={brand.name} className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0" />
          ) : (
            <span className="text-white/60">{brand.name}</span>
          )
          return <li key={brand.id}>{brand.url ? <a href={brand.url} target="_blank" rel="noopener noreferrer">{content}</a> : content}</li>
        })}
      </ul>
      {action}
    </div>
  )
}

export function ViewCasesLink({ locale, label }: { locale: LocaleCode; label: string }) {
  return (
    <Link href={localePath(locale, '/business/works')} className="ms-auto inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/70 uppercase hover:text-cyan">
      {label} <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
    </Link>
  )
}

// 작업 사례 카드: 대표 이미지 · 브랜드 · 캠페인 이름 · 진행 시기 · 참여 탤런트
export function WorkCard({ locale, work }: { locale: LocaleCode; work: CaseStudy }) {
  const thumb = mediaUrl(work.thumbnail, 'card')
  const talents = (work.talents ?? []).flatMap((t) => (typeof t === 'object' ? [t.name] : []))
  return (
    <Link href={localePath(locale, `/business/works/${work.slug}`)} className="group block">
      <div className="relative mb-5 aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a]">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0" />
        ) : null}
        <div className="scanlines absolute inset-0 opacity-30" />
        <span className="absolute end-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/50 opacity-0 backdrop-blur transition group-hover:opacity-100">
          <ArrowUpRight size={14} aria-hidden />
        </span>
      </div>
      <p className="flex items-center justify-between gap-4 font-mono text-[10px] tracking-[0.15em] uppercase">
        <span className="text-cyan">{work.brandName}</span>
        <span className="text-white/40">{monthDot(work.date)}</span>
      </p>
      <p className="mt-2 text-xl leading-snug font-black transition-colors group-hover:text-cyan">{work.title}</p>
      {talents.length ? <p className="mt-2 font-mono text-[11px] text-white/50">{talents.join(' · ')}</p> : null}
    </Link>
  )
}
