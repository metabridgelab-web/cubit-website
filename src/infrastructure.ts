import { PutObjectCommand, S3Client, type S3ClientConfig } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { resolveSignedURLKey } from '@payloadcms/plugin-cloud-storage/utilities'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { APIError, type DatabaseAdapterObj, type Endpoint, type Plugin } from 'payload'
import { assertClientUploadAllowed, assertClientUploadFileSize } from 'payload/internal'
import { fileURLToPath } from 'url'

import { assertSubmissionRate, ATTACHMENTS_PER_HOUR } from './inbox'

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
const r2Settings = () => {
  const {
    R2_ACCOUNT_ID: accountId,
    R2_ACCESS_KEY_ID: accessKeyId,
    R2_SECRET_ACCESS_KEY: secretAccessKey,
    R2_PUBLIC_BUCKET: publicBucket,
    R2_PRIVATE_BUCKET: privateBucket,
    R2_PUBLIC_URL: publicUrl,
  } = process.env
  if (!accountId || !accessKeyId || !secretAccessKey || !publicBucket || !privateBucket || !publicUrl) return null
  const config: S3ClientConfig = {
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    region: 'auto',
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true,
  }
  return { config, publicBucket, privateBucket, publicBase: publicUrl.replace(/\/$/, '') }
}

const ATTACHMENT_PREFIX = 'attachments'
const ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024

// R2가 없을 때(개발)도 플러그인을 꺼진 채로 넣어, 파일 위치 칸(prefix · _objectKey)이 언제나 같은 표 구조로 들어가게 한다.
// (운영 데이터베이스의 표 구조 기록 src/migrations 과 어긋나지 않게)
export const storagePlugins = (): Plugin[] => {
  const r2 = r2Settings()
  const enabled = Boolean(r2)
  const config = r2?.config ?? {}
  const publicBase = r2?.publicBase ?? ''

  return [
    s3Storage({
      enabled,
      alwaysInsertFields: true,
      bucket: r2?.publicBucket ?? '',
      config,
      clientCacheKey: 'r2-public',
      clientUploads: true,
      collections: {
        media: {
          prefix: 'media',
          // Vercel을 거치지 않고 Cloudflare에서 바로 내려받게 한다 (누구나 볼 수 있는 파일만)
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) => `${publicBase}/${[prefix, encodeURIComponent(filename)].filter(Boolean).join('/')}`,
        },
      },
    }),
    s3Storage({
      enabled,
      alwaysInsertFields: true,
      bucket: r2?.privateBucket ?? '',
      config,
      clientCacheKey: 'r2-private',
      // 관리자 화면에서 올릴 때 쓰는 허가 주소. 방문자(문의 양식)는 아래 attachmentUploadEndpoints를 쓴다.
      clientUploads: true,
      collections: { attachments: { prefix: ATTACHMENT_PREFIX } },
    }),
  ]
}

// 문의 양식(로그인하지 않은 방문자)의 첨부 파일 업로드 허가: POST /api/attachments-upload-url
// Payload 기본 허가 주소는 로그인한 사람만 쓸 수 있어서 따로 둔다. 확인하는 것:
// 첨부 파일로 받는 형식(PDF · JPG · PNG · MP4 · MOV)인지, 50MB 이하인지, 한 시간에 15개를 넘지 않았는지.
// 허가는 10분 동안만 유효하고, 함께 받은 영수증(signedReceipt)이 있어야 문의함에 기록된다.
export const attachmentUploadEndpoints = (): Endpoint[] => {
  const r2 = r2Settings()
  if (!r2) return []
  const client = new S3Client(r2.config)

  return [
    {
      path: '/attachments-upload-url',
      method: 'post',
      handler: async (req) => {
        const { filename, filesize, mimeType } = ((await req.json?.()) ?? {}) as { filename?: unknown; filesize?: unknown; mimeType?: unknown }
        if (typeof filename !== 'string' || typeof mimeType !== 'string' || typeof filesize !== 'number') {
          throw new APIError('filename, filesize and mimeType are required.', 400)
        }
        const collection = req.payload.collections.attachments.config
        // 첨부 파일 모음에 정해 둔 형식만 (기본 확인은 위험한 형식만 막기 때문에 목록을 직접 확인한다)
        const allowed = typeof collection.upload === 'object' ? (collection.upload.mimeTypes ?? []) : []
        if (!allowed.includes(mimeType)) throw new APIError('This file type is not allowed.', 400)
        assertClientUploadAllowed({ collection, filename, mimeType })
        assertClientUploadFileSize(filesize)
        if (filesize <= 0 || filesize > ATTACHMENT_MAX_BYTES) throw new APIError('File is too large.', 400)
        await assertSubmissionRate(req, 'attachments', ATTACHMENTS_PER_HOUR)

        const { clientUploadContext, fileKey, sanitizedFilename } = await resolveSignedURLKey({
          collectionPrefix: ATTACHMENT_PREFIX,
          collectionSlug: 'attachments',
          filename,
          req,
        })
        const url = await getSignedUrl(
          client,
          new PutObjectCommand({ Bucket: r2.privateBucket, Key: fileKey, ContentType: mimeType, ContentLength: filesize, IfNoneMatch: '*' }),
          { expiresIn: 600, signableHeaders: new Set(['content-type', 'content-length']) },
        )
        return Response.json({
          clientUploadContext,
          filename: sanitizedFilename,
          headers: { 'Content-Length': String(filesize), 'Content-Type': mimeType, 'If-None-Match': '*' },
          url,
        })
      },
    },
  ]
}
