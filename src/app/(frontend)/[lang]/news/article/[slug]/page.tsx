import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { localePath } from '@/i18n'
import { getPost, getUiLabels } from '@/lib/data'
import { mediaUrl, pageMetadata, resolveLocale, type LangParams } from '@/lib/page'

type Params = LangParams & { slug: string }

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const post = await getPost(slug, locale)
  return pageMetadata(locale, `/news/article/${slug}`, { title: post?.title, description: post?.excerpt })
}

// 게시글 상세 (모든 게시판 공통). 디자인 적용 전 임시 모양.
export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const locale = await resolveLocale(params)
  const { slug } = await params
  const [post, labels] = await Promise.all([getPost(slug, locale), getUiLabels(locale)])
  if (!post) notFound()
  const board = typeof post.board === 'object' ? post.board : null
  const listPath = board?.slug === 'news' ? '/news' : `/news/${board?.slug ?? ''}`
  const thumbnail = mediaUrl(post.thumbnail, 'large')

  return (
    <article>
      <p>
        {board?.name} {typeof post.category === 'object' && post.category ? `· ${post.category.name}` : ''}
      </p>
      <h1>{post.title}</h1>
      <time dateTime={post.publishedAt}>{post.publishedAt?.slice(0, 10)}</time>
      {thumbnail ? <img src={thumbnail} alt="" /> : null}
      {post.content ? <RichText data={post.content} /> : null}
      <Link href={localePath(locale, listPath)}>{labels.common.back}</Link>
    </article>
  )
}
