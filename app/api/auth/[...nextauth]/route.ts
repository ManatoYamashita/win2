import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Next-Auth v5 (AuthJS) API Route Handler
 *
 * GET /api/auth/session - セッション情報取得
 * POST /api/auth/signin - ログイン
 * POST /api/auth/signout - ログアウト
 * GET /api/auth/csrf - CSRFトークン取得
 * GET /api/auth/providers - プロバイダー一覧
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
