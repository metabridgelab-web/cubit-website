import type { CollectionConfig } from 'payload'

import { hasRole, isAdmin, ROLES } from '../access'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: '관리자 계정', plural: '관리자 계정' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'roles'],
    group: '설정',
  },
  auth: true,
  access: {
    // 최고 관리자는 모든 계정을, 나머지는 자기 계정만 본다
    read: ({ req }) => {
      if (!req.user) return false
      if (hasRole(req)) return true
      return { id: { equals: req.user.id } }
    },
    create: isAdmin,
    update: ({ req }) => {
      if (!req.user) return false
      if (hasRole(req)) return true
      return { id: { equals: req.user.id } }
    },
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      // 처음 만드는 계정은 항상 최고 관리자가 된다
      async ({ data, operation, req }) => {
        if (operation !== 'create') return data
        const { totalDocs } = await req.payload.count({ collection: 'users', req })
        if (totalDocs === 0) data.roles = ['admin']
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      label: '이름',
      type: 'text',
      required: true,
    },
    {
      name: 'roles',
      label: '역할',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['editor'],
      options: [...ROLES],
      saveToJWT: true,
      access: {
        // 역할은 최고 관리자만 바꿀 수 있다
        create: ({ req }) => hasRole(req),
        update: ({ req }) => hasRole(req),
      },
      admin: {
        // 첫 계정 만들기 화면에서는 숨긴다 (첫 계정은 자동으로 최고 관리자)
        condition: (_data, _siblingData, { user }) => Boolean(user),
        description:
          '최고 관리자: 모든 기능 · 편집자: 콘텐츠 관리 · 번역 검수자: 번역 수정 · 영업 담당자: 견적 요청·문의 · 공시 담당자: 투자자 정보',
      },
    },
  ],
}
