'use client'

import { ArrowLeft, ArrowRight, Check, Image as ImageIcon, Megaphone, ShareNetwork, Television } from '@phosphor-icons/react'
import { useMemo, useState, type FormEvent } from 'react'

import { Chip, Consent, Field, Honeypot, TextArea, TextInput, submitError } from './fields'

export type BuilderTalent = { id: number; name: string; photo: string | null; categories: string }
type Labels = Record<string, string>

type Props = {
  locale: string
  talents: BuilderTalent[]
  initialTalents: number[]
  languages: { value: string; label: string }[]
  labels: { campaign: Labels; forms: Labels; common: Labels }
  confirmation: string
  privacyHref: string | null
}

const USAGES = [
  { value: 'digital', icon: Megaphone, color: 'text-cyan', title: 'usageDigital', desc: 'usageDigitalDesc' },
  { value: 'video', icon: Television, color: 'text-pink', title: 'usageVideo', desc: 'usageVideoDesc' },
  { value: 'social', icon: ShareNetwork, color: 'text-lime', title: 'usageSocial', desc: 'usageSocialDesc' },
  { value: 'ooh', icon: ImageIcon, color: 'text-white', title: 'usageOoh', desc: 'usageOohDesc' },
] as const

const REGIONS = [
  { value: 'worldwide', label: 'regionWorldwide' },
  { value: 'kr', label: 'regionKr' },
  { value: 'north-america', label: 'regionNa' },
  { value: 'europe', label: 'regionEu' },
  { value: 'asia-pacific', label: 'regionApac' },
] as const

const toggle = <T,>(list: T[], value: T) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 캠페인 빌더 (design/05_캠페인빌더): 5단계 선택 + 오른쪽 요약 → 견적 요청함으로 접수
export function CampaignBuilder({ locale, talents, initialTalents, languages, labels, confirmation, privacyHref }: Props) {
  const t = labels.campaign
  const [step, setStep] = useState(1)
  const [selected, setSelected] = useState<number[]>(initialTalents.filter((id) => talents.some((x) => x.id === id)))
  const [usage, setUsage] = useState<string[]>([])
  const [periodStart, setPeriodStart] = useState('')
  const [periodEnd, setPeriodEnd] = useState('')
  const [regions, setRegions] = useState<string[]>(['worldwide'])
  const [regionsOther, setRegionsOther] = useState('')
  const [langs, setLangs] = useState<string[]>([languages.some((l) => l.value === locale) ? locale : 'en'])
  const [contact, setContact] = useState({ companyName: '', contactName: '', email: '', phone: '', message: '' })
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  const steps = [t.step1, t.step2, t.step3, t.step4, t.step5]
  const chosenTalents = useMemo(() => talents.filter((x) => selected.includes(x.id)), [talents, selected])

  const problem = (s: number): string => {
    if (s === 1 && !selected.length) return t.pickTalent
    if (s === 2 && !usage.length) return t.pickUsage
    if (s === 5 && (!contact.companyName.trim() || !contact.contactName.trim() || !EMAIL.test(contact.email) || !consent)) return t.fillContact
    return ''
  }

  const next = () => {
    const issue = problem(step)
    setError(issue)
    if (!issue) setStep((s) => Math.min(5, s + 1))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const issue = [1, 2, 5].map(problem).find(Boolean) ?? ''
    setError(issue)
    if (issue) return
    setStatus('sending')
    const response = await fetch(`/api/quote-requests?locale=${locale}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        talents: selected,
        usage,
        periodStart: periodStart || undefined,
        periodEnd: periodEnd || undefined,
        regions,
        regionsOther: regionsOther.split(',').map((r) => r.trim()).filter(Boolean),
        languages: langs,
        ...contact,
        privacyConsent: consent,
        website,
      }),
    }).catch(() => null)
    if (response?.ok) {
      setStatus('done')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setStatus('idle')
    setError(response ? await submitError(response, labels.forms) : labels.forms.error)
  }

  const summary = (
    <aside className="glass h-fit rounded-2xl p-8 lg:sticky lg:top-28 lg:rounded-none lg:border-y-0 lg:border-e-0 lg:bg-white/[0.02] lg:p-12">
      <p className="font-mono text-[9px] tracking-[0.1em] text-cyan uppercase">Summary_log</p>
      <h3 className="mt-1 mb-8 text-2xl font-black uppercase">{t.summary}</h3>
      <p className="mb-4 font-mono text-[10px] text-white/50 uppercase">{t.selectedTalent}</p>
      <ul className="mb-8 space-y-3">
        {chosenTalents.length ? (
          chosenTalents.map((x) => (
            <li key={x.id} className="flex items-center gap-3">
              <span className="h-10 w-10 shrink-0 overflow-hidden rounded bg-white/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {x.photo ? <img src={x.photo} alt="" className="h-full w-full object-cover" /> : null}
              </span>
              <span className="text-sm font-bold uppercase">{x.name}</span>
            </li>
          ))
        ) : (
          <li className="text-white/30">—</li>
        )}
      </ul>
      <dl className="space-y-2 text-xs">
        {[
          [t.usageTitle, USAGES.filter((u) => usage.includes(u.value)).map((u) => t[u.title]).join(', ')],
          [t.scope, [...REGIONS.filter((r) => regions.includes(r.value)).map((r) => t[r.label]), regionsOther].filter(Boolean).join(', ')],
          [t.languagesTitle, languages.filter((l) => langs.includes(l.value)).map((l) => l.label).join(', ')],
          [t.duration, [periodStart, periodEnd].filter(Boolean).join(' → ')],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between gap-4">
            <dt className="shrink-0 text-white/40">{label}</dt>
            <dd className="text-end font-bold">{value || '—'}</dd>
          </div>
        ))}
      </dl>
    </aside>
  )

  if (status === 'done') {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="py-10">
          <p className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-black">
            <Check size={28} weight="bold" aria-hidden />
          </p>
          <h2 className="text-4xl font-black uppercase">{t.doneTitle}</h2>
          <p className="mt-4 max-w-xl text-white/60">{confirmation}</p>
        </div>
        {summary}
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="relative grid gap-10 lg:grid-cols-[1fr_420px] lg:gap-0">
      <Honeypot value={website} onChange={setWebsite} />
      <div className="lg:pe-16">
        <ol className="mb-16 flex gap-3 md:gap-4">
          {steps.map((label, index) => {
            const n = index + 1
            return (
              <li key={label} className="flex-1">
                <button
                  type="button"
                  disabled={n > step}
                  onClick={() => n < step && setStep(n)}
                  aria-current={n === step ? 'step' : undefined}
                  className="w-full pb-5 text-start disabled:cursor-default"
                >
                  <span className={`block truncate font-mono text-[9px] tracking-[0.2em] uppercase ${n === step ? 'text-cyan' : 'text-white/30'}`}>
                    {String(n).padStart(2, '0')} <span className="hidden sm:inline">{label}</span>
                  </span>
                  <span
                    className={`mt-3 block h-0.5 transition-all ${
                      n === step ? 'bg-gradient-to-r from-cyan to-pink shadow-[0_0_10px_var(--color-cyan)]' : n < step ? 'bg-cyan' : 'bg-white/5'
                    }`}
                  />
                </button>
              </li>
            )
          })}
        </ol>

        <div className="min-h-[460px]">
          {step === 1 ? (
            <section>
              <StepTitle tag="Selection_phase" title={t.talentTitle} hint={t.talentHint} />
              <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
                {talents.map((x) => {
                  const on = selected.includes(x.id)
                  return (
                    <li key={x.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSelected((list) => toggle(list, x.id))}
                        className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-xl border bg-[#0a0a0a] text-start transition-all ${
                          on ? 'border-cyan shadow-[0_0_20px_rgba(0,243,255,0.15)]' : 'border-line'
                        }`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        {x.photo ? <img src={x.photo} alt="" className={`h-full w-full object-cover transition-all ${on ? '' : 'grayscale group-hover:grayscale-0'}`} /> : null}
                        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                          <span className="block text-xl font-black uppercase">{x.name}</span>
                          <span className="block font-mono text-[9px] text-cyan uppercase">{x.categories}</span>
                        </span>
                        {on ? (
                          <span className="absolute end-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-cyan text-black">
                            <Check size={14} weight="bold" aria-hidden />
                          </span>
                        ) : null}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          {step === 2 ? (
            <section>
              <StepTitle tag="License_params" title={t.usageTitle} hint={t.usageHint} />
              <ul className="grid gap-6 sm:grid-cols-2">
                {USAGES.map(({ value, icon: Icon, color, title, desc }) => {
                  const on = usage.includes(value)
                  return (
                    <li key={value}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setUsage((list) => toggle(list, value))}
                        className={`h-full w-full rounded-xl border p-6 text-center transition-all ${on ? 'border-pink bg-pink/5' : 'border-line bg-white/[0.03] hover:border-pink'}`}
                      >
                        <Icon size={36} className={`mx-auto mb-4 ${color}`} aria-hidden />
                        <span className="block text-xl font-bold uppercase">{t[title]}</span>
                        <span className="mt-2 block text-sm text-white/50">{t[desc]}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          ) : null}

          {step === 3 ? (
            <section className="space-y-12">
              <StepTitle tag="Period_&_region" title={t.periodTitle} />
              <div>
                <p className="mb-4 font-mono text-[10px] text-white/50 uppercase">{t.duration}</p>
                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                  <div className="min-w-40 flex-1">
                    <TextInput type="date" aria-label={t.duration} value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} />
                  </div>
                  <span className="font-mono text-white/30 uppercase">{t.to}</span>
                  <div className="min-w-40 flex-1">
                    <TextInput type="date" aria-label={t.to} value={periodEnd} min={periodStart || undefined} onChange={(e) => setPeriodEnd(e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <p className="mb-4 font-mono text-[10px] text-white/50 uppercase">{t.scope}</p>
                <div className="flex flex-wrap gap-3">
                  {REGIONS.map((r) => (
                    <Chip key={r.value} active={regions.includes(r.value)} onClick={() => setRegions((list) => toggle(list, r.value))}>
                      {t[r.label]}
                    </Chip>
                  ))}
                </div>
                <div className="mt-6 max-w-xl">
                  <Field label={t.regionOther}>
                    <TextInput value={regionsOther} onChange={(e) => setRegionsOther(e.target.value)} />
                  </Field>
                </div>
              </div>
            </section>
          ) : null}

          {step === 4 ? (
            <section>
              <StepTitle tag="Linguistic_mapping" title={t.languagesTitle} hint={t.languagesHint} />
              <div className="flex flex-wrap gap-3">
                {languages.map((l) => (
                  <Chip key={l.value} active={langs.includes(l.value)} onClick={() => setLangs((list) => toggle(list, l.value))}>
                    <span lang={l.value}>{l.label}</span>
                  </Chip>
                ))}
              </div>
            </section>
          ) : null}

          {step === 5 ? (
            <section>
              <StepTitle tag="Identity" title={t.contactTitle} />
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label={t.company} required className="sm:col-span-2">
                  <TextInput autoComplete="organization" value={contact.companyName} onChange={(e) => setContact({ ...contact, companyName: e.target.value })} />
                </Field>
                <Field label={t.contactName} required>
                  <TextInput autoComplete="name" value={contact.contactName} onChange={(e) => setContact({ ...contact, contactName: e.target.value })} />
                </Field>
                <Field label={t.email} required>
                  <TextInput type="email" autoComplete="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                </Field>
                <Field label={t.phone}>
                  <TextInput type="tel" autoComplete="tel" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
                </Field>
                <Field label={t.brief} className="sm:col-span-2">
                  <TextArea placeholder={t.briefPlaceholder} maxLength={5000} value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} />
                </Field>
                <div className="sm:col-span-2">
                  <Consent checked={consent} onChange={setConsent}>
                    {privacyHref ? (
                      <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-2">
                        {labels.forms.privacyConsent}
                      </a>
                    ) : (
                      labels.forms.privacyConsent
                    )}
                    <span className="ms-1 text-pink">*</span>
                  </Consent>
                </div>
              </div>
            </section>
          ) : null}
        </div>

        {error ? (
          <p role="alert" className="mt-8 text-sm text-pink">
            {error}
          </p>
        ) : null}

        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-10">
          <button
            type="button"
            onClick={() => (setError(''), setStep((s) => Math.max(1, s - 1)))}
            className={`flex items-center gap-2 font-mono text-[11px] tracking-[0.15em] text-white/50 uppercase hover:text-white ${step === 1 ? 'pointer-events-none opacity-0' : ''}`}
          >
            <ArrowLeft size={14} aria-hidden className="rtl:rotate-180" /> {t.previous}
          </button>
          {step < 5 ? (
            <button type="button" onClick={next} className="btn-irid">
              {t.continue} <ArrowRight size={14} aria-hidden className="rtl:rotate-180" />
            </button>
          ) : (
            <button type="submit" disabled={status === 'sending'} className="btn-irid disabled:opacity-60">
              {status === 'sending' ? labels.forms.sending : t.submit}
            </button>
          )}
        </div>
      </div>
      {summary}
    </form>
  )
}

function StepTitle({ tag, title, hint }: { tag: string; title: string; hint?: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-[9px] tracking-[0.1em] text-cyan uppercase">{tag}</p>
      <h2 className="mt-2 text-4xl font-black uppercase">{title}</h2>
      {hint ? <p className="mt-2 text-white/50">{hint}</p> : null}
    </div>
  )
}
