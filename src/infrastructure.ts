import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import type { DatabaseAdapterObj, Plugin } from 'payload'
import { fileURLToPath } from 'url'

// 데이터베이스와 파일 저장소를 환경 변수에 따라 고른다.
// - 이 컴퓨터(개발): SQLite 파일 + 프로젝트의 media 폴더
// - 인터넷(Vercel): Neon Postgres + Cloudflare R2 (환경 변수가 채워져 있을 때만 켜진다)

const dirname = path.dirname(fileURLToPath(import.meta.url))

// DATABASE_URL이 postgres:// 로 시작하면 Neon(Postgres), 아니면 SQLite 파일.
// Postgres는 표 구조를 "migrations" 폴더의 변경 기록으로만 바꾼다 (운영 데이터 보호). 배포할 때 payload migrate가 먼저 실행된다.
export const database = (): DatabaseAdapterObj => {
  const url = process.env.DATABASE_URL || ''
  if (/^postgres(ql)?:\/\//.test(url)) {
    return postgresAdapter({
      pool: { connectionString: url },
      push: false,
      migrationDir: path.resolve(dirname, 'migrations'),
    })
  }
  return sqliteAdapter({ client: { url } })
}

// Cloudflare R2 (S3와 같은 방식으로 쓰는 저장소). 버킷 두 개:
// - 공개 버킷: 사진 · 영상 · PDF (media). 방문자는 Cloudflare 주소(R2_PUBLIC_URL)에서 바로 받아 빠르다.
// - 비공개 버킷: 문의 첨부 파일 (attachments). 접수함 담당자만 관리자 화면을 거쳐 열 수 있다.
// 파일은 브라우저에서 저장소로 바로 올라간다 (Vercel 서버의 한 번에 받는 크기 제한 약 4.5MB를 피함).
export const storagePlugins = (): Plugin[] => {
  const {
    R2_ACCOUNT_ID: accountId,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_PUBLIC_BUCKET: publicBucket,
    R2_PRIVATE_BUCKET: privateBucket,
    R2_PUBLIC_URL: publicUrl,
  } = process.env
  if (!accountId || !accessKeyId || !secretAccessKey || !publicBucket || !privateBucket || !publicUrl) return []

  const config = {
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  }
  const publicBase = publicUrl.replace(/\/$/, '')

  return [
    s3Storage({
      bucket: publicBucket,
      config,
      clientCacheKey: 'r2-public',
      clientUploads: true,
      collections: {
        media: {
          prefix: 'media',
          // Vercel을 거치지 않고 Cloudflare에서 바로 내려받게 한다 (누구나 볼 수 있는 파일만)
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => `${publicBase}/${[prefix, filename].filter(Boolean).join('/')}`,
        },
      },
    }),
    s3Storage({
      bucket: privateBucket,
      config,
      clientCacheKey: 'r2-private',
      // 문의 양식의 첨부 파일은 로그인하지 않은 방문자도 올린다 (형식 · 크기 · 횟수 제한은 Attachments에서 확인)
      clientUploads: { access: ({ collectionSlug }) => collectionSlug === 'attachments' },
      collections: { attachments: { prefix: 'attachments' } },
    }),
  ]
}

export const directUploadsEnabled = () => storagePlugins().length > 0
