'use client'

import type { DefaultCellComponentProps } from 'payload'

// "확인할 유튜브 영상" 목록의 처리 상태 칸.
// 처리가 끝난 영상(등록 완료 · 등록 안 함)은 기록으로 남기되, 줄 전체를 회색으로 흐리게 보이게 한다.
// (줄을 흐리게 하는 꾸밈은 app/(payload)/custom.scss 의 .cubit-review-status)
export const REVIEW_STATUS_LABEL: Record<string, string> = { pending: '확인 대기', registered: '등록 완료', ignored: '등록 안 함' }

export function ReviewStatusCell({ cellData }: DefaultCellComponentProps) {
  const status = typeof cellData === 'string' ? cellData : ''
  const done = status !== '' && status !== 'pending'
  return (
    <span className={`cubit-review-status cubit-review-status--${done ? 'done' : 'pending'}`}>{REVIEW_STATUS_LABEL[status] ?? status}</span>
  )
}
