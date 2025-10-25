import type { NextAuthOptions, Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getMemberByEmail } from "@/lib/sheets";

/**
 * Next-Auth v5 (AuthJS) 設定
 *
 * CredentialsProviderを使用したメールアドレス + パスワード認証
 * セッションにmemberIdを含めるためのJWT callback実装
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "メールアドレス", type: "email" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("メールアドレスとパスワードを入力してください");
        }

        // Google Sheetsから会員情報を取得
        const member = await getMemberByEmail(credentials.email);

        if (!member) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        // パスワードの検証（型安全性のため明示的にチェック）
        const passwordHash = member.passwordHash;
        if (!passwordHash) {
          throw new Error("パスワード情報が不正です");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("メールアドレスまたはパスワードが正しくありません");
        }

        // ユーザーオブジェクトを返す（memberIdを含む）
        return {
          id: member.memberId,
          memberId: member.memberId,
          email: member.email,
          name: member.name,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * JWT callback
     * トークンにmemberIdを追加
     */
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.memberId = user.memberId;
        if (user.email) {
          token.email = user.email;
        }
        if (user.name) {
          token.name = user.name;
        }
      }
      return token;
    },
    /**
     * Session callback
     * セッションにmemberIdを追加
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        if (token.memberId) {
          session.user.memberId = token.memberId;
        }
        if (token.email) {
          session.user.email = token.email;
        }
        if (token.name) {
          session.user.name = token.name;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  secret: process.env.NEXTAUTH_SECRET,
};
