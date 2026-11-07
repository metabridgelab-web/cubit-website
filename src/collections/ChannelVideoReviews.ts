import { APIError, type CollectionConfig } from 'payload'

import { canEditContent } from '../access'
import { addVideoToArtist } from '../channelVideos/sync'

// 유튜브 채널의 새 영상 중 자동으로 가수를 정하지 못한 영상. 사람이 가수를 고르고 저장하면 그 가수에 들어간다.
export const ChannelVideoReviews: CollectionConfig = {
  slug: 'channel-video-reviews',
  labels: { singular: '확인할 유튜브 영상', plural: '확인할 유튜브 영상' },
  admin: {
    useAsTitle: 'youtubeTitle',
    defaultColumns: ['youtubeTitle', 'status', 'reason', 'publishedAt'],
    group: '아티스트 관리',
    description: '자동으로 가수를 정하지 못한 새 영상입니다. 가수와 곡 제목을 넣고 저장하면 그 가수에 등록됩니다. 등록하지 않을 영상은 처리 상태를 "등록 안 함"으로 바꿔 주세요.',
  },
  access: {
    read: canEditContent,
    create: () => false,
    update: canEditContent,
    delete: canEditContent,
  },
  hooks: {
    beforeChange: [
      async ({ data, originalDoc, operation, req }) => {
        if (operation !== 'update' || data.status !== 'pending' || !data.artist) return data
        if (!data.songTitle) throw new APIError('곡 제목을 적어 주세요.', 400, undefined, true)
        const artistId = typeof data.artist === 'object' ? data.artist.id : data.artist
        try {
          await addVideoToArtist({
            payload: req.payload,
            artistId,
            url: data.youtubeUrl ?? originalDoc?.youtubeUrl,
            song: data.songTitle,
            releaseDate: data.publishedAt ?? originalDoc?.publishedAt,
            req,
          })
        } catch (error) {
          throw new APIError(error instanceof Error ? error.message : String(error), 400, undefined, true)
        }
        return { ...data, status: 'registered' }
      },
    ],
  },
  fields: [
    { name: 'youtubeTitle', label: '유튜브 제목', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'youtubeUrl', label: '유튜브 주소', type: 'text', required: true, admin: { readOnly: true } },
    { name: 'reason', label: '자동 등록하지 못한 이유', type: 'text', admin: { readOnly: true } },
    { name: 'artist', label: '가수', type: 'relationship', relationTo: 'artists' },
    { name: 'songTitle', label: '곡 제목', type: 'text', admin: { description: '번역 제목 없이 곡 제목만 적어 주세요.' } },
    {
      name: 'status',
      label: '처리 상태',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: '확인 대기', value: 'pending' },
        { label: '등록 완료', value: 'registered' },
        { label: '등록 안 함', value: 'ignored' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'publishedAt', label: '공개일', type: 'date', admin: { position: 'sidebar', readOnly: true, date: { pickerAppearance: 'dayOnly' } } },
    { name: 'youtubeId', label: '영상 번호', type: 'text', required: true, unique: true, admin: { position: 'sidebar', readOnly: true } },
  ],
}
