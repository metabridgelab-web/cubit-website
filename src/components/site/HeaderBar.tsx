'use client'

import { List } from '@phosphor-icons/react'
import Link from 'next/link'
import { useCallback, useEffect, useState, type ReactNode } from 'react'

import { MenuOverlay, type MenuSection } from './MenuOverlay'

type Props = {
  homeHref: string
  siteName: string
  logoSrc: string
  menuLabel: string
  closeLabel: string
  sections: MenuSection[]
  cta: { label: string; href: string }
  socials: { id: string; platform: string; url: string }[]
  copyright: string
  languageMenu: ReactNode
}

// 모든 페이지 상단: 왼쪽 로고 · 오른쪽 언어 선택 + 메뉴 버튼.
// 첫 화면 위에서는 투명하고, 아래로 내리면 어두운 유리 배경이 깔린다.
export function HeaderBar({ homeHref, siteName, logoSrc, menuLabel, closeLabel, sections, cta, socials, copyright, languageMenu }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-4 transition-all duration-500 md:px-10 md:py-6 ${
          scrolled ? 'border-b border-white/10 bg-black/60 backdrop-blur-xl' : ''
        }`}
      >
        <Link href={homeHref} className="flex items-center gap-3" aria-label={siteName}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} alt="" width={44} height={44} className="h-10 w-10 md:h-11 md:w-11" />
          <span className="hidden text-sm font-black tracking-[0.4em] uppercase sm:inline">{siteName}</span>
        </Link>
        <div className="flex items-center gap-3">
          {languageMenu}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label={menuLabel}
            aria-expanded={open}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-all hover:border-white hover:bg-white hover:text-black"
          >
            <List size={22} aria-hidden />
          </button>
        </div>
      </header>
      <MenuOverlay
        open={open}
        onClose={close}
        sections={sections}
        cta={cta}
        socials={socials}
        copyright={copyright}
        closeLabel={closeLabel}
        languageMenu={languageMenu}
      />
    </>
  )
}
