"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { ReactNode } from "react";

/**
 * Next-Auth SessionProvider ラッパー
 *
 * クライアントコンポーネントとして定義し、
 * サーバーコンポーネントのRootLayoutから使用可能にする
 */
export function SessionProvider({ children }: { children: ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
