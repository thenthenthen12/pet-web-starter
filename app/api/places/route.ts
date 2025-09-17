import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
// ✅ 너의 경로에 맞춰서 import
import { authOptions } from '../../../app/api/auth/[...nextauth]/options'
import { supabaseAdmin } from '../../../src/lib/supabaseAdmin'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json().catch(() => null) as any
  const name = body?.name?.trim()
  const category = body?.category?.trim()
  const address = body?.address?.trim() || null
  const lat = Number(body?.lat)
  const lng = Number(body?.lng)

  if (!name || !category || Number.isNaN(lat) || Number.isNaN(lng)) {
    return NextResponse.json({ error: 'invalid_payload' }, { status: 400 })
  }

  // ✅ options.ts에서 session 콜백으로 넣어둔 값
  const userId = (session.user as any)?.id
  if (!userId) {
    return NextResponse.json({ error: 'no_user_id_in_session' }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('places').insert({
    name, category, address, lat, lng, user_id: String(userId),
  })

  if (error) {
    console.error('[places insert error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
