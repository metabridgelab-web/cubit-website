import { after } from 'next/server'
import type { Payload } from 'payload'

// 예약한 작업(자동 번역 · 문의 알림 메일)을, 그 작업을 만든 요청의 응답이 나간 직후 바로 처리한다.
// - Vercel에서는 정기 호출이 15분마다라서, 이렇게 하지 않으면 최대 15분 늦어진다.
//   (예전에는 1분마다 불러서 데이터베이스가 하루 종일 깨어 있었고, Neon 사용 시간이 금방 찼다)
// - 이 컴퓨터(개발 서버)는 10초마다 자동 처리하므로 여기서는 하지 않는다.
// - 스크립트처럼 요청 밖에서 불리면 after()를 쓸 수 없으니 건너뛴다. 그 작업은 다음 정기 호출이 처리한다.
export const runJobSoon = (payload: Payload, jobId: number | string | undefined) => {
  if (jobId == null) return
  if (process.env.VERCEL !== '1' && process.env.RUN_JOBS_AFTER_RESPONSE !== 'true') return
  try {
    after(async () => {
      try {
        await payload.jobs.runByID({ id: jobId })
      } catch (error) {
        payload.logger.error({ err: error, msg: `작업 ${jobId}을 바로 처리하지 못했습니다. 다음 정기 호출 때 다시 처리합니다.` })
      }
    })
  } catch {
    // 요청 밖(스크립트 등): 정기 호출이 처리한다
  }
}
