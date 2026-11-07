import type { Payload, PayloadRequest } from 'payload'

import { matchVideo, parseFeed, videoIdFromUrl, type FeedVideo } from './match'

// 채널의 일반 영상 최신 15개 피드. UULF 목록에는 쇼츠가 들어 있지 않다.
const FEED_URL = 'https://www.youtube.com/feeds/videos.xml?playlist_id=UULFX5DIoR5z5kPRTZD_03KGjw'

export const youtubeWatchUrl = (id: string) => `https://www.youtube.com/watch?v=${id}`

// 아티스트의 뮤직비디오 칸 맨 위에 영상을 넣는다.
// 곡 제목은 번역하지 않으므로 자동 번역을 다시 돌리지 않고, 다른 언어에서는 영어 칸의 제목이 그대로 보인다.
export const addVideoToArtist = async (args: {
  payload: Payload
  artistId: number
  url: string
  song: string
  releaseDate?: string | null
  req?: PayloadRequest
}) => {
  const { payload, artistId, url, song, releaseDate, req } = args
  const artist = await payload.findByID({ collection: 'artists', id: artistId, depth: 0, locale: 'en', draft: true, overrideAccess: true, req })
  if (artist._status === 'draft') throw new Error('이 아티스트에 게시하지 않은 수정 내용이 있어 영상을 넣지 않았습니다. 먼저 게시해 주세요.')
  const id = videoIdFromUrl(url)
  const videos = artist.videos ?? []
  if (videos.some((video) => videoIdFromUrl(video.youtubeUrl) === id)) return
  await payload.update({
    collection: 'artists',
    id: artistId,
    locale: 'en',
    overrideAccess: true,
    context: { translating: true },
    data: { videos: [{ title: song, youtubeUrl: url, releaseDate: releaseDate ?? undefined }, ...videos] },
    req,
  })
}

export const syncChannelVideos = async (payload: Payload) => {
  const response = await fetch(FEED_URL, { cache: 'no-store' })
  if (!response.ok) throw new Error(`YouTube feed ${response.status}`)
  const feed = parseFeed(await response.text())

  const { docs: artists } = await payload.find({
    collection: 'artists',
    depth: 0,
    limit: 0,
    pagination: false,
    locale: 'en',
    overrideAccess: true,
    select: { name: true, searchNames: true, nationality: true, videos: true },
  })
  const { docs: reviews } = await payload.find({
    collection: 'channel-video-reviews',
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: true,
    select: { youtubeId: true },
  })
  const known = new Set([
    ...artists.flatMap((artist) => (artist.videos ?? []).map((video) => videoIdFromUrl(video.youtubeUrl))),
    ...reviews.map((review) => review.youtubeId),
  ])

  const review = (video: FeedVideo, reason: string, song: string, artistId?: number) =>
    payload.create({
      collection: 'channel-video-reviews',
      overrideAccess: true,
      data: {
        youtubeId: video.id,
        youtubeUrl: youtubeWatchUrl(video.id),
        youtubeTitle: video.title,
        publishedAt: video.published || undefined,
        reason,
        status: 'pending',
        songTitle: song || undefined,
        artist: artistId,
      },
    })

  const added: string[] = []
  const toReview: string[] = []
  for (const video of feed) {
    if (known.has(video.id)) continue
    const match = matchVideo(video, artists)
    if ('reason' in match) {
      await review(video, match.reason, match.song, match.artistId)
      toReview.push(video.id)
      continue
    }
    try {
      await addVideoToArtist({ payload, artistId: match.artistId, url: youtubeWatchUrl(video.id), song: match.song, releaseDate: video.published || null })
      added.push(video.id)
    } catch (error) {
      await review(video, error instanceof Error ? error.message : String(error), match.song, match.artistId)
      toReview.push(video.id)
    }
  }
  return { checked: feed.length, added, toReview }
}
