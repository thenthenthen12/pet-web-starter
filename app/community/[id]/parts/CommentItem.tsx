'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Comment = {
  id: number
  author: string | null
  content: string
  created_at: string
}

export default function CommentItem({ comment }: { comment: Comment }) {
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(comment.content)
  const router = useRouter()

  async function save() {
    const { error } = await supabase
      .from('comments')
      .update({ content: text })
      .eq('id', comment.id)
    if (error) return alert(error.message)
    setEditing(false)
    router.refresh()
  }

  async function remove() {
    if (!confirm('정말 삭제할까요?')) return
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', comment.id)
    if (error) return alert(error.message)
    router.refresh()
  }

  return (
    <li className="border rounded p-3">
      <div className="text-sm text-gray-600">
        {(comment.author ?? '익명')} · {new Date(comment.created_at).toLocaleString()}
      </div>

      {editing ? (
        <div className="mt-2 space-y-2">
          <textarea
            className="w-full border rounded p-2 h-24"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={save}>저장</button>
            <button className="px-3 py-1 rounded bg-gray-300" onClick={()=>{setEditing(false); setText(comment.content)}}>취소</button>
          </div>
        </div>
      ) : (
        <p className="mt-2 whitespace-pre-wrap">{comment.content}</p>
      )}

      <div className="mt-2 flex gap-2 text-sm">
        <button className="underline text-blue-600" onClick={()=>setEditing(v=>!v)}>
          {editing ? '편집 취소' : '수정'}
        </button>
        <button className="underline text-red-600" onClick={remove}>삭제</button>
      </div>
    </li>
  )
}
