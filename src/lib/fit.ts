// 큰 제목(아티스트 이름 등)이 화면 폭 안에 들어가도록 글자 크기를 정한다.
// 짧은 이름(14자 이하)은 통째로 한 줄에, 긴 이름은 가장 긴 단어 기준으로 맞춘다.
// lines를 주면 긴 제목을 그 줄 수 안에 들어가게 맞춘다 (가장 긴 단어보다 작아지지는 않는다).
// 굵은 대문자 한 글자는 대략 글자 크기의 0.72배 폭이고, 한글 · 한자 · 가나는 거의 정사각형이라 1배로 센다.
const width = (text: string) => [...text].reduce((sum, char) => sum + (/[ᄀ-ᇿ぀-ヿ㄰-㆏一-鿿가-힣]/.test(char) ? 1 : 0.72), 0)

export const fitHeadline = (text: string, { maxRem, widthVw, lines = 1 }: { maxRem: number; widthVw: number; lines?: number }) => {
  const longestWord = Math.max(...text.split(/\s+/).map(width), 0.72)
  const units = text.length <= 14 ? width(text) : Math.max(longestWord, lines > 1 ? width(text) / lines : longestWord)
  return `min(${maxRem}rem, calc(${widthVw}vw / ${Math.max(units, 0.72).toFixed(2)}))`
}
