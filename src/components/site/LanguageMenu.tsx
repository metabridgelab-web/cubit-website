'use client'

import { CaretDown, Check, GlobeSimple } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { LOCALES, type LocaleCode } from '@/constants/locales'

// 12개 언어 선택. 지금 보는 페이지를 같은 주소의 다른 언어로 연다. 고른 언어는 1년간 기억한다.
export function LanguageMenu({ locale, enabled, label }: { locale: LocaleCode; enabled: LocaleCode[]; label: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const pathname = usePathname() ?? `/${locale}`
  const rest = pathname.split('/').slice(2).join('/')

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent ? event.key === 'Escape' : !ref.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  const current = LOCALES.find((l) => l.code === locale)

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        className="flex h-12 items-center gap-2 rounded-full border border-line px-4 font-mono text-[11px] tracking-[0.2em] uppercase transition-colors hover:border-cyan hover:text-cyan"
      >
        <GlobeSimple size={16} aria-hidden />
        <span>{locale}</span>
        <CaretDown size={12} aria-hidden className={open ? 'rotate-180 transition-transform' : 'transition-transform'} />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="glass absolute end-0 top-14 z-50 max-h-[70vh] w-60 overflow-y-auto rounded-2xl bg-black/80 p-2"
        >
          {LOCALES.filter((l) => enabled.includes(l.code)).map((l) => (
            <li key={l.code} role="option" aria-selected={l.code === locale}>
              <a
                href={`/${l.code}${rest ? `/${rest}` : ''}`}
                hrefLang={l.code}
                lang={l.code}
                onClick={() => {
                  document.cookie = `NEXT_LOCALE=${l.code}; path=/; max-age=31536000; samesite=lax`
                }}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span>{l.label}</span>
                <span className="flex items-center gap-2 font-mono text-[10px] text-white/30 uppercase">
                  {l.code === locale ? <Check size={14} className="text-cyan" aria-hidden /> : null}
                  {l.code}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
      <span className="sr-only">{current?.label}</span>
    </div>
  )
}
