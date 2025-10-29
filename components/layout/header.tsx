"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * 共通Headerコンポーネント
 *
 * 機能:
 * - WIN×II ロゴ表示
 * - ナビゲーションリンク（トップページ、ブログ、案件一覧、プロフィール）
 * - ログイン/ログアウト状態の切り替え
 * - レスポンシブ対応（モバイルでハンバーガーメニュー）
 */
export function Header() {
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
              WIN×Ⅱ
            </span>
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              トップページ
            </Link>
            <Link
              href="/blog"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              ブログ
            </Link>
            <Link
              href="/deals"
              className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              案件一覧
            </Link>
            {session && (
              <Link
                href="/mypage"
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors"
              >
                プロフィール
              </Link>
            )}
          </nav>

          {/* ログインボタン / ログアウトボタン */}
          <div className="hidden md:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="h-10 w-24 bg-gray-200 animate-pulse rounded" />
            ) : session ? (
              <>
                <span className="text-sm text-gray-600">
                  {session.user?.email}
                </span>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  ログアウト
                </Button>
              </>
            ) : (
              <Button
                asChild
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Link href="/login">ログイン</Link>
              </Button>
            )}
          </div>

          {/* モバイルハンバーガーメニュー */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="メニューを開く"
          >
            {isMobileMenuOpen ? (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-2"
              >
                トップページ
              </Link>
              <Link
                href="/blog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-2"
              >
                ブログ
              </Link>
              <Link
                href="/deals"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-2"
              >
                案件一覧
              </Link>
              {session && (
                <Link
                  href="/mypage"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-2"
                >
                  プロフィール
                </Link>
              )}

              {/* モバイルログインボタン */}
              <div className="pt-4 border-t">
                {session ? (
                  <>
                    <span className="text-sm text-gray-600 px-2 block mb-2">
                      {session.user?.email}
                    </span>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
                    >
                      ログアウト
                    </Button>
                  </>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Link
                      href="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
