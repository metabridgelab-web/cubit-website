// 캠페인 빌더 선택지. 관리자 화면과 홈페이지 입력 양식이 함께 쓴다.

export const CAMPAIGN_USAGES = [
  { label: '디지털 광고 (웹·앱·스트리밍)', value: 'digital' },
  { label: 'TV·영상 (방송·영화·긴 영상)', value: 'video' },
  { label: 'SNS (인플루언서·브랜디드 콘텐츠)', value: 'social' },
  { label: '옥외·인쇄 (빌보드·교통·인쇄 광고)', value: 'ooh' },
] as const

export const CAMPAIGN_REGIONS = [
  { label: '전 세계', value: 'worldwide' },
  { label: '한국', value: 'kr' },
  { label: '북미', value: 'north-america' },
  { label: '유럽', value: 'europe' },
  { label: '아시아태평양', value: 'asia-pacific' },
] as const

// 캠페인 결과물에 쓸 언어 (사이트 언어와 별개로 고를 수 있다)
export const CAMPAIGN_LANGUAGES = [
  { label: 'English', value: 'en' },
  { label: '한국어', value: 'ko' },
  { label: '日本語', value: 'ja' },
  { label: '中文', value: 'zh' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Português', value: 'pt' },
  { label: 'Русский', value: 'ru' },
  { label: 'العربية', value: 'ar' },
  { label: 'हिन्दी', value: 'hi' },
  { label: 'বাংলা', value: 'bn' },
  { label: 'Bahasa Indonesia', value: 'id' },
  { label: 'ไทย', value: 'th' },
  { label: 'Tiếng Việt', value: 'vi' },
] as const

export const labelOf = (list: readonly { label: string; value: string }[], value: string) =>
  list.find((item) => item.value === value)?.label ?? value
