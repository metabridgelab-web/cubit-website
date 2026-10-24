// 쿠키 동의: 방문자의 선택을 쿠키 하나에 6개월 동안 기억한다 (그 뒤에는 다시 묻는다).
// all = 모두 허용 · essential = 필수만. 나중에 방문 통계 등 선택 쿠키를 붙일 때는
// hasOptionalConsent()가 true일 때만 켜고, CONSENT_EVENT를 들어서 동의 직후에도 켜지게 한다.
export const CONSENT_COOKIE = 'cubit_consent'
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 180
export const CONSENT_EVENT = 'cubit:consent'
export const OPEN_CONSENT_EVENT = 'cubit:open-consent'

export type Consent = 'all' | 'essential'

export const readConsent = (): Consent | null => {
  const value = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`))?.[1]
  return value === 'all' || value === 'essential' ? value : null
}

export const hasOptionalConsent = () => readConsent() === 'all'
