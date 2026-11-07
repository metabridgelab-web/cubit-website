import { describe, expect, it } from 'vitest'

import { cleanSong, matchVideo, parseFeed, videoIdFromUrl } from '@/channelVideos/match'

const artists = [
  { id: 1, name: 'AMANE YUKI', searchNames: '아마네 유키' },
  { id: 2, name: 'SUNNY', searchNames: '써니' },
  { id: 3, name: 'EDWARD HALE' },
  { id: 4, name: 'EDWARD HALE' },
  { id: 5, name: 'DO GEONWOO', searchNames: '도건우' },
  { id: 6, name: 'RUBIQUE' },
]
const match = (title: string, description = '') => matchVideo({ title, description }, artists)

describe('channel video matching', () => {
  it('finds the artist and keeps only the song title', () => {
    expect(match('Amane Yuki — Last Train [Official Music Video] #Jazz #AmaneYuki')).toEqual({ artistId: 1, song: 'Last Train' })
    expect(match('도건우 Do Geonwoo — 딱 한 잔만 (Just One Drink) [Official Audio] #트로트')).toEqual({ artistId: 5, song: '딱 한 잔만' })
    expect(match('RUBIQUE 질주하는 별들 [Official Music Video]')).toEqual({ artistId: 6, song: '질주하는 별들' })
    expect(match('Do Geonwoo — Just One Drink (딱 한 잔만) [Official Audio]')).toEqual({ artistId: 5, song: 'Just One Drink' })
    expect(match('Do Geonwoo — Wings of Tragedy 비극의 날개 [Official Audio]')).toEqual({ artistId: 5, song: 'Wings of Tragedy' })
    expect(match('K-Pop | Spotlight — SUNNY | CUBIT Entertainment')).toEqual({ artistId: 2, song: 'Spotlight' })
  })

  it('reads the first line of the description when the title has no artist', () => {
    expect(match('오늘 밤 전화해 인트로 4K 최종', '써니 SUNNY — CALL ME TONIGHT [Official Music Video]\n\nmore')).toEqual({ artistId: 2, song: 'CALL ME TONIGHT' })
  })

  it('sends anything uncertain to a person instead of guessing', () => {
    expect(match('Edward Hale — Don’t Walk Away [Official Audio]')).toHaveProperty('reason')
    expect(match('Beyond That Door [Official Audio]')).toHaveProperty('reason')
    expect(match('SUNNY — Rubique [Official Audio]')).toHaveProperty('reason')
    expect(match('Sunny - Winter Songs [1 Hour Loop]')).toHaveProperty('reason')
    expect(match('[Playlist] Best of SUNNY #playlist')).toHaveProperty('reason')
  })

  it('does not treat a song or hashtag word as an artist', () => {
    expect(match('Sunny Days [Official Audio] #Rubique')).toHaveProperty('reason')
  })

  it('removes translated titles but keeps parts of the title', () => {
    expect(cleanSong('중독 (Addicted)')).toBe('중독')
    expect(cleanSong('Your Summer (너의 여름)')).toBe('Your Summer')
    expect(cleanSong('If I Say It Now (Reply)')).toBe('If I Say It Now (Reply)')
    expect(cleanSong('Noche de Fiesta, ¡Bienvenidos a la fiesta')).toBe('Noche de Fiesta')
  })

  it('reads the YouTube feed', () => {
    const xml = '<feed><entry><yt:videoId>abcdefghijk</yt:videoId><title>A &amp; B</title><published>2026-11-07T10:00:07+00:00</published><media:description>line &quot;one&quot;</media:description></entry></feed>'
    expect(parseFeed(xml)).toEqual([{ id: 'abcdefghijk', title: 'A & B', published: '2026-11-07T10:00:07+00:00', description: 'line "one"' }])
    expect(videoIdFromUrl('https://www.youtube.com/watch?v=abcdefghijk&t=1')).toBe('abcdefghijk')
  })
})
