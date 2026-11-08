import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { artistListHref, readSelection } from '@/components/admin/artistTabs'
import { GenreTabs } from '@/components/admin/GenreTabs'

describe('artist list tabs', () => {
  it('builds list addresses for a category, a genre, or both', () => {
    expect(artistListHref({ category: 'all', genre: 'all' })).toBe('/admin/collections/artists')
    expect(artistListHref({ category: '2', genre: 'all' })).toBe('/admin/collections/artists?where[or][0][and][0][categories][in][0]=2')
    expect(artistListHref({ category: '1', genre: '5' })).toBe('/admin/collections/artists?where[or][0][and][0][categories][in][0]=1&where[or][0][and][1][genres][in][0]=5')
    expect(artistListHref({ category: 'all', genre: 'none' })).toBe('/admin/collections/artists?where[or][0][and][0][genres][exists]=false')
  })

  it('reads the selection back from the address, flat or nested', () => {
    expect(readSelection({})).toEqual({ category: 'all', genre: 'all' })
    expect(readSelection({ 'where[or][0][and][0][categories][in][0]': '1', 'where[or][0][and][1][genres][in][0]': '5' })).toEqual({ category: '1', genre: '5' })
    expect(readSelection({ where: { or: [{ and: [{ categories: { in: ['3'] } }, { genres: { exists: 'false' } }] }] } })).toEqual({ category: '3', genre: 'none' })
    // 예전 장르 단추 주소도 그대로 읽힌다
    expect(readSelection({ where: { or: [{ and: [{ genres: { in: ['7'] } }] }] } })).toEqual({ category: 'all', genre: '7' })
  })

  it('shows categories with counts and only the chosen category’s genres', async () => {
    const data: Record<string, unknown[]> = {
      'artist-categories': [
        { id: 1, name: '가수' },
        { id: 2, name: '모델' },
      ],
      'artist-genres': [
        { id: 5, name: 'Rock', category: 1 },
        { id: 9, name: 'Runway', category: 2 },
      ],
      artists: [
        { id: 10, categories: [1], genres: [5] },
        { id: 11, categories: [1], genres: [] },
        { id: 12, categories: [{ id: 2 }], genres: [9] },
      ],
    }
    const payload = { find: async ({ collection }: { collection: string }) => ({ docs: data[collection] }) }
    const render = async (searchParams: Record<string, unknown>) =>
      renderToStaticMarkup(await GenreTabs({ payload, searchParams } as never))

    const all = await render({})
    expect(all).toContain('가수<span>2</span>')
    expect(all).toContain('모델<span>1</span>')
    expect(all).toContain('Runway')

    const singers = await render({ 'where[or][0][and][0][categories][in][0]': '1' })
    expect(singers).toContain('Rock<span>1</span>')
    expect(singers).not.toContain('Runway')
    expect(singers).toContain('장르 없음<span>1</span>')
    expect(singers).toMatch(/aria-current="page"[^>]*>가수/)
  })
})
