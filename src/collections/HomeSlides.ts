import type { CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'
import { youtubeUrlField } from '../fields'

// 홈 첫 화면의 전체 화면 영상 슬라이드. 목록에서 끌어서 순서를 바꾼다.
export const HomeSlides: CollectionConfig = {
  slug: 'home-slides',
  labels: { singular: '메인 슬라이드', plural: '메인 슬라이드' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'artist', 'videoSource', 'active', 'startAt', 'endAt'],
    group: '홈 관리',
    description: '5~10개를 권장합니다. 목록에서 끌어서 순서를 바꿀 수 있습니다. 직접 올린 영상은 끝까지 재생된 뒤 다음 슬라이드로 넘어갑니다.',
  },
  access: {
    read: anyone,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  orderable: true,
  fields: [
    {
      name: 'title',
      label: '곡 · 작품 제목',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'artist',
          label: '아티스트',
          type: 'relationship',
          relationTo: 'artists',
          admin: { width: '50%' },
        },
        {
          name: 'releaseDate',
          label: '발매일',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'headline',
      label: '큰 글자',
      type: 'text',
      admin: { description: '화면 가운데 크게 보이는 이름. 비우면 아티스트 이름이 나옵니다. 예: 계열사 소개 영상이면 "VIONA"' },
    },
    {
      name: 'videoSource',
      label: '영상 방식',
      type: 'radio',
      required: true,
      defaultValue: 'file',
      options: [
        { label: '짧은 영상 파일 직접 올리기 (추천)', value: 'file' },
        { label: 'YouTube 영상 그대로 넣기', value: 'youtube' },
      ],
    },
    {
      name: 'videoFile',
      label: '하이라이트 영상 (15~30초, mp4)',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: { condition: (_, siblingData) => siblingData?.videoSource === 'file' },
      validate: (value: unknown, { siblingData }: { siblingData: { videoSource?: string } }) =>
        siblingData?.videoSource !== 'file' || Boolean(value) || '영상 파일을 올려 주세요.',
    },
    youtubeUrlField({
      admin: { condition: (_, siblingData) => siblingData?.videoSource === 'youtube' },
    }),
    {
      name: 'poster',
      label: '대표 이미지',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: { description: '영상이 뜨기 전에 먼저 보이는 이미지' },
    },
    {
      name: 'mvUrl',
      label: '[뮤직비디오 보기] 버튼 주소',
      type: 'text',
      admin: { description: '보통 YouTube 전체 영상 주소를 넣습니다.' },
    },
    {
      name: 'active',
      label: '노출',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'startAt',
      label: '노출 시작',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: '비우면 바로 노출' },
    },
    {
      name: 'endAt',
      label: '노출 종료',
      type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' }, description: '비우면 계속 노출' },
    },
  ],
}
