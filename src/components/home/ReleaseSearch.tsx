'use client'

import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

// 발매 목록 검색란: 입력을 멈추면(0.4초) 주소의 ?q= 를 바꿔 목록을 다시 불러온다. 첫 쪽부터 다시 보여 준다.
export function ReleaseSearch({ initial, placeholder, clearLabel }: { initial: string; placeholder: string; clearLabel: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [text, setText] = useState(initial)
  const first = useRef(true)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const timer = window.setTimeout(() => {
      const q = text.trim()
      router.replace(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname, { scroll: false })
    }, 400)
    return () => window.clearTimeout(timer)
  }, [text, pathname, router])

  return (
    <form role="search" onSubmit={(event) => event.preventDefault()} className="relative mb-12 w-full sm:max-w-md">
      <MagnifyingGlass size={16} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
      <input
        type="search"
        name="q"
        autoComplete="off"
        aria-label={placeholder}
        placeholder={placeholder}
        value={text}
        onChange={(event) => setText(event.target.value)}
        className="w-full rounded-full border border-white/15 bg-black py-2.5 ps-11 pe-10 text-sm text-white transition-colors placeholder:text-white/40 hover:border-white/40 focus:border-cyan focus:outline-none [&::-webkit-search-cancel-button]:hidden"
      />
      {text ? (
        <button type="button" aria-label={clearLabel} onClick={() => setText('')} className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-white/50 transition-colors hover:text-white">
          <X size={14} aria-hidden />
        </button>
      ) : null}
    </form>
  )
}
