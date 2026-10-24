'use client'

import { Check, PaperPlaneTilt, UploadSimple, X } from '@phosphor-icons/react'
import { useRef, useState, type DragEvent, type FormEvent } from 'react'

import { Chip, Consent, Field, Honeypot, TextArea, TextInput, submitError } from './fields'

type Labels = Record<string, string>
// contact: 일반 문의 (CONTACT) · report: 사칭 신고 (TRUST) · apply: 지원서 (JOIN US)
type Mode = 'contact' | 'report' | 'apply'
type Props = {
  locale: string
  labels: { contact: Labels; campaign: Labels; forms: Labels; trust?: Labels; join?: Labels }
  privacyHref: string | null
  mode?: Mode
  positions?: string[]
}

const TYPES = [
  { value: 'partnership', label: 'typePartnership' },
  { value: 'press', label: 'typePress' },
  { value: 'investment', label: 'typeInvestment' },
  { value: 'other', label: 'typeOther' },
] as const
const ACCEPT = ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'video/quicktime']
const MAX_FILES = 5
const MAX_BYTES = 50 * 1024 * 1024
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
// 비공개 저장소(R2)의 업로드 허가 주소. src/infrastructure.ts에서 두 번째로 등록한 저장소라 끝에 -1이 붙는다.
const SIGNED_UPLOAD_URL = '/api/storage-s3-generate-signed-url-1'

// 첨부 파일 한 개를 올리고 번호를 돌려준다.
// 운영(R2 연결): 허가 받은 주소로 브라우저가 저장소에 바로 올린 뒤 기록만 서버에 남긴다 (큰 파일도 Vercel 제한에 걸리지 않음).
// 개발(R2 없음): 허가 주소가 없으면(404) 파일을 서버로 보낸다.
async function uploadAttachment(file: File): Promise<number> {
  const signed = await fetch(SIGNED_UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ collectionSlug: 'attachments', filename: file.name, filesize: file.size, mimeType: file.type }),
  })
  const body = new FormData()
  if (signed.ok) {
    const { clientUploadContext, filename, headers, url } = await signed.json()
    const put = await fetch(url, { method: 'PUT', body: file, headers })
    if (!put.ok) throw new Error(`upload failed: ${put.status}`)
    body.append(
      'file',
      JSON.stringify({
        clientUploadContext: { prefix: clientUploadContext.prefix, signedReceipt: clientUploadContext.signedReceipt },
        collectionSlug: 'attachments',
        filename: filename || file.name,
        mimeType: file.type,
        size: file.size,
      }),
    )
  } else if (signed.status === 404) {
    body.append('file', file)
  } else {
    throw signed
  }
  const response = await fetch('/api/attachments', { method: 'POST', body })
  if (!response.ok) throw response
  return (await response.json()).doc.id
}

// 문의 양식 (design/09_CONTACT): 유형 · 연락처 · 내용 · 첨부 파일 → 문의함으로 접수.
// 사칭 신고와 지원서도 같은 문의함으로 들어간다 (유형만 다름).
export function ContactForm({ locale, labels, privacyHref, mode = 'contact', positions = [] }: Props) {
  const c = labels.contact
  const f = labels.forms
  const t = labels.trust ?? {}
  const j = labels.join ?? {}
  const [type, setType] = useState<string>(mode === 'report' ? 'report' : mode === 'apply' ? 'application' : 'partnership')
  const [position, setPosition] = useState(positions[0] ?? j.general ?? '')
  const [reportedUrl, setReportedUrl] = useState('')
  const [fields, setFields] = useState({ companyName: '', contactName: '', email: '', phone: '', message: '' })
  const [files, setFiles] = useState<File[]>([])
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  const addFiles = (list: FileList | null) => {
    const ok = Array.from(list ?? []).filter((file) => ACCEPT.includes(file.type) && file.size <= MAX_BYTES)
    setFiles((current) => [...current, ...ok].slice(0, MAX_FILES))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const missing =
      (mode === 'contact' && !fields.companyName.trim()) ||
      (mode === 'report' && (!reportedUrl.trim() || !fields.message.trim())) ||
      !fields.contactName.trim() ||
      !EMAIL.test(fields.email) ||
      !consent
    if (missing) {
      setError(labels.campaign.fillContact)
      return
    }
    setError('')
    setStatus('sending')
    try {
      // 1) 첨부 파일을 비공개 보관함에 올린다
      const attachments: number[] = []
      for (const file of files) attachments.push(await uploadAttachment(file))
      // 2) 문의를 접수한다
      const response = await fetch(`/api/inquiries?locale=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          ...fields,
          ...(mode === 'apply' ? { position } : {}),
          ...(mode === 'report' ? { reportedUrl } : {}),
          attachments,
          privacyConsent: consent,
          website,
        }),
      })
      if (!response.ok) throw response
      setStatus('done')
    } catch (failure) {
      setStatus('idle')
      setError(failure instanceof Response ? await submitError(failure, f) : f.error)
    }
  }

  if (status === 'done') {
    return (
      <div className="py-10">
        <p className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-cyan text-black">
          <Check size={28} weight="bold" aria-hidden />
        </p>
        <p className="max-w-xl text-xl">{f.success}</p>
      </div>
    )
  }

  const onDrop = (event: DragEvent) => {
    event.preventDefault()
    setDragging(false)
    addFiles(event.dataTransfer.files)
  }

  return (
    <form onSubmit={submit} noValidate className="relative space-y-8">
      <Honeypot value={website} onChange={setWebsite} />
      {mode === 'contact' ? (
        <div>
          <p className="mb-4 font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">{c.type}</p>
          <div className="flex flex-wrap gap-3">
            {TYPES.map((item) => (
              <Chip key={item.value} active={type === item.value} onClick={() => setType(item.value)}>
                {c[item.label]}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
      {mode === 'apply' ? (
        <div>
          <p className="mb-4 font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">{j.position}</p>
          <div className="flex flex-wrap gap-3">
            {[...positions, j.general].map((item) => (
              <Chip key={item} active={position === item} onClick={() => setPosition(item)}>
                {item}
              </Chip>
            ))}
          </div>
        </div>
      ) : null}
      {mode === 'report' ? (
        <Field label={t.reportedUrl} required>
          <TextInput inputMode="url" value={reportedUrl} onChange={(e) => setReportedUrl(e.target.value)} />
        </Field>
      ) : null}
      <div className="grid gap-6 md:grid-cols-2">
        {mode === 'contact' ? (
          <Field label={labels.campaign.company} required>
            <TextInput autoComplete="organization" value={fields.companyName} onChange={(e) => setFields({ ...fields, companyName: e.target.value })} />
          </Field>
        ) : null}
        <Field label={c.name} required>
          <TextInput autoComplete="name" value={fields.contactName} onChange={(e) => setFields({ ...fields, contactName: e.target.value })} />
        </Field>
        <Field label={labels.campaign.email} required>
          <TextInput type="email" autoComplete="email" value={fields.email} onChange={(e) => setFields({ ...fields, email: e.target.value })} />
        </Field>
        {mode !== 'report' ? (
          <Field label={labels.campaign.phone}>
            <TextInput type="tel" autoComplete="tel" value={fields.phone} onChange={(e) => setFields({ ...fields, phone: e.target.value })} />
          </Field>
        ) : null}
      </div>
      <Field label={mode === 'report' ? t.details : c.message} required={mode === 'report'}>
        <TextArea rows={8} maxLength={5000} value={fields.message} onChange={(e) => setFields({ ...fields, message: e.target.value })} />
      </Field>

      <div>
        <p className="mb-2 font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">{mode === 'apply' ? j.portfolio : c.attach}</p>
        <button
          type="button"
          onClick={() => input.current?.click()}
          onDragOver={(e) => (e.preventDefault(), setDragging(true))}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex w-full flex-col items-center justify-center rounded-xl border border-dashed px-6 py-10 transition-colors ${dragging ? 'border-cyan bg-cyan/5' : 'border-white/15 hover:border-white/40'}`}
        >
          <UploadSimple size={28} className="mb-2 text-white/40" aria-hidden />
          <span className="font-mono text-[11px] text-white/50 uppercase">Drag & drop / Browse</span>
          <span className="mt-1 text-[11px] text-white/30">{c.attachHint}</span>
        </button>
        <input ref={input} type="file" multiple accept={ACCEPT.join(',')} className="hidden" onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
        {files.length ? (
          <ul className="mt-4 space-y-2">
            {files.map((file, index) => (
              <li key={`${file.name}-${index}`} className="flex items-center justify-between gap-4 rounded-lg border border-line px-4 py-2 text-sm">
                <span className="truncate">{file.name}</span>
                <span className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-white/40">
                  {(file.size / 1024 / 1024).toFixed(1)}MB
                  <button type="button" onClick={() => setFiles((list) => list.filter((_, i) => i !== index))} aria-label="Remove" className="hover:text-pink">
                    <X size={14} aria-hidden />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <Consent checked={consent} onChange={setConsent}>
        {privacyHref ? (
          <a href={privacyHref} target="_blank" rel="noopener noreferrer" className="text-cyan underline underline-offset-2">
            {f.privacyConsent}
          </a>
        ) : (
          f.privacyConsent
        )}
        <span className="ms-1 text-pink">*</span>
      </Consent>

      {error ? (
        <p role="alert" className="text-sm text-pink">
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={status === 'sending'} className="btn-irid w-full px-9 py-3.5 md:w-auto disabled:opacity-60">
        {status === 'sending' ? f.sending : mode === 'report' ? t.sendReport : mode === 'apply' ? j.sendApplication : c.send} <PaperPlaneTilt size={16} weight="fill" aria-hidden />
      </button>
    </form>
  )
}
