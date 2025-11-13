import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "ログイン",
  description:
    "WIN×Ⅱ会員向けログインページ。メールアドレスとパスワードでマイページにアクセスし、キャッシュバック履歴や案件情報をご確認いただけます。",
  robots: {
    index: false, // 会員向けページはnoindex推奨
    follow: true,
  },
  alternates: {
    canonical: `${appUrl}/login`,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
