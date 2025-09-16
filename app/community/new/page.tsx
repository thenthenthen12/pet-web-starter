'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function NewPostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return alert('제목을 입력하세요')
    setLoading(true)
    const { error } = await supabase.from('posts').insert({ title, content })
    setLoading(false)
    if (error) return alert(error.message)
    alert('등록 완료!')
    router.push('/community')
  }

  return (
    <form onSubmit={submit} className="space-y-3 max-w-md">
      <h2 className="text-xl font-semibold">글 쓰기</h2>
      <input className="w-full border p-2 rounded" placeholder="제목"
             value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea className="w-full border p-2 rounded h-32" placeholder="내용"
                value={content} onChange={e=>setContent(e.target.value)} />
      <button disabled={loading}
        className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50">
        {loading ? '등록 중...' : '등록'}
      </button>
    </form>
  )
}
