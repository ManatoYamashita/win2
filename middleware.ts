import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

/**
 * Next-Auth認証保護ミドルウェア
 *
 * 認証が必要なルート:
 * - /mypage (マイページ)
 * - /mypage/* (マイページサブページ)
 * - /deals (案件一覧、会員限定)
 *
 * 未認証の場合は /login にリダイレクト
 */
export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

/**
 * ミドルウェアの適用対象パス
 */
export const config = {
  matcher: ["/mypage/:path*", "/deals/:path*"],
};
