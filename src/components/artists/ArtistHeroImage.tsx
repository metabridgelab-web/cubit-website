'use client'

import { useEffect, useRef } from 'react'

// 아티스트 상세 맨 위 사진: 원본 색 그대로, 아래로 내리면 천천히 따라 내려온다 (design/04).
// 원래 비율 그대로: 컴퓨터에서는 화면 높이에 맞추고(너비는 비율대로), 휴대폰에서는 화면 폭에 맞춘다(높이는 비율대로).
// 컴퓨터에서 아주 넓은 사진이 60%를 넘으면 그때만 잘리며, focus(초점) 위치를 보여 준다.
export function ArtistHeroImage({ src, alt, focus = '50% 50%' }: { src: string; alt: string; focus?: string }) {
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
    <img ref={ref} src={src} alt={alt} fetchPriority="high" style={{ objectPosition: focus }} className="h-auto w-full md:h-full md:w-auto md:max-w-none md:object-cover" />
  )
}
