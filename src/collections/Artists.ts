import { slugField, type CollectionConfig, type Where } from 'payload'

import { canEditContent, canUpdateContent, publishedOrLoggedIn } from '../access'
import { sortOrderField, youtubeUrlField } from '../fields'

export const Artists: CollectionConfig = {
  slug: 'artists',
  labels: { singular: '아티스트', plural: '아티스트' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'kind', 'categories', 'featured', '_status', 'updatedAt'],
    group: '아티스트 관리',
    description:
      '사진 · 정보 · 자기소개 · 뮤직비디오를 등록합니다. 그룹은 멤버(개인 아티스트)를 먼저 등록한 뒤 그룹의 "멤버" 칸에서 연결합니다. 영어로 쓰고 저장하면 다른 11개 언어로 자동 번역됩니다.',
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
              name: 'kind',
              label: '유형',
              type: 'radio',
              required: true,
              defaultValue: 'solo',
              options: [
                { label: '개인 (솔로 · 그룹 멤버)', value: 'solo' },
                { label: '그룹', value: 'group' },
              ],
              admin: { layout: 'horizontal' },
            },
            {
              name: 'members',
              label: '멤버',
              type: 'relationship',
              relationTo: 'artists',
              hasMany: true,
              // 개인 아티스트만 고를 수 있다 (그룹 안에 그룹은 넣지 않는다)
              filterOptions: ({ id }): Where => {
                const conditions: Where[] = [{ kind: { equals: 'solo' } }]
                if (id) conditions.push({ id: { not_equals: id } })
                return { and: conditions }
              },
              admin: {
                condition: (_, siblingData) => siblingData?.kind === 'group',
                description: '멤버를 개인 아티스트로 먼저 등록한 뒤 여기서 고릅니다. 끌어서 순서를 바꿀 수 있습니다.',
              },
            },
            {
              name: 'memberOf',
              label: '소속 그룹',
              type: 'join',
              collection: 'artists',
              on: 'members',
              admin: {
                condition: (_, siblingData) => siblingData?.kind !== 'group',
                description: '그룹의 "멤버" 칸에서 연결하면 자동으로 여기에 표시됩니다.',
              },
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
              name: 'genres',
              label: '장르',
              type: 'relationship',
              relationTo: 'artist-genres',
              hasMany: true,
              // 고른 카테고리(예: 가수)에 속한 장르만 보여 준다
              filterOptions: ({ siblingData }) => {
                const categories = ((siblingData as { categories?: unknown[] })?.categories ?? []).map((c) =>
                  typeof c === 'object' && c !== null ? (c as { id: number }).id : c,
                )
                return categories.length ? { category: { in: categories } } : true
              },
              admin: { description: '여러 개 고를 수 있습니다. 장르 목록은 "아티스트 관리 → 장르"에서 추가 · 수정합니다.' },
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
              label: '대표 사진 (목록용)',
              type: 'upload',
              relationTo: 'media',
              required: true,
              admin: { description: '아티스트 목록 · 홈 화면의 카드에 나오는 사진. 세로(3:4) 사진을 추천합니다.' },
            },
            {
              name: 'detailPhoto',
              label: '상세 페이지 사진',
              type: 'upload',
              relationTo: 'media',
              filterOptions: { mimeType: { contains: 'image' } },
              admin: { description: '아티스트를 눌렀을 때 상세 페이지 맨 위에 크게 나오는 사진. 비우면 대표 사진이 나옵니다.' },
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
                {
                  name: 'lyrics',
                  label: '가사',
                  type: 'textarea',
                  admin: {
                    rows: 8,
                    description: '넣으면 영상 아래에 "가사 보기" 버튼이 생깁니다. 가사는 번역하지 않고 모든 언어에서 그대로 보입니다. 빈 줄로 절을 나눕니다.',
                  },
                },
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
    {
      name: 'listAlone',
      label: '그룹과 따로 목록에도 표시',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => siblingData?.kind !== 'group',
        description: '그룹 멤버는 보통 아티스트 목록에 그룹으로만 나옵니다. 체크하면 개인으로도 목록에 나옵니다. (그룹 멤버가 아니면 상관없음)',
      },
    },
    sortOrderField,
  ],
}
