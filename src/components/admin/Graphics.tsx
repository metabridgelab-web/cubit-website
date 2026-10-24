// 관리자 화면의 로고: 로그인 화면(Logo)과 왼쪽 메뉴 맨 위(Icon). 꾸밈은 app/(payload)/custom.scss

export function Logo() {
  return (
    <div className="cubit-logo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/cubit-logo.png" alt="" width={72} height={72} />
      <div>
        <p className="cubit-logo__name">CUBIT ENTERTAINMENT</p>
        <p className="cubit-logo__sub">관리자 · ADMIN</p>
      </div>
    </div>
  )
}

export function Icon() {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/cubit-logo.png" alt="CUBIT" width={28} height={28} className="cubit-icon" />
}
