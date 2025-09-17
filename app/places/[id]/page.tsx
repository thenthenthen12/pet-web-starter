import { supabase } from '@/src/lib/supabaseClient'
import ReviewForm from './parts/ReviewForm'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function PlaceDetail({ params }: { params: { id: string } }) {
  const id = Number(params.id)

  const { data: place } = await supabase
    .from('places')
    .select('id,name,category,lat,lng,address,created_at')
    .eq('id', id).single()

  const { data: stats } = await supabase
    .from('place_rating_stats')
    .select('avg_rating,review_count')
    .eq('place_id', id).single()

  const { data: reviews } = await supabase
    .from('place_reviews')
    .select('id,rating,content,created_at')
    .eq('place_id', id).order('created_at', { ascending: false })

  if (!place) return <div>없는 장소입니다.</div>

  return (
    <div className="space-y-4">
      <div className="border rounded p-4">
        <h1 className="text-2xl font-bold">{place.name}</h1>
        <div className="text-sm text-gray-600">
          {place.category} · {place.address}
        </div>
        <div className="mt-2">
          ⭐ {stats?.avg_rating ?? 0} ({stats?.review_count ?? 0}개)
        </div>
        <div className="text-sm text-gray-500 mt-1">
          위치: {place.lat}, {place.lng}
        </div>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">리뷰</h2>
        <ReviewForm placeId={id} />
        <ul className="space-y-2">
          {(reviews ?? []).map(r => (
            <li key={r.id} className="border rounded p-3">
              <div>⭐ {r.rating}</div>
              <p className="mt-1 whitespace-pre-wrap">{r.content}</p>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(r.created_at).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
