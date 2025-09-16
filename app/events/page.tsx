import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function EventsPage() {
  const { data } = await supabase
    .from('events')
    .select('*')
    .order('start_at', { ascending: true })

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">이벤트</h2>
      <ul className="space-y-2">
        {(data||[]).map((e:any)=>(
          <li key={e.id} className="border rounded p-3">
            <div className="font-semibold">{e.title}</div>
            <div className="text-sm text-gray-600">
              {e.region} · {e.venue} · {new Date(e.start_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
