'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CommentForm({ postId }: { postId: number }) {
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    const { error } = await supabase.from('comments').insert({
      post_id: postId,
      author: author || '익명',
      content,
    })
    setLoading(false)
    if (error) return alert(error.message)
    setContent('')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex gap-2">
        <input
          className="border rounded p-2 w-40"
          placeholder="작성자(선택)"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />
        <textarea
          className="flex-1 border rounded p-2 h-20"
          placeholder="댓글 내용을 입력하세요"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
      </div>
      <button
        disabled={loading}
        className="px-4 py-2 rounded bg-orange-500 text-white disabled:opacity-50"
      >
        {loading ? '등록 중...' : '댓글 등록'}
      </button>
    </form>
  )
}
