import './globals.css'
import Link from 'next/link'
import Providers from './Providers'
import HeaderAuthClient from './HeaderAuthClient'

export const metadata = {
  title: 'Pet Web',
  description: 'Pet lifestyle platform'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>
          <header className="header flex gap-4 p-4 border-b">
            <Link href="/">홈</Link>
            <Link href="/places">지도</Link>
            <Link href="/community">커뮤니티</Link>
            <Link href="/events">커뮤니티</Link>
            <HeaderAuthClient />
          </header>
          <main className="container p-4">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
