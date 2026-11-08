'use client'

import { usePathname } from 'next/navigation'
import { useCallback, useEffect, useState, type ReactNode } from 'react'

import type { CheckState, StatusReport } from '@/systemStatus/checks'

// 관리자 화면 "오늘의 시스템 점검"
// - SystemStatusPopup: 로그인한 뒤 처음 여는 관리자 화면에서 한 번 뜨는 창 (최고 관리자만)
// - SystemStatusPanel: 대시보드 위쪽에 늘 보이는 같은 내용
// 꾸밈은 app/(payload)/custom.scss 의 .cubit-status

const STATE_LABEL: Record<CheckState, string> = { ok: '정상', warn: '확인 필요', pay: '결제 필요', down: '멈춤', unknown: '확인 불가' }
const SHOWN_KEY = 'cubit-status-shown'

const useReport = () => {
  const [report, setReport] = useState<StatusReport | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/system-status', { cache: 'no-store', credentials: 'include' })
      if (!response.ok) throw new Error(`응답 ${response.status}`)
      setReport((await response.json()) as StatusReport)
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e))
    } finally {
      setLoading(false)
    }
  }, [])
  return { report, loading, error, load }
}

function StatusBody({ report, loading, error, onReload }: { report: StatusReport | null; loading: boolean; error: string; onReload: () => void }) {
  const problems = report?.checks.filter((c) => c.state !== 'ok') ?? []
  const when = report ? new Date(report.checkedAt).toLocaleString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
  return (
    <>
      <div className="cubit-status__head">
        <div>
          <p className="cubit-status__eyebrow">오늘의 시스템 점검</p>
          <p className="cubit-status__summary">
            {loading && !report
              ? '점검 중입니다…'
              : error && !report
                ? `점검하지 못했습니다 (${error})`
                : problems.length
                  ? `확인할 항목 ${problems.length}개가 있습니다`
                  : '모두 정상입니다'}
          </p>
          {when ? <p className="cubit-status__when">{when} 기준</p> : null}
        </div>
        <button type="button" className="cubit-status__reload" onClick={onReload} disabled={loading}>
          {loading ? '점검 중…' : '다시 확인'}
        </button>
      </div>
      {report ? (
        <>
          <ul className="cubit-status__list">
            {report.checks.map((check) => (
              <li key={check.key} className={`cubit-status__row cubit-status__row--${check.state}`}>
                <span className="cubit-status__badge">{STATE_LABEL[check.state]}</span>
                <span className="cubit-status__name">{check.name}</span>
                <span className="cubit-status__detail">{check.detail}</span>
                {check.link ? (
                  <a className="cubit-status__link" href={check.link} target="_blank" rel="noopener noreferrer">
                    {check.linkLabel ?? '보기'} ↗
                  </a>
                ) : (
                  <span />
                )}
              </li>
            ))}
          </ul>
          <ul className="cubit-status__todo">
            {report.todo.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={item.count ? 'is-active' : ''}>
                  {item.label} <strong>{item.count}</strong>
                </a>
              </li>
            ))}
          </ul>
          <p className="cubit-status__note">
            Vercel · Cloudflare · Neon의 요금과 한도는 이 화면에서 알 수 없어, 각 줄의 링크에서 확인합니다.
          </p>
        </>
      ) : null}
    </>
  )
}

export function SystemStatusPanel() {
  const { report, loading, error, load } = useReport()
  useEffect(() => {
    void load()
  }, [load])
  return (
    <section className="cubit-status cubit-status--panel" aria-label="오늘의 시스템 점검">
      <StatusBody report={report} loading={loading} error={error} onReload={load} />
    </section>
  )
}

// 관리자 화면 전체를 감싸서, 로그인 뒤 첫 화면에서 한 번 창을 띄운다
export function SystemStatusPopup({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { report, loading, error, load } = useReport()

  useEffect(() => {
    if (open || !pathname?.startsWith('/admin') || /\/(login|logout|forgot|reset|create-first-user)/.test(pathname)) return
    try {
      if (sessionStorage.getItem(SHOWN_KEY)) return
    } catch {
      return
    }
    let cancelled = false
    void (async () => {
      const me = await fetch('/api/users/me', { credentials: 'include' }).then((r) => (r.ok ? r.json() : null)).catch(() => null)
      const roles: string[] = me?.user?.roles ?? []
      if (cancelled || !roles.includes('admin')) return
      try {
        sessionStorage.setItem(SHOWN_KEY, '1')
      } catch {}
      setOpen(true)
      void load()
    })()
    return () => {
      cancelled = true
    }
  }, [pathname, open, load])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      {children}
      {open ? (
        <div className="cubit-status-overlay" role="dialog" aria-modal="true" aria-label="오늘의 시스템 점검" onClick={() => setOpen(false)}>
          <section className="cubit-status cubit-status--popup" onClick={(event) => event.stopPropagation()}>
            <StatusBody report={report} loading={loading} error={error} onReload={load} />
            <button type="button" className="cubit-status__close" onClick={() => setOpen(false)}>
              확인했습니다
            </button>
          </section>
        </div>
      ) : null}
    </>
  )
}
