import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "会員登録",
  description:
    "WIN×Ⅱの無料会員登録ページ。保険・不動産・転職など300件以上のサービスをご紹介し、ご成約時にキャッシュバックも受け取れます。登録は無料、わずか3分で完了します。",
  keywords: [
    "会員登録",
    "無料登録",
    "WIN×Ⅱ",
    "キャッシュバック",
    "アフィリエイト",
    "保険",
    "不動産",
    "転職",
  ],
  openGraph: {
    title: "会員登録 | WIN×Ⅱ",
    description:
      "WIN×Ⅱの無料会員登録ページ。保険・不動産・転職など300件以上のサービスをご紹介し、ご成約時にキャッシュバックも受け取れます。",
    images: [`${appUrl}/ogp.jpg`],
    url: `${appUrl}/register`,
    type: "website",
    siteName: "WIN×Ⅱ",
  },
  twitter: {
    card: "summary_large_image",
    title: "会員登録 | WIN×Ⅱ",
    description:
      "WIN×Ⅱの無料会員登録。保険・不動産・転職など300件以上のサービスをご紹介し、ご成約時にキャッシュバック。",
    images: [`${appUrl}/ogp.jpg`],
  },
  alternates: {
    canonical: `${appUrl}/register`,
  },
  robots: {
    index: true, // 新規ユーザー獲得のためindex必須
    follow: true,
  },
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
