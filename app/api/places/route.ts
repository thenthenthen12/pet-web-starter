import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../src/lib/supabaseAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const userId = (session.user as any).id

  const { name, category, lat, lng, address } = await req.json()

  if (!name || lat === undefined || lng === undefined) {
    return NextResponse.json({ error: 'Invalid data', body: { name, lat, lng } }, { status: 400 })
  }

  const { error } = await supabaseAdmin.from('places').insert({
    name,
    category,
    lat: Number(lat),
    lng: Number(lng),
    address,
    user_id: userId,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}

