import { RichText } from '@payloadcms/richtext-lexical/react'
import { ArrowRight, CaretDown, DownloadSimple, Info, ShieldCheck, WarningOctagon } from '@phosphor-icons/react/dist/ssr'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { CopyButton } from '@/components/media/Interactive'
import { PageHeader, PageShell } from '@/components/site/Hud'
import { INVESTOR_TABS, type InvestorTab } from '@/constants/investors'
import { LOCALES, type LocaleCode } from '@/constants/locales'
import { localePath } from '@/i18n'
import { getDisclosures, getInvestors, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata } from '@/lib/page'
import type { Investor } from '@/payload-types'

// INVESTORS (design/07 토큰 정보): 위쪽 탭으로 8개 화면을 오간다.

type Labels = Awaited<ReturnType<typeof getUiLabels>>
type L = Labels['investors']

const dot = (date?: string | null) => date?.slice(0, 10).replaceAll('-', '.') ?? ''
const tabPath = (tab: InvestorTab) => (tab === 'overview' ? '/investors' : `/investors/${tab}`)
const CHART_COLORS = ['var(--color-cyan)', 'var(--color-pink)', 'var(--color-lime)', '#ffffff', 'rgb(255 255 255 / 0.45)', 'rgb(0 243 255 / 0.45)', 'rgb(255 0 229 / 0.45)']

// ── 공통 부품 ─────────────────────────────────────────────

function Card({ tag, title, children, className = '' }: { tag: string; title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border border-line bg-white/[0.02] p-6 backdrop-blur-xl md:p-8 ${className}`}>
      <div className="mb-8 border-s-2 border-cyan ps-4">
        <p className="font-mono text-[9px] tracking-[0.1em] text-cyan uppercase">{tag}</p>
        {title ? <h2 className="mt-1 text-xl font-bold uppercase">{title}</h2> : null}
      </div>
      {children}
    </section>
  )
}

const Empty = ({ text }: { text: string }) => <p className="font-mono text-xs tracking-[0.15em] text-white/40 uppercase">{text}</p>

// 심볼 · 수량처럼 기호가 붙은 값은 아랍어 화면에서도 왼쪽→오른쪽으로 보여야 한다 ($CUBIT가 CUBIT$로 뒤집히지 않게)
function Metric({ label, value, className = '', ltr }: { label: string; value?: string | null; className?: string; ltr?: boolean }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] text-white/50 uppercase">{label}</p>
      <p className={`text-2xl font-black tracking-tight break-all ${className}`}>{ltr ? <bdi dir="ltr">{value || '—'}</bdi> : value || '—'}</p>
    </div>
  )
}

function ListingBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1 font-mono text-[9px] tracking-[0.1em] text-lime uppercase">
      <span className="h-1 w-1 animate-pulse rounded-full bg-lime" /> {text}
    </span>
  )
}

function SecurityAlert({ data, l, locale }: { data: Investor; l: L; locale: LocaleCode }) {
  if (!data.securityAlert) return null
  return (
    <section className="h-full rounded-2xl border border-pink/15 bg-pink/5 p-6">
      <div className="mb-4 flex items-center gap-4">
        <WarningOctagon size={24} className="text-pink" aria-hidden />
        <h3 className="font-black tracking-tight uppercase">{l.securityAlert}</h3>
      </div>
      <p className="text-sm leading-relaxed whitespace-pre-line text-white/60">{data.securityAlert}</p>
      <Link href={localePath(locale, '/trust/report')} className="mt-6 inline-flex items-center gap-2 border-s-2 border-pink bg-white/5 px-4 py-3 font-mono text-[10px] tracking-[0.1em] text-pink uppercase">
        Report_Imposter <ArrowRight size={12} aria-hidden className="rtl:rotate-180" />
      </Link>
    </section>
  )
}

function RiskBox({ text, title }: { text?: string | null; title: string }) {
  if (!text) return null
  return (
    <section className="rounded-2xl border border-line bg-white/[0.01] p-6 text-xs leading-[1.8] text-white/40 md:p-8">
      <h3 className="mb-4 font-mono text-[10px] text-white uppercase">{title}</h3>
      <p className="whitespace-pre-line">{text}</p>
    </section>
  )
}

function Addresses({ rows, l }: { rows: Investor['contracts']; l: L }) {
  if (!rows?.length) return <Empty text={l.tba} />
  return (
    <ul className="space-y-4">
      {rows.map((row) => (
        <li key={row.id} className="flex items-center justify-between gap-4 rounded-xl border border-cyan/10 bg-cyan/[0.03] p-4 md:p-5">
          <div className="flex min-w-0 items-center gap-4">
            <ShieldCheck size={24} className="hidden shrink-0 text-cyan sm:block" aria-hidden />
            <div className="min-w-0">
              <p className="mb-1 font-mono text-[9px] text-white/50 uppercase">
                {row.label}
                {row.network ? ` // ${row.network}` : ''}
              </p>
              <p dir="ltr" className="font-mono text-sm tracking-tight break-all text-white/80 select-all">{row.address}</p>
            </div>
          </div>
          <CopyButton value={row.address} label={l.copy} doneLabel={l.copied} />
        </li>
      ))}
    </ul>
  )
}

function Donut({ rows }: { rows: NonNullable<Investor['allocation']> }) {
  let offset = 0
  return (
    <div className="relative h-56 w-56 shrink-0 md:h-60 md:w-60">
      <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90" aria-hidden>
        <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgb(255 255 255 / 0.05)" strokeWidth="3" />
        {rows.map((row, i) => {
          const circle = (
            <circle key={row.id} cx="18" cy="18" r="15.915" fill="transparent" stroke={CHART_COLORS[i % CHART_COLORS.length]} strokeWidth="3" strokeDasharray={`${row.percent} ${100 - row.percent}`} strokeDashoffset={-offset} />
          )
          offset += row.percent
          return circle
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono text-[10px] text-white/50">GENESIS</span>
        <span className="text-xl font-black">{offset}%</span>
      </div>
    </div>
  )
}

// ── 탭별 내용 ─────────────────────────────────────────────

function Overview({ data, l, locale }: { data: Investor; l: L; locale: LocaleCode }) {
  return (
    <div className="grid grid-cols-12 gap-6 md:gap-8">
      {data.intro ? <p className="col-span-12 max-w-3xl text-xl leading-relaxed whitespace-pre-line text-white/70 md:text-2xl">{data.intro}</p> : null}
      <Card tag="Asset_Specification" title={l.token} className="col-span-12 lg:col-span-4">
        <div className="space-y-8">
          <Metric label={l.tokenName} value={data.tokenName || l.tba} />
          <Metric label={l.symbol} value={data.symbol || l.tba} className="text-cyan" ltr={Boolean(data.symbol)} />
          <div>
            <p className="mb-2 font-mono text-[10px] text-white/50 uppercase">{l.listing}</p>
            <ListingBadge text={data.listingStatus || l.tba} />
          </div>
        </div>
      </Card>
      <Card tag="Utility_Map" title={l.utilities} className="col-span-12 lg:col-span-8">
        {data.utilities?.length ? (
          <ul className="grid gap-4 md:grid-cols-2">
            {data.utilities.map((u, i) => (
              <li key={u.id} className="rounded-xl border border-white/5 bg-white/[0.02] p-5">
                <p className="font-mono text-[10px] text-lime">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-3 font-bold uppercase">{u.title}</p>
                {u.description ? <p className="mt-2 text-sm leading-relaxed text-white/50">{u.description}</p> : null}
              </li>
            ))}
          </ul>
        ) : (
          <Empty text={l.tba} />
        )}
      </Card>
      <div className="col-span-12">
        <SecurityAlert data={data} l={l} locale={locale} />
      </div>
    </div>
  )
}

function Token({ data, l, locale }: { data: Investor; l: L; locale: LocaleCode }) {
  return (
    <div className="grid grid-cols-12 gap-6 md:gap-8">
      <Card tag="Asset_Specification" title={l.token} className="col-span-12 lg:col-span-4">
        <div className="space-y-8">
          <Metric label={l.tokenName} value={data.tokenName || l.tba} />
          <Metric label={l.symbol} value={data.symbol || l.tba} className="text-cyan" ltr={Boolean(data.symbol)} />
          <Metric label={l.totalSupply} value={data.totalSupply || l.tba} className="font-mono" ltr={Boolean(data.totalSupply)} />
          {data.network ? <Metric label={l.network} value={data.network} ltr /> : null}
          <div>
            <p className="mb-2 font-mono text-[10px] text-white/50 uppercase">{l.listing}</p>
            <ListingBadge text={data.listingStatus || l.tba} />
          </div>
        </div>
      </Card>
      <Card tag="Distribution_Model" title={l.allocation} className="col-span-12 lg:col-span-8">
        {data.allocation?.length ? (
          <div className="flex flex-col items-center gap-10 md:flex-row md:gap-16">
            <Donut rows={data.allocation} />
            <ul className="grid flex-1 grid-cols-1 gap-4 self-stretch sm:grid-cols-2">
              {data.allocation.map((row, i) => (
                <li key={row.id} className="flex items-center gap-3">
                  <span className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                  <div>
                    <p className="font-mono text-[10px] text-white/50">{row.percent}%</p>
                    <p className="text-xs font-bold uppercase">{row.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <Empty text={l.tba} />
        )}
      </Card>
      <Card tag="Temporal_Lock_Protocol" title={l.vesting} className="col-span-12">
        {data.vesting?.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-start">
              <thead>
                <tr className="border-b border-line font-mono text-[10px] tracking-[0.1em] text-white/30 uppercase">
                  {[l.category, l.tgeUnlock, l.cliff, l.vestingPeriod, l.amount].map((h) => (
                    <th key={h} className="pb-3 text-start font-normal">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="font-mono text-xs text-white/60">
                {data.vesting.map((row) => (
                  <tr key={row.id} className="border-b border-white/5">
                    <td className="py-4 font-bold text-white uppercase">{row.category}</td>
                    <td>{row.tgeUnlock}</td>
                    <td>{row.cliff}</td>
                    <td>{row.vestingPeriod}</td>
                    <td dir="ltr" className="text-start">{row.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty text={l.tba} />
        )}
      </Card>
      <Card tag="Smart_Contract_Verification" title={l.contracts} className="col-span-12 lg:col-span-7">
        <Addresses rows={data.contracts} l={l} />
        <p className="mt-6 flex items-start gap-3 text-xs leading-relaxed text-white/50">
          <Info size={16} className="mt-0.5 shrink-0" aria-hidden /> {l.verifyHint}
        </p>
      </Card>
      <div className="col-span-12 lg:col-span-5">
        <SecurityAlert data={data} l={l} locale={locale} />
      </div>
    </div>
  )
}

function Whitepaper({ data, l }: { data: Investor; l: L }) {
  const rows = data.whitepapers ?? []
  return (
    <Card tag="Document_Archive" title={l.whitepaper}>
      {rows.length ? (
        <ul className="divide-y divide-white/5">
          {rows.map((row) => {
            const file = mediaUrl(row.file)
            return (
              <li key={row.id} className="flex flex-wrap items-center justify-between gap-4 py-5">
                <div>
                  <p className="font-bold">{LOCALES.find((x) => x.code === row.language)?.label ?? row.language}</p>
                  <p className="mt-1 font-mono text-[10px] text-white/50 uppercase">
                    {l.version} {row.version}
                    {row.date ? ` · ${dot(row.date)}` : ''}
                  </p>
                </div>
                {file ? (
                  <a href={file} target="_blank" rel="noopener noreferrer" className="btn-line">
                    <DownloadSimple size={14} aria-hidden /> {l.download}
                  </a>
                ) : null}
              </li>
            )
          })}
        </ul>
      ) : (
        <Empty text={l.tba} />
      )}
    </Card>
  )
}

function Roadmap({ data, l }: { data: Investor; l: L }) {
  const rows = data.roadmap ?? []
  const status = { done: [l.statusDone, 'border-lime/40 bg-lime/10 text-lime'], 'in-progress': [l.statusInProgress, 'border-cyan/40 bg-cyan/10 text-cyan'], planned: [l.statusPlanned, 'border-white/20 text-white/50'] } as const
  return (
    <Card tag="Roadmap_Sequence" title={l.roadmap}>
      {rows.length ? (
        <ol className="relative ms-2 border-s border-cyan/40">
          {rows.map((row) => {
            const [label, style] = status[row.status]
            return (
              <li key={row.id} className="relative mb-12 ps-10 last:mb-0">
                <span className={`absolute -start-[5px] top-2 h-2.5 w-2.5 rounded-full ${row.status === 'planned' ? 'border border-white/40 bg-black' : 'bg-cyan shadow-[0_0_12px_var(--color-cyan)]'}`} />
                <p className="flex flex-wrap items-center gap-3 font-mono text-sm text-cyan">
                  {row.period}
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] tracking-[0.1em] uppercase ${style}`}>{label}</span>
                </p>
                <p className="mt-2 text-xl font-bold">{row.title}</p>
                {row.description ? <p className="mt-2 max-w-2xl whitespace-pre-line text-white/60">{row.description}</p> : null}
              </li>
            )
          })}
        </ol>
      ) : (
        <Empty text={l.tba} />
      )}
    </Card>
  )
}

async function Disclosure({ locale, l }: { locale: LocaleCode; l: L }) {
  const docs = await getDisclosures(locale)
  const category: Record<string, string> = { issuance: l.catIssuance, allocation: l.catAllocation, unlock: l.catUnlock, partnership: l.catPartnership, other: l.catOther }
  return (
    <Card tag="Disclosure_Log" title={l.disclosure}>
      {docs.length ? (
        <ul className="border-t border-white/10">
          {docs.map((doc) => {
            const file = mediaUrl(doc.file)
            // 공시일 이후에 고쳤으면 수정일을 함께 보여준다
            const edited = doc.updatedAt.slice(0, 10) > (doc.date?.slice(0, 10) ?? '')
            return (
              <li key={doc.id} className="border-b border-white/10">
                <details className="group">
                  <summary className="grid cursor-pointer list-none gap-2 py-6 md:grid-cols-[160px_1fr_auto] md:items-baseline md:gap-8 [&::-webkit-details-marker]:hidden">
                    <p className="font-mono text-[11px] text-white/50">
                      {dot(doc.date)} <span className="ms-2 text-cyan uppercase">{category[doc.category]}</span>
                    </p>
                    <p className="text-lg font-bold transition-colors group-hover:text-cyan">{doc.title}</p>
                    <CaretDown size={16} className="hidden text-white/50 transition-transform group-open:rotate-180 md:block" aria-hidden />
                  </summary>
                  <div className="pb-8 md:ps-[192px]">
                    {edited ? <p className="mb-4 font-mono text-[10px] text-white/40 uppercase">{l.updated} {dot(doc.updatedAt)}</p> : null}
                    {doc.body ? (
                      <div className="prose-cubit max-w-3xl text-white/70">
                        <RichText data={doc.body} />
                      </div>
                    ) : null}
                    {file ? (
                      <a href={file} target="_blank" rel="noopener noreferrer" className="btn-line mt-6">
                        <DownloadSimple size={14} aria-hidden /> {l.download}
                      </a>
                    ) : null}
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      ) : (
        <Empty text={l.tba} />
      )}
    </Card>
  )
}

function Audit({ data, l }: { data: Investor; l: L }) {
  const rows = data.audits ?? []
  return rows.length ? (
    <ul className="grid gap-6 md:grid-cols-2">
      {rows.map((row) => {
        const file = mediaUrl(row.report)
        return (
          <li key={row.id}>
            <Card tag={`Audit // ${dot(row.date) || 'TBA'}`} title={row.auditor}>
              {row.scope ? (
                <p className="text-sm text-white/60">
                  <span className="me-2 font-mono text-[10px] text-white/40 uppercase">{l.scope}</span>
                  {row.scope}
                </p>
              ) : null}
              {file ? (
                <a href={file} target="_blank" rel="noopener noreferrer" className="btn-line mt-6">
                  <DownloadSimple size={14} aria-hidden /> {l.report}
                </a>
              ) : null}
            </Card>
          </li>
        )
      })}
    </ul>
  ) : (
    <Card tag="Security_Audit" title={l.audit}>
      <Empty text={l.tba} />
    </Card>
  )
}

function Official({ data, l, locale }: { data: Investor; l: L; locale: LocaleCode }) {
  return (
    <div className="grid grid-cols-12 gap-6 md:gap-8">
      <div className="col-span-12 space-y-6 md:space-y-8 lg:col-span-7">
        <Card tag="Smart_Contract_Verification" title={l.contracts}>
          <Addresses rows={data.contracts} l={l} />
        </Card>
        <Card tag="Treasury_Registry" title={l.wallets}>
          <Addresses rows={data.wallets} l={l} />
        </Card>
      </div>
      <div className="col-span-12 lg:col-span-5">
        <SecurityAlert data={data} l={l} locale={locale} />
      </div>
    </div>
  )
}

function Disclaimer({ data, l }: { data: Investor; l: L }) {
  return (
    <div className="max-w-4xl space-y-8">
      <section className="text-lg leading-relaxed whitespace-pre-line text-white/70">{data.riskNotice || l.tba}</section>
      {data.restrictedRegions ? (
        <section className="rounded-2xl border border-pink/15 bg-pink/5 p-6">
          <h2 className="mb-3 font-mono text-[10px] tracking-[0.1em] text-pink uppercase">{l.restricted}</h2>
          <p className="whitespace-pre-line text-white/70">{data.restrictedRegions}</p>
        </section>
      ) : null}
    </div>
  )
}

// ── 화면 ─────────────────────────────────────────────

export async function InvestorsView({ locale, tab }: { locale: LocaleCode; tab: InvestorTab }) {
  const [data, labels] = await Promise.all([getInvestors(locale), getUiLabels(locale)])
  if (!data) notFound()
  const l = labels.investors

  const body = {
    overview: <Overview data={data} l={l} locale={locale} />,
    token: <Token data={data} l={l} locale={locale} />,
    whitepaper: <Whitepaper data={data} l={l} />,
    roadmap: <Roadmap data={data} l={l} />,
    disclosure: <Disclosure locale={locale} l={l} />,
    audit: <Audit data={data} l={l} />,
    official: <Official data={data} l={l} locale={locale} />,
    disclaimer: <Disclaimer data={data} l={l} />,
  }[tab]

  return (
    <PageShell>
      <PageHeader
        eyebrow="Investor_Relations // Token_Ecosystem"
        title={tab === 'overview' ? l.title : l[tab]}
        aside={<p>LISTING: <span className="text-lime">{data.listingStatus || l.tba}</span></p>}
      />
      <nav aria-label={l.title} className="-mx-5 mb-12 flex overflow-x-auto border-b border-white/10 px-5 [scrollbar-width:none] md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden">
        {INVESTOR_TABS.map((t) => (
          <Link
            key={t}
            href={localePath(locale, tabPath(t))}
            aria-current={t === tab ? 'page' : undefined}
            className={`shrink-0 border-b-2 px-4 py-3 font-mono text-[11px] tracking-[0.15em] uppercase transition-colors md:px-5 ${t === tab ? 'border-cyan text-white' : 'border-transparent text-white/40 hover:text-white'}`}
          >
            {t === 'overview' ? l.overview : l[t]}
          </Link>
        ))}
      </nav>
      {body}
      {tab !== 'disclaimer' ? (
        <div className="mt-12">
          <RiskBox text={data.riskNotice} title={l.disclaimer} />
        </div>
      ) : null}
    </PageShell>
  )
}

export async function investorsMetadata(locale: LocaleCode, tab: InvestorTab): Promise<Metadata> {
  const [data, labels] = await Promise.all([getInvestors(locale), getUiLabels(locale)])
  if (!data) return { robots: { index: false } }
  const l = labels.investors
  return pageMetadata(locale, tabPath(tab), { title: tab === 'overview' ? l.title : `${l[tab]} · ${l.title}` })
}
