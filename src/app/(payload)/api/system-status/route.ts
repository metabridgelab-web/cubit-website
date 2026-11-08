import config from '@payload-config'
import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'

import { runSystemChecks } from '@/systemStatus/checks'

// 관리자 화면 "오늘의 시스템 점검". 최고 관리자만 볼 수 있다.
export async function GET(request: NextRequest) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: request.headers })
  const roles = (user as { roles?: string[] } | null)?.roles ?? []
  if (!user || !roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: user ? 403 : 401 })
  return NextResponse.json(await runSystemChecks(payload), { headers: { 'Cache-Control': 'no-store' } })
}
