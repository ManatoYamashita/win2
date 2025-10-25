import { ReactNode } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <div className="container mx-auto py-12 px-4">
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
                  className="block px-4 py-2 rounded-md hover:bg-accent transition-colors text-destructive"
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
