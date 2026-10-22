// 사이트에서 지원하는 12개 언어. 영어가 기본 언어(원문)이고 나머지 11개는 번역 대상이다.
// 순서는 관리자 화면과 사이트의 언어 선택 목록 순서와 같다.
export const LOCALES = [
  { code: 'en', label: 'English', rtl: false },
  { code: 'ko', label: '한국어', rtl: false },
  { code: 'zh', label: '中文 (简体)', rtl: false },
  { code: 'ja', label: '日本語', rtl: false },
  { code: 'es', label: 'Español', rtl: false },
  { code: 'fr', label: 'Français', rtl: false },
  { code: 'pt', label: 'Português', rtl: false },
  { code: 'ru', label: 'Русский', rtl: false },
  { code: 'ar', label: 'العربية', rtl: true },
  { code: 'hi', label: 'हिन्दी', rtl: false },
  { code: 'bn', label: 'বাংলা', rtl: false },
  { code: 'id', label: 'Bahasa Indonesia', rtl: false },
] as const

export type LocaleCode = (typeof LOCALES)[number]['code']

// 원문 언어. 관리자는 이 언어로 쓰고, 저장하면 나머지 언어로 자동 번역된다.
export const DEFAULT_LOCALE: LocaleCode = 'en'

export const TRANSLATION_TARGETS = LOCALES.map(({ code }) => code).filter((code) => code !== DEFAULT_LOCALE)

// 견적 요청 등에서 "사용 언어"를 고를 때 쓰는 선택지
export const LOCALE_OPTIONS = LOCALES.map(({ code, label }) => ({ label, value: code }))
