import Link from 'next/link'
import { supabase } from '../../src/lib/supabaseClient'

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
      <h2 className="text-xl font-semibold">커뮤니티</h2>
      <ul className="space-y-2">
        {posts?.map(p => (
          <li key={p.id} className="border rounded p-3">
            <Link href={`/community/${p.id}`} className="font-semibold hover:underline">
              {p.title}
            </Link>
            <div className="text-sm text-gray-600">
              {new Date(p.created_at).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
