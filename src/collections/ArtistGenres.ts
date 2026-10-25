import { slugField, type CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'

// 카테고리 안의 세부 분류 (예: 가수 → K-Pop · Rock · Jazz). 목록에서 끌어서 순서를 바꾼다.
// 아티스트 목록 화면에서 그 카테고리를 볼 때 "장르" 선택 상자로 나온다.
export const ArtistGenres: CollectionConfig = {
  slug: 'artist-genres',
  labels: { singular: '장르', plural: '장르' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'slug'],
    group: '아티스트 관리',
    description: '카테고리 안의 세부 분류입니다. 목록에서 끌어서 순서를 바꿀 수 있고, 아티스트 목록 화면의 "장르" 선택 상자에 이 순서대로 나옵니다.',
  },
  access: {
    read: anyone,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  orderable: true,
  fields: [
    { name: 'name', label: '장르 이름', type: 'text', required: true, localized: true },
    {
      name: 'category',
      label: '카테고리',
      type: 'relationship',
      relationTo: 'artist-categories',
      required: true,
      admin: { description: '어느 카테고리의 장르인지 고릅니다. 보통 "가수".' },
    },
    slugField({ useAsSlug: 'name' }),
  ],
}
