import type { ReactNode } from 'react'

import { LocalClock } from './LocalClock'

// 하위 페이지 공통 부품 (design/03~09에서 반복되는 모양)

// 페이지 맨 위: 작은 HUD 라벨 + 큰 무지개빛 제목 + 오른쪽 현재 시각
export function PageHeader({ eyebrow, title, aside }: { eyebrow: string; title: string; aside?: ReactNode }) {
  return (
    <div className="mb-12 flex flex-wrap items-start justify-between gap-6 md:mb-16">
      <div className="min-w-0">
        <p className="hud-label mb-2 text-cyan!">{eyebrow}</p>
        <h1 className="bg-gradient-to-b from-white to-white/40 bg-clip-text text-[clamp(2.75rem,8vw,4rem)] leading-none font-black tracking-[-0.04em] break-words text-transparent uppercase">
          {title}
        </h1>
      </div>
      <div className="space-y-1 text-end font-mono text-[9px] text-white/40 uppercase">
        <p>
          LOCAL_TIME: <LocalClock className="text-white" />
        </p>
        {aside}
      </div>
    </div>
  )
}

// 섹션 제목: 왼쪽 시안 세로줄 + 작은 HUD 태그 + 굵은 제목
export function HudHeading({ tag, title, aside, size = 'md' }: { tag: string; title: string; aside?: ReactNode; size?: 'md' | 'lg' }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-s-2 border-cyan ps-4">
      <div>
        <p className="font-mono text-[9px] tracking-[0.1em] text-cyan uppercase">{tag}</p>
        <h2 className={`mt-2 font-black tracking-tight uppercase ${size === 'lg' ? 'text-3xl' : 'text-2xl'}`}>{title}</h2>
      </div>
      {aside}
    </div>
  )
}

// 고정 헤더 아래로 본문을 내린 하위 페이지 바탕
export function PageShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-[1600px] px-5 pt-28 pb-32 md:px-16 md:pt-36">{children}</div>
}
