import NextAuth from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"
import type { NextAuthOptions } from "next-auth"

export const authOptions: NextAuthOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID!,
      clientSecret: process.env.KAKAO_CLIENT_SECRET || ""
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account, profile }) {
      // 첫 로그인 시 카카오 계정 id를 token.sub로 보유
      if (account && profile) {
        token.provider = "kakao"
      }
      return token
    },
    async session({ session, token }) {
      // 클라이언트에서 사용할 수 있게 id 주입
      // Kakao는 보통 token.sub에 식별자가 들어옵니다.
      (session.user as any).id = token.sub
      return session
    }
  },
  secret: process.env.AUTH_SECRET
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
