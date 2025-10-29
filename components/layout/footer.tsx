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
          <Link href="/" className="flex items-center">
            <span className="text-3xl font-bold text-gray-500 hover:text-gray-600 transition-colors">
              WIN×Ⅱ
            </span>
          </Link>
        </div>

        {/* 著作権表示 */}
        <div className="text-center text-sm text-gray-600">
          <p>&copy; {currentYear} WIN×Ⅱ. All rights reserved.</p>
        </div>

        {/* オプション: フッターリンク（必要に応じてコメント解除） */}
        {/* <div className="flex justify-center space-x-6 mt-4 text-sm">
          <Link
            href="/terms"
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            利用規約
          </Link>
          <Link
            href="/privacy"
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            プライバシーポリシー
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-orange-600 transition-colors"
          >
            お問い合わせ
          </Link>
        </div> */}
      </div>
    </footer>
  );
}
