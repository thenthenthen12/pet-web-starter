'use client'

import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'

export default function WriteButton() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'

  if (loading) return null

  // 로그인 O → 글쓰기 링크 / 로그인 X → 카카오 로그인 유도 버튼
  return session ? (
    <Link
      href="/community/new"
      className="px-3 py-2 rounded bg-orange-500 text-white text-sm"
    >
      글쓰기
    </Link>
  ) : (
    <button
      className="px-3 py-2 rounded bg-yellow-400 text-black text-sm"
      onClick={() => signIn('kakao')}
    >
      카카오로 로그인하고 글쓰기
    </button>
  )
}
