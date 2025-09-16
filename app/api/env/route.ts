import { NextResponse } from 'next/server'
export async function GET() {
  return NextResponse.json({
    kakao: process.env.NEXT_PUBLIC_KAKAO_MAP_KEY ?? null,
  })
}
