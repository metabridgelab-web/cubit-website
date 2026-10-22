import type { Field, GlobalConfig } from 'payload'

import { anyone, canUpdateContent, hasRole, isAdmin } from '../access'
import { DEFAULT_LOCALE, LOCALE_OPTIONS } from '../constants/locales'
import { linkFields } from '../fields'

const contentAccess = { read: anyone, update: canUpdateContent }

// 사이트 설정: 로고 · 회사 정보 · SNS · 하단 문구 · 사용 언어
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: '사이트 설정',
  admin: { group: '설정' },
  access: { read: anyone, update: isAdmin },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '기본',
          fields: [
            { name: 'siteName', label: '사이트 이름', type: 'text', required: true, defaultValue: 'CUBIT ENTERTAINMENT' },
            { name: 'logo', label: '로고', type: 'upload', relationTo: 'media' },
            { name: 'logoDark', label: '로고 (어두운 배경용)', type: 'upload', relationTo: 'media' },
            {
              name: 'enabledLocales',
              label: '사용하는 언어',
              type: 'select',
              hasMany: true,
              options: LOCALE_OPTIONS,
              defaultValue: LOCALE_OPTIONS.map((option) => option.value),
              admin: { description: '체크를 끈 언어는 사이트에서 숨겨지고 자동 번역도 하지 않습니다. 영어는 끌 수 없습니다.' },
              validate: (value: string[] | null | undefined) =>
                (value ?? []).includes(DEFAULT_LOCALE) || '영어는 기본 언어라서 끌 수 없습니다.',
            },
          ],
        },
        {
          label: '회사 정보',
          fields: [
            { name: 'companyName', label: '회사명', type: 'text', localized: true },
            { name: 'ceo', label: '대표', type: 'text', localized: true },
            { name: 'address', label: '주소', type: 'textarea', localized: true },
            { name: 'businessNumber', label: '사업자등록번호', type: 'text' },
            { name: 'email', label: '대표 이메일', type: 'email' },
            { name: 'phone', label: '대표 전화', type: 'text' },
          ],
        },
        {
          label: 'SNS',
          fields: [
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
                      options: ['YouTube', 'Instagram', 'TikTok', 'X', 'Weibo', 'Facebook', 'LinkedIn', '기타'],
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
          label: '하단 · 쿠키',
          fields: [
            {
              name: 'aiNotice',
              label: 'AI 생성 콘텐츠 표시 문구',
              type: 'text',
              localized: true,
              defaultValue: 'Artists and content on this site are created with AI technology.',
            },
            { name: 'copyright', label: '저작권 표기', type: 'text', defaultValue: '© CUBIT ENTERTAINMENT. All rights reserved.' },
            {
              name: 'policyLinks',
              label: '하단 정책 링크',
              type: 'relationship',
              relationTo: 'pages',
              hasMany: true,
              filterOptions: { section: { equals: 'legal' } },
              admin: { description: '개인정보처리방침 · 쿠키 정책 등 "정책" 섹션 페이지를 고르세요.' },
            },
            { name: 'cookieBannerText', label: '쿠키 동의 배너 문구', type: 'textarea', localized: true },
          ],
        },
      ],
    },
  ],
}

// ≡ 버튼을 누르면 열리는 전체 화면 메뉴
export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: '메뉴 관리',
  admin: { group: '설정', description: '전체 화면 메뉴의 섹션과 항목입니다. 끌어서 순서를 바꿀 수 있습니다.' },
  access: { read: anyone, update: ({ req }) => hasRole(req, 'editor', 'translator') },
  fields: [
    {
      name: 'sections',
      label: '메뉴 섹션',
      type: 'array',
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', label: '섹션 이름', type: 'text', required: true, localized: true, admin: { width: '40%' } },
            { name: 'url', label: '섹션 주소', type: 'text', admin: { width: '40%' } },
            { name: 'hidden', label: '숨기기', type: 'checkbox', defaultValue: false, admin: { width: '20%' } },
          ],
        },
        {
          name: 'items',
          label: '하위 메뉴',
          type: 'array',
          fields: [
            {
              type: 'row',
              fields: [...linkFields().map((field) => ({ ...field, admin: { ...field.admin, width: '50%' } }) as Field)],
            },
          ],
        },
      ],
    },
    {
      name: 'ctaLabel',
      label: '메뉴 하단 버튼 글자',
      type: 'text',
      localized: true,
      defaultValue: 'Get a campaign quote',
    },
  ],
}

// 홈 화면 설정: 슬라이드 넘김 시간 · 섹션 순서
export const HomeSettings: GlobalConfig = {
  slug: 'home-settings',
  label: '홈 화면 설정',
  admin: { group: '홈 관리' },
  access: contentAccess,
  fields: [
    {
      name: 'autoAdvanceSeconds',
      label: '슬라이드 자동 넘김 (초)',
      type: 'number',
      defaultValue: 8,
      min: 3,
      max: 60,
      admin: { description: '영상이 이 시간보다 짧으면 영상이 끝날 때 넘어갑니다.' },
    },
    {
      name: 'sections',
      label: '홈 섹션 순서',
      type: 'array',
      admin: { description: '끌어서 순서를 바꾸고, 숨기기로 감출 수 있습니다. BUSINESS 섹션은 숨길 수 없습니다.' },
      defaultValue: [
        { section: 'new-release', hidden: false },
        { section: 'artists', hidden: false },
        { section: 'business', hidden: false },
        { section: 'news', hidden: false },
        { section: 'notice', hidden: false },
      ],
      validate: (value: unknown[] | null | undefined) => {
        const rows = (value ?? []) as { section?: string; hidden?: boolean }[]
        const business = rows.find((row) => row.section === 'business')
        if (!business) return 'BUSINESS 섹션은 반드시 있어야 합니다.'
        if (business.hidden) return 'BUSINESS 섹션은 숨길 수 없습니다.'
        return true
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'section',
              label: '섹션',
              type: 'select',
              required: true,
              options: [
                { label: 'NEW RELEASE', value: 'new-release' },
                { label: 'ARTISTS', value: 'artists' },
                { label: 'BUSINESS (필수)', value: 'business' },
                { label: 'NEWS', value: 'news' },
                { label: 'NOTICE', value: 'notice' },
              ],
              admin: { width: '70%' },
            },
            { name: 'hidden', label: '숨기기', type: 'checkbox', defaultValue: false, admin: { width: '30%' } },
          ],
        },
      ],
    },
  ],
}

// BUSINESS 개요 · 홈 BUSINESS 섹션 · 캠페인 빌더 문구
export const BusinessSettings: GlobalConfig = {
  slug: 'business-settings',
  label: '비즈니스 설정',
  admin: { group: '비즈니스' },
  access: { read: anyone, update: ({ req }) => hasRole(req, 'editor', 'translator', 'sales') },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: '소개',
          fields: [
            { name: 'eyebrow', label: '작은 제목', type: 'text', localized: true, defaultValue: 'FOR BRANDS' },
            { name: 'headline', label: '큰 제목', type: 'text', localized: true, defaultValue: 'Three ways to work with our talent' },
            {
              name: 'services',
              label: '서비스 카드',
              type: 'array',
              minRows: 1,
              defaultValue: [
                {
                  title: 'Talent Licensing',
                  description: 'Feature our AI talent in ads, video, and social right away. Usage rights are set by purpose, period, and region, so contracts move fast.',
                  url: '/business/licensing',
                },
                {
                  title: 'Brand-Exclusive AI Talent',
                  description: 'We create an AI talent made only for your brand, from story and look to voice. From short campaigns to long-term IP.',
                  url: '/business/custom',
                },
                {
                  title: 'Campaign Builder',
                  description: 'Pick talent and terms yourself and request a quote instantly. No back-and-forth booking emails.',
                  url: '/business/campaign',
                },
              ],
              fields: [
                { name: 'title', label: '제목', type: 'text', required: true, localized: true },
                { name: 'description', label: '설명', type: 'textarea', required: true, localized: true },
                { name: 'url', label: '자세히 보기 주소', type: 'text' },
              ],
            },
          ],
        },
        {
          label: '캠페인 빌더',
          fields: [
            { name: 'builderCtaLabel', label: '견적 버튼 글자', type: 'text', localized: true, defaultValue: 'Start campaign quote' },
            {
              name: 'confirmationMessage',
              label: '견적 요청 완료 안내',
              type: 'textarea',
              localized: true,
              defaultValue: 'Your quote request has been received. Our team will review it and contact you by email.',
            },
            {
              name: 'notifyEmails',
              label: '견적 요청 알림 받을 이메일',
              type: 'text',
              hasMany: true,
              admin: { description: '견적 요청이 들어오면 이 주소로 알림이 갑니다. 여러 개 입력할 수 있습니다.' },
              validate: (value: string[] | null | undefined) =>
                (value ?? []).every((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) ||
                '이메일 주소 형식을 확인해 주세요.',
            },
          ],
        },
        {
          label: '함께한 브랜드',
          fields: [
            {
              name: 'brands',
              label: '브랜드 로고',
              type: 'array',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'name', label: '브랜드 이름', type: 'text', required: true, admin: { width: '40%' } },
                    { name: 'logo', label: '로고', type: 'upload', relationTo: 'media', required: true, admin: { width: '30%' } },
                    { name: 'url', label: '링크', type: 'text', admin: { width: '30%' } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

export const globals = [SiteSettings, Navigation, HomeSettings, BusinessSettings]
