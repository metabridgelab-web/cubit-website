'use client'

import { useEffect, useRef, type RefObject, type VideoHTMLAttributes } from 'react'

// 영상 주소를 <video>에 연결한다.
// - 일반 파일(mp4): 그대로
// - Cloudflare Stream(.m3u8): hls.js를 그때만 불러와, 처음부터 끝까지 가장 높은 화질(원본 해상도)로 고정해 재생한다.
//   낮은 화질로 시작했다가 올라가는 일이 없다. hls.js를 못 쓰는 오래된 기기만 브라우저 기본 재생(화질 자동 조절)으로 둔다.
export function useVideoSource(ref: RefObject<HTMLVideoElement | null>, src: string | null | undefined) {
  useEffect(() => {
    const video = ref.current
    if (!video || !src) return
    if (!src.includes('.m3u8')) {
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
      const instance = new Hls({ capLevelToPlayerSize: false })
      instance.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        const top = data.levels.reduce((best, level, index, all) => {
          const current = all[best]
          return level.height > current.height || (level.height === current.height && level.bitrate > current.bitrate) ? index : best
        }, 0)
        instance.currentLevel = top
      })
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
