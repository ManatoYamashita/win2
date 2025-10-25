import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/toaster";

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
          <div className="min-h-screen flex flex-col">
            <header className="border-b">
              <div className="container mx-auto px-4 py-4">
                <h1 className="text-2xl font-bold">WIN×Ⅱ</h1>
              </div>
            </header>
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <footer className="border-t">
              <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
                <p>&copy; 2025 WIN×Ⅱ. All rights reserved.</p>
              </div>
            </footer>
          </div>
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
