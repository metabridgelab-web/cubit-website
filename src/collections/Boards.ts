import { slugField, type CollectionConfig } from 'payload'

import { anyone, canEditContent, isAdmin } from '../access'
import { sortOrderField } from '../fields'

// 게시판. 뉴스·공지사항으로 시작하고, 관리자 화면에서 새 게시판을 바로 만들 수 있다.
export const Boards: CollectionConfig = {
  slug: 'boards',
  labels: { singular: '게시판', plural: '게시판 목록' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'sortOrder'],
    group: '게시판 관리',
    description: '이름과 영문 주소만 정하면 새 게시판이 만들어집니다.',
  },
  access: {
    read: anyone,
    create: isAdmin,
    update: canEditContent,
    delete: isAdmin,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      label: '게시판 이름',
      type: 'text',
      required: true,
      localized: true,
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'description',
      label: '설명',
      type: 'textarea',
      localized: true,
    },
    sortOrderField,
  ],
}

// 게시판 안의 분류 (예: 뉴스 → 음악 · 캠페인 · 보도자료)
export const PostCategories: CollectionConfig = {
  slug: 'post-categories',
  labels: { singular: '게시판 분류', plural: '게시판 분류' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'board', 'sortOrder'],
    group: '게시판 관리',
  },
  access: {
    read: anyone,
    create: canEditContent,
    update: canEditContent,
    delete: canEditContent,
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      name: 'name',
      label: '분류 이름',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'board',
      label: '게시판',
      type: 'relationship',
      relationTo: 'boards',
      required: true,
    },
    sortOrderField,
  ],
}
