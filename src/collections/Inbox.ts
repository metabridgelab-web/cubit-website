import type { CollectionConfig, Field } from 'payload'

import { anyone, canHandleInbox, inboxFieldAccess, isAdmin } from '../access'
import { CAMPAIGN_LANGUAGES, CAMPAIGN_REGIONS, CAMPAIGN_USAGES } from '../constants/campaign'
import { guardSubmission, queueNotification, submissionFields } from '../inbox'

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
  { name: 'message', label: '요청 사항', type: 'textarea', maxLength: 5000 },
  {
    name: 'privacyConsent',
    label: '개인정보 수집·이용 동의',
    type: 'checkbox',
    required: true,
    validate: (value: boolean | null | undefined) => value === true || '개인정보 수집·이용에 동의해야 접수됩니다.',
  },
]

const PERSONAL_TYPES = ['report', 'application']

// 캠페인 빌더로 들어오는 견적 요청 (수익화 핵심)
export const QuoteRequests: CollectionConfig = {
  slug: 'quote-requests',
  hooks: {
    beforeChange: [guardSubmission('quote-requests')],
    afterChange: [queueNotification('quote-requests')],
  },
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
      options: [...CAMPAIGN_USAGES],
    },
    {
      type: 'row',
      fields: [
        { name: 'periodStart', label: '사용 시작일', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
        { name: 'periodEnd', label: '사용 종료일', type: 'date', admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } } },
      ],
    },
    {
      name: 'regions',
      label: '사용 지역',
      type: 'select',
      hasMany: true,
      options: [...CAMPAIGN_REGIONS],
    },
    {
      name: 'regionsOther',
      label: '기타 국가 (직접 입력)',
      type: 'text',
      hasMany: true,
      maxRows: 50,
    },
    {
      name: 'languages',
      label: '사용 언어',
      type: 'select',
      hasMany: true,
      options: [...CAMPAIGN_LANGUAGES],
    },
    ...contactFields,
    ...submissionFields,
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
  hooks: {
    beforeChange: [guardSubmission('inquiries')],
    afterChange: [queueNotification('inquiries')],
  },
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
        { label: '사칭 신고', value: 'report' },
        { label: '지원 (JOIN US)', value: 'application' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'companyName',
          label: '회사명',
          type: 'text',
          // 개인이 보내는 사칭 신고 · 지원서는 회사명이 없어도 된다
          validate: (value: string | null | undefined, { siblingData }: { siblingData: { type?: string } }) =>
            PERSONAL_TYPES.includes(siblingData?.type ?? '') || Boolean(value?.trim()) || '회사명을 입력해 주세요.',
          admin: { width: '50%', description: '사칭 신고 · 지원서는 비어 있을 수 있습니다.' },
        },
        { name: 'contactName', label: '이름', type: 'text', required: true, admin: { width: '50%' } },
      ],
    },
    ...contactFields.slice(1),
    {
      name: 'position',
      label: '지원 분야',
      type: 'text',
      admin: { condition: (data) => data?.type === 'application' },
    },
    {
      name: 'reportedUrl',
      label: '신고 대상 (계정 · 게시물 · 토큰 주소)',
      type: 'text',
      maxLength: 2000,
      admin: { condition: (data) => data?.type === 'report' },
    },
    {
      name: 'attachments',
      label: '첨부 파일',
      type: 'upload',
      relationTo: 'attachments',
      hasMany: true,
      maxRows: 5,
    },
    ...submissionFields,
    ...handlingFields([
      { label: '접수', value: 'received' },
      { label: '처리 중', value: 'in-progress' },
      { label: '완료', value: 'done' },
    ]),
  ],
}
