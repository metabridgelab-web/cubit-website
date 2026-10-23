// 큰 제목(아티스트 이름 등)이 화면 폭 안에 들어가도록 글자 크기를 정한다.
// 짧은 이름(14자 이하)은 통째로 한 줄에, 긴 이름은 가장 긴 단어 기준으로 맞춘다.
// 굵은 대문자 한 글자는 대략 글자 크기의 0.72배 폭이다.
export const fitHeadline = (text: string, { maxRem, widthVw }: { maxRem: number; widthVw: number }) => {
  const chars = text.length <= 14 ? text.length : Math.max(...text.split(/\s+/).map((word) => word.length), 1)
  return `min(${maxRem}rem, calc(${widthVw}vw / ${(Math.max(chars, 1) * 0.72).toFixed(2)}))`
}
