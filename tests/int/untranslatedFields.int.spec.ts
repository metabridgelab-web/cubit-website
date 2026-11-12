import { describe, expect, it } from 'vitest'

import { Media } from '@/collections/Media'
import { requiredInEnglish } from '@/fields'
import { collectTexts } from '@/translation/extract'

const validate = requiredInEnglish('제목을 입력해 주세요.')
const run = (value: unknown, locale?: string) => validate(value as never, { req: { locale } } as never)

describe('requiredInEnglish (곡 제목처럼 번역하지 않는 칸)', () => {
  it('requires the English title', () => {
    expect(run('', 'en')).toBe('제목을 입력해 주세요.')
    expect(run('   ', 'en')).toBe('제목을 입력해 주세요.')
    expect(run(undefined, undefined)).toBe('제목을 입력해 주세요.')
    expect(run('지금 딱 (TÁ TÁ TÁ)', 'en')).toBe(true)
  })

  it('lets other languages stay empty so translation and Korean edits are not blocked', () => {
    expect(run(undefined, 'fr')).toBe(true)
    expect(run('', 'ko')).toBe(true)
  })
})

describe('photo descriptions are not translated', () => {
  it('finds nothing to translate in a photo', () => {
    expect(collectTexts(Media.fields, { alt: 'TIFFANY — profile photo' })).toEqual([])
  })
})
