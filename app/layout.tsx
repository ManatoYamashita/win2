import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: {
    default: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    template: "%s | WIN×Ⅱ",
  },
  description: "WIN×Ⅱは、保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォームです。300件以上の厳選サービスから最適な選択をサポートします。",
  keywords: ["キャッシュバック", "アフィリエイト", "保険相談", "不動産査定", "転職支援", "サブスクリプション", "お得", "WIN×Ⅱ"],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: appUrl,
    siteName: "WIN×Ⅱ",
    title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    description: "保険・不動産・転職・エンタメなど、300件以上の厳選サービスをご紹介。成果に応じたキャッシュバック付きの会員制プラットフォーム。",
    images: [
      {
        url: `${appUrl}/ogp.jpg`,
        width: 1200,
        height: 630,
        alt: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    description: "保険・不動産・転職・エンタメなど、300件以上の厳選サービスをご紹介。成果に応じたキャッシュバック付き。",
    images: [`${appUrl}/ogp.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: appUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <SessionProvider>
          <PageTransition>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </PageTransition>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
