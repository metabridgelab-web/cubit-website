// 시험용 아티스트 4명 (화면 확인용). 주소가 sample- 로 시작한다.
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
    { name: 'DR. SEO', slug: 'sample-dr-seo', cats: ['doctors'], photo: 3, nationality: 'Korea', extra: [{ label: 'Specialty', value: 'Dermatology' }] },
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
}

if (step === 'remove') {
  await payload.delete({ collection: 'artists', where: { slug: { like: 'sample-' } } })
  await payload.delete({ collection: 'media', where: { filename: { like: 'sample-' } } })
  console.log('CHECK samples removed')
}
process.exit(0)
