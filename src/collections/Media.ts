import type { CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'
import { mediaAdminThumbnail } from '../infrastructure'

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
    adminThumbnail: mediaAdminThumbnail,
    focalPoint: true,
  },
  fields: [
    {
      name: 'alt',
      label: '대체 텍스트',
      type: 'text',
      localized: true,
      // 대부분 아티스트 이름이라 번역할 게 없다. 사진마다 11개 언어 번역을 돌리면 번역 비용만 든다.
      custom: { translate: false },
      admin: {
        description: '사진을 볼 수 없는 사람(화면 낭독기)과 검색엔진을 위한 짧은 설명. 번역하지 않고 영어 칸에 적은 그대로 모든 언어에서 쓰입니다. 예: "AI-01 프로필 사진"',
      },
    },
  ],
}
