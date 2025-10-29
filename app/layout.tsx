import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageTransition } from "@/components/layout/page-transition";

export const metadata: Metadata = {
  title: "WIN×Ⅱ - アフィリエイトブログプラットフォーム",
  description: "キャッシュバック付きアフィリエイトブログプラットフォーム",
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
