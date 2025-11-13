import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "よくある質問",
  description:
    "WIN×Ⅱのサービスに関するよくある質問と回答をまとめています。会員登録、キャッシュバック、掲載サービス、個人情報の取り扱いなど、お客様からよくいただく質問にお答えします。",
  keywords: [
    "FAQ",
    "よくある質問",
    "WIN×Ⅱ",
    "会員登録",
    "キャッシュバック",
    "掲載サービス",
    "使い方",
  ],
  openGraph: {
    title: "よくある質問 | WIN×Ⅱ",
    description:
      "WIN×Ⅱのサービスに関するよくある質問と回答。会員登録、キャッシュバック、掲載サービスなど、お客様からよくいただく質問にお答えします。",
    images: [`${appUrl}/ogp.jpg`],
    url: `${appUrl}/faq`,
    type: "website",
    siteName: "WIN×Ⅱ",
  },
  twitter: {
    card: "summary_large_image",
    title: "よくある質問 | WIN×Ⅱ",
    description:
      "WIN×Ⅱのサービスに関するよくある質問と回答。会員登録、キャッシュバック、掲載サービスなど、お客様からよくいただく質問にお答えします。",
    images: [`${appUrl}/ogp.jpg`],
  },
  alternates: {
    canonical: `${appUrl}/faq`,
  },
  robots: {
    index: true, // FAQページは検索エンジンにインデックスさせる
    follow: true,
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
