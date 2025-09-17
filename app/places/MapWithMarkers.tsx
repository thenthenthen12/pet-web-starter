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

    const scriptId = 'kakao-map-sdk'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
      script.async = true
      document.head.appendChild(script)
      script.onload = () => {
        // @ts-ignore
        if (window.kakao && window.kakao.maps) {
          // @ts-ignore
          window.kakao.maps.load(initMap)
        }
      }
    } else {
      // 이미 로드된 경우
      // @ts-ignore
      if (window.kakao && window.kakao.maps) {
        // @ts-ignore
        window.kakao.maps.load(initMap)
      }
    }

    function initMap() {
      const container = document.getElementById('map')
      if (!container) return

      // 중심좌표: 데이터 있으면 첫 장소 기준, 없으면 서울시청
      const center = places.length
        ? new window.kakao.maps.LatLng(Number(places[0].lat), Number(places[0].lng))
        : new window.kakao.maps.LatLng(37.5665, 126.9780)

      // @ts-ignore
      const map = new window.kakao.maps.Map(container, {
        center,
        level: 7
      })

      // 마커 찍기
      places.forEach(p => {
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
    }
  }, [places])

  return <div id="map" style={{ width: '100%', height: 420 }} />
}
