'use client'

import { Cookie } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

import { CONSENT_COOKIE, CONSENT_EVENT, CONSENT_MAX_AGE, OPEN_CONSENT_EVENT, readConsent, type Consent } from '@/constants/consent'

type Props = { title: string; text: string; acceptLabel: string; essentialLabel: string; policyLabel: string; policyHref: string | null }

// 쿠키 동의 배너: 처음 방문했을 때(또는 6개월이 지나 기억이 사라졌을 때) 화면 아래에 뜬다.
// "필수만"도 "모두 허용"과 같은 크기의 버튼으로 둬서 거절이 허용만큼 쉽게 한다. 하단 "쿠키 설정"으로 다시 열 수 있다.
export function CookieBanner({ title, text, acceptLabel, essentialLabel, policyLabel, policyHref }: Props) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    // 서버 화면과 어긋나지 않게, 쿠키는 화면이 뜬 뒤에 읽는다
    if (!readConsent()) setOpen(true)
    const reopen = () => setOpen(true)
    window.addEventListener(OPEN_CONSENT_EVENT, reopen)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen)
  }, [])

  const choose = (consent: Consent) => {
    const secure = location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${CONSENT_COOKIE}=${consent}; Max-Age=${CONSENT_MAX_AGE}; Path=/; SameSite=Lax${secure}`
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: consent }))
    setOpen(false)
  }

  if (!open) return null

  return (
    <section
      role="region"
      aria-label={title}
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-5xl rounded-2xl border border-white/10 bg-black/80 p-5 shadow-[0_0_40px_rgba(0,0,0,0.6)] backdrop-blur-xl md:inset-x-6 md:bottom-6 md:p-6"
    >
      <span className="absolute inset-x-6 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-cyan),var(--color-pink),transparent)]" />
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-8">
        <div className="flex min-w-0 flex-1 gap-4">
          <Cookie size={24} className="mt-0.5 hidden shrink-0 text-cyan sm:block" aria-hidden />
          <div className="min-w-0">
            <p className="mb-1 font-mono text-[10px] tracking-[0.15em] text-cyan uppercase">{title}</p>
            <p className="text-sm leading-relaxed whitespace-pre-line text-white/70">
              {text}
              {policyHref ? (
                <>
                  {' '}
                  <Link href={policyHref} className="whitespace-nowrap text-white underline underline-offset-2 hover:text-cyan">
                    {policyLabel}
                  </Link>
                </>
              ) : null}
            </p>
          </div>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-3">
          <button type="button" onClick={() => choose('essential')} className="btn-line px-5 py-3">
            {essentialLabel}
          </button>
          <button type="button" onClick={() => choose('all')} className="btn-irid justify-center px-5 py-3">
            {acceptLabel}
          </button>
        </div>
      </div>
    </section>
  )
}

// 하단의 "쿠키 설정": 누르면 배너를 다시 열어 선택을 바꿀 수 있다
export function CookieSettingsButton({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))} className={className}>
      {label}
    </button>
  )
}
