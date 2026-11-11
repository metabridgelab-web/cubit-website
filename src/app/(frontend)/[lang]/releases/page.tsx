import type { Metadata } from 'next'
import Link from 'next/link'

import { normalizeName } from '@/components/artists/searchMatch'
import { ReleaseSearch } from '@/components/home/ReleaseSearch'
import { ReleaseCard } from '@/components/home/Sections'
import { PageHeader, PageShell } from '@/components/site/Hud'
import { localePath } from '@/i18n'
import { getNewReleases, getUiLabels } from '@/lib/data'
import { pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

const PER_PAGE = 32

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/releases', { title: labels.home.newRelease })
}

// /releases = 발매된 뮤직비디오 전체 (홈 "신규 발매"의 전체 보기). 공개일 최신순, 한 쪽에 32개.
// ?q= 로 가수 이름(검색용 한글 이름 포함) · 곡 제목을 찾는다. 대소문자 · 띄어쓰기 · 악센트는 무시하고, 한글은 입력 중인 글자도 걸린다.
export default async function ReleasesPage({ params, searchParams }: { params: Promise<LangParams>; searchParams: Promise<{ page?: string; q?: string }> }) {
  const locale = await resolveLocale(params)
  const [labels, all, search] = await Promise.all([getUiLabels(locale), getNewReleases(locale, 0), searchParams])
  const q = (search.q ?? '').trim().slice(0, 100)
  const key = normalizeName(q)
  const found = key
    ? all.filter((video) => [video.artist.name, video.artist.searchNames ?? '', video.title].some((text) => normalizeName(text).includes(key)))
    : all
  const totalPages = Math.max(1, Math.ceil(found.length / PER_PAGE))
  const page = Math.min(totalPages, Math.max(1, Number(search.page) || 1))
  const videos = found.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const href = (n: number) => {
    const query = new URLSearchParams({ ...(q ? { q } : {}), ...(n > 1 ? { page: String(n) } : {}) }).toString()
    return localePath(locale, `/releases${query ? `?${query}` : ''}`)
  }

  return (
    <PageShell>
      <PageHeader eyebrow="Latest transmissions" title={labels.home.newRelease} aside={<p className="hud-label">{String(found.length).padStart(3, '0')} {labels.artist.entries}</p>} />
      <ReleaseSearch initial={q} placeholder={labels.home.releaseSearch} clearLabel={labels.common.close} />
      {videos.length ? (
        <ul className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <li key={video.id}>
              <ReleaseCard video={video} />
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="hud-label py-24 text-center">
          {q ? labels.artist.searchNoResults : labels.common.empty}
        </p>
      )}

      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="mt-16 flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <Link
              key={n}
              href={href(n)}
              aria-current={n === page ? 'page' : undefined}
              className={`flex h-10 w-10 items-center justify-center rounded-full border ${n === page ? 'border-cyan bg-cyan font-bold text-black' : 'border-line text-white/60 hover:border-white'}`}
            >
              {String(n).padStart(2, '0')}
            </Link>
          ))}
        </nav>
      ) : null}
    </PageShell>
  )
}
