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

const STREAM_ID = /^[a-f0-9]{32}$/

// Cloudflare Stream 영상 ID 칸. 대시보드에서 영상을 올리면 나오는 32자리 ID를 붙여넣는다.
// requiredWhen: 같은 묶음의 다른 칸 값에 따라 꼭 넣어야 할 때 (예: 영상 방식이 Stream일 때)
export const streamIdField = (
  overrides: { requiredWhen?: (siblingData: Record<string, unknown>) => boolean; admin?: TextField['admin'] } = {},
): TextField => ({
  name: 'streamId',
  label: 'Cloudflare Stream 영상 ID',
  type: 'text',
  validate: (value: string | null | undefined, { siblingData }: { siblingData: Record<string, unknown> }) => {
    if (!value) return overrides.requiredWhen?.(siblingData ?? {}) ? 'Stream 영상 ID를 넣어 주세요.' : true
    return STREAM_ID.test(value.trim()) || 'Cloudflare Stream의 영상 ID(영문·숫자 32자리)를 붙여넣어 주세요.'
  },
  admin: {
    placeholder: '예: 5d5bc37ffcf54c9b82e996823bffbb81',
    description: 'Cloudflare 대시보드 → Stream에 영상을 올린 뒤, 영상의 ID(32자리)를 복사해 붙여넣으세요.',
    ...overrides.admin,
  },
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
