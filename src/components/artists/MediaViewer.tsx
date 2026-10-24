'use client'

import { ArrowLeft, ArrowRight, Play, X } from '@phosphor-icons/react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

export type GalleryImage = { thumb: string; full: string; alt: string }
export type VideoItem = { id: string; youtubeId: string; title: string; date: string }

// 크게 보기 창: 사진 넘겨보기 또는 YouTube 영상 재생. Esc로 닫고 ←/→로 넘긴다.
export function Viewer({ onClose, onPrev, onNext, closeLabel, children }: { onClose: () => void; onPrev?: () => void; onNext?: () => void; closeLabel: string; children: React.ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev?.()
      if (event.key === 'ArrowRight') onNext?.()
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = ''
    }
  }, [onClose, onPrev, onNext])

  // 페이지 맨 위층(body)에 띄워서 상단 바·고정 버튼보다 위에 보이게 한다
  return createPortal(
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 backdrop-blur" onClick={onClose}>
      <button type="button" onClick={onClose} aria-label={closeLabel} className="absolute end-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 hover:bg-white hover:text-black">
        <X size={22} aria-hidden />
      </button>
      {onPrev ? (
        <button type="button" onClick={(e) => (e.stopPropagation(), onPrev())} aria-label="Prev" className="absolute start-4 hidden h-12 w-12 items-center justify-center border border-white/20 hover:bg-white hover:text-black md:flex">
          <ArrowLeft size={20} aria-hidden className="rtl:rotate-180" />
        </button>
      ) : null}
      {onNext ? (
        <button type="button" onClick={(e) => (e.stopPropagation(), onNext())} aria-label="Next" className="absolute end-4 hidden h-12 w-12 items-center justify-center border border-white/20 hover:bg-white hover:text-black md:flex">
          <ArrowRight size={20} aria-hidden className="rtl:rotate-180" />
        </button>
      ) : null}
      <div onClick={(e) => e.stopPropagation()} className="max-h-full w-full max-w-6xl">
        {children}
      </div>
    </div>,
    document.body,
  )
}

// 사진 모음 (design/04 Visuals): 처음엔 6장, "모두 보기"로 전부. 누르면 크게 보기.
export function Gallery({ images, viewAllLabel, closeLabel }: { images: GalleryImage[]; viewAllLabel: string; closeLabel: string }) {
  const [expanded, setExpanded] = useState(false)
  const [open, setOpen] = useState<number | null>(null)
  const close = useCallback(() => setOpen(null), [])
  const shown = expanded ? images : images.slice(0, 6)
  const step = (delta: number) => setOpen((i) => (i === null ? i : (i + delta + images.length) % images.length))

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {shown.map((image, index) => (
          <li key={image.full}>
            <button type="button" onClick={() => setOpen(index)} className="group block aspect-square w-full overflow-hidden rounded-xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image.thumb} alt={image.alt} loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-110 group-hover:grayscale-0" />
            </button>
          </li>
        ))}
      </ul>
      {images.length > 6 && !expanded ? (
        <button type="button" onClick={() => setExpanded(true)} className="mt-6 w-full rounded-xl border border-white/10 py-4 font-mono text-[10px] tracking-widest text-white/50 uppercase transition-all hover:border-white/30 hover:text-white">
          {viewAllLabel} [+{images.length - 6}]
        </button>
      ) : null}
      {open !== null ? (
        <Viewer onClose={close} onPrev={images.length > 1 ? () => step(-1) : undefined} onNext={images.length > 1 ? () => step(1) : undefined} closeLabel={closeLabel}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[open].full} alt={images[open].alt} className="mx-auto max-h-[85vh] w-auto object-contain" />
        </Viewer>
      ) : null}
    </>
  )
}

// 뮤직비디오 카드 (design/04 Discography): 누르면 사이트 안에서 바로 재생
export function VideoGrid({ videos, closeLabel }: { videos: VideoItem[]; closeLabel: string }) {
  const [open, setOpen] = useState<VideoItem | null>(null)
  const close = useCallback(() => setOpen(null), [])
  return (
    <>
      <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <li key={video.id}>
            <button type="button" onClick={() => setOpen(video)} className="group block w-full overflow-hidden rounded-2xl border border-line bg-[#0a0a0a] p-4 text-start transition-all hover:-translate-y-1 hover:border-cyan">
              <span className="relative block aspect-video overflow-hidden rounded-xl bg-[#111]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0" />
                <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                  <Play size={36} weight="fill" aria-hidden />
                </span>
              </span>
              <span className="mt-6 flex items-start justify-between gap-4">
                <span className="text-lg font-bold uppercase">{video.title}</span>
                <span className="shrink-0 font-mono text-[9px] text-cyan">{video.date}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      {open ? (
        <Viewer onClose={close} closeLabel={closeLabel}>
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${open.youtubeId}?autoplay=1&rel=0`}
              title={open.title}
              allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        </Viewer>
      ) : null}
    </>
  )
}
