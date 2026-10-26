import { draftMode } from 'next/headers'

// 관리자 미리보기 중일 때만 화면 아래에 뜨는 안내 띠 (방문자에게는 보이지 않는다)
export async function PreviewBanner() {
  if (!(await draftMode()).isEnabled) return null
  return (
    <div className="keep-tracking fixed inset-x-0 bottom-0 z-[100] flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-lime/60 bg-black/90 px-4 py-3 text-sm text-white backdrop-blur">
      <span>
        <strong className="text-lime">미리보기 중</strong> · 게시하기 전 초안이 보입니다. 방문자에게는 아직 보이지 않습니다.
      </span>
      <form action="/preview/exit" method="post">
        <button type="submit" className="rounded-full border border-white/30 px-4 py-1.5 text-xs hover:border-lime hover:text-lime">
          미리보기 끝내기
        </button>
      </form>
    </div>
  )
}
