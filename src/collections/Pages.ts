import { slugField, type Block, type CollectionConfig } from 'payload'

import { canEditContent, canUpdateContent, publishedOrLoggedIn } from '../access'
import { linkFields, streamIdField, youtubeUrlField } from '../fields'

// 소개 페이지용 블록: 글 · 사진 · 영상 · 연혁 · 오시는 길 · 버튼을 원하는 순서로 쌓는다
const TextBlock: Block = {
  slug: 'text',
  labels: { singular: '글', plural: '글' },
  fields: [
    { name: 'heading', label: '소제목', type: 'text', localized: true },
    { name: 'body', label: '본문', type: 'richText', localized: true },
  ],
}

const ImageBlock: Block = {
  slug: 'image',
  labels: { singular: '사진', plural: '사진' },
  fields: [
    { name: 'images', label: '사진', type: 'upload', relationTo: 'media', hasMany: true, required: true },
    { name: 'caption', label: '설명', type: 'text', localized: true },
  ],
}

const VideoBlock: Block = {
  slug: 'video',
  labels: { singular: '영상', plural: '영상' },
  fields: [
    youtubeUrlField(),
    { ...streamIdField(), label: '또는 Cloudflare Stream 영상 ID' },
    { name: 'file', label: '또는 영상 파일', type: 'upload', relationTo: 'media' },
    { name: 'caption', label: '설명', type: 'text', localized: true },
  ],
}

const TimelineBlock: Block = {
  slug: 'timeline',
  labels: { singular: '연혁', plural: '연혁' },
  fields: [
    {
      name: 'items',
      label: '연혁 항목',
      type: 'array',
      fields: [
        { name: 'year', label: '연도', type: 'text', required: true },
        { name: 'month', label: '월', type: 'text' },
        { name: 'text', label: '내용', type: 'textarea', required: true, localized: true },
      ],
    },
  ],
}

const LocationBlock: Block = {
  slug: 'location',
  labels: { singular: '오시는 길', plural: '오시는 길' },
  fields: [
    {
      name: 'offices',
      label: '사무실',
      type: 'array',
      fields: [
        { name: 'name', label: '이름', type: 'text', required: true, localized: true },
        { name: 'address', label: '주소', type: 'textarea', required: true, localized: true },
        { name: 'phone', label: '전화', type: 'text' },
        { name: 'email', label: '이메일', type: 'email' },
        { name: 'mapUrl', label: '지도 주소 (Google 지도 공유 링크)', type: 'text' },
      ],
    },
  ],
}

const CtaBlock: Block = {
  slug: 'cta',
  labels: { singular: '버튼', plural: '버튼' },
  fields: [{ name: 'text', label: '안내 문구', type: 'text', localized: true }, ...linkFields()],
}

// 회사 소개 · 연혁 · 오시는 길 · 비즈니스 소개처럼 글 위주의 페이지
export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: { singular: '페이지', plural: '페이지' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'slug', '_status', 'updatedAt'],
    group: '페이지 관리',
    description: '글 · 사진 · 영상 블록을 원하는 순서로 쌓아 페이지를 만듭니다.',
  },
  access: {
    read: publishedOrLoggedIn,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  versions: { drafts: true, maxPerDoc: 100 },
  fields: [
    { name: 'title', label: '페이지 제목', type: 'text', required: true, localized: true },
    { name: 'intro', label: '첫 문단', type: 'textarea', localized: true },
    { name: 'heroImage', label: '상단 이미지', type: 'upload', relationTo: 'media' },
    {
      name: 'layout',
      label: '내용 블록',
      type: 'blocks',
      blocks: [TextBlock, ImageBlock, VideoBlock, TimelineBlock, LocationBlock, CtaBlock],
    },
    {
      name: 'section',
      label: '메뉴 섹션',
      type: 'select',
      required: true,
      options: [
        { label: 'COMPANY', value: 'company' },
        { label: 'BUSINESS', value: 'business' },
        { label: 'STUDIO', value: 'studio' },
        { label: 'TRUST', value: 'trust' },
        { label: 'JOIN US', value: 'join' },
        { label: 'INVESTORS', value: 'investors' },
        { label: '정책 (개인정보처리방침 등)', value: 'legal' },
      ],
      admin: { position: 'sidebar' },
    },
    slugField({ useAsSlug: 'title' }),
    {
      name: 'reviewRequired',
      label: '번역 검수 필수 문서',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: '개인정보처리방침 · 위험 고지처럼 법적 문서는 체크하세요. 자동 번역만으로는 게시되지 않습니다.',
      },
    },
  ],
}
