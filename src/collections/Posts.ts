import { slugField, type CollectionConfig } from 'payload'

import { canEditContent, canUpdateContent, publishedOrLoggedIn } from '../access'

// 모든 게시판의 글 (뉴스 · 공지사항 · 이후 추가되는 게시판)
export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: { singular: '게시글', plural: '게시글' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'board', 'category', 'pinned', 'publishedAt', '_status'],
    group: '게시판 관리',
    listSearchableFields: ['title'],
  },
  access: {
    read: publishedOrLoggedIn,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  versions: {
    drafts: { schedulePublish: true },
    maxPerDoc: 100,
  },
  defaultSort: '-publishedAt',
  fields: [
    {
      name: 'title',
      label: '제목',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'board',
          label: '게시판',
          type: 'relationship',
          relationTo: 'boards',
          required: true,
          admin: { width: '50%' },
        },
        {
          name: 'category',
          label: '분류',
          type: 'relationship',
          relationTo: 'post-categories',
          admin: { width: '50%', description: '게시판을 먼저 고르면 그 게시판의 분류만 보입니다.' },
          filterOptions: ({ data }) => (data?.board ? { board: { equals: data.board } } : true),
        },
      ],
    },
    {
      name: 'thumbnail',
      label: '대표 이미지',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      label: '요약',
      type: 'textarea',
      localized: true,
      admin: { description: '목록에 보이는 한두 줄 요약' },
    },
    {
      name: 'content',
      label: '본문',
      type: 'richText',
      localized: true,
    },
    {
      name: 'artists',
      label: '관련 아티스트',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      admin: { description: '고르면 해당 아티스트 상세 페이지의 소식에도 보입니다.' },
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'publishedAt',
      label: '게시일',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'pinned',
      label: '맨 위에 고정',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: '사칭 주의처럼 중요한 글을 목록 맨 위에 고정합니다.' },
    },
  ],
}
