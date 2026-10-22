import type { CollectionConfig } from 'payload'

import { canEditContent, hasRole, isLoggedIn } from '../access'

// 번역하면 안 되는 단어 (아티스트 이름, 곡 제목, 회사 이름, 토큰 이름 등). 자동 번역 때 그대로 둔다.
export const Glossary: CollectionConfig = {
  slug: 'glossary',
  labels: { singular: '용어', plural: '용어집' },
  admin: {
    useAsTitle: 'term',
    defaultColumns: ['term', 'note'],
    group: '번역 관리',
    description: '여기 등록한 단어는 자동 번역할 때 바꾸지 않고 그대로 둡니다.',
  },
  access: {
    read: isLoggedIn,
    create: ({ req }) => hasRole(req, 'editor', 'translator'),
    update: ({ req }) => hasRole(req, 'editor', 'translator'),
    delete: canEditContent,
  },
  fields: [
    { name: 'term', label: '단어', type: 'text', required: true, unique: true },
    { name: 'note', label: '메모', type: 'text', admin: { description: '예: 아티스트 이름, 곡 제목' } },
  ],
}
