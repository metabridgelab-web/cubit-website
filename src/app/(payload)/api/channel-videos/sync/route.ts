import config from '@payload-config'
import { NextResponse, type NextRequest } from 'next/server'
import { getPayload } from 'payload'

import { syncChannelVideos } from '@/channelVideos/sync'

// vercel.json의 정기 호출이 1시간마다 부른다. 채널의 새 영상을 찾아 가수에 등록한다.
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(await syncChannelVideos(await getPayload({ config })))
}
