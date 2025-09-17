import WriteButton from './WriteButton'
import { supabase } from '@/src/lib/supabaseClient'

export const revalidate = 0
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function CommunityPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, content, created_at')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">커뮤니티</h2>
        <WriteButton />
      </div>

      <ul className="space-y-2">
        {posts?.map((p) => (
          <li key={p.id} className="border rounded p-3">
            <a href={`/community/${p.id}`} className="font-semibold underline">
              {p.title}
            </a>
            <div className="text-sm text-gray-600">
              {new Date(p.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
