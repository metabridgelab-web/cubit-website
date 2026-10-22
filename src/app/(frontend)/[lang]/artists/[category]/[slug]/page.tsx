import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { localePath } from '@/i18n'
import { getArtist, getPosts, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, youtubeId, type LangParams } from '@/lib/page'

type Params = LangParams & { category: string; slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { category, slug } = await params
  const artist = await getArtist(slug, locale)
  return pageMetadata(locale, `/artists/${category}/${slug}`, { title: artist?.name })
}

// 아티스트 상세: 사진 · 정보 · 자기소개 · 뮤직비디오 · 캠페인 견적 버튼. 디자인 적용 전 임시 모양.
export default async function ArtistPage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const [artist, labels] = await Promise.all([getArtist(slug, locale), getUiLabels(locale)])
  if (!artist) notFound()
  const news = await getPosts(locale, { artistId: artist.id, limit: 6 })
  const photo = mediaUrl(artist.profilePhoto, 'large')
  const disclaimers = (artist.categories ?? []).flatMap((c) => (typeof c === 'object' && c.disclaimer ? [c.disclaimer] : []))

  return (
    <article>
      <h1>{artist.name}</h1>
      {photo ? <img src={photo} alt={artist.name} width={480} /> : null}

      {disclaimers.map((text) => (
        <p key={text} role="note">
          {text}
        </p>
      ))}

      <section>
        <h2>{labels.artist.profile}</h2>
        <dl>
          {artist.birthday ? (
            <>
              <dt>{labels.artist.birthday}</dt>
              <dd>{artist.birthday.slice(0, 10)}</dd>
            </>
          ) : null}
          {artist.debutDate ? (
            <>
              <dt>{labels.artist.debut}</dt>
              <dd>{artist.debutDate.slice(0, 10)}</dd>
            </>
          ) : null}
          {artist.nationality ? (
            <>
              <dt>{labels.artist.nationality}</dt>
              <dd>{artist.nationality}</dd>
            </>
          ) : null}
          {(artist.extraInfo ?? []).map((row) => (
            <div key={row.id}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        <ul>
          {(artist.socials ?? []).map((social) => (
            <li key={social.id}>
              <a href={social.url} target="_blank" rel="noopener noreferrer">
                {social.platform}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {artist.intro ? (
        <section>
          <h2>{labels.artist.introduction}</h2>
          <RichText data={artist.intro} />
        </section>
      ) : null}

      {artist.gallery?.length ? (
        <section>
          <h2>{labels.artist.gallery}</h2>
          {artist.gallery.map((image, index) => {
            const src = mediaUrl(image, 'card')
            return src ? <img key={index} src={src} alt={artist.name} width={240} loading="lazy" /> : null
          })}
        </section>
      ) : null}

      {artist.videos?.length ? (
        <section>
          <h2>{labels.artist.musicVideos}</h2>
          {artist.videos.map((video) => {
            const id = youtubeId(video.youtubeUrl)
            return (
              <figure key={video.id}>
                {id ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title={video.title}
                    loading="lazy"
                    allow="accelerometer; autoplay; encrypted-media; picture-in-picture"
                    allowFullScreen
                  />
                ) : null}
                <figcaption>
                  {video.title} {video.releaseDate?.slice(0, 10)}
                </figcaption>
              </figure>
            )
          })}
        </section>
      ) : null}

      {news.docs.length ? (
        <section>
          <h2>{labels.artist.relatedNews}</h2>
          <ul>
            {news.docs.map((post) => (
              <li key={post.id}>
                <Link href={localePath(locale, `/news/article/${post.slug}`)}>{post.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <Link href={localePath(locale, `/business/campaign?talent=${artist.id}`)}>{labels.artist.quoteWithArtist}</Link>
    </article>
  )
}
