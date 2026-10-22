import { slugField, type CollectionConfig } from 'payload'

import { canEditContent, canUpdateContent, publishedOrLoggedIn } from '../access'
import { sortOrderField, youtubeUrlField } from '../fields'

export const Artists: CollectionConfig = {
  slug: 'artists',
  labels: { singular: '아티스트', plural: '아티스트' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'categories', 'featured', '_status', 'updatedAt'],
    group: '아티스트 관리',
    description: '사진 · 정보 · 자기소개 · 뮤직비디오를 등록합니다. 영어로 쓰고 저장하면 다른 11개 언어로 자동 번역됩니다.',
  },
  access: {
    read: publishedOrLoggedIn,
    create: canEditContent,
    update: canUpdateContent,
    delete: canEditContent,
  },
  versions: { drafts: true, maxPerDoc: 100 },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '기본 정보',
          fields: [
            {
              name: 'name',
              label: '이름',
              type: 'text',
              required: true,
              admin: { description: '이름은 번역하지 않고 모든 언어에서 그대로 보입니다.' },
            },
            {
              name: 'categories',
              label: '카테고리',
              type: 'relationship',
              relationTo: 'artist-categories',
              hasMany: true,
              required: true,
            },
            {
              type: 'row',
              fields: [
                { name: 'birthday', label: '생일', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
                { name: 'debutDate', label: '데뷔일', type: 'date', admin: { width: '33%', date: { pickerAppearance: 'dayOnly' } } },
                { name: 'nationality', label: '국적', type: 'text', localized: true, admin: { width: '33%' } },
              ],
            },
            {
              name: 'extraInfo',
              label: '추가 정보',
              type: 'array',
              admin: { description: '키, 전문 분야, 출연작처럼 카테고리마다 필요한 항목을 자유롭게 추가합니다.' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', label: '항목', type: 'text', required: true, localized: true, admin: { width: '40%' } },
                    { name: 'value', label: '내용', type: 'text', required: true, localized: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              name: 'socials',
              label: '공식 SNS',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      label: '플랫폼',
                      type: 'select',
                      required: true,
                      options: ['YouTube', 'Instagram', 'TikTok', 'X', 'Weibo', 'Facebook', 'Spotify', 'Apple Music', 'Melon', '기타'],
                      admin: { width: '30%' },
                    },
                    { name: 'url', label: '주소', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: '사진',
          fields: [
            {
              name: 'profilePhoto',
              label: '대표 사진',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'gallery',
              label: '사진 모음',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
            },
          ],
        },
        {
          label: '자기소개',
          fields: [
            {
              name: 'intro',
              label: '자기소개',
              type: 'richText',
              localized: true,
            },
          ],
        },
        {
          label: '뮤직비디오',
          fields: [
            {
              name: 'videos',
              label: '뮤직비디오 · 출연 영상',
              type: 'array',
              admin: { description: 'YouTube 주소만 붙여넣으면 됩니다. 위에 있을수록 먼저 보입니다.' },
              fields: [
                { name: 'title', label: '제목', type: 'text', required: true, localized: true },
                youtubeUrlField({ required: true }),
                { name: 'releaseDate', label: '공개일', type: 'date', admin: { date: { pickerAppearance: 'dayOnly' } } },
              ],
            },
          ],
        },
      ],
    },
    slugField({ useAsSlug: 'name' }),
    {
      name: 'featured',
      label: '홈 화면에 노출',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
    sortOrderField,
  ],
}
