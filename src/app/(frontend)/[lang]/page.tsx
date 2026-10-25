import type { ReactNode } from 'react'

import { HeroSlider, type HeroSlide } from '@/components/home/HeroSlider'
import { ArtistsSection, BusinessSection, NewReleaseSection, PostsSection } from '@/components/home/Sections'
import {
  getArtistCategories,
  getArtists,
  getBoard,
  getBusinessSettings,
  getHomeSettings,
  getHomeSlides,
  getNewReleases,
  getPosts,
  getUiLabels,
} from '@/lib/data'
import { mediaUrl, resolveLocale, streamSource, youtubeId, type LangParams } from '@/lib/page'

// 홈: 화면 전체 영상 슬라이드 + 관리자 화면 "홈 화면 설정" 순서대로 섹션
export default async function HomePage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [labels, settings, slides, business, categories, newsBoard, noticeBoard] = await Promise.all([
    getUiLabels(locale),
    getHomeSettings(),
    getHomeSlides(locale),
    getBusinessSettings(locale),
    getArtistCategories(locale),
    getBoard('news', locale),
    getBoard('notice', locale),
  ])
  const [releases, artists, news, notices] = await Promise.all([
    getNewReleases(locale, 4),
    getArtists(locale, { featured: true, limit: 12, forList: true }),
    newsBoard ? getPosts(locale, { boardId: newsBoard.id, limit: 4 }) : null,
    noticeBoard ? getPosts(locale, { boardId: noticeBoard.id, limit: 3 }) : null,
  ])

  const heroSlides: HeroSlide[] = slides.map((slide) => {
    const artistName = typeof slide.artist === 'object' && slide.artist ? slide.artist.name : ''
    const stream = slide.videoSource === 'stream' ? streamSource(slide.streamId) : null
    const file = slide.videoSource === 'file' ? mediaUrl(slide.videoFile) : (stream?.hls ?? null)
    const yt = slide.videoSource === 'youtube' ? youtubeId(slide.youtubeUrl) : null
    return {
      id: String(slide.id),
      headline: slide.headline || artistName || slide.title,
      title: slide.title,
      releaseDate: slide.releaseDate ?? null,
      video: file ? { type: 'file', src: file } : yt ? { type: 'youtube', id: yt } : null,
      poster: mediaUrl(slide.poster, 'hero') ?? stream?.thumbnail ?? null,
      mvUrl: slide.mvUrl ?? null,
    }
  })

  let n = 0
  const section = (key: string): ReactNode => {
    switch (key) {
      case 'new-release':
        return releases.length ? <NewReleaseSection key={key} index={++n} locale={locale} labels={labels} releases={releases} /> : null
      case 'artists':
        return artists.length ? <ArtistsSection key={key} index={++n} locale={locale} labels={labels} artists={artists} categories={categories} /> : null
      case 'business':
        return <BusinessSection key={key} index={++n} locale={locale} labels={labels} business={business} />
      case 'news':
        return news?.docs.length ? (
          <PostsSection key={key} index={++n} locale={locale} labels={labels} eyebrow="Global feed" title={labels.home.news} posts={news.docs} href="/news" />
        ) : null
      case 'notice':
        return notices?.docs.length ? (
          <PostsSection key={key} index={++n} locale={locale} labels={labels} eyebrow="Priority transmissions" title={labels.home.notice} posts={notices.docs} href="/news/notice" />
        ) : null
      default:
        return null
    }
  }

  return (
    <>
      <HeroSlider
        slides={heroSlides}
        autoAdvanceSeconds={settings.autoAdvanceSeconds ?? 8}
        labels={{
          watchMv: labels.common.watchMv,
          prev: labels.common.prev,
          next: labels.common.next,
          soundOn: labels.common.soundOn,
          soundOff: labels.common.soundOff,
          scrollDown: labels.home.scrollDown,
        }}
      />
      {(settings.sections ?? []).filter((row) => !row.hidden).map((row) => section(row.section))}
    </>
  )
}
