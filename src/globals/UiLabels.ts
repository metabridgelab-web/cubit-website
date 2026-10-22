import type { Field, GlobalConfig } from 'payload'

import { anyone, hasRole } from '../access'

// 사이트 고정 문구: 버튼·제목처럼 화면 곳곳에 쓰이는 짧은 글. 영어로 쓰면 자동 번역된다.
// 새 문구가 필요하면 아래 목록에 한 줄 추가한다 (기본값 = 영어 원문).
export const UI_LABELS = {
  common: {
    label: '공통',
    items: {
      viewAll: 'View all',
      readMore: 'Read more',
      back: 'Back',
      menu: 'Menu',
      close: 'Close',
      language: 'Language',
      prev: 'Prev',
      next: 'Next',
      soundOn: 'Sound on',
      soundOff: 'Sound off',
      watchMv: 'Watch MV',
      getQuote: 'Get a campaign quote',
      notFound: 'The page you are looking for does not exist.',
    },
  },
  home: {
    label: '홈',
    items: {
      newRelease: 'New Release',
      artists: 'Artists',
      news: 'News',
      notice: 'Notice',
      scrollDown: 'Scroll down',
    },
  },
  artist: {
    label: '아티스트',
    items: {
      profile: 'Profile',
      introduction: 'Introduction',
      gallery: 'Gallery',
      musicVideos: 'Music Videos',
      birthday: 'Birthday',
      debut: 'Debut',
      nationality: 'Nationality',
      quoteWithArtist: 'Get a campaign quote with this artist',
      relatedNews: 'Related News',
    },
  },
  forms: {
    label: '신청 양식',
    items: {
      submit: 'Submit',
      sending: 'Sending…',
      success: 'Thank you. We have received your request.',
      required: 'Required',
      privacyConsent: 'I agree to the collection and use of my personal information.',
      tooMany: 'Too many submissions. Please try again later.',
      error: 'Something went wrong. Please try again.',
    },
  },
} as const

const groups: Field[] = Object.entries(UI_LABELS).map(([name, group]) => ({
  name,
  label: group.label,
  type: 'group',
  fields: Object.entries(group.items).map(([key, defaultValue]) => ({
    name: key,
    type: 'text',
    localized: true,
    required: true,
    defaultValue,
  })),
}))

export const UiLabels: GlobalConfig = {
  slug: 'ui-labels',
  label: '사이트 고정 문구',
  admin: { group: '번역 관리', description: '버튼·제목처럼 화면 곳곳에 쓰이는 짧은 글입니다. 영어로 고치고 저장하면 자동 번역됩니다.' },
  access: { read: anyone, update: ({ req }) => hasRole(req, 'editor', 'translator') },
  fields: groups,
}
