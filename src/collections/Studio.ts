import type { CollectionConfig } from 'payload'

import { anyone, canEditContent, canUpdateContent } from '../access'
import { youtubeUrlField } from '../fields'

const image = { type: 'upload', relationTo: 'media', filterOptions: { mimeType: { contains: 'image' } } } as const

// STUDIO (/studio): 제작 과정 단계 · 전후 비교 · 보유 기술 카드. 목록에서 끌어서 순서를 바꾼다.
export const StudioItems: CollectionConfig = {
  slug: 'studio-items',
  labels: { singular: '스튜디오 항목', plural: '스튜디오' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'hidden', 'updatedAt'],
    group: '스튜디오',
    description: '제작 과정 단계, 작업 전후 비교, 보유 기술을 하나씩 추가합니다. 같은 구분끼리 목록 순서대로 보입니다.',
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
      name: 'kind',
      label: '구분',
      type: 'radio',
      required: true,
      defaultValue: 'process',
      options: [
        { label: '제작 과정 단계 (기획 → 생성·연기 → 검수)', value: 'process' },
        { label: '작업 전후 비교 (사진 두 장을 밀어서 비교)', value: 'comparison' },
        { label: '보유 기술 카드', value: 'technology' },
      ],
    },
    {
      name: 'tag',
      label: '작은 표시 (영문)',
      type: 'text',
      admin: { description: '제목 위에 작게 보이는 장식용 영문 표시. 예: NEURAL_MOCAP · 비우면 표시하지 않습니다.' },
    },
    { name: 'title', label: '제목', type: 'text', required: true, localized: true },
    { name: 'description', label: '설명', type: 'textarea', localized: true },
    {
      ...image,
      name: 'image',
      label: '대표 이미지',
      admin: { condition: (_, siblingData) => siblingData?.kind !== 'comparison' },
    },
    {
      name: 'video',
      label: '영상 파일 (mp4)',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: { condition: (_, siblingData) => siblingData?.kind === 'process', description: '메이킹 · 비하인드 영상. 카드를 누르면 재생됩니다.' },
    },
    youtubeUrlField({ admin: { condition: (_, siblingData) => siblingData?.kind === 'process', description: '영상 파일 대신 YouTube 영상을 쓰려면 주소를 붙여넣으세요.' } }),
    {
      type: 'row',
      admin: { condition: (_, siblingData) => siblingData?.kind === 'comparison' },
      fields: [
        { ...image, name: 'before', label: '작업 전 사진', admin: { width: '50%' } },
        { ...image, name: 'after', label: '작업 후 사진', admin: { width: '50%' } },
      ],
    },
    {
      type: 'row',
      admin: { condition: (_, siblingData) => siblingData?.kind === 'comparison' },
      fields: [
        { name: 'beforeLabel', label: '작업 전 이름표', type: 'text', localized: true, defaultValue: 'Before', admin: { width: '50%' } },
        { name: 'afterLabel', label: '작업 후 이름표', type: 'text', localized: true, defaultValue: 'After', admin: { width: '50%' } },
      ],
    },
    { name: 'hidden', label: '숨기기', type: 'checkbox', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
