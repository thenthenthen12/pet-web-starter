// app/places/page.tsx
import Link from 'next/link'
import { supabase } from '../../src/lib/supabaseClient'
import MapWithMarkers from './MapWithMarkers'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function PlacesPage() {
  const { data: places } = await supabase
    .from('places')
    .select('id,name,lat,lng,address,category')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">지도</h2>
      <Link
        href="/places/new"
        className="px-3 py-2 rounded bg-orange-500 text-white text-sm"
      >
        장소 등록
      </Link>

      {/* 지도 + 마커 */}
      <MapWithMarkers places={places ?? []} />
    </div>
  )
}
