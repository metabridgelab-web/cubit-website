'use client'

import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

// 입력 양식 공통 부품 (design/05 · 09의 input-field · chip)

export const fieldClass =
  'w-full rounded-lg border border-line bg-white/5 px-4 py-3 text-white placeholder:text-white/30 transition-colors focus:border-cyan focus:outline-none'

export function Field({ label, required, children, className = '' }: { label: string; required?: boolean; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block font-mono text-[10px] tracking-[0.1em] text-white/50 uppercase">
        {label}
        {required ? <span className="ms-1 text-pink">*</span> : null}
      </span>
      {children}
    </label>
  )
}

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => <input {...props} className={fieldClass} />
export const TextArea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => <textarea {...props} className={`${fieldClass} min-h-32`} />

export function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`rounded-full border px-5 py-2 font-mono text-[11px] uppercase transition-all ${
        active ? 'border-cyan bg-cyan font-bold text-black' : 'border-line text-white/50 hover:border-white/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

// 사람에게는 보이지 않는 칸 (자동 프로그램만 채운다 → 접수 거절)
export const Honeypot = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div aria-hidden className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
    <label>
      Website
      <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  </div>
)

export function Consent({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-white/60">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 shrink-0 accent-cyan" />
      <span>{children}</span>
    </label>
  )
}

// 접수 결과 오류를 방문자 언어 문구로 바꾼다
export const submitError = async (response: Response, labels: Record<string, string>) =>
  response.status === 429 ? labels.tooMany : labels.error
