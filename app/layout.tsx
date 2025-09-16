import './globals.css'
import Link from 'next/link'

export const metadata = { title: 'Pet Web', description: 'Pet lifestyle platform' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <header className="header">
          <Link href="/">홈</Link>
          <Link href="/places">지도</Link>
          <Link href="/events">이벤트</Link>
          <Link href="/community">커뮤니티</Link>
          <Link href="/community/new">글쓰기</Link> 
        </header>
        <main className="container">
          {children}
        </main>
      </body>
    </html>
  )
}
