import { slugField, type CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'
import { sortOrderField } from '../fields'

// 가수 · 모델 · 배우 · 전문의. 관리자 화면에서 카테고리를 더 추가할 수 있다.
export const ArtistCategories: CollectionConfig = {
  slug: 'artist-categories',
  labels: { singular: '아티스트 카테고리', plural: '아티스트 카테고리' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: '아티스트 관리',
  },
  access: {
    read: anyone,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      label: '카테고리 이름',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'disclaimer',
      label: '상세 페이지 고지문',
      type: 'textarea',
      localized: true,
      admin: {
        description: '이 카테고리 아티스트의 상세 페이지에 항상 표시할 문구. 전문의는 필수입니다.',
      },
    },
    sortOrderField,
  ],
}
