/**
 * Google Tag Manager (GTM) 型定義
 *
 * window.dataLayer の型を定義し、カスタムイベント送信時の型安全性を確保します。
 *
 * 使用例:
 * ```typescript
 * window.dataLayer.push({
 *   event: 'button_click',
 *   button_name: 'cta_register',
 * });
 * ```
 */

interface Window {
  dataLayer: Array<Record<string, unknown>>;
}
