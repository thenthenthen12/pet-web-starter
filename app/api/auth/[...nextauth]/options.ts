import type { NextAuthOptions } from "next-auth"
import KakaoProvider from "next-auth/providers/kakao"

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
      if (account && profile) {
        token.provider = "kakao"
      }
      return token
    },
    async session({ session, token }) {
      (session.user as any).id = token.sub
      return session
    }
  },
  secret: process.env.AUTH_SECRET
}
