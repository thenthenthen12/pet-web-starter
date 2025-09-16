export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">🐾 반려인 플랫폼 (웹 베타)</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <section className="card">
          <h2 className="font-semibold">인기 글</h2>
          <p className="text-sm text-gray-500">커뮤니티에서 사람들 많이 보는 글</p>
        </section>
        <section className="card">
          <h2 className="font-semibold">근처 장소</h2>
          <p className="text-sm text-gray-500">지도로 애견동반 카페/병원 탐색</p>
        </section>
      </div>
    </div>
  )
}
