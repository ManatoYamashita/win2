"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
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
  const pathname = usePathname();

  const navigation = useMemo(() => {
    const items = [
      { href: "/", label: "トップページ", isActive: pathname === "/" },
      {
        href: "/blog",
        label: "ブログ",
        isActive: pathname.startsWith("/blog") || pathname.startsWith("/category"),
      },
    ];

    items.push(
      session
        ? {
            href: "/mypage",
            label: "プロフィール",
            isActive: pathname.startsWith("/mypage"),
          }
        : {
            href: "/login",
            label: "ログイン",
            isActive: pathname === "/login",
          }
    );

    return items;
  }, [pathname, session]);

  const getLinkClasses = (isActive: boolean) =>
    [
      "font-medium transition-colors inline-flex items-center",
      isActive
        ? "text-orange-600 border-b-2 border-orange-500 pb-1"
        : "text-gray-700 hover:text-orange-600",
    ].join(" ");

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
          <Link href="/" className="flex items-center" aria-label="WIN×Ⅱ トップページ">
            <Image
              src="/assets/win2/logo.webp"
              alt="WIN×Ⅱ"
              width={140}
              height={40}
              className="h-8 w-auto object-contain transition-transform hover:scale-105"
              priority
            />
          </Link>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href} className={getLinkClasses(item.isActive)}>
                {item.label}
              </Link>
            ))}
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
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`${getLinkClasses(item.isActive)} px-2`}
                >
                  {item.label}
                </Link>
              ))}

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
