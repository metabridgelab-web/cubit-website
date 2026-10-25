import type { CollectionConfig } from 'payload'

import { anyone, canHandleInbox, isAdmin } from '../access'
import { ATTACHMENTS_PER_HOUR, guardSubmission, ipHashField } from '../inbox'

// 문의 양식에 방문자가 첨부한 파일. 담당자(영업·최고 관리자)만 열어볼 수 있고 사이트에는 보이지 않는다.
export const Attachments: CollectionConfig = {
  slug: 'attachments',
  labels: { singular: '첨부 파일', plural: '문의 첨부 파일' },
  admin: { group: '접수함', description: '문의 양식으로 받은 파일입니다. 담당자만 열어볼 수 있습니다.' },
  access: {
    create: anyone,
    read: canHandleInbox,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [guardSubmission('attachments', { maxPerHour: ATTACHMENTS_PER_HOUR })],
  },
  upload: {
    mimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'video/mp4', 'video/quicktime'],
  },
  fields: [ipHashField],
}
