'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signIn } from 'next-auth/react'

export default function NewPlacePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', category: 'cafe', address: '', lat: '', lng: ''
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return signIn('kakao')
const res = await fetch("/api/places", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    ...form,
    lat: Number(form.lat),
    lng: Number(form.lng),
  }),
})

const data = await res.json()
console.log("📌 Response:", data)   // 🔥 서버 응답 찍기

if (!res.ok) {
  alert("에러: " + (data.error || "Unknown error"))
  return
}
    if (!res.ok) return alert('등록 실패')
    router.push('/places')
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h2 className="text-xl font-semibold">장소 등록</h2>
      <input className="w-full border p-2 rounded" placeholder="이름"
             value={form.name} onChange={e=>setForm(s=>({...s,name:e.target.value}))} required />
      <select className="w-full border p-2 rounded"
              value={form.category} onChange={e=>setForm(s=>({...s,category:e.target.value}))}>
        <option value="cafe">카페</option>
        <option value="park">공원</option>
        <option value="hospital">동물병원</option>
        <option value="store">용품점</option>
      </select>
      <input className="w-full border p-2 rounded" placeholder="주소(선택)"
             value={form.address} onChange={e=>setForm(s=>({...s,address:e.target.value}))} />
      <div className="grid grid-cols-2 gap-2">
        <input className="border p-2 rounded" placeholder="위도(lat)"
               value={form.lat} onChange={e=>setForm(s=>({...s,lat:e.target.value}))} required />
        <input className="border p-2 rounded" placeholder="경도(lng)"
               value={form.lng} onChange={e=>setForm(s=>({...s,lng:e.target.value}))} required />
      </div>
      <button className="px-4 py-2 rounded bg-orange-500 text-white">등록</button>
      <p className="text-sm text-gray-500">※ 지도에서 좌표 찍는 UI는 다음 단계에 붙일게!</p>
    </form>
  )
}
