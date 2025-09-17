'use client'
import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ReviewForm({ placeId }: { placeId: number }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!session) return signIn('kakao')
    const res = await fetch('/api/place-reviews', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ place_id: placeId, rating, content })
    })
    if (!res.ok) return alert('리뷰 등록 실패')
    setContent('')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="flex gap-2 items-start">
      <select value={rating} onChange={e=>setRating(Number(e.target.value))}
              className="border p-2 rounded">
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}점</option>)}
      </select>
      <textarea className="flex-1 border p-2 rounded h-20"
                placeholder="리뷰 내용을 입력하세요"
                value={content} onChange={e=>setContent(e.target.value)} />
      <button className="px-4 py-2 rounded bg-orange-500 text-white">등록</button>
    </form>
  )
}
