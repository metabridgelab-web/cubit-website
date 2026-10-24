import type { CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'

// JOIN US: 크리에이터 파트너 모집 (/join/creators) · 채용 공고 (/join/careers). 목록에서 끌어서 순서를 바꾼다.
export const Openings: CollectionConfig = {
  slug: 'openings',
  labels: { singular: '모집·채용 공고', plural: '모집·채용 공고' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'status', 'deadline'],
    group: '함께하기',
    description: '모집 분야나 채용 공고를 추가합니다. 지원서는 "문의함"에 "지원" 유형으로 들어옵니다.',
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
        {
          name: 'kind',
          label: '구분',
          type: 'select',
          required: true,
          defaultValue: 'creator',
          options: [
            { label: '크리에이터 파트너 모집', value: 'creator' },
            { label: '채용', value: 'career' },
          ],
          admin: { width: '50%' },
        },
        {
          name: 'status',
          label: '상태',
          type: 'select',
          required: true,
          defaultValue: 'open',
          options: [
            { label: '모집 중', value: 'open' },
            { label: '마감', value: 'closed' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'title', label: '공고 제목 · 모집 분야', type: 'text', required: true, localized: true, admin: { description: '예: Voice Actor · Motion Performer · Composer' } },
    {
      type: 'row',
      fields: [
        { name: 'location', label: '근무 지역', type: 'text', localized: true, admin: { width: '33%', placeholder: 'Seoul · Remote' } },
        { name: 'employment', label: '형태', type: 'text', localized: true, admin: { width: '33%', placeholder: 'Full-time · Freelance' } },
        { name: 'deadline', label: '마감일', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    { name: 'summary', label: '한 줄 소개', type: 'textarea', localized: true },
    { name: 'description', label: '자세한 내용', type: 'richText', localized: true },
    {
      name: 'applyUrl',
      label: '외부 지원 주소 (선택)',
      type: 'text',
      admin: { description: '외부 채용 사이트로 받으려면 주소를 넣으세요. 비우면 이 사이트의 지원 양식으로 받습니다.', placeholder: 'https://' },
    },
  ],
}
