'use client'

import { ArrowUpRight, X } from '@phosphor-icons/react'
import Link from 'next/link'
import { useEffect, useRef, useState, type ReactNode } from 'react'

import { SocialIcon } from './SocialIcon'

export type MenuLink = { id: string; label: string; href: string }
export type MenuSection = MenuLink & { preview: string | null; items: MenuLink[] }

type Props = {
  open: boolean
  onClose: () => void
  sections: MenuSection[]
  cta: { label: string; href: string }
  socials: { id: string; platform: string; url: string }[]
  copyright: string
  closeLabel: string
  languageMenu: ReactNode
}

// 오른쪽 위 메뉴 버튼으로 여는 전체 화면 메뉴 (design/02_메뉴-열림)
// 왼쪽: 큰 메뉴 · 가운데: 하위 메뉴 · 오른쪽: 포털 미리보기 사진
export function MenuOverlay({ open, onClose, sections, cta, socials, copyright, closeLabel, languageMenu }: Props) {
  const [active, setActive] = useState(0)
  const [time, setTime] = useState('')
  const firstLink = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    firstLink.current?.focus()
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB'))
    tick()
    const timer = setInterval(tick, 1000)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
      clearInterval(timer)
    }
  }, [open, onClose])

  if (!open) return null
  const current = sections[active]

  return (
    <div role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-black">
      <Particles />

      <div className="relative z-10 flex justify-end p-6 md:p-10">
        <button
          type="button"
          onClick={onClose}
          aria-label={closeLabel}
          className="group flex h-12 w-12 items-center justify-center rounded-full border border-white/15 transition-all hover:bg-white hover:text-black"
        >
          <X size={22} aria-hidden className="transition-transform duration-300 group-hover:rotate-90" />
        </button>
      </div>

      <div className="relative z-10 grid flex-1 items-center gap-12 px-6 md:px-16 lg:grid-cols-2 lg:px-24">
        <div className="flex items-start gap-10 lg:gap-12">
          <nav aria-label="Main" className="flex flex-col gap-1">
            {sections.map((section, index) => (
              <div key={section.id}>
                <Link
                  ref={index === 0 ? firstLink : undefined}
                  href={section.href}
                  onPointerEnter={(event) => event.pointerType === 'mouse' && setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={(event) => {
                    // 터치 화면: 처음 누르면 하위 메뉴를 펼치고, 한 번 더 누르면 이동
                    if (window.matchMedia('(hover: none)').matches && active !== index && section.items.length) {
                      event.preventDefault()
                      setActive(index)
                      return
                    }
                    onClose()
                  }}
                  className={`group relative block w-fit text-[2.25rem] leading-[1.15] font-black tracking-[-0.02em] uppercase transition-all duration-400 ease-out-expo sm:text-5xl lg:text-[3.5rem] ${
                    active === index ? 'translate-x-0 text-white lg:translate-x-5' : 'text-white/40 hover:text-white'
                  }`}
                >
                  <span
                    aria-hidden
                    className={`absolute -start-9 top-3 hidden font-mono text-[10px] text-cyan transition-opacity lg:block ${active === index ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.label}
                </Link>
                {/* 작은 화면: 하위 메뉴를 섹션 바로 아래에 펼친다 */}
                {active === index && section.items.length ? (
                  <ul className="mt-2 mb-4 flex flex-col gap-2 border-s border-white/10 ps-4 lg:hidden">
                    {section.items.map((item) => (
                      <li key={item.id}>
                        <Link href={item.href} onClick={onClose} className="font-mono text-sm tracking-[0.1em] text-cyan">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="mt-8 hidden min-w-[200px] border-s border-white/10 ps-8 pt-4 lg:block">
            <p className="hud-label mb-6">Directory // Select</p>
            <ul key={active} className="flex flex-col gap-2">
              {(current?.items ?? []).map((item, index) => (
                <li key={item.id} className="animate-[fade-in_0.3s_ease_both]" style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-center gap-2.5 font-mono text-sm tracking-[0.1em] text-cyan transition-colors hover:text-white"
                  >
                    <span aria-hidden className="h-px w-0 bg-cyan transition-all group-hover:w-5" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden lg:block lg:ps-12 xl:ps-24">
          <div className="relative">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-[0_0_50px_rgba(0,243,255,0.1)]">
              <div className="scanlines absolute inset-0 z-10" />
              <span className="hud-bracket start-5 top-5 border-e-0 border-b-0" />
              <span className="hud-bracket end-5 top-5 border-s-0 border-b-0" />
              <span className="hud-bracket start-5 bottom-5 border-e-0 border-t-0" />
              <span className="hud-bracket end-5 bottom-5 border-s-0 border-t-0" />
              <p className="absolute start-6 top-4 z-20 flex items-center gap-2 font-mono text-[9px] tracking-widest text-cyan uppercase">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan" />
                {current?.label}
              </p>
              {current?.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={current.preview}
                  src={current.preview}
                  alt=""
                  className="h-full w-full animate-[fade-in_0.5s_ease_both] object-cover brightness-[0.8] contrast-[1.2] grayscale"
                />
              ) : (
                <div
                  key={active}
                  className="flex h-full w-full animate-[fade-in_0.5s_ease_both] items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(0,243,255,0.25),transparent_60%),radial-gradient(circle_at_70%_70%,rgba(255,0,229,0.2),transparent_60%)]"
                >
                  <span className="text-[8rem] font-black text-white/10">{String(active + 1).padStart(2, '0')}</span>
                </div>
              )}
            </div>
            <p className="absolute -bottom-10 end-0 font-mono text-[10px] text-white/40">
              LOCAL_TIME: <span className="text-white">{time}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-10">
        <div className="flex flex-wrap items-center gap-8">
          <Link href={cta.href} onClick={onClose} className="btn-irid">
            {cta.label} <ArrowUpRight size={16} aria-hidden />
          </Link>
          <ul className="flex gap-5 text-white/50">
            {socials.map((social) => (
              <li key={social.id}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" aria-label={social.platform} className="transition-colors hover:text-cyan">
                  <SocialIcon platform={social.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {languageMenu}
          <p className="border-s border-white/10 ps-6 font-mono text-[10px] text-white/40 uppercase">{copyright}</p>
        </div>
      </div>
    </div>
  )
}

// 떠다니는 빛 입자 (화면에 그린 뒤에 만들어서 서버 화면과 어긋나지 않게 한다)
function Particles() {
  const [dots, setDots] = useState<{ size: number; left: number; top: number; delay: number; duration: number }[]>([])
  useEffect(() => {
    setDots(
      Array.from({ length: 50 }, () => ({
        size: Math.random() * 3,
        left: Math.random() * 100,
        top: Math.random() * 100,
        delay: Math.random() * 20,
        duration: Math.random() * 10 + 10,
      })),
    )
  }, [])
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      {dots.map((dot, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-white opacity-30 blur-[1px]"
          style={{
            width: dot.size,
            height: dot.size,
            left: `${dot.left}vw`,
            top: `${dot.top}vh`,
            animation: `float-up ${dot.duration}s linear ${dot.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
