// 아티스트 이름 검색 규칙 (가수 목록 검색란 · 캠페인 빌더 아티스트 찾기에서 같이 쓴다)

// 대소문자 · 악센트 · 띄어쓰기 · 기호를 무시한다. 한글은 자모로 풀어 "바레"처럼 입력 중인 글자도 "바렉"에 걸린다.
export const normalizeName = (text: string) =>
  text
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/ø/g, 'o')
    .replace(/ł/g, 'l')
    .replace(/ß/g, 'ss')
    .replace(/[^\p{L}\p{N}]/gu, '')

export type NameKeys = { nameKey: string; altKey: string; groupKey: string; words: string[] }

// name: 화면에 보이는 이름, searchNames: 검색용 다른 이름(한글 이름 등), groupText: 소속 그룹 이름들
export const nameKeys = (name: string, searchNames: string, groupText: string): NameKeys => ({
  nameKey: normalizeName(name),
  altKey: normalizeName(searchNames),
  groupKey: normalizeName(groupText),
  words: `${name} ${searchNames}`.split(/\s+/).map(normalizeName).filter(Boolean),
})

// 낮을수록 먼저 보인다: 이름과 일치 → 이름으로 시작 → 낱말로 시작 → 이름 안에 포함 → 소속 그룹 이름과 일치. 안 맞으면 null
export const rankName = (keys: NameKeys, query: string) => {
  if (keys.nameKey === query || keys.altKey === query) return 0
  if (keys.nameKey.startsWith(query) || keys.altKey.startsWith(query)) return 1
  if (keys.words.some((word) => word.startsWith(query))) return 2
  // 낱말 안에서만 찾는다: "바렉"이 "노바 렉스"처럼 띄어쓰기를 넘어 걸리지 않게
  if (keys.words.some((word) => word.includes(query))) return 3
  if (keys.groupKey.includes(query)) return 4
  return null
}
