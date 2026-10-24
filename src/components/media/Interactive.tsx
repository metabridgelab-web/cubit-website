'use client'

import { ArrowsLeftRight, Check, Copy, Play } from '@phosphor-icons/react'
import { useCallback, useState, type ReactNode } from 'react'

import { Viewer } from '@/components/artists/MediaViewer'
import { SmartVideo } from '@/components/media/Video'

// 화면 안에서 손으로 다루는 작은 부품들 (STUDIO · 계열사 · INVESTORS에서 같이 쓴다)

export type Film = { src?: string | null; youtubeId?: string | null; title: string }

// 썸네일을 누르면 영상(직접 올린 파일 또는 YouTube)을 크게 재생한다
export function FilmButton({ film, closeLabel, label, className, children }: { film: Film; closeLabel: string; label: string; className?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} aria-label={`${label}: ${film.title}`} className={`group/film relative block w-full text-start ${className ?? ''}`}>
        {children}
        <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all group-hover/film:border-cyan group-hover/film:bg-cyan group-hover/film:text-black">
          <Play size={18} weight="fill" aria-hidden />
        </span>
      </button>
      {open ? (
        <Viewer onClose={close} closeLabel={closeLabel}>
          <div className="aspect-video w-full overflow-hidden bg-black">
            {film.youtubeId ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${film.youtubeId}?autoplay=1&rel=0`}
                title={film.title}
                allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
              />
            ) : film.src ? (
              <SmartVideo src={film.src} controls autoPlay playsInline className="h-full w-full" />
            ) : null}
          </div>
          <p className="mt-4 font-mono text-xs tracking-[0.15em] text-white/60 uppercase">{film.title}</p>
        </Viewer>
      ) : null}
    </>
  )
}

// 작업 전후 비교 (design/06): 가운데 손잡이를 좌우로 밀어서 두 사진을 비교한다. 키보드 ←/→로도 움직인다.
export function CompareSlider({ before, after, beforeLabel, afterLabel, hint }: { before: string; after: string; beforeLabel: string; afterLabel: string; hint: string }) {
  const [position, setPosition] = useState(50)
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-line select-none md:aspect-[21/9]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={afterLabel} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={beforeLabel} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scanlines absolute inset-0" />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-cyan shadow-[0_0_20px_var(--color-cyan)]" style={{ left: `${position}%` }}>
        <span className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cyan bg-black text-cyan">
          <ArrowsLeftRight size={16} aria-hidden />
        </span>
      </div>
      <span className="absolute bottom-5 left-5 border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase backdrop-blur-md">{beforeLabel}</span>
      <span className="absolute right-5 bottom-5 border border-white/10 bg-black/60 px-3 py-1 font-mono text-[10px] uppercase backdrop-blur-md">{afterLabel}</span>
      <input
        type="range"
        min={0}
        max={100}
        value={position}
        onChange={(e) => setPosition(Number(e.target.value))}
        aria-label={hint}
        dir="ltr"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
      />
    </div>
  )
}

// 주소 복사 버튼: 누르면 잠깐 "복사됨"으로 바뀐다
export function CopyButton({ value, label, doneLabel }: { value: string; label: string; doneLabel: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      // 클립보드를 쓸 수 없는 브라우저: 주소를 직접 선택해 복사할 수 있다 (select-all)
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={done ? doneLabel : label}
      title={done ? doneLabel : label}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 transition-all hover:bg-white hover:text-black"
    >
      {done ? <Check size={18} className="text-lime" aria-hidden /> : <Copy size={18} aria-hidden />}
    </button>
  )
}
