'use client'

import { useState } from 'react'
// 경로는 프로젝트 구조에 맞게 조정 (new/가 한 단계 더 깊으니 보통 아래가 맞습니다)
import { supabase } from '../../../src/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import MapPreview from '../MapPreview'

export default function NewPlacePage() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('cafe')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | undefined>()
  const [lng, setLng] = useState<number | undefined>()
  const [loadingGeo, setLoadingGeo] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const router = useRouter()

  async function findCoords() {
    if (!address.trim()) {
      setMsg('주소(또는 장소명)를 입력해주세요.')
      return
    }
    setMsg(null)
    setLoadingGeo(true)
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(address)}`)
      const data = await res.json()
      if (!res.ok) {
        setMsg(data?.error || '좌표를 찾을 수 없습니다.')
        setLat(undefined)
        setLng(undefined)
        return
      }
      setLat(data.lat)
      setLng(data.lng)
      setMsg('좌표를 찾았습니다. 미리보기 지도를 확인하세요.')
    } catch (e: any) {
      setMsg('좌표 변환 중 오류가 발생했습니다.')
    } finally {
      setLoadingGeo(false)
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg(null)
    if (!name.trim()) return setMsg('이름을 입력해주세요.')
    if (!category.trim()) return setMsg('카테고리를 선택해주세요.')
    if (lat == null || lng == null) return setMsg('먼저 주소로 좌표를 찾아주세요.')

    setSaving(true)
    try {
      const { error } = await supabase.from('places').insert({
        name,
        category,
        address,
        lat,
        lng
        // user_id: 추후 Auth 붙인 후 auth.user.id로 저장
      })
      if (error) {
        setMsg(`저장 실패: ${error.message}`)
      } else {
        router.push('/places')
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-4">
      <h2 className="text-xl font-semibold">장소 등록</h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">이름</label>
          <input
            className="w-full border px-3 py-2 rounded"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="예) 강남 애견카페"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">카테고리</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            <option value="cafe">카페</option>
            <option value="park">공원</option>
            <option value="hospital">병원</option>
            <option value="hotel">숙소</option>
            <option value="store">용품</option>
          </select>
        </div>

        <div>
          <label className="block text-sm mb-1">주소 / 장소명</label>
          <div className="flex gap-2">
            <input
              className="flex-1 border px-3 py-2 rounded"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="예) 서울 강남구 테헤란로 123"
            />
            <button
              type="button"
              onClick={findCoords}
              className="px-3 py-2 rounded bg-blue-600 text-white"
              disabled={loadingGeo}
            >
              {loadingGeo ? '검색중...' : '좌표찾기'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            도로명/지번 주소가 없으면 장소명으로도 검색해볼게요.
          </p>
        </div>

        {(lat != null && lng != null) && (
          <div>
            <div className="text-sm mb-2">
              찾은 좌표: <b>{lat}</b>, <b>{lng}</b>
            </div>
            <MapPreview lat={lat} lng={lng} />
          </div>
        )}

        {msg && <div className="text-sm text-amber-700">{msg}</div>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving || lat == null || lng == null}
            className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50"
          >
            {saving ? '저장중...' : '저장'}
          </button>
        </div>
      </form>
    </div>
  )
}
