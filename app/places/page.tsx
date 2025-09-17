// app/places/page.tsx
import Link from 'next/link'
import { supabase } from '../../src/lib/supabaseClient'
import MapWithMarkers from './MapWithMarkers'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function PlacesPage() {
  const { data, error } = await supabase
    .from('places')
    .select('id,name,lat,lng,address,category') // .order('created_at', { ascending: false }) 제거

  if (error) {
    console.error('[places select error]', error)
  }

  const places = Array.isArray(data) ? data : []

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">지도</h2>

      <div className="text-sm text-gray-500">
        불러온 장소: <b>{places.length}</b>개
      </div>

      <Link
        href="/places/new"
        className="px-3 py-2 rounded bg-orange-500 text-white text-sm"
      >
        장소 등록
      </Link>

      {/* 데이터가 0개여도 컴포넌트는 문제 없이 렌더 */}
      <MapWithMarkers places={places as any} />
    </div>
  )
}
