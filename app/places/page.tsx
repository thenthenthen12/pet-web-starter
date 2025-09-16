'use client'
import { useEffect } from 'react'

export default function PlacesPage() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    if (!key) return
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
    script.async = true
    document.head.appendChild(script)
    script.onload = () => {
      // @ts-ignore
      window.kakao.maps.load(async () => {
        const container = document.getElementById('map')
        // @ts-ignore
        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 5
        })

        // ✅ 여기: Supabase API에서 장소 읽어오기
        const res = await fetch('/api/places')
        const places = await res.json()

        places.forEach((p:any) => {
          // @ts-ignore
          const pos = new window.kakao.maps.LatLng(p.lat, p.lng)
          // @ts-ignore
          const marker = new window.kakao.maps.Marker({ map, position: pos })
          // @ts-ignore
          const iw = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:6px;max-width:160px">${p.name}</div>`
          })
          // @ts-ignore
          window.kakao.maps.event.addListener(marker, 'click', () => iw.open(map, marker))
        })

        console.log('markers loaded:', places.length)
      })
    }
  }, [])

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">지도</h2>
      <div id="map" style={{ width: '100%', height: 420 }} />
    </div>
  )
}
