import { supabase } from '../../../src/lib/supabaseClient'
import CommentForm from './parts/CommentForm'
import CommentItem from './parts/CommentItem'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

type Props = { params: { id: string } }

export default async function PostDetail({ params }: Props) {
  const postId = Number(params.id)

  const { data: post } = await supabase
    .from('posts')
    .select('id, title, content, created_at')
    .eq('id', postId)
    .single()

  const { data: comments } = await supabase
    .from('comments')
    .select('id, author, content, created_at')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (!post) return <div>존재하지 않는 글입니다.</div>

  return (
    <div className="space-y-4">
      <div className="border rounded p-4">
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="text-sm text-gray-600">
          {new Date(post.created_at).toLocaleString()}
        </div>
        <p className="mt-3 whitespace-pre-wrap">{post.content}</p>
      </div>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">댓글</h2>
        <CommentForm postId={postId} />
        <ul className="space-y-2">
          {(comments ?? []).map(c => (
            <CommentItem key={c.id} comment={c} />
          ))}
        </ul>
      </section>
    </div>
  )
}
