// app/api/geocode/route.ts
import { NextResponse } from 'next/server'

const KAKAO_HOST = 'https://dapi.kakao.com'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.trim()
  if (!q) return NextResponse.json({ error: 'Missing query ?q=' }, { status: 400 })

  const headers = { Authorization: `KakaoAK ${process.env.KAKAO_REST_KEY}` }

  // 1) 도로명/지번 주소로 좌표 탐색
  const addrRes = await fetch(
    `${KAKAO_HOST}/v2/local/search/address.json?query=${encodeURIComponent(q)}`,
    { headers }
  )
  const addrJson = await addrRes.json()

  // documents[0]: { x: lng, y: lat }  ※ Kakao는 x=경도, y=위도
  let doc = addrJson?.documents?.[0]

  // 2) 주소가 아니면 키워드(장소명)로 보조 탐색
  if (!doc) {
    const kwRes = await fetch(
      `${KAKAO_HOST}/v2/local/search/keyword.json?query=${encodeURIComponent(q)}`,
      { headers }
    )
    const kwJson = await kwRes.json()
    doc = kwJson?.documents?.[0]
  }

  if (!doc) return NextResponse.json({ error: 'not_found' }, { status: 404 })

  const lat = Number(doc.y) // 위도
  const lng = Number(doc.x) // 경도

  return NextResponse.json({ lat, lng, raw: doc })
}
