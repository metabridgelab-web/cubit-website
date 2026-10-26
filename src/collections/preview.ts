import type { CollectionConfig } from 'payload'

// 관리자 화면 오른쪽 위 "미리보기" 버튼: 저장한 초안을 실제 사이트 모양으로 새 탭에 연다 (게시 전 확인용).
// /preview 가 로그인한 관리자인지 확인한 뒤 초안 보기를 켜고 해당 페이지로 보낸다.
export const previewButton =
  (collection: 'artists' | 'case-studies' | 'pages'): NonNullable<CollectionConfig['admin']>['preview'] =>
  (doc, { locale }) =>
    doc?.id ? `/preview?collection=${collection}&id=${doc.id}&locale=${locale}` : null
