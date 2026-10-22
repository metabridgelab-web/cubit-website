import type { Access, FieldAccess, PayloadRequest } from 'payload'

// 관리자 계정 역할
// - admin: 최고 관리자 (모든 기능, 계정·권한 관리)
// - editor: 편집자 (콘텐츠 등록·수정·삭제)
// - translator: 번역 검수자 (기존 콘텐츠의 번역 수정만)
// - sales: 영업 담당자 (견적 요청·문의·작업 사례)
// - disclosure: 공시 담당자 (투자자 정보, 3차 오픈에서 사용)
export const ROLES = [
  { label: '최고 관리자', value: 'admin' },
  { label: '편집자', value: 'editor' },
  { label: '번역 검수자', value: 'translator' },
  { label: '영업 담당자', value: 'sales' },
  { label: '공시 담당자', value: 'disclosure' },
] as const

export type Role = (typeof ROLES)[number]['value']

export const hasRole = (req: PayloadRequest, ...roles: Role[]): boolean => {
  const userRoles = (req.user as { roles?: Role[] } | null)?.roles ?? []
  return userRoles.includes('admin') || roles.some((role) => userRoles.includes(role))
}

export const anyone: Access = () => true

export const isAdmin: Access = ({ req }) => hasRole(req)

export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

// 콘텐츠를 새로 만들거나 지울 수 있는 사람
export const canEditContent: Access = ({ req }) => hasRole(req, 'editor')

// 콘텐츠를 고칠 수 있는 사람 (번역 검수자 포함)
export const canUpdateContent: Access = ({ req }) => hasRole(req, 'editor', 'translator')

// 접수함(견적 요청·문의)을 볼 수 있는 사람
export const canHandleInbox: Access = ({ req }) => hasRole(req, 'sales')

// 방문자에게는 게시된 글만, 관리자에게는 임시저장 글까지 보여준다
export const publishedOrLoggedIn: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

// 접수 처리 상태·담당자·메모처럼 관리자만 다루는 칸
export const inboxFieldAccess: FieldAccess = ({ req }) => hasRole(req, 'sales')
