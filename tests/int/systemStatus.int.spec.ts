import { act, createElement } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import type { StatusReport } from '@/systemStatus/checks'

let pathname = '/admin'
vi.mock('next/navigation', () => ({ usePathname: () => pathname }))

const { SystemStatusPopup } = await import('@/components/admin/SystemStatus')
;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const report: StatusReport = {
  checkedAt: '2026-11-08T09:00:00.000Z',
  checks: [
    { key: 'site', name: '사이트 (Vercel)', state: 'ok', detail: '작동 중' },
    { key: 'claude', name: '자동 번역 (Claude API)', state: 'pay', detail: '크레딧이 바닥났습니다', link: 'https://platform.claude.com/settings/billing', linkLabel: '크레딧 충전하기' },
    { key: 'youtube', name: '유튜브 자동 등록', state: 'down', detail: '멈췄을 수 있습니다' },
  ],
  todo: [{ label: '새 문의', count: 2, href: '/admin/collections/inquiries' }],
}

const mockFetch = (roles: string[]) =>
  vi.fn(async (url: string) =>
    url.startsWith('/api/users/me')
      ? new Response(JSON.stringify({ user: roles.length ? { roles } : null }), { status: 200 })
      : new Response(JSON.stringify(report), { status: 200 }),
  )

let root: Root | null = null
let host: HTMLElement
const mount = async () => {
  host = document.createElement('div')
  document.body.appendChild(host)
  await act(async () => {
    root = createRoot(host)
    root.render(createElement(SystemStatusPopup, null, 'page'))
  })
  // 응답을 받아 화면을 그릴 때까지 기다린다
  for (let i = 0; i < 5; i++) await act(async () => new Promise((resolve) => setTimeout(resolve, 0)))
}

describe('system status popup', () => {
  beforeEach(() => {
    sessionStorage.clear()
    pathname = '/admin'
  })
  afterEach(async () => {
    await act(async () => root?.unmount())
    host?.remove()
    vi.unstubAllGlobals()
  })

  it('opens once for an admin after login and shows each service state', async () => {
    vi.stubGlobal('fetch', mockFetch(['admin']))
    await mount()
    const text = host.textContent ?? ''
    expect(text).toContain('확인할 항목 2개가 있습니다')
    expect(text).toContain('결제 필요')
    expect(text).toContain('멈춤')
    expect(host.querySelector('a[href="https://platform.claude.com/settings/billing"]')?.textContent).toContain('크레딧 충전하기')
    expect(host.querySelector('[role="dialog"]')).not.toBeNull()
    expect(sessionStorage.getItem('cubit-status-shown')).toBe('1')
  })

  it('stays closed for other roles', async () => {
    vi.stubGlobal('fetch', mockFetch(['editor']))
    await mount()
    expect(host.querySelector('[role="dialog"]')).toBeNull()
  })

  it('stays closed on the login page and after it was shown once', async () => {
    vi.stubGlobal('fetch', mockFetch(['admin']))
    pathname = '/admin/login'
    await mount()
    expect(host.querySelector('[role="dialog"]')).toBeNull()
    await act(async () => root?.unmount())
    host.remove()

    pathname = '/admin'
    sessionStorage.setItem('cubit-status-shown', '1')
    await mount()
    expect(host.querySelector('[role="dialog"]')).toBeNull()
  })
})
