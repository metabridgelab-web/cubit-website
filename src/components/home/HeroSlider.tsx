'use client'

import { ArrowLeft, ArrowRight, ArrowUpRight, CaretDown, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { useVideoSource } from '@/components/media/Video'
import { fitHeadline } from '@/lib/fit'

export type HeroSlide = {
  id: string
  headline: string
  title: string
  releaseDate: string | null
  // file: 직접 올린 mp4 또는 Cloudflare Stream(.m3u8) · youtube: YouTube 영상
  video: { type: 'file'; src: string } | { type: 'youtube'; id: string } | null
  poster: string | null
  mvUrl: string | null
}

type Labels = { watchMv: string; prev: string; next: string; soundOn: string; soundOff: string; scrollDown: string }

// 가운데 큰 글자: 화면 폭의 92% 안, 최대 8rem
const headlineSize = (text: string) => fitHeadline(text, { maxRem: 8, widthVw: 92 })

// 홈 첫 화면: 화면 전체 영상 슬라이드 (design/01_홈-첫화면)
// - 음소거로 자동 재생 · 직접 올린 영상은 끝나면 다음으로, YouTube·사진은 정해진 시간 뒤 다음으로
// - 소리를 켜면 그 슬라이드에서 멈춰 반복 재생
// - 좌우 화살표 버튼 · 키보드 ←/→ · 손가락으로 밀기
export function HeroSlider({ slides, autoAdvanceSeconds, labels }: { slides: HeroSlide[]; autoAdvanceSeconds: number; labels: Labels }) {
  const [index, setIndex] = useState(0)
  const [muted, setMuted] = useState(true)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const videoRef = useRef<HTMLVideoElement>(null)
  const pointerStart = useRef<number | null>(null)
  const count = slides.length
  const slide = slides[index]

  const go = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count])

  // 영상이 아닌 슬라이드(또는 YouTube)는 정해진 시간 뒤에 넘긴다
  useEffect(() => {
    if (count < 2 || !muted || slide?.video?.type === 'file') return
    const timer = setTimeout(() => go(1), autoAdvanceSeconds * 1000)
    return () => clearTimeout(timer)
  }, [index, muted, count, slide, go, autoAdvanceSeconds])

  useVideoSource(videoRef, slide?.video?.type === 'file' ? slide.video.src : null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.muted = muted
    video.play().catch(() => undefined)
  }, [index, muted])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (window.scrollY > window.innerHeight / 2 || document.querySelector('[role="dialog"]')) return
      if (event.key === 'ArrowRight') go(document.dir === 'rtl' ? -1 : 1)
      if (event.key === 'ArrowLeft') go(document.dir === 'rtl' ? 1 : -1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onMove = (event: MouseEvent) =>
      setOffset({ x: (event.clientX - window.innerWidth / 2) * 0.01, y: (event.clientY - window.innerHeight / 2) * 0.01 })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  if (!slide) return <section className="h-dvh" aria-label="Main visual" />

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Main visual"
      className="relative h-dvh w-full overflow-hidden select-none"
      onPointerDown={(event) => (pointerStart.current = event.clientX)}
      onPointerUp={(event) => {
        if (pointerStart.current === null) return
        const delta = event.clientX - pointerStart.current
        pointerStart.current = null
        if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1)
      }}
    >
      <div className="absolute inset-0 z-0">
        {slide.video?.type === 'file' ? (
          <video
            ref={videoRef}
            key={slide.id}
            poster={slide.poster ?? undefined}
            autoPlay
            muted
            playsInline
            loop={count < 2 || !muted}
            onEnded={() => muted && go(1)}
            className="h-full w-full object-cover brightness-90 contrast-110"
          />
        ) : slide.video?.type === 'youtube' ? (
          <iframe
            key={slide.id}
            title={slide.title}
            src={`https://www.youtube-nocookie.com/embed/${slide.video.id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${slide.video.id}&playsinline=1&rel=0&modestbranding=1`}
            allow="autoplay; encrypted-media"
            className="pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2"
          />
        ) : slide.poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide.poster} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.65)_100%)]" />
      <div className="scanline z-[2]" />

      <div className="absolute inset-x-0 bottom-36 z-10 px-5 text-center md:bottom-40" aria-live="polite">
        <p className="tracking-wide-cjk mb-3 font-mono text-xs tracking-[0.5em] text-cyan uppercase drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)] md:text-sm">
          {slide.title}
          {slide.releaseDate ? <span className="text-white/40">{` // ${slide.releaseDate.slice(0, 10).replaceAll('-', '.')}`}</span> : null}
        </p>
        <h1
          className="bg-gradient-to-b from-white to-white/40 bg-clip-text leading-[0.85] font-black tracking-[-0.04em] text-transparent uppercase drop-shadow-[0_4px_30px_rgba(0,0,0,0.45)]"
          style={{ transform: `translate(${offset.x}px, ${offset.y}px)`, fontSize: headlineSize(slide.headline) }}
        >
          {slide.headline}
        </h1>
        {slide.mvUrl ? (
          <a href={slide.mvUrl} target="_blank" rel="noopener noreferrer" className="btn-line mt-8 pointer-events-auto">
            {labels.watchMv} <ArrowUpRight size={14} aria-hidden />
          </a>
        ) : null}
      </div>

      <div className="absolute inset-x-5 bottom-10 z-10 flex items-center justify-between md:inset-x-10">
        <p className="hud-label hidden items-center gap-2 md:flex">
          <CaretDown size={14} aria-hidden className="animate-bounce" />
          {labels.scrollDown}
        </p>
        <div className="ms-auto flex items-center gap-4 font-mono">
          {slide.video?.type === 'file' ? (
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-pressed={!muted}
              className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[10px] tracking-[0.2em] uppercase transition-colors hover:border-cyan hover:text-cyan"
            >
              {muted ? <SpeakerSlash size={14} aria-hidden /> : <SpeakerHigh size={14} aria-hidden />}
              {muted ? labels.soundOn : labels.soundOff}
            </button>
          ) : null}
          {count > 1 ? (
            <>
              <p className="text-sm tracking-[0.2em]">
                {String(index + 1).padStart(2, '0')} <span className="text-white/30">/ {String(count).padStart(2, '0')}</span>
              </p>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label={labels.prev}
                className="flex h-10 w-10 items-center justify-center border border-line transition-all hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowLeft size={18} aria-hidden className="rtl:rotate-180" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label={labels.next}
                className="flex h-10 w-10 items-center justify-center border border-line transition-all hover:border-white hover:bg-white hover:text-black"
              >
                <ArrowRight size={18} aria-hidden className="rtl:rotate-180" />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </section>
  )
}
