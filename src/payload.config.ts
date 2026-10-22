import { sqliteAdapter } from '@payloadcms/db-sqlite'
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
  // 사이트 콘텐츠 언어: 12개. 번역이 비어 있으면 한국어 원문을 보여준다
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
  plugins: [],
})
