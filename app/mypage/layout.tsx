import { ReactNode } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "マイページ | WIN×Ⅱ",
  description:
    "WIN×Ⅱ会員向けの管理ページです。登録情報の確認や申込履歴の確認、キャッシュバック状況のチェックが行えます。",
  alternates: {
    canonical: `${appUrl}/mypage`,
  },
  openGraph: {
    title: "マイページ | WIN×Ⅱ",
    description:
      "WIN×Ⅱ会員向けの管理ページです。登録情報の確認や申込履歴の確認、キャッシュバック状況のチェックが行えます。",
    url: `${appUrl}/mypage`,
    type: "website",
    siteName: "WIN×Ⅱ",
    locale: "ja_JP",
  },
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

/**
 * マイページレイアウト
 *
 * サイドナビゲーション付きの2カラムレイアウト
 * - 左側: サイドナビ（登録情報、申込履歴、ログアウト）
 * - 右側: メインコンテンツエリア
 */
export default function MypageLayout({
  children,
}: {
  children: ReactNode;
}) {
  const memberDashboardSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "WIN×Ⅱ会員マイページ",
    description:
      "WIN×Ⅱ会員が登録情報や申込履歴を確認し、キャッシュバック状況を把握するためのマイページ",
    url: `${appUrl}/mypage`,
    isPartOf: {
      "@type": "WebSite",
      name: "WIN×Ⅱ",
      url: appUrl,
    },
    inLanguage: "ja-JP",
    about: {
      "@type": "Organization",
      name: "WIN×Ⅱ",
    },
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(memberDashboardSchema),
        }}
      />
      <h1 className="text-3xl font-bold mb-8">マイページ</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* サイドナビゲーション */}
        <aside className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <nav className="space-y-2">
                <Link
                  href="/mypage"
                  className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  登録情報
                </Link>
                <Link
                  href="/mypage/history"
                  className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
                >
                  申込履歴
                </Link>
                <Link
                  href="/api/auth/signout"
                  className="block px-4 py-2 rounded-md hover:bg-accent transition-colors text-destructive whitespace-nowrap"
                >
                  ログアウト
                </Link>
              </nav>
            </CardContent>
          </Card>
        </aside>

        {/* メインコンテンツエリア */}
        <main className="md:col-span-3">
          {children}
        </main>
      </div>
    </div>
  );
}
