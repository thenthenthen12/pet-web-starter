'use client'

import { useEffect, useRef } from 'react'

export default function MapPreview({ lat, lng }: { lat?: number; lng?: number }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (lat == null || lng == null) return
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY
    if (!key) return

    const scriptId = 'kakao-map-sdk'
    const onReady = () => {
      // @ts-ignore
      if (!window.kakao || !window.kakao.maps) return
      // @ts-ignore
      window.kakao.maps.load(() => {
        if (!ref.current) return
        // @ts-ignore
        const map = new window.kakao.maps.Map(ref.current, {
          center: new window.kakao.maps.LatLng(lat, lng),
          level: 4
        })
        // @ts-ignore
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(lat, lng)
        })
      })
    }

    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script')
      s.id = scriptId
      s.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`
      s.async = true
      document.head.appendChild(s)
      s.onload = onReady
    } else {
      onReady()
    }
  }, [lat, lng])

  return <div ref={ref} style={{ width: '100%', height: 220, border: '1px solid #eee' }} />
}
