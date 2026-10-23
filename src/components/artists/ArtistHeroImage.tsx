'use client'

import { useEffect, useRef } from 'react'

// 아티스트 상세 맨 위 사진: 오른쪽 60%를 채우고, 아래로 내리면 천천히 따라 내려온다 (design/04)
export function ArtistHeroImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const onScroll = () => {
      if (ref.current) ref.current.style.transform = `translateY(${window.scrollY * 0.3}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img ref={ref} src={src} alt={alt} fetchPriority="high" className="h-full w-full object-cover contrast-110 grayscale" />
  )
}
