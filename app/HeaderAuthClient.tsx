'use client'
import { useEffect, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function HeaderAuthClient() {
  const { data: session, status } = useSession()
  const loading = status === 'loading'
  const email = session?.user?.email
  return (
    <div className="ml-auto flex items-center gap-3">
      {loading ? (
        <span className="text-sm text-gray-500">로그인 확인중…</span>
      ) : session ? (
        <>
          <span className="text-sm text-gray-600">{email ?? '카카오 로그인'}</span>
          <button onClick={() => signOut()} className="px-3 py-1 rounded bg-gray-200">로그아웃</button>
        </>
      ) : (
        <button onClick={() => signIn('kakao')} className="px-3 py-1 rounded bg-yellow-400">카카오로 로그인</button>
      )}
    </div>
  )
}
