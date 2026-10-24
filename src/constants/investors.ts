// INVESTORS 화면의 탭 (design/07). 탭 이름 = 주소 끝부분 (/investors/token …), overview는 /investors
export const INVESTOR_TABS = ['overview', 'token', 'whitepaper', 'roadmap', 'disclosure', 'audit', 'official', 'disclaimer'] as const
export type InvestorTab = (typeof INVESTOR_TABS)[number]
