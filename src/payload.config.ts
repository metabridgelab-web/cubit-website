import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resendAdapter } from '@payloadcms/email-resend'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { en } from '@payloadcms/translations/languages/en'
import { ko } from '@payloadcms/translations/languages/ko'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { ArtistCategories } from './collections/ArtistCategories'
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
  // 예약된 작업(자동 번역 등)을 10초마다 처리한다. 서버리스 배포에서는 7단계에서 정기 호출로 바꾼다.
  // 메일: RESEND_API_KEY가 있으면 Resend로 실제 발송, 없으면 개발 서버 화면(콘솔)에만 찍힌다
  email: process.env.RESEND_API_KEY
    ? resendAdapter({
        apiKey: process.env.RESEND_API_KEY,
        defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'no-reply@cubitenter.com',
        defaultFromName: process.env.EMAIL_FROM_NAME || 'CUBIT ENTERTAINMENT',
      })
    : undefined,
  jobs: {
    tasks: [notifyTask],
    autoRun: [{ cron: '*/10 * * * * *', queue: 'default', limit: 10 }],
    shouldAutoRun: () => process.env.DISABLE_JOB_AUTORUN !== 'true',
    // 끝난 작업 기록을 남겨 두어 번역 실패 원인을 확인할 수 있게 한다
    deleteJobOnComplete: false,
    enableConcurrencyControl: true,
  },
  plugins: [translationPlugin({ exclude: ['users', 'glossary'] })],
})
