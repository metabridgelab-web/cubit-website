import type { CollectionConfig, Field } from 'payload'

import { anyone, canHandleInbox, inboxFieldAccess, isAdmin } from '../access'
import { LOCALE_OPTIONS } from '../constants/locales'

// 접수함 공통: 처리 상태 · 담당자 · 내부 메모 (방문자는 볼 수도, 넣을 수도 없음)
const handlingFields = (statusOptions: { label: string; value: string }[]): Field[] => [
  {
    name: 'status',
    label: '처리 상태',
    type: 'select',
    defaultValue: statusOptions[0].value,
    options: statusOptions,
    access: { create: inboxFieldAccess, read: inboxFieldAccess, update: inboxFieldAccess },
    admin: { position: 'sidebar' },
  },
  {
    name: 'assignee',
    label: '담당자',
    type: 'relationship',
    relationTo: 'users',
    access: { create: inboxFieldAccess, read: inboxFieldAccess, update: inboxFieldAccess },
    admin: { position: 'sidebar' },
  },
  {
    name: 'internalNotes',
    label: '내부 메모',
    type: 'textarea',
    access: { create: inboxFieldAccess, read: inboxFieldAccess, update: inboxFieldAccess },
    admin: { position: 'sidebar', description: '방문자에게는 보이지 않습니다.' },
  },
]

const contactFields: Field[] = [
  {
    type: 'row',
    fields: [
      { name: 'companyName', label: '회사명', type: 'text', required: true, admin: { width: '50%' } },
      { name: 'contactName', label: '담당자 이름', type: 'text', required: true, admin: { width: '50%' } },
    ],
  },
  {
    type: 'row',
    fields: [
      { name: 'email', label: '이메일', type: 'email', required: true, admin: { width: '50%' } },
      { name: 'phone', label: '연락처', type: 'text', admin: { width: '50%' } },
    ],
  },
  { name: 'message', label: '요청 사항', type: 'textarea' },
  {
    name: 'privacyConsent',
    label: '개인정보 수집·이용 동의',
    type: 'checkbox',
    required: true,
    validate: (value: boolean | null | undefined) => value === true || '개인정보 수집·이용에 동의해야 접수됩니다.',
  },
]

// 캠페인 빌더로 들어오는 견적 요청 (수익화 핵심)
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  labels: { singular: '견적 요청', plural: '견적 요청함' },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['companyName', 'talents', 'usage', 'status', 'assignee', 'createdAt'],
    group: '접수함',
    description: '캠페인 빌더로 들어온 견적 요청입니다. 상태를 바꿔 가며 진행 상황을 관리하세요.',
  },
  access: {
    create: anyone,
    read: canHandleInbox,
    update: canHandleInbox,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'talents',
      label: '선택한 탤런트',
      type: 'relationship',
      relationTo: 'artists',
      hasMany: true,
      required: true,
    },
    {
      name: 'usage',
      label: '용도',
      type: 'select',
      hasMany: true,
      required: true,
      options: [
        { label: '광고', value: 'ads' },
        { label: '영상', value: 'video' },
        { label: 'SNS', value: 'social' },
        { label: '기타', value: 'other' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'periodStart', label: '사용 시작일', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'periodEnd', label: '사용 종료일', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      name: 'worldwide',
      label: '전 세계 사용',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'regions',
      label: '사용 국가',
      type: 'text',
      hasMany: true,
      admin: { condition: (_, siblingData) => !siblingData?.worldwide },
    },
    {
      name: 'languages',
      label: '사용 언어',
      type: 'select',
      hasMany: true,
      options: LOCALE_OPTIONS,
    },
    ...contactFields,
    ...handlingFields([
      { label: '접수', value: 'received' },
      { label: '견적 발송', value: 'quoted' },
      { label: '협의 중', value: 'negotiating' },
      { label: '계약', value: 'contracted' },
      { label: '완료', value: 'done' },
      { label: '취소', value: 'cancelled' },
    ]),
  ],
}

// CONTACT 페이지 문의 (제휴 · 언론 · 투자 · 기타)
export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  labels: { singular: '문의', plural: '문의함' },
  admin: {
    useAsTitle: 'companyName',
    defaultColumns: ['type', 'companyName', 'contactName', 'status', 'createdAt'],
    group: '접수함',
  },
  access: {
    create: anyone,
    read: canHandleInbox,
    update: canHandleInbox,
    delete: isAdmin,
  },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'type',
      label: '문의 유형',
      type: 'select',
      required: true,
      options: [
        { label: '제휴', value: 'partnership' },
        { label: '언론', value: 'press' },
        { label: '투자', value: 'investment' },
        { label: '기타', value: 'other' },
      ],
    },
    ...contactFields,
    ...handlingFields([
      { label: '접수', value: 'received' },
      { label: '처리 중', value: 'in-progress' },
      { label: '완료', value: 'done' },
    ]),
  ],
}
