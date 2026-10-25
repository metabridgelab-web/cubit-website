import type { Metadata } from 'next'

import { CampaignBuilder } from '@/components/forms/CampaignBuilder'
import { PageHeader, PageShell } from '@/components/site/Hud'
import { CAMPAIGN_LANGUAGES } from '@/constants/campaign'
import { localePath } from '@/i18n'
import { getArtists, getBusinessSettings, getSiteSettings, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'
import type { Artist, ArtistCategory } from '@/payload-types'

export async function generateMetadata({ params }: { params: Promise<LangParams> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const labels = await getUiLabels(locale)
  return pageMetadata(locale, '/business/campaign', { title: labels.campaign.title })
}

// 캠페인 빌더 (수익화 핵심). 아티스트 상세의 견적 버튼에서 오면 ?talent=<id>로 미리 선택된다.
export default async function CampaignBuilderPage({ params, searchParams }: { params: Promise<LangParams>; searchParams: Promise<{ talent?: string | string[] }> }) {
  const locale = await resolveLocale(params)
  const [labels, business, artists, settings, search] = await Promise.all([
    getUiLabels(locale),
    getBusinessSettings(locale),
    getArtists(locale),
    getSiteSettings(locale),
    searchParams,
  ])
  const initial = [search.talent ?? []].flat().map(Number).filter(Boolean)

  // 그룹 → 그 멤버들 → 나머지 개인 순서로 보여 준다 (그룹 전체 또는 멤버 한 명만 고를 수 있게)
  const byId = new Map(artists.map((a) => [a.id, a]))
  const ordered: { artist: Artist; group?: string }[] = []
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
        talents={ordered.map(({ artist, group }) => ({
          id: artist.id,
          name: artist.name,
          photo: mediaUrl(artist.profilePhoto, 'card'),
          categories: (artist.categories ?? [])
            .filter((c): c is ArtistCategory => typeof c === 'object')
            .map((c) => c.name)
            .join(' · '),
          group,
        }))}
        initialTalents={initial}
        languages={[...CAMPAIGN_LANGUAGES]}
        labels={{ campaign: labels.campaign as Record<string, string>, forms: labels.forms as Record<string, string>, common: labels.common as Record<string, string> }}
        confirmation={business.confirmationMessage ?? ''}
        privacyHref={privacy && typeof privacy === 'object' ? localePath(locale, `/legal/${privacy.slug}`) : null}
      />
    </PageShell>
  )
}
