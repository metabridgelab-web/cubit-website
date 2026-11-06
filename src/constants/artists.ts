// 아티스트 목록의 장르 선택 상자에서 "전체"를 고를 때 주소에 붙는 값 (?genre=all). 아무것도 안 붙이면 첫 장르(가수 → K-Pop)가 보인다
export const ALL_GENRES = 'all'

// 사이트 검색이 받아 가는 아티스트 한 명의 정보
export type ArtistSearchEntry = {
  name: string
  slug: string
  searchNames: string
  isGroup: boolean
  groups: string[]
  groupSearchNames: string
  photo: string | null
}
