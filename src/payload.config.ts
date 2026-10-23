import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ko } from '@payloadcms/translations/languages/ko'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { hasRole } from './access'
import { ArtistCategories } from './collections/ArtistCategories'
import { Attachments } from './collections/Attachments'
import { Artists } from './collections/Artists'
import { Boards, PostCategories } from './collections/Boards'
import { CaseStudies } from './collections/CaseStudies'
import { Glossary } from './collections/Glossary'
import { HomeSlides } from './collections/HomeSlides'
import { Inquiries, QuoteRequests } from './collections/Inbox'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { DEFAULT_LOCALE, LOCALES } from './constants/locales'
import { globals } from './globals'
import { notifyTask } from './inbox'
import { translationPlugin } from './translation/plugin'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' · CUBIT 관리자',
    },
  },
  // 관리자 화면 언어: 한국어 기본, 필요하면 영어로 바꿀 수 있다
  i18n: {
    supportedLanguages: { ko, en },
    fallbackLanguage: 'ko',
  },
  // 사이트 콘텐츠 언어: 12개. 영어가 원문이고, 번역이 비어 있으면 영어 원문을 보여준다
  localization: {
    locales: LOCALES.map(({ code, label, rtl }) => ({ code, label, rtl })),
    defaultLocale: DEFAULT_LOCALE,
    fallback: true,
  },
  collections: [
    HomeSlides,
    ArtistCategories,
    Artists,
    Boards,
    PostCategories,
    Posts,
    CaseStudies,
    Pages,
    QuoteRequests,
    Inquiries,
    Attachments,
    Media,
    Glossary,
    Users,
  ],
  globals,
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  // 올리는 파일 하나의 최대 크기 (문의 첨부 50MB). 큰 영상은 Cloudflare 연결 후 저장소로 바로 올린다.
  upload: { limits: { fileSize: 50 * 1024 * 1024 } },
  // 메일: RESEND_API_KEY가 있으면 Resend로 실제 발송, 없으면 개발 서버 화면(콘솔)에만 찍힌다
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@mail.cubitenter.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'CUBIT ENTERTAINMENT',
      })
    : undefined,
  // 예약된 작업(자동 번역 · 알림 메일 · 예약 게시)
  // - 개발 서버: 10초마다 자동 처리
  // - Vercel: 서버가 계속 켜져 있지 않으므로 vercel.json의 정기 호출(1분마다)이 /api/payload-jobs/run 을 부른다
  jobs: {
    tasks: [notifyTask],
    autoRun: [{ cron: '*/10 * * * * *', queue: 'default', limit: 10 }],
    shouldAutoRun: () => process.env.VERCEL !== '1' && process.env.DISABLE_JOB_AUTORUN !== 'true',
    access: {
      // 정기 호출은 CRON_SECRET으로 확인하고, 사람은 최고 관리자만 직접 실행할 수 있다
      run: ({ req }) => {
        if (hasRole(req)) return true
        const secret = process.env.CRON_SECRET
        return Boolean(secret) && req.headers.get('authorization') === `Bearer ${secret}`
      },
      queue: ({ req }) => hasRole(req),
      cancel: ({ req }) => hasRole(req),
    },
    // 끝난 작업 기록을 남겨 두어 번역 실패 원인을 확인할 수 있게 한다
    deleteJobOnComplete: false,
    enableConcurrencyControl: true,
  },
  plugins: [translationPlugin({ exclude: ['users', 'glossary'] })],
})
