import type { CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'
import { streamIdField, youtubeUrlField } from '../fields'

export const FAMILY_KINDS = [
  { label: '레이블', value: 'label' },
  { label: '브랜드', value: 'brand' },
  { label: '계열사', value: 'affiliate' },
] as const

// COMPANY > 브랜드 · 레이블 · 계열사 (/about/family). 목록에서 끌어서 순서를 바꾼다.
export const Family: CollectionConfig = {
  slug: 'family',
  labels: { singular: '레이블·브랜드·계열사', plural: '레이블·브랜드·계열사' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'hidden', 'updatedAt'],
    group: '회사 소개',
    description: '레이블 · 브랜드 · 계열사 카드를 만듭니다. 목록에서 끌어서 순서를 바꿀 수 있습니다.',
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
      type: 'row',
      fields: [
        { name: 'name', label: '이름', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'kind', label: '구분', type: 'select', required: true, defaultValue: 'affiliate', options: [...FAMILY_KINDS], admin: { width: '50%' } },
      ],
    },
    { name: 'logo', label: '로고', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image' } } },
    {
      name: 'tagline',
      label: '사업 분야 (짧게)',
      type: 'text',
      localized: true,
      admin: { description: '카드 아래 작게 보이는 한 줄. 예: Music label · Fashion brand · Distribution partner' },
    },
    { name: 'description', label: '소개', type: 'textarea', localized: true },
    {
      name: 'artists',
      label: '소속 아티스트',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      admin: { description: '레이블이면 소속 아티스트를 고르세요. 카드에 얼굴이 작게 보입니다.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'film',
          label: '소개 영상 파일 (mp4)',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'video' } },
          admin: { width: '50%' },
        },
        {
          name: 'poster',
          label: '영상 대표 이미지',
          type: 'upload',
          relationTo: 'media',
          filterOptions: { mimeType: { contains: 'image' } },
          admin: { width: '50%' },
        },
      ],
    },
    streamIdField({ admin: { description: '영상 파일 대신 Cloudflare Stream 영상을 쓰려면 ID(32자리)를 붙여넣으세요. 고화질 영상에 추천합니다.' } }),
    youtubeUrlField({ admin: { description: '영상 파일 대신 YouTube 영상을 쓰려면 주소를 붙여넣으세요.' } }),
    { name: 'website', label: '공식 사이트 주소', type: 'text', admin: { placeholder: 'https://' } },
    { name: 'hidden', label: '숨기기', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
