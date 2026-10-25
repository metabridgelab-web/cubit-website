'use client'

import { CaretDown } from '@phosphor-icons/react'
import { useRouter } from 'next/navigation'

// 장르 선택 상자 (예: 가수 → 전체 · K-Pop · Rock …). 고르면 주소에 ?genre=… 를 붙여 목록을 다시 불러온다.
export function GenreSelect({ label, allLabel, basePath, genres, current }: { label: string; allLabel: string; basePath: string; genres: { slug: string; name: string }[]; current: string | null }) {
  const router = useRouter()
  return (
    <label className="relative inline-flex items-center gap-3">
      <span className="font-mono text-[10px] tracking-[0.15em] text-white/50 uppercase">{label}</span>
      <span className="relative">
        <select
          value={current ?? ''}
          onChange={(e) => router.push(e.target.value ? `${basePath}?genre=${encodeURIComponent(e.target.value)}` : basePath, { scroll: false })}
          className="appearance-none rounded-full border border-white/15 bg-black py-2.5 ps-5 pe-11 text-sm text-white transition-colors hover:border-white/40 focus:border-cyan focus:outline-none"
        >
          <option value="">{allLabel}</option>
          {genres.map((genre) => (
            <option key={genre.slug} value={genre.slug}>
              {genre.name}
            </option>
          ))}
        </select>
        <CaretDown size={14} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-white/60" aria-hidden />
      </span>
    </label>
  )
}
