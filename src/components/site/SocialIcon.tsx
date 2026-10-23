import {
  FacebookLogo,
  GlobeSimple,
  InstagramLogo,
  LinkedinLogo,
  TiktokLogo,
  XLogo,
  YoutubeLogo,
} from '@phosphor-icons/react/dist/ssr'

const ICONS = {
  YouTube: YoutubeLogo,
  Instagram: InstagramLogo,
  TikTok: TiktokLogo,
  X: XLogo,
  Facebook: FacebookLogo,
  LinkedIn: LinkedinLogo,
} as const

// 관리자 화면 "공식 SNS"의 플랫폼 이름에 맞는 아이콘
export function SocialIcon({ platform, size = 20 }: { platform: string; size?: number }) {
  const Icon = ICONS[platform as keyof typeof ICONS] ?? GlobeSimple
  return <Icon size={size} aria-hidden />
}
