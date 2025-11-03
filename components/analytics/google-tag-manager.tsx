"use client";

import Script from "next/script";

interface GoogleTagManagerProps {
  gtmId: string;
}

/**
 * Google Tag Manager統合コンポーネント
 *
 * 使用方法:
 * <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
 */
export function GoogleTagManager({ gtmId }: GoogleTagManagerProps) {
  // デバッグ用ログ（一時的）
  console.log("[GTM Debug] GTM ID received:", gtmId || "(empty)");

  if (!gtmId) {
    console.warn("GTM ID is not provided. Google Tag Manager will not be loaded.");
    return null;
  }

  console.log("[GTM Debug] Loading GTM with ID:", gtmId);

  return (
    <>
      {/* GTM Script */}
      <Script
        id="google-tag-manager"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtmId}');
          `,
        }}
      />
    </>
  );
}

/**
 * Google Tag Manager noscript fallback
 * <body>の直後に配置する必要がある
 */
export function GoogleTagManagerNoScript({ gtmId }: GoogleTagManagerProps) {
  if (!gtmId) {
    return null;
  }

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
        title="Google Tag Manager"
      />
    </noscript>
  );
}
