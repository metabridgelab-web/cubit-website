import { afterEach, describe, expect, it, vi } from 'vitest'

// next/server의 after()를 흉내 낸다: 넘겨받은 일을 모아 두었다가 "응답이 나간 뒤"에 실행
const scheduled: (() => Promise<void>)[] = []
let insideRequest = true
vi.mock('next/server', () => ({
  after: (task: () => Promise<void>) => {
    if (!insideRequest) throw new Error('`after` was called outside a request scope')
    scheduled.push(task)
  },
}))

const { runJobSoon } = await import('@/jobs/runSoon')

const fakePayload = () => ({ jobs: { runByID: vi.fn(async () => ({})) }, logger: { error: vi.fn() } })

describe('runJobSoon', () => {
  afterEach(() => {
    scheduled.length = 0
    insideRequest = true
    vi.unstubAllEnvs()
  })

  it('runs the queued job right after the response on Vercel', async () => {
    vi.stubEnv('VERCEL', '1')
    const payload = fakePayload()
    runJobSoon(payload as never, 42)
    expect(payload.jobs.runByID).not.toHaveBeenCalled()
    await Promise.all(scheduled.map((task) => task()))
    expect(payload.jobs.runByID).toHaveBeenCalledWith({ id: 42 })
  })

  it('leaves the job to the scheduled run outside a request (scripts) and on the dev server', () => {
    vi.stubEnv('VERCEL', '1')
    insideRequest = false
    expect(() => runJobSoon(fakePayload() as never, 1)).not.toThrow()

    insideRequest = true
    vi.stubEnv('VERCEL', '')
    runJobSoon(fakePayload() as never, 2)
    expect(scheduled).toHaveLength(0)
  })

  it('logs instead of failing when the job cannot run', async () => {
    vi.stubEnv('VERCEL', '1')
    const payload = fakePayload()
    payload.jobs.runByID.mockRejectedValueOnce(new Error('superseded'))
    runJobSoon(payload as never, 7)
    await Promise.all(scheduled.map((task) => task()))
    expect(payload.logger.error).toHaveBeenCalledOnce()
  })
})
