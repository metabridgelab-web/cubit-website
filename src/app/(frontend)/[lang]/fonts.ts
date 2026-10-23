import {
  Inter,
  Noto_Sans_Arabic,
  Noto_Sans_Bengali,
  Noto_Sans_Devanagari,
  Noto_Sans_JP,
  Noto_Sans_KR,
  Noto_Sans_SC,
  Space_Mono,
} from 'next/font/google'

// 디자인 글꼴: Inter(본문·제목) + Space Mono(작은 정보 글자). 둘 다 영어 전용이라
// 언어별 Noto 글꼴을 뒤에 붙여 한국어·일본어·중국어·아랍어·힌디어·벵골어가 깨지지 않게 한다.
// 영어 외 글꼴은 미리 내려받지 않고(preload: false) 그 글자가 화면에 나올 때만 받는다.
// next/font는 설정을 글자 그대로 적어야 해서(미리 분석) 글꼴마다 같은 설정을 반복해 적는다.

export const inter = Inter({ subsets: ['latin', 'latin-ext', 'cyrillic'], variable: '--font-inter', display: 'swap' })
export const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono', display: 'swap' })

export const notoKR = Noto_Sans_KR({ display: 'swap', preload: false, variable: '--font-noto-kr' })
export const notoJP = Noto_Sans_JP({ display: 'swap', preload: false, variable: '--font-noto-jp' })
export const notoSC = Noto_Sans_SC({ display: 'swap', preload: false, variable: '--font-noto-sc' })
export const notoArabic = Noto_Sans_Arabic({ display: 'swap', preload: false, subsets: ['arabic'], variable: '--font-noto-ar' })
export const notoDevanagari = Noto_Sans_Devanagari({ display: 'swap', preload: false, subsets: ['devanagari'], variable: '--font-noto-hi' })
export const notoBengali = Noto_Sans_Bengali({ display: 'swap', preload: false, subsets: ['bengali'], variable: '--font-noto-bn' })

export const fontVariables = [inter, spaceMono, notoKR, notoJP, notoSC, notoArabic, notoDevanagari, notoBengali]
  .map((font) => font.variable)
  .join(' ')
