// 시험용 아티스트 4명과 게시글 4개 (화면 확인용). 주소가 sample- 로 시작한다.
// 넣기: npm run samples -- add <사진 폴더>   지우기: npm run samples -- remove
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config'

const payload = await getPayload({ config })
const [step, dir] = process.argv.slice(2)

const paragraph = (text: string) => ({
  type: 'paragraph',
  version: 1,
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  children: [{ type: 'text', version: 1, text, format: 0, detail: 0, mode: 'normal', style: '' }],
})

if (step === 'add') {
  const upload = async (file: string) => {
    const data = fs.readFileSync(path.join(dir, file))
    return payload.create({ collection: 'media', data: { alt: file }, file: { data, mimetype: 'image/jpeg', name: `sample-${file}`, size: data.length } })
  }
  const photos = await Promise.all(['viona', 'exora', 'cubiter', 'eximax', 'anima-x', 'cubit-entertainment'].map((n) => upload(`${n}-poster.jpg`)))
  const cats = Object.fromEntries((await payload.find({ collection: 'artist-categories', depth: 0 })).docs.map((c) => [c.slug, c.id]))
  const samples = [
    { name: 'LUNA V', slug: 'sample-luna-v', cats: ['singers', 'models'], photo: 0, nationality: 'Korea', extra: [{ label: 'Height', value: '168 cm' }] },
    { name: 'ARIA', slug: 'sample-aria', cats: ['singers'], photo: 1, nationality: 'Japan', extra: [] },
    { name: 'KAI', slug: 'sample-kai', cats: ['actors'], photo: 2, nationality: 'Korea', extra: [{ label: 'Filmography', value: 'Neon Horizon (2026)' }] },
    { name: 'SEO', slug: 'sample-seo', cats: ['experts'], photo: 3, nationality: 'Korea', extra: [{ label: 'Specialty', value: 'Dermatology' }] },
  ]
  for (const s of samples) {
    await payload.create({
      collection: 'artists',
      locale: 'en',
      draft: false,
      data: {
        name: s.name,
        slug: s.slug,
        generateSlug: false,
        categories: s.cats.map((c) => cats[c]),
        profilePhoto: photos[s.photo].id,
        gallery: photos.map((p) => p.id),
        birthday: '2002-03-14',
        debutDate: '2025-09-01',
        nationality: s.nationality,
        extraInfo: s.extra,
        intro: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [paragraph(`${s.name} is a sample AI artist used to preview this page. Replace this text with the real introduction.`)] } },
        videos: [
          { title: 'Sample Video One', youtubeUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', releaseDate: '2026-09-01' },
          { title: 'Sample Video Two', youtubeUrl: 'https://www.youtube.com/watch?v=eRsGyueVLvQ', releaseDate: '2026-06-01' },
        ],
        socials: [
          { platform: 'Instagram', url: 'https://www.instagram.com/' },
          { platform: 'YouTube', url: 'https://www.youtube.com/' },
        ],
        featured: true,
        _status: 'published',
      },
    })
    console.log(`CHECK added ${s.name}`)
  }

  // 시험용 게시글: 뉴스 3개 + 고정 공지 1개
  const boards = Object.fromEntries((await payload.find({ collection: 'boards', depth: 0 })).docs.map((b) => [b.slug, b.id]))
  const categories = (await payload.find({ collection: 'post-categories', depth: 0, limit: 50 })).docs
  const categoryOf = (board: string, name: string) => categories.find((c) => c.board === boards[board] && c.name === name)?.id
  const luna = (await payload.find({ collection: 'artists', where: { slug: { equals: 'sample-luna-v' } }, depth: 0 })).docs[0]
  const posts = [
    { slug: 'sample-luna-v-debut', board: 'news', category: 'Music', title: 'LUNA V releases debut single', excerpt: 'Our AI artist LUNA V debuts with an energetic summer track.', thumb: 0, artists: [luna?.id], pinned: false, date: '2026-10-20' },
    { slug: 'sample-brand-campaign', board: 'news', category: 'Campaign', title: 'ARIA fronts a global beauty campaign', excerpt: 'A sample campaign story to preview the news layout.', thumb: 1, artists: [], pinned: false, date: '2026-10-12' },
    { slug: 'sample-studio-opening', board: 'news', category: 'Press', title: 'CUBIT opens a new production studio', excerpt: 'A sample press release to preview the news layout.', thumb: 5, artists: [], pinned: false, date: '2026-10-02' },
    { slug: 'sample-impersonation-alert', board: 'notice', category: 'Impersonation Alert', title: 'Beware of fake accounts and fake auditions', excerpt: 'CUBIT only recruits through its official channels.', thumb: null, artists: [], pinned: true, date: '2026-10-22' },
  ]
  for (const p of posts) {
    await payload.create({
      collection: 'posts',
      locale: 'en',
      draft: false,
      data: {
        title: p.title,
        slug: p.slug,
        generateSlug: false,
        board: boards[p.board],
        category: categoryOf(p.board, p.category),
        excerpt: p.excerpt,
        thumbnail: p.thumb === null ? undefined : photos[p.thumb].id,
        artists: p.artists.filter(Boolean) as number[],
        pinned: p.pinned,
        publishedAt: `${p.date}T09:00:00.000Z`,
        content: { root: { type: 'root', version: 1, direction: 'ltr', format: '', indent: 0, children: [paragraph(p.excerpt), paragraph('This is sample text to preview the article page. Replace it with the real story.')] } },
        _status: 'published',
      },
    })
    console.log(`CHECK added post ${p.slug}`)
  }
}

if (step === 'remove') {
  await payload.delete({ collection: 'posts', where: { slug: { like: 'sample-' } } })
  await payload.delete({ collection: 'artists', where: { slug: { like: 'sample-' } } })
  await payload.delete({ collection: 'media', where: { filename: { like: 'sample-' } } })
  console.log('CHECK samples removed')
}
process.exit(0)
