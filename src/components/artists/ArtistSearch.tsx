'use client'

import { MagnifyingGlass, X } from '@phosphor-icons/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'

import type { ArtistSearchEntry } from '@/constants/artists'

import { nameKeys, normalizeName as normalize, rankName as rank, type NameKeys } from './searchMatch'

const MAX_RESULTS = 30

type Labels = { placeholder: string; noResults: string; failed: string; group: string; memberOf: string; clear: string }
type Indexed = ArtistSearchEntry & NameKeys

const index = (entry: ArtistSearchEntry): Indexed => ({
  ...entry,
  ...nameKeys(entry.name, entry.searchNames, `${entry.groups.join(' ')} ${entry.groupSearchNames}`),
})

// 아티스트 이름 검색: 지금 고른 장르와 상관없이 카테고리 안의 모든 사람(그룹 멤버 포함)을 찾는다.
// 목록은 검색란을 처음 누를 때 한 번만 받아 와서, 그 뒤로는 입력하는 대로 바로 결과를 보여 준다.
export function ArtistSearch({ categorySlug, basePath, labels }: { categorySlug: string; basePath: string; labels: Labels }) {
  const router = useRouter()
  const listId = useId()
  const box = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const [entries, setEntries] = useState<Indexed[] | null>(null)
  const [status, setStatus] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')
  const [text, setText] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)

  const load = async () => {
    if (status === 'loading' || status === 'ready') return
    setStatus('loading')
    try {
      const response = await fetch(`/api/artist-search?category=${encodeURIComponent(categorySlug)}`)
      if (!response.ok) throw new Error(String(response.status))
      setEntries(((await response.json()) as ArtistSearchEntry[]).map(index))
      setStatus('ready')
    } catch {
      setStatus('failed')
    }
  }

  const query = normalize(text)
  const results = useMemo(() => {
    if (!query || !entries) return []
    return entries
      .flatMap((entry) => {
        const score = rank(entry, query)
        return score === null ? [] : [{ entry, score }]
      })
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_RESULTS)
      .map(({ entry }) => entry)
  }, [entries, query])

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: PointerEvent) => {
      if (!box.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  const showList = open && query.length > 0
  const hrefOf = (entry: Indexed) => `${basePath}/${entry.slug}`

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false)
      return
    }
    if (!results.length) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setOpen(true)
      const step = event.key === 'ArrowDown' ? 1 : -1
      setActive((current) => (current + step + results.length) % results.length)
    } else if (event.key === 'Enter' && showList && !event.nativeEvent.isComposing) {
      event.preventDefault()
      router.push(hrefOf(results[Math.min(active, results.length - 1)]))
    }
  }

  return (
    <div ref={box} className="relative z-30 w-full sm:max-w-sm">
      <MagnifyingGlass size={16} className="pointer-events-none absolute start-4 top-1/2 -translate-y-1/2 text-white/50" aria-hidden />
      <input
        ref={input}
        type="text"
        inputMode="search"
        role="combobox"
        autoComplete="off"
        aria-label={labels.placeholder}
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && results.length ? `${listId}-${active}` : undefined}
        placeholder={labels.placeholder}
        value={text}
        onFocus={() => {
          setOpen(true)
          void load()
        }}
        onChange={(event) => {
          setText(event.target.value)
          setActive(0)
          setOpen(true)
          void load()
        }}
        onKeyDown={onKeyDown}
        className="w-full rounded-full border border-white/15 bg-black py-2.5 ps-11 pe-10 text-sm text-white transition-colors placeholder:text-white/40 hover:border-white/40 focus:border-cyan focus:outline-none"
      />
      {text ? (
        <button
          type="button"
          aria-label={labels.clear}
          onClick={() => {
            setText('')
            setActive(0)
            input.current?.focus()
          }}
          className="absolute end-3 top-1/2 -translate-y-1/2 p-1 text-white/50 transition-colors hover:text-white"
        >
          <X size={14} aria-hidden />
        </button>
      ) : null}

      {showList ? (
        <div className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[#0a0a0a] shadow-2xl">
          {results.length ? (
            <ul id={listId} role="listbox" aria-label={labels.placeholder} className="max-h-96 overflow-y-auto py-2">
              {results.map((entry, i) => (
                <li key={entry.slug} role="presentation">
                  <Link
                    id={`${listId}-${i}`}
                    role="option"
                    aria-selected={i === active}
                    href={hrefOf(entry)}
                    onClick={() => setOpen(false)}
                    onPointerMove={() => setActive(i)}
                    className={`flex items-center gap-3 px-4 py-2 transition-colors ${i === active ? 'bg-white/10' : ''}`}
                  >
                    {entry.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.photo} alt="" loading="lazy" className="h-12 w-9 shrink-0 rounded object-cover object-top" />
                    ) : (
                      <span className="h-12 w-9 shrink-0 rounded bg-white/5" />
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-white">{entry.name}</span>
                      {entry.isGroup ? (
                        <span className="block truncate font-mono text-[10px] tracking-[0.15em] text-cyan uppercase">{labels.group}</span>
                      ) : entry.groups.length ? (
                        <span className="block truncate text-xs text-white/50">
                          {labels.memberOf} {entry.groups.join(' · ')}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} role="status" className="px-4 py-3 text-sm text-white/50">
              {status === 'failed' ? labels.failed : status === 'ready' ? labels.noResults : '…'}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
