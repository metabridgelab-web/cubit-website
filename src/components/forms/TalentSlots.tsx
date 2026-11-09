'use client'

import { CaretDown, Check, MagnifyingGlass, Plus, UserPlus, X } from '@phosphor-icons/react'
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from 'react'

import { nameKeys, normalizeName, rankName, type NameKeys } from '@/components/artists/searchMatch'

// 캠페인 빌더 1단계: 아티스트가 수백 명이라 전부 펼쳐 보이는 대신
// 빈 인물 칸(처음 3칸) + "추가" 칸을 보여 주고, 칸을 누르면 이름 · 장르로 찾는 창이 열린다.
// 빈 칸은 거울처럼 소속 아티스트의 실루엣이 2초에 한 명씩 비친다.

// group: 그룹이면 "GROUP · 멤버 수", 멤버면 "↳ 소속 그룹" (목록에서 그룹 바로 뒤에 이어서 보인다)
export type BuilderTalent = {
  id: number
  name: string
  photo: string | null
  thumb: string | null
  categories: string
  group?: string
  categoryIds: number[]
  genreIds: number[]
  searchNames: string
  groupNames: string
}
export type GenreFilterGroup = { id: number; name: string; genres: { id: number; name: string }[] }
export type SlotLabels = {
  slotEmpty: string
  addSlot: string
  changeTalent: string
  removeTalent: string
  pickerTitle: string
  search: string
  noResults: string
  genre: string
  all: string
  close: string
}

export const MIN_SLOTS = 3
const MIRROR_STEP_MS = 2000
const MIRROR_FACES = 12
const ALL = 'all'

// 거울에 비칠 얼굴: 사진 있는 아티스트를 고르게 건너뛰며 최대 12명 (서버 · 브라우저가 같은 결과를 내도록 무작위는 쓰지 않는다)
const pickFaces = (talents: BuilderTalent[]) => {
  const withPhoto = talents.filter((t) => t.thumb)
  if (withPhoto.length <= MIRROR_FACES) return withPhoto.map((t) => t.thumb!)
  const step = withPhoto.length / MIRROR_FACES
  return Array.from({ length: MIRROR_FACES }, (_, i) => withPhoto[Math.floor(i * step)].thumb!)
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const subscribeMotion = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}
// 움직임 줄이기를 켠 방문자에게는 거울 속 얼굴을 바꾸지 않는다
const useReducedMotion = () =>
  useSyncExternalStore(subscribeMotion, () => window.matchMedia(REDUCED_MOTION).matches, () => false)

export function TalentSlots({
  talents,
  slots,
  onChange,
  genreGroups,
  labels,
}: {
  talents: BuilderTalent[]
  slots: (number | null)[]
  onChange: (slots: (number | null)[]) => void
  genreGroups: GenreFilterGroup[]
  labels: SlotLabels
}) {
  const byId = useMemo(() => new Map(talents.map((t) => [t.id, t])), [talents])
  const faces = useMemo(() => pickFaces(talents), [talents])
  const reduced = useReducedMotion()
  const [tick, setTick] = useState(0)
  const [picking, setPicking] = useState<number | null>(null)
  // 찾기 창의 검색어 · 장르는 창을 닫았다 열어도 그대로 둔다
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState(ALL)
  const hasEmpty = slots.some((id) => id === null)

  useEffect(() => {
    if (reduced || !hasEmpty || faces.length < 2) return
    const timer = window.setInterval(() => setTick((t) => t + 1), MIRROR_STEP_MS)
    return () => window.clearInterval(timer)
  }, [reduced, hasEmpty, faces.length])

  const remove = (index: number) => {
    const next = [...slots]
    if (next.length > MIN_SLOTS) next.splice(index, 1)
    else next[index] = null
    onChange(next)
  }
  const pick = (index: number, id: number) => {
    const next = [...slots]
    next[index] = id
    onChange(next)
    setPicking(null)
  }
  const addSlot = () => {
    onChange([...slots, null])
    setPicking(slots.length)
  }
  const taken = new Set(slots.filter((id, i): id is number => id !== null && i !== picking))

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {slots.map((id, index) => {
          const talent = id === null ? undefined : byId.get(id)
          // 빈 칸마다 다른 사람이 비치도록 칸 순서만큼 건너뛴다
          const face = faces.length ? (tick + index * Math.max(1, Math.floor(faces.length / MIN_SLOTS))) % faces.length : -1
          return (
            <li key={index} className="relative">
              {talent ? (
                <button
                  type="button"
                  onClick={() => setPicking(index)}
                  aria-label={`${talent.name} · ${labels.changeTalent}`}
                  className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl border border-cyan bg-[#0a0a0a] text-start shadow-[0_0_20px_rgba(0,243,255,0.15)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {talent.photo ? <img src={talent.photo} alt="" className="h-full w-full object-cover" /> : null}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <span className="block text-xl font-black uppercase">{talent.name}</span>
                    <span className="block font-mono text-[9px] text-cyan uppercase">{talent.group ?? talent.categories}</span>
                    <span className="mt-2 block font-mono text-[9px] tracking-[0.15em] text-white/50 uppercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      {labels.changeTalent}
                    </span>
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPicking(index)}
                  className="mirror-slot group relative block aspect-[3/4] w-full overflow-hidden rounded-xl border border-white/15 bg-[#050505] transition-colors hover:border-cyan focus-visible:border-cyan"
                >
                  <span aria-hidden className="absolute inset-0">
                    {faces.map((src, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={src}
                        src={src}
                        alt=""
                        style={{ transitionDelay: `${index * 250}ms` }}
                        className={`mirror-face absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${i === face ? 'opacity-100' : 'opacity-0'}`}
                      />
                    ))}
                    <span className="mirror-sheen" style={{ animationDelay: `${index * 250}ms` }} />
                  </span>
                  <span className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/25 bg-black/40 text-white/80 backdrop-blur-sm transition-colors group-hover:border-cyan group-hover:text-cyan">
                      <UserPlus size={22} aria-hidden />
                    </span>
                    <span className="px-3 font-mono text-[10px] tracking-[0.15em] text-white/70 uppercase">{labels.slotEmpty}</span>
                  </span>
                </button>
              )}
              {talent || slots.length > MIN_SLOTS ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label={talent ? `${talent.name} · ${labels.removeTalent}` : labels.removeTalent}
                  className="absolute end-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white/80 backdrop-blur-sm transition-colors hover:bg-pink hover:text-black"
                >
                  <X size={14} weight="bold" aria-hidden />
                </button>
              ) : null}
            </li>
          )
        })}
        <li>
          <button
            type="button"
            onClick={addSlot}
            className="group flex aspect-[3/4] w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 text-white/50 transition-colors hover:border-cyan hover:text-cyan"
          >
            <Plus size={36} weight="light" aria-hidden />
            <span className="font-mono text-[10px] tracking-[0.15em] uppercase">{labels.addSlot}</span>
          </button>
        </li>
      </ul>

      {picking !== null ? (
        <TalentPicker
          talents={talents}
          current={slots[picking] ?? null}
          taken={taken}
          genreGroups={genreGroups}
          labels={labels}
          query={query}
          onQuery={setQuery}
          filter={filter}
          onFilter={setFilter}
          onPick={(id) => pick(picking, id)}
          onClose={() => setPicking(null)}
        />
      ) : null}
    </>
  )
}

type Indexed = BuilderTalent & NameKeys

function TalentPicker({
  talents,
  current,
  taken,
  genreGroups,
  labels,
  query,
  onQuery,
  filter,
  onFilter,
  onPick,
  onClose,
}: {
  talents: BuilderTalent[]
  current: number | null
  taken: Set<number>
  genreGroups: GenreFilterGroup[]
  labels: SlotLabels
  query: string
  onQuery: (value: string) => void
  filter: string
  onFilter: (value: string) => void
  onPick: (id: number) => void
  onClose: () => void
}) {
  const titleId = useId()
  const input = useRef<HTMLInputElement>(null)
  const indexed = useMemo<Indexed[]>(() => talents.map((t) => ({ ...t, ...nameKeys(t.name, t.searchNames, t.groupNames) })), [talents])

  const results = useMemo(() => {
    const [kind, raw] = filter.split(':')
    const id = Number(raw)
    const inFilter = indexed.filter((t) => (kind === 'c' ? t.categoryIds.includes(id) : kind === 'g' ? t.genreIds.includes(id) : true))
    const q = normalizeName(query)
    if (!q) return inFilter
    return inFilter
      .flatMap((t) => {
        const score = rankName(t, q)
        return score === null ? [] : [{ t, score }]
      })
      .sort((a, b) => a.score - b.score)
      .map(({ t }) => t)
  }, [indexed, filter, query])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // 휴대폰에서는 자판이 목록을 가리지 않게, 마우스가 있는 화면에서만 검색란에 바로 커서를 둔다
    if (window.matchMedia('(pointer: fine)').matches) input.current?.focus()
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm md:p-8" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="absolute inset-x-0 top-10 bottom-0 flex flex-col overflow-hidden rounded-t-2xl border border-white/15 bg-[#0a0a0a] md:static md:mx-auto md:h-[85vh] md:max-w-5xl md:rounded-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 md:px-8">
          <h3 id={titleId} className="text-xl font-black uppercase md:text-2xl">
            {labels.pickerTitle}
          </h3>
          <button type="button" onClick={onClose} aria-label={labels.close} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white hover:text-white">
            <X size={16} aria-hidden />
          </button>
        </div>

        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center md:px-8">
          <div className="relative flex-1">
            <MagnifyingGlass size={16} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
            <input
              ref={input}
              type="text"
              inputMode="search"
              autoComplete="off"
              aria-label={labels.search}
              placeholder={labels.search}
              value={query}
              onChange={(event) => onQuery(event.target.value)}
              className="w-full rounded-full border border-white/15 bg-black py-2.5 ps-11 pe-10 text-sm text-white transition-colors placeholder:text-white/40 hover:border-white/40 focus:border-cyan focus:outline-none"
            />
            {query ? (
              <button
                type="button"
                aria-label={labels.close}
                onClick={() => {
                  onQuery('')
                  input.current?.focus()
                }}
                className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-white/50 transition-colors hover:text-white"
              >
                <X size={14} aria-hidden />
              </button>
            ) : null}
          </div>
          <label className="flex items-center gap-3">
            <span className="shrink-0 font-mono text-[10px] tracking-[0.15em] text-white/50 uppercase">{labels.genre}</span>
            <span className="relative flex-1 sm:flex-none">
              <select
                value={filter}
                onChange={(event) => onFilter(event.target.value)}
                className="w-full appearance-none rounded-full border border-white/15 bg-black py-2.5 ps-5 pe-11 text-sm text-white transition-colors hover:border-white/40 focus:border-cyan focus:outline-none sm:w-56"
              >
                <option value={ALL}>{labels.all}</option>
                {genreGroups.map((group) => (
                  <optgroup key={group.id} label={group.name}>
                    <option value={`c:${group.id}`}>
                      {group.name} · {labels.all}
                    </option>
                    {group.genres.map((genre) => (
                      <option key={genre.id} value={`g:${genre.id}`}>
                        {genre.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <CaretDown size={14} className="pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-white/60" aria-hidden />
            </span>
          </label>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-8">
          {results.length ? (
            <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
              {results.map((t) => {
                const selected = t.id === current
                const elsewhere = taken.has(t.id)
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      disabled={elsewhere}
                      aria-pressed={selected}
                      onClick={() => (selected ? onClose() : onPick(t.id))}
                      className={`group relative block aspect-[3/4] w-full overflow-hidden rounded-lg border bg-black text-start transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        selected ? 'border-cyan' : 'border-white/10 hover:border-cyan'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {t.thumb ? <img src={t.thumb} alt="" loading="lazy" className="h-full w-full object-cover object-top grayscale transition-all group-hover:grayscale-0" /> : null}
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 to-transparent p-2.5">
                        <span className="block truncate text-sm font-black uppercase">{t.name}</span>
                        <span className="block truncate font-mono text-[8px] text-cyan uppercase">{t.group ?? t.categories}</span>
                      </span>
                      {selected || elsewhere ? (
                        <span className="absolute end-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan text-black">
                          <Check size={12} weight="bold" aria-hidden />
                        </span>
                      ) : null}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p role="status" className="py-10 text-center text-sm text-white/50">
              {labels.noResults}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
