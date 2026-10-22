import Link from 'next/link'

import { localePath } from '@/i18n'
import {
  getArtists,
  getBoard,
  getBusinessSettings,
  getHomeSettings,
  getHomeSlides,
  getNewReleases,
  getPosts,
  getUiLabels,
} from '@/lib/data'
import { mediaUrl, resolveLocale, type LangParams } from '@/lib/page'

// 홈. 디자인 적용 전 임시 뼈대: 데이터가 제대로 나오는지 확인하는 용도.
export default async function HomePage({ params }: { params: Promise<LangParams> }) {
  const locale = await resolveLocale(params)
  const [labels, settings, slides, business, newsBoard, noticeBoard] = await Promise.all([
    getUiLabels(locale),
    getHomeSettings(),
    getHomeSlides(locale),
    getBusinessSettings(locale),
    getBoard('news', locale),
    getBoard('notice', locale),
  ])
  const [releases, artists, news, notices] = await Promise.all([
    getNewReleases(locale, 4),
    getArtists(locale, { featured: true, limit: 12 }),
    newsBoard ? getPosts(locale, { boardId: newsBoard.id, limit: 4 }) : null,
    noticeBoard ? getPosts(locale, { boardId: noticeBoard.id, limit: 3 }) : null,
  ])

  const sections: Record<string, React.ReactNode> = {
    'new-release': (
      <section key="new-release">
        <h2>{labels.home.newRelease}</h2>
        <ul>
          {releases.map((video) => (
            <li key={video.id}>
              {video.artist.name} — {video.title} ({video.releaseDate?.slice(0, 10)}){' '}
              <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                {labels.common.watchMv}
              </a>
            </li>
          ))}
        </ul>
      </section>
    ),
    artists: (
      <section key="artists">
        <h2>{labels.home.artists}</h2>
        <ul>
          {artists.map((artist) => {
            const category = artist.categories?.[0]
            const slug = typeof category === 'object' ? category.slug : ''
            return (
              <li key={artist.id}>
                <Link href={localePath(locale, `/artists/${slug}/${artist.slug}`)}>{artist.name}</Link>
              </li>
            )
          })}
        </ul>
        <Link href={localePath(locale, '/artists')}>{labels.common.viewAll}</Link>
      </section>
    ),
    business: (
      <section key="business">
        <p>{business.eyebrow}</p>
        <h2>{business.headline}</h2>
        <ol>
          {(business.services ?? []).map((service) => (
            <li key={service.id}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </li>
          ))}
        </ol>
        <Link href={localePath(locale, '/business/campaign')}>{business.builderCtaLabel}</Link>
        <ul>
          {(business.brands ?? []).map((brand) => {
            const logo = mediaUrl(brand.logo, 'thumbnail')
            return <li key={brand.id}>{logo ? <img src={logo} alt={brand.name} /> : brand.name}</li>
          })}
        </ul>
        <Link href={localePath(locale, '/business/works')}>{labels.common.viewAll}</Link>
      </section>
    ),
    news: (
      <section key="news">
        <h2>{labels.home.news}</h2>
        <ul>
          {(news?.docs ?? []).map((post) => (
            <li key={post.id}>
              <Link href={localePath(locale, `/news/article/${post.slug}`)}>{post.title}</Link> {post.publishedAt?.slice(0, 10)}
            </li>
          ))}
        </ul>
        <Link href={localePath(locale, '/news')}>{labels.common.viewAll}</Link>
      </section>
    ),
    notice: (
      <section key="notice">
        <h2>{labels.home.notice}</h2>
        <ul>
          {(notices?.docs ?? []).map((post) => (
            <li key={post.id}>
              {post.pinned ? '* ' : ''}
              <Link href={localePath(locale, `/news/article/${post.slug}`)}>{post.title}</Link>
            </li>
          ))}
        </ul>
      </section>
    ),
  }

  return (
    <>
      <section aria-label="Main visual">
        <ol>
          {slides.map((slide) => (
            <li key={slide.id}>
              <strong>{typeof slide.artist === 'object' && slide.artist ? slide.artist.name : ''}</strong> — {slide.title}{' '}
              {slide.releaseDate?.slice(0, 10)} ({slide.videoSource === 'file' ? mediaUrl(slide.videoFile) : slide.youtubeUrl})
              {slide.mvUrl ? (
                <>
                  {' '}
                  <a href={slide.mvUrl} target="_blank" rel="noopener noreferrer">
                    {labels.common.watchMv}
                  </a>
                </>
              ) : null}
            </li>
          ))}
        </ol>
        <p>
          {labels.common.next}: {settings.autoAdvanceSeconds}s
        </p>
      </section>
      {(settings.sections ?? []).filter((row) => !row.hidden).map((row) => sections[row.section])}
    </>
  )
}
