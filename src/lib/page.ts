import 'server-only'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import type { LocaleCode } from '@/constants/locales'
import { isLocale, languageAlternates, localePath, SITE_URL } from '@/i18n'

import { getEnabledLocales } from './data'

export type LangParams = { lang: string }

// 주소의 언어가 지원 언어이고 관리자 화면에서 켜져 있는지 확인한다. 아니면 404.
export const resolveLocale = async (params: Promise<LangParams>): Promise<LocaleCode> => {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const enabled = await getEnabledLocales()
  if (!enabled.includes(lang)) notFound()
  return lang
}

// 페이지마다 제목·설명과 12개 언어 주소(hreflang)를 검색엔진에 알려준다
export const pageMetadata = async (
  locale: LocaleCode,
  path: string,
  meta: { title?: string | null; description?: string | null } = {},
): Promise<Metadata> => ({
  metadataBase: new URL(SITE_URL),
  title: meta.title ?? undefined,
  description: meta.description ?? undefined,
  alternates: {
    canonical: `${SITE_URL}${localePath(locale, path)}`,
    languages: languageAlternates(path, await getEnabledLocales()),
  },
  openGraph: { locale, url: `${SITE_URL}${localePath(locale, path)}`, title: meta.title ?? undefined },
})

// YouTube 주소에서 영상 id를 꺼낸다 (watch?v= · youtu.be · shorts · embed 모두)
export const youtubeId = (url: string | null | undefined) =>
  url?.match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{6,})/)?.[1] ?? null

// Cloudflare Stream 영상 주소 (화질 자동 조절 · 대표 이미지). CF_STREAM_CUSTOMER_CODE가 있어야 한다.
// 고객 코드는 Cloudflare 대시보드 → Stream 화면의 영상 주소 "customer-XXXX.cloudflarestream.com"의 XXXX 부분.
export const streamSource = (id: string | null | undefined) => {
  const code = process.env.CF_STREAM_CUSTOMER_CODE
  const uid = id?.trim()
  if (!code || !uid) return null
  const base = `https://customer-${code}.cloudflarestream.com/${uid}`
  return { hls: `${base}/manifest/video.m3u8`, thumbnail: `${base}/thumbnails/thumbnail.jpg?time=1s&height=1080` }
}

export const mediaUrl = (media: unknown, size?: 'thumbnail' | 'card' | 'large' | 'hero') => {
  if (!media || typeof media !== 'object') return null
  const m = media as { url?: string | null; sizes?: Record<string, { url?: string | null } | undefined> }
  return (size && m.sizes?.[size]?.url) || m.url || null
}
