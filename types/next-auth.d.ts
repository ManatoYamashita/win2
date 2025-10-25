import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  /**
   * Session型の拡張
   * memberIdをセッションに含める
   */
  interface Session {
    user: {
      memberId: string;
    } & DefaultSession["user"];
  }

  /**
   * User型の拡張
   * memberIdをユーザー情報に含める
   */
  interface User extends DefaultUser {
    memberId: string;
  }
}

declare module "next-auth/jwt" {
  /**
   * JWT型の拡張
   * memberIdをトークンに含める
   */
  interface JWT {
    memberId?: string;
  }
}
