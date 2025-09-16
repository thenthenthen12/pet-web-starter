import { supabase } from '../../src/lib/supabaseClient'

export const revalidate = 0;          // ISR 끄기
export const dynamic = 'force-dynamic'; // 항상 동적 렌더
export const fetchCache = 'force-no-store'; // fetch 캐시 금지

export default async function CommunityPage() {
  let items: { id: number; title: string; content: string | null }[] = []
  try {
    const { data, error } = await supabase
      .from('posts')
      .select('id,title,content,created_at')
      .order('created_at', { ascending: false })
    if (error) throw error
    items = data || []
  } catch (e) {}

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">커뮤니티 (읽기 데모)</h2>
      <ul className="space-y-3">
        {items.length === 0 && <li className="text-sm text-gray-500">표시할 글이 없습니다. Supabase 연결/시드를 확인하세요.</li>}
        {items.map(p => (
          <li key={p.id} className="card">
            <div className="font-semibold">{p.title}</div>
            {p.content && <p className="text-sm text-gray-600 whitespace-pre-wrap">{p.content}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
