// 계열사 소개 영상을 홈 첫 화면 슬라이드로 올린다 (개발용. Cloudflare Stream 연결 전까지 사용).
// 실행: npm run films -- <압축한 영상 폴더>   (폴더 안에 <이름>.mp4 와 <이름>-poster.jpg)
import fs from 'fs'
import path from 'path'
import { getPayload } from 'payload'

import config from '../payload.config'

const payload = await getPayload({ config })
const dir = process.argv[2]

const films = [
  { slug: 'cubit-entertainment', headline: 'CUBIT ENTERTAINMENT', title: 'Company Film' },
  { slug: 'cubiter', headline: 'CUBITER', title: 'Affiliate Film' },
  { slug: 'viona', headline: 'VIONA', title: 'Affiliate Film' },
  { slug: 'anima-x', headline: 'ANIMA-X', title: 'Affiliate Film' },
  { slug: 'eximax', headline: 'EXIMAX', title: 'Affiliate Film' },
  { slug: 'exora', headline: 'EXORA', title: 'Affiliate Film' },
]

const upload = async (file: string, mimetype: string, alt: string) => {
  const data = fs.readFileSync(path.join(dir, file))
  return payload.create({ collection: 'media', data: { alt }, file: { data, mimetype, name: file, size: data.length } })
}

for (const film of films) {
  const video = await upload(`${film.slug}.mp4`, 'video/mp4', `${film.headline} film`)
  const poster = await upload(`${film.slug}-poster.jpg`, 'image/jpeg', film.headline)
  await payload.create({
    collection: 'home-slides',
    locale: 'en',
    data: { title: film.title, headline: film.headline, videoSource: 'file', videoFile: video.id, poster: poster.id, active: true },
  })
  payload.logger.info(`추가: 슬라이드 ${film.headline}`)
}
process.exit(0)
