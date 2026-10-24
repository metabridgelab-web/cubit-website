'use client'

import { useEffect, useRef, type RefObject, type VideoHTMLAttributes } from 'react'

// 영상 주소를 <video>에 연결한다.
// - 일반 파일(mp4): 그대로
// - Cloudflare Stream(.m3u8, 화면 크기 · 인터넷 속도에 맞춰 화질이 바뀌는 방식): Safari는 그대로 재생,
//   다른 브라우저는 hls.js를 그때만 불러와 재생한다.
export function useVideoSource(ref: RefObject<HTMLVideoElement | null>, src: string | null | undefined) {
  useEffect(() => {
    const video = ref.current
    if (!video || !src) return
    if (!src.includes('.m3u8') || video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      return
    }
    let destroyed = false
    let hls: { destroy: () => void } | null = null
    import('hls.js').then(({ default: Hls }) => {
      if (destroyed) return
      if (!Hls.isSupported()) {
        video.src = src
        return
      }
      const instance = new Hls({ capLevelToPlayerSize: true })
      instance.loadSource(src)
      instance.attachMedia(video)
      hls = instance
    })
    return () => {
      destroyed = true
      hls?.destroy()
    }
  }, [ref, src])
}

// 서버 화면(페이지 블록 등)에서 쓰는 영상 태그. 주소 종류와 상관없이 같은 모양으로 쓴다.
export function SmartVideo({ src, ...props }: Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src'> & { src: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useVideoSource(ref, src)
  return <video ref={ref} {...props} />
}
