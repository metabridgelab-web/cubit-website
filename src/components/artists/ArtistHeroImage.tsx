'use client'

import { useEffect, useRef } from 'react'

// 아티스트 상세 맨 위 사진: 원본 색 그대로, 아래로 내리면 천천히 따라 내려온다 (design/04).
// 정해진 자리를 꽉 채우고, 넘치는 부분은 잘린다. 관리자 화면에서 사진의 "초점"을 찍어 두면 그 위치가 보이게 맞춘다(focus).
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
    <img ref={ref} src={src} alt={alt} fetchPriority="high" style={{ objectPosition: focus }} className="h-full w-full object-cover" />
  )
}
