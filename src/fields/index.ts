import type { Field, TextField } from 'payload'

const YOUTUBE_URL = /^https:\/\/(www\.)?(youtube\.com\/(watch\?v=|shorts\/|embed\/)|youtu\.be\/)[\w-]{6,}/

// YouTube 주소 칸. 붙여넣은 주소가 YouTube 영상 주소인지 확인한다.
export const youtubeUrlField = (overrides: { required?: boolean; admin?: TextField['admin'] } = {}): TextField => ({
  name: 'youtubeUrl',
  label: 'YouTube 주소',
  type: 'text',
  required: overrides.required,
  validate: (value: string | null | undefined) => {
    if (!value) return overrides.required ? 'YouTube 주소를 입력해 주세요.' : true
    return YOUTUBE_URL.test(value) || 'YouTube 영상 주소를 붙여넣어 주세요. 예: https://www.youtube.com/watch?v=...'
  },
  admin: { placeholder: 'https://www.youtube.com/watch?v=...', ...overrides.admin },
})

// 사이드바의 노출 순서 칸 (숫자가 작을수록 앞에 나온다)
export const sortOrderField: Field = {
  name: 'sortOrder',
  label: '노출 순서',
  type: 'number',
  defaultValue: 0,
  admin: {
    position: 'sidebar',
    description: '숫자가 작을수록 앞에 보입니다.',
  },
}

// 링크 칸: 사이트 안의 주소 또는 바깥 주소
export const linkFields = (prefix = ''): Field[] => [
  {
    name: `${prefix}label`,
    label: '버튼 글자',
    type: 'text',
    localized: true,
  },
  {
    name: `${prefix}url`,
    label: '연결 주소',
    type: 'text',
    admin: { description: '사이트 안 주소는 /business 처럼, 바깥 주소는 https:// 로 시작하게 입력하세요.' },
  },
]
