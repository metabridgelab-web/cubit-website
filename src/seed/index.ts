// 기본 데이터 넣기: 아티스트 카테고리 · 게시판과 분류 · 메뉴.
// 여러 번 실행해도 이미 있는 항목은 건너뛴다.
// 실행: npm run seed
import { getPayload } from 'payload'

import config from '../payload.config'

const payload = await getPayload({ config })

const findOrCreate = async <T extends 'artist-categories' | 'boards' | 'post-categories'>(
  collection: T,
  where: Record<string, { equals: unknown }>,
  data: Record<string, unknown>,
) => {
  const existing = await payload.find({ collection, where, limit: 1, depth: 0 })
  if (existing.docs[0]) return existing.docs[0]
  payload.logger.info(`추가: ${collection} ${JSON.stringify(where)}`)
  return payload.create({ collection, data: data as never, depth: 0 })
}

const categories = [
  { slug: 'singers', name: '가수', sortOrder: 1 },
  { slug: 'models', name: '모델', sortOrder: 2 },
  { slug: 'actors', name: '배우', sortOrder: 3 },
  {
    slug: 'doctors',
    name: '전문의',
    sortOrder: 4,
    disclaimer: 'AI 캐릭터이며 실제 의사가 아닙니다. 진단·처방을 하지 않습니다.',
  },
]

for (const category of categories) {
  await findOrCreate('artist-categories', { slug: { equals: category.slug } }, { ...category, generateSlug: false })
}

const boards = [
  { slug: 'news', name: '뉴스', sortOrder: 1, categories: ['음악', '캠페인', '활동', '보도자료'] },
  { slug: 'notice', name: '공지사항', sortOrder: 2, categories: ['공식 입장', '법적 대응', '사칭 주의', '이벤트'] },
]

for (const { categories: categoryNames, ...board } of boards) {
  const created = await findOrCreate('boards', { slug: { equals: board.slug } }, { ...board, generateSlug: false })
  for (const [index, name] of categoryNames.entries()) {
    await findOrCreate(
      'post-categories',
      { name: { equals: name }, board: { equals: created.id } },
      { name, board: created.id, sortOrder: index + 1 },
    )
  }
}

const navigation = await payload.findGlobal({ slug: 'navigation', depth: 0 })
if (!navigation.sections?.length) {
  payload.logger.info('추가: 메뉴 기본 구성')
  await payload.updateGlobal({
    slug: 'navigation',
    data: {
      sections: [
        {
          label: 'ARTISTS',
          url: '/artists',
          items: [
            { label: '가수', url: '/artists/singers' },
            { label: '모델', url: '/artists/models' },
            { label: '배우', url: '/artists/actors' },
            { label: '전문의', url: '/artists/doctors' },
          ],
        },
        {
          label: 'COMPANY',
          url: '/about',
          items: [
            { label: '회사 소개', url: '/about' },
            { label: '연혁', url: '/about/history' },
            { label: '오시는 길', url: '/about/location' },
          ],
        },
        {
          label: 'BUSINESS',
          url: '/business',
          items: [
            { label: '개요', url: '/business' },
            { label: '탤런트 사용 계약', url: '/business/licensing' },
            { label: '브랜드 전속 AI 탤런트 제작', url: '/business/custom' },
            { label: '캠페인 빌더', url: '/business/campaign' },
            { label: '작업 사례', url: '/business/works' },
          ],
        },
        {
          label: 'NEWS',
          url: '/news',
          items: [
            { label: '뉴스', url: '/news' },
            { label: '공지사항', url: '/news/notice' },
          ],
        },
        { label: 'CONTACT', url: '/contact', items: [] },
      ],
    },
  })
}

payload.logger.info('기본 데이터 넣기 완료')
process.exit(0)
