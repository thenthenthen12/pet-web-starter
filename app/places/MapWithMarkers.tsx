'use client'

import { useEffect } from 'react'

type Place = {
  id: number
  name: string
  lat: number
  lng: number
  address?: string | null
  category?: string | null
}

export default function MapWithMarkers({ places }: { places: Place[] }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    if (!key) return

    // 스크립트 로드
    const scriptId = 'kakao-map-sdk'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
      script.async = true
      document.head.appendChild(script)
      script.onload = setup
    } else {
      setup()
    }

    function setup() {
      // @ts-ignore
      window.kakao.maps.load(() => {
        const container = document.getElementById('map')
        if (!container) return
        // @ts-ignore
        const map = new window.kakao.maps.Map(container, {
          // 서울 시청 근처
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 7
        })

        // 마커 찍기
        places.forEach(p => {
          // @ts-ignore
          const pos = new window.kakao.maps.LatLng(Number(p.lat), Number(p.lng))
          // @ts-ignore
          const marker = new window.kakao.maps.Marker({ map, position: pos })
          // @ts-ignore
          const iw = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:6px 8px;max-width:220px"><b>${p.name}</b><br/>${p.address ?? ''}</div>`
          })
          // @ts-ignore
          window.kakao.maps.event.addListener(marker, 'click', () => {
            iw.open(map, marker)
          })
        })
      })
    }
  }, [places])

  return <div id="map" style={{ width: '100%', height: 420 }} />
}
