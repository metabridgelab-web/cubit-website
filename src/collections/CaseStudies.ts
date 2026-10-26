import { slugField, type CollectionConfig } from 'payload'

import { canEditContent, hasRole, publishedOrLoggedIn } from '../access'
import { previewButton } from './preview'

// BUSINESS > 작업 사례
export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  labels: { singular: '작업 사례', plural: '작업 사례' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'brandName', 'date', '_status'],
    group: '비즈니스',
    preview: previewButton('case-studies'),
  },
  access: {
    read: publishedOrLoggedIn,
    create: ({ req }) => hasRole(req, 'editor', 'sales'),
    update: ({ req }) => hasRole(req, 'editor', 'translator', 'sales'),
    delete: canEditContent,
  },
  versions: { drafts: true, maxPerDoc: 100 },
  defaultSort: '-date',
  fields: [
    { name: 'title', label: '캠페인 이름', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'brandName', label: '브랜드', type: 'text', required: true, admin: { width: '50%' } },
        { name: 'date', label: '진행 시기', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'monthOnly' } } },
      ],
    },
    { name: 'brandLogo', label: '브랜드 로고', type: 'upload', relationTo: 'media' },
    { name: 'thumbnail', label: '대표 이미지', type: 'upload', relationTo: 'media', required: true },
    { name: 'talents', label: '참여 탤런트', type: 'relationship', relationTo: 'artists', hasMany: true },
    { name: 'summary', label: '요약', type: 'textarea', localized: true },
    { name: 'content', label: '내용', type: 'richText', localized: true },
    { name: 'gallery', label: '결과물 사진·영상', type: 'upload', relationTo: 'media', hasMany: true },
    slugField({ useAsSlug: 'title' }),
  ],
}
