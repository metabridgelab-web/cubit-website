import { act, createElement } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, expect, it } from 'vitest'

import { ReviewStatusCell } from '@/components/admin/ReviewStatusCell'
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

// 목록 한 줄을 흉내 내어, 처리 상태에 따라 회색 표시용 꾸밈 이름이 붙는지 본다
const renderRow = async (status: string) => {
  const table = document.createElement('table')
  const tr = table.appendChild(document.createElement('tbody')).appendChild(document.createElement('tr'))
  const td = tr.appendChild(document.createElement('td'))
  document.body.appendChild(table)
  await act(async () => {
    createRoot(td).render(createElement(ReviewStatusCell, { cellData: status } as never))
  })
  return tr
}

describe('review status cell', () => {
  it('shows pending in white and marks finished rows for greying', async () => {
    const pending = await renderRow('pending')
    expect(pending.textContent).toBe('확인 대기')
    expect(pending.querySelector('.cubit-review-status--pending')).not.toBeNull()
    expect(pending.matches('tr:has(.cubit-review-status--done)')).toBe(false)

    for (const [status, label] of [
      ['registered', '등록 완료'],
      ['ignored', '등록 안 함'],
    ]) {
      const row = await renderRow(status)
      expect(row.textContent).toBe(label)
      expect(row.matches('tr:has(.cubit-review-status--done)')).toBe(true)
    }
  })
})
