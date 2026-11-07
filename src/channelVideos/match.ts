// 유튜브 채널 피드를 읽고, 영상 제목에서 가수와 곡 제목을 찾는다.
// 잘못 연결하는 것보다 사람에게 넘기는 편이 낫다: 확실할 때만 결과를 주고, 나머지는 이유와 함께 돌려준다.

export type FeedVideo = { id: string; title: string; published: string; description: string }
export type ArtistName = { id: number; name: string; searchNames?: string | null }
export type VideoMatch = { artistId: number; song: string } | { reason: string; song: string; artistId?: number }

const decode = (text: string) =>
  text
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')

export const parseFeed = (xml: string): FeedVideo[] =>
  [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].flatMap(([, entry]) => {
    const tag = (name: string) => entry.match(new RegExp(`<${name}>([\\s\\S]*?)</${name}>`))?.[1] ?? ''
    const id = tag('yt:videoId')
    return id
      ? [{ id, title: decode(tag('title')).trim(), published: tag('published'), description: decode(tag('media:description')) }]
      : []
  })

export const videoIdFromUrl = (url?: string | null) =>
  url?.match(/(?:[?&]v=|youtu\.be\/|\/embed\/|\/shorts\/)([\w-]{11})/)?.[1] ?? null

// 글자와 숫자만 남겨 비교한다 (대소문자 · 띄어쓰기 · 악센트 무시)
const compact = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .normalize('NFC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, '')

const NOT_A_SONG =
  /^(?:k-?pop.*|k-?ballad|k-?발라드|발라드|솔로 발라드|ballad|rock|heavy metal|metal|pop|jazz|trot|트로트.*|retro k-?pop|hip-?hop.*|rap|r-?&?-?b.*|electronic.*|edm|blues|country|folk.*|musical|뮤지컬|popera|팝페라|classical.*|contemporary classical.*|world music|soundtrack.*|cubit.*|큐빗.*|.*엔터테인먼트|official.*|mv|뮤직비디오|gospel|ccm|religious.*)$/i

const COMPILATION = /playlist|\bloop\b/i

// 해시태그 · [Official Audio] · 이모지를 떼고 구분 기호로 나눈다
const segments = (title: string) =>
  title
    .replace(/#\p{L}.*$/su, ' ')
    .replace(/\[[^\]]*\]|【[^】]*】/g, '  ')
    .replace(/[\p{Extended_Pictographic}️♪♫]/gu, ' ')
    .split(/\s[-–—]\s|[—–ㅣ|]|\s\/\s|\/\s|\sl\s|\s{2,}/)
    .map((part) => part.trim().replace(/^[-_,.·\s]+|[-_,·\s]+$/g, ''))
    .filter(Boolean)

type NameIndex = Map<string, Set<number>>

const buildIndex = (artists: ArtistName[]): NameIndex => {
  const index: NameIndex = new Map()
  for (const artist of artists) {
    for (const form of [artist.name, ...(artist.searchNames ?? '').split(/\s+/)]) {
      const key = compact(form)
      if (key.length < 2) continue
      index.set(key, (index.get(key) ?? new Set()).add(artist.id))
    }
  }
  return index
}

// 앞에서부터 가수 이름을 읽는다. 다 읽으면 이름뿐인 칸이고, 남으면 뒤쪽이 곡 제목이다.
const readName = (segment: string, index: NameIndex) => {
  const words = segment.replace(/[()（）]/g, ' ').split(/\s+/).filter(Boolean)
  let ids: Set<number> | null = null
  let at = 0
  while (at < words.length) {
    let found = 0
    for (let end = words.length; end > at; end--) {
      const hit = index.get(compact(words.slice(at, end).join('')))
      if (hit && (!ids || [...hit].some((id) => ids?.has(id)))) {
        ids = ids ? new Set([...hit].filter((id) => ids?.has(id))) : hit
        found = end - at
        break
      }
    }
    if (!found) break
    at += found
  }
  return { ids, rest: words.slice(at).join(' ') }
}

// 곡 제목만 남긴다: 다른 글자로 된 번역 제목은 뗀다. "중독 (Addicted)" → "중독"
const scriptOf = (text: string) => {
  if (/[가-힣]/.test(text)) return 'ko'
  if (/[぀-ヿ一-鿿]/.test(text)) return 'cjk'
  return 'latin'
}

export const cleanSong = (song: string) => {
  let text = song
    .replace(/,?\s*¡.*$/, '')
    .replace(/\s+(?:MV|M\/V|Official Audio|Official Music Video|Official Video|Music Video)$/i, '')
    .trim()
  const bracket = text.match(/^(.+?)\s*[(（]([^()（）]+)[)）]$/)
  if (bracket && scriptOf(bracket[1]) !== scriptOf(bracket[2])) text = bracket[1].trim()
  const twoScripts = text.match(/^([\x20-\x7e’‘À-ɏ]*[A-Za-z][\x20-\x7e’‘À-ɏ]*?)\s+([가-힣぀-ヿ一-鿿].*)$/)
  if (twoScripts) return twoScripts[1].trim()
  const koThenLatin = text.match(/^(.*[가-힣][^A-Za-z]*?)\s+([A-Za-z][ -~’‘]*)$/)
  return koThenLatin ? koThenLatin[1].trim() : text
}

const readTitle = (title: string, index: NameIndex): VideoMatch | null => {
  const parts = segments(title)
  const named: Set<number>[] = []
  const others: string[] = []
  for (const part of parts) {
    if (NOT_A_SONG.test(part)) continue
    const bare = part.replace(/\s*[(（][^()（）]*[)）]\s*$/, '')
    const whole = readName(part, index)
    const short = readName(bare, index)
    if (whole.ids && !whole.rest) named.push(whole.ids)
    else if (short.ids && !short.rest) named.push(short.ids)
    else others.push(part)
  }
  // 구분 기호 없이 이어 쓴 제목: "RUBIQUE 질주하는 별들"
  if (!named.length && others.length === 1) {
    const text = others[0].replace(/[,.]/g, ' ').trim()
    const { ids, rest } = readName(text, index)
    const name = rest ? text.slice(0, text.length - rest.length).replace(/[()（）]/g, ' ').trim() : ''
    // 한 단어 이름은 곡 제목의 첫 단어일 수 있다("Sunny Days", "이슬 내리는 밤"). 대문자 이름 + 다른 표기의 곡 제목일 때만 믿는다
    const sure = /\s/.test(name) || (/^[A-Z0-9]+$/.test(name) && rest !== rest.toUpperCase()) || (/^[A-Z0-9]+$/.test(name) && /[^\x00-\x7f]/.test(rest))
    if (ids && rest && sure) {
      named.push(ids)
      others[0] = rest
    }
  }
  if (!named.length) return null
  const song = others[0] ? cleanSong(others[0]) : ''
  if (named.length > 1) return { reason: '제목에 가수 이름이 여럿 있습니다. 어느 가수의 영상인지 골라 주세요.', song }
  if (named[0].size > 1) return { reason: '같은 이름의 가수가 여러 명입니다. 어느 가수의 영상인지 골라 주세요.', song }
  const [artistId] = [...named[0]]
  if (!song) return { reason: '제목에서 곡 제목을 찾지 못했습니다. 곡 제목을 적어 주세요.', song: '', artistId }
  return { artistId, song }
}

export const matchVideo = (video: Pick<FeedVideo, 'title' | 'description'>, artists: ArtistName[]): VideoMatch => {
  if (COMPILATION.test(video.title.replace(/#\p{L}.*$/su, ''))) return { reason: '여러 곡 모음 또는 반복 영상으로 보입니다.', song: '' }
  const index = buildIndex(artists)
  const firstLine = video.description.split('\n')[0] ?? ''
  const result = readTitle(video.title, index) ?? (firstLine ? readTitle(firstLine, index) : null)
  return result ?? { reason: '제목과 설명에서 가수 이름을 찾지 못했습니다. 어느 가수의 영상인지 골라 주세요.', song: cleanSong(segments(video.title)[0] ?? '') }
}
