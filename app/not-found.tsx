import type { Metadata } from "next";
import Link from "next/link";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "404 ページが見つかりません",
  description: "お探しのページは削除されたか、URLが変更された可能性があります。",
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${appUrl}/404`,
  },
};

/**
 * 404 Not Found ページコンポーネント
 *
 * デザインシステムに準拠したエラーページ:
 * - WIN×IIブランドカラー（オレンジ・ローズグラデーション）
 * - クリーンでシンプルなレイアウト
 * - 2つのCTAボタン（トップページ + ブログ）
 */
export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-b from-win2-surface-cream-50 to-white px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        {/* 404 大きな数字（グラデーション） */}
        <div className="mb-8">
          <h1 className="bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage bg-clip-text text-9xl font-extrabold leading-none tracking-tighter text-transparent">
            404
          </h1>
        </div>

        {/* タイトル */}
        <h2 className="mb-4 text-3xl font-bold text-win2-neutral-950 md:text-4xl">
          ページが見つかりません
        </h2>

        {/* 説明文 */}
        <p className="mb-8 text-base text-win2-neutral-600 md:text-lg">
          お探しのページは削除されたか、URLが変更された可能性があります。
          <br className="hidden sm:inline" />
          下記のボタンからトップページまたはブログをご覧ください。
        </p>

        {/* CTAボタン */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          {/* Primary CTA: トップページへ */}
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage px-8 py-3 text-sm font-semibold text-white shadow-md shadow-win2-accent-rose/25 transition hover:opacity-90 sm:w-auto"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            トップページへ
          </Link>

          {/* Secondary CTA: ブログを見る */}
          <Link
            href="/blog"
            className="inline-flex w-full items-center justify-center rounded-full border border-win2-surface-cream-200 bg-white px-8 py-3 text-sm font-semibold text-win2-neutral-900 transition hover:border-win2-primary-orage hover:text-win2-primary-orage sm:w-auto"
          >
            <svg
              className="mr-2 h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            ブログを見る
          </Link>
        </div>

        {/* 装飾的な要素（オプション） */}
        <div className="mt-16">
          <p className="text-sm text-win2-neutral-600">
            問題が解決しない場合は、
            <Link
              href="/"
              className="font-medium text-win2-primary-orage underline decoration-win2-primary-orage/30 underline-offset-4 transition hover:decoration-win2-primary-orage"
            >
              トップページ
            </Link>
            からお探しください。
          </p>
        </div>
      </div>
    </div>
  );
}
