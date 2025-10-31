"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

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
    const items: Array<{ href: string; label: string; isActive: boolean }> = [
      {
        href: "/",
        label: "トップページ",
        isActive: pathname === "/",
      },
      {
        href: "/blog",
        label: "ブログ",
        isActive: pathname.startsWith("/blog") || pathname.startsWith("/category"),
      },
    ];

    if (session) {
      items.push({
        href: "/mypage",
        label: "マイページ",
        isActive: pathname.startsWith("/mypage"),
      });
    }

    return items;
  }, [pathname, session]);

  const getLinkClasses = (isActive: boolean) =>
    cn(
      "relative inline-flex items-center text-[14px] font-medium text-slate-600 transition-colors",
      isActive ? "text-win2-primary-orage" : "hover:text-win2-primary-orage"
    );

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const isAuthenticated = !!session;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-win2-surface-cream-200">
      <div className="mx-auto flex max-w-[1100px] items-center justify-between px-4 py-4 lg:px-6">
        <Link href="/" className="flex items-center gap-3" aria-label="WIN×Ⅱ トップページ">
          <Image
            src="/assets/win2/logo.webp"
            alt="WIN×Ⅱ"
            width={140}
            height={40}
            className="h-8 w-auto object-contain"
            priority
          />
          {/* <span className="hidden text-sm font-semibold tracking-[0.35em] text-[#f26f36] md:inline">
            アフィリエイトブログ
          </span> */}
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navigation.map((item) =>
            <Link key={item.href} href={item.href} className={getLinkClasses(item.isActive)}>
              {item.label}
            </Link>
          )}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {isAuthenticated ? (
            <>
              <Link
                href="/mypage"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-6 py-2 text-sm font-semibold text-white shadow-md shadow-win2-accent-rose/25 transition hover:opacity-90"
              >
                プロフィールページ
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-medium text-slate-600 transition hover:text-win2-primary-orage"
              >
                ログアウト
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-slate-600 transition hover:text-win2-primary-orage"
              >
                ログイン
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-6 py-2 text-sm font-semibold text-white shadow-md shadow-win2-accent-rose/25 transition hover:opacity-90"
              >
                新規登録
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="rounded-md p-2 md:hidden"
          aria-label="メニューを開く"
        >
          {isMobileMenuOpen ? (
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-6 w-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>
      {isMobileMenuOpen && (
        <div className="border-t border-win2-surface-cream-200 bg-white/95 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4 text-sm text-slate-600">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={getLinkClasses(item.isActive)}
              >
                {item.label}
              </Link>
            ))}
            {status === "loading" && (
              <span className="text-xs text-slate-400">読み込み中...</span>
            )}
            <div className="mt-4 flex flex-col gap-3">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/mypage"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-win2-accent-rose/25 transition hover:opacity-90"
                  >
                    プロフィールページ
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-sm font-medium text-slate-600 transition hover:text-win2-primary-orage"
                  >
                    ログアウト
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-left text-sm font-medium text-slate-600 transition hover:text-win2-primary-orage"
                  >
                    ログイン
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-win2-accent-rose/25 transition hover:opacity-90"
                  >
                    新規登録
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
