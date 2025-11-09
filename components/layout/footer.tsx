import Image from "next/image";
import Link from "next/link";

/**
 * 共通Footerコンポーネント
 *
 * 機能:
 * - WIN×II ロゴ表示（グレー）
 * - 著作権表示
 * - シンプルなデザイン
 */
export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        {/* ロゴ */}
        <div className="flex justify-center mb-4">
          <Link href="/" className="flex items-center" aria-label="WIN×Ⅱ トップページ">
            <Image
              src="/assets/win2/logo.webp"
              alt="WIN×Ⅱ"
              width={160}
              height={46}
              className="h-10 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
            />
          </Link>
        </div>

        {/* フッターリンク */}
        <div className="flex justify-center space-x-6 mt-4 text-sm">
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            プライバシーポリシー
          </Link>
        </div>

        {/* 著作権表示 */}
        <div className="text-center text-sm text-gray-600 mt-4">
          <p>&copy; {currentYear} WIN×Ⅱ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
