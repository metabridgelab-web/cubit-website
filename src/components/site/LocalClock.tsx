'use client'

import { useEffect, useState } from 'react'

// 방문자 컴퓨터의 현재 시각 (HUD 장식). 서버 화면과 어긋나지 않게 화면에 그린 뒤부터 보여준다.
export function LocalClock({ className }: { className?: string }) {
  const [time, setTime] = useState('--:--:--')
  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-GB'))
    tick()
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [])
  return (
    <time suppressHydrationWarning className={className}>
      {time}
    </time>
  )
}
