import type { Metadata } from 'next'

import { CampaignBuilder } from '@/components/forms/CampaignBuilder'
import { PageHeader, PageShell } from '@/components/site/Hud'
import { CAMPAIGN_LANGUAGES } from '@/constants/campaign'
import { localePath } from '@/i18n'
import { getArtistCategories, getArtists, getBusinessSettings, getGenres, getSiteSettings, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'
import type { ArtistCategory } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/business/campaign', { title: labels.campaign.title })
}

// 캠페인 빌더 (수익화 핵심). 아티스트 상세의 견적 버튼에서 오면 ?talent=<id>로 미리 선택된다.
export default async function CampaignBuilderPage({ params, searchParams }: { params: Promise<LangParams>; searchParams: Promise<{ talent?: string | string[] }> }) {
  const locale = await resolveLocale(params)
  const [labels, business, artists, settings, categories, search] = await Promise.all([
    getUiLabels(locale),
    getBusinessSettings(locale),
    getArtists(locale),
    getSiteSettings(locale),
    getArtistCategories(locale),
    searchParams,
  ])
  const initial = [search.talent ?? []].flat().map(Number).filter(Boolean)
  // 아티스트 찾기 창의 장르 선택: 카테고리(가수 · 모델 …)마다 그 장르들
  const genreGroups = await Promise.all(
    categories.map(async (category) => ({
      id: category.id,
      name: category.name,
      genres: (await getGenres(category.id, locale)).map((genre) => ({ id: genre.id, name: genre.name })),
    })),
  )

  // 그룹 → 그 멤버들 → 나머지 개인 순서로 보여 준다 (그룹 전체 또는 멤버 한 명만 고를 수 있게)
  type Listed = (typeof artists)[number]
  const byId = new Map(artists.map((a) => [a.id, a]))
  const groupsOf = new Map<number, string[]>()
  for (const group of artists.filter((a) => a.kind === 'group')) {
    for (const m of group.members ?? []) {
      const id = typeof m === 'object' ? m.id : m
      groupsOf.set(id, [...(groupsOf.get(id) ?? []), `${group.name} ${group.searchNames ?? ''}`])
    }
  }
  const ordered: { artist: Listed; group?: string }[] = []
  const placed = new Set<number>()
  for (const group of artists.filter((a) => a.kind === 'group')) {
    ordered.push({ artist: group, group: `${labels.artist.group} · ${String(group.members?.length ?? 0).padStart(2, '0')}` })
    placed.add(group.id)
    for (const m of group.members ?? []) {
      const member = byId.get(typeof m === 'object' ? m.id : m)
      if (member && !placed.has(member.id)) {
        ordered.push({ artist: member, group: `↳ ${group.name}` })
        placed.add(member.id)
      }
    }
  }
  for (const artist of artists) if (!placed.has(artist.id)) ordered.push({ artist })
  const privacy = (settings.policyLinks ?? []).find((page) => typeof page === 'object')

  return (
    <PageShell>
      <PageHeader eyebrow={labels.campaign.eyebrow} title={labels.campaign.title} />
      <CampaignBuilder
        locale={locale}
        talents={ordered.map(({ artist, group }) => {
          const cats = (artist.categories ?? []).filter((c): c is ArtistCategory => typeof c === 'object')
          return {
            id: artist.id,
            name: artist.name,
            photo: mediaUrl(artist.profilePhoto, 'card'),
            thumb: mediaUrl(artist.profilePhoto, 'thumbnail'),
            categories: cats.map((c) => c.name).join(' · '),
            group,
            categoryIds: cats.map((c) => c.id),
            genreIds: (artist.genres ?? []).map((g) => (typeof g === 'object' ? g.id : g)),
            searchNames: artist.searchNames ?? '',
            groupNames: (groupsOf.get(artist.id) ?? []).join(' '),
          }
        })}
        genreGroups={genreGroups}
        initialTalents={initial}
        languages={[...CAMPAIGN_LANGUAGES]}
        labels={{
          campaign: labels.campaign as Record<string, string>,
          forms: labels.forms as Record<string, string>,
          common: labels.common as Record<string, string>,
          artist: labels.artist as Record<string, string>,
        }}
        confirmation={business.confirmationMessage ?? ''}
        privacyHref={privacy && typeof privacy === 'object' ? localePath(locale, `/legal/${privacy.slug}`) : null}
      />
    </PageShell>
  )
}
