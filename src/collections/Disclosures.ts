import type { CollectionConfig } from 'payload'

import { hasRole, publishedOrLoggedIn } from '../access'

export const DISCLOSURE_CATEGORIES = [
  { label: '발행', value: 'issuance' },
  { label: '배분', value: 'allocation' },
  { label: '락업 해제', value: 'unlock' },
  { label: '파트너십', value: 'partnership' },
  { label: '기타', value: 'other' },
] as const

// INVESTORS > 공시 (/investors/disclosure). 날짜별 기록이며, 고친 적이 있으면 "수정일"이 함께 보인다.
export const Disclosures: CollectionConfig = {
  slug: 'disclosures',
  labels: { singular: '공시', plural: '공시' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', '_status'],
    group: '투자자 정보',
    description: '토큰 발행 · 배분 · 락업 해제 · 파트너십 공지를 날짜별로 남깁니다. 지우지 말고 고쳐 주세요 (수정 이력이 남습니다).',
  },
  access: {
    read: publishedOrLoggedIn,
    create: ({ req }) => hasRole(req, 'disclosure'),
    update: ({ req }) => hasRole(req, 'disclosure', 'translator'),
    delete: ({ req }) => hasRole(req),
  },
  versions: { drafts: true, maxPerDoc: 0 },
  defaultSort: '-date',
  fields: [
    { name: 'title', label: '제목', type: 'text', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'date', label: '공시일', type: 'date', required: true, defaultValue: () => new Date().toISOString(), admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'category', label: '분류', type: 'select', required: true, defaultValue: 'other', options: [...DISCLOSURE_CATEGORIES], admin: { width: '50%' } },
      ],
    },
    { name: 'body', label: '내용', type: 'richText', localized: true },
    { name: 'file', label: '첨부 문서 (PDF)', type: 'upload', relationTo: 'media', filterOptions: { mimeType: { equals: 'application/pdf' } } },
  ],
}
