import type { Metadata } from "next";
import { LandingPage } from "@/components/home/landing-page";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
  description:
    "WIN×Ⅱは、保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォームです。300件以上の厳選サービスから最適な選択をサポートします。",
  keywords: [
    "キャッシュバック",
    "アフィリエイト",
    "保険相談",
    "不動産査定",
    "転職支援",
    "サブスクリプション",
    "お得",
    "WIN×Ⅱ",
  ],
  openGraph: {
    title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    description:
      "保険・不動産・転職・エンタメなど、300件以上の厳選サービスをご紹介。アフィリエイトブログプラットフォームです。",
    images: [
      {
        url: `${appUrl}/ogp.jpg`,
        width: 1200,
        height: 630,
        alt: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
      },
    ],
    type: "website",
    url: appUrl,
    siteName: "WIN×Ⅱ",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "WIN×Ⅱ - 暮らしをもっとお得に、もっとスマートに",
    description:
      "保険・不動産・転職・エンタメなど、300件以上の厳選サービスをご紹介。アフィリエイトブログプラットフォームです。",
    images: [`${appUrl}/ogp.jpg`],
  },
  alternates: {
    canonical: appUrl,
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
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "WIN×Ⅱ",
  url: appUrl,
  logo: `${appUrl}/assets/win2/logo.webp`,
  description:
    "保険・不動産・転職・エンタメなど、暮らしに役立つサービスを無料でご紹介し、キャッシュバックも受けられる会員制プラットフォーム",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    availableLanguage: ["Japanese"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "WIN×Ⅱ",
  url: appUrl,
  potentialAction: {
    "@type": "SearchAction",
    target: `${appUrl}/search?query={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <LandingPage />
    </>
  );
}
