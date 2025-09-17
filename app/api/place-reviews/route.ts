import { NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../src/lib/supabaseAdmin'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/options'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as any).id

  const { place_id, rating, content } = await req.json()
  if (!place_id || !rating) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const { error } = await supabaseAdmin.from('place_reviews').insert({
    place_id, rating, content, user_id: userId
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true })
}
