import type { CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: '미디어', plural: '미디어 보관함' },
  admin: {
    group: '미디어',
    description: '사진·영상·PDF를 끌어다 놓으면 올라갑니다. 사진은 화면 크기별로 자동으로 줄여 저장됩니다.',
  },
  access: {
    read: anyone,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  folders: true,
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm', 'application/pdf'],
    // 원본은 그대로 두고, 화면 크기별 사진을 자동으로 만든다
    imageSizes: [
      { name: 'thumbnail', width: 400 },
      { name: 'card', width: 800 },
      { name: 'large', width: 1600 },
      { name: 'hero', width: 2560 },
    ],
    adminThumbnail: 'thumbnail',
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      label: '대체 텍스트',
      type: 'text',
      localized: true,
      admin: {
        description: '사진을 볼 수 없는 사람(화면 낭독기)과 검색엔진을 위한 짧은 설명. 예: "AI-01 프로필 사진"',
      },
    },
  ],
}
