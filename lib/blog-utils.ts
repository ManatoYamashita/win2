/**
 * ブログ関連のユーティリティ関数
 */

/**
 * HTMLコンテンツから抜粋を生成
 *
 * @param content HTMLコンテンツ（リッチエディタから取得）
 * @param maxLength 最大文字数（デフォルト: 150）
 * @returns プレーンテキストの抜粋（末尾に...を追加）
 *
 * @example
 * const excerpt = extractExcerpt("<p>こんにちは、世界！</p>", 10);
 * // => "こんにちは、世界..."
 */
export function extractExcerpt(content: string, maxLength: number = 150): string {
  // HTMLタグを除去
  const plainText = content
    .replace(/<[^>]*>/g, "")       // HTMLタグを削除
    .replace(/&nbsp;/g, " ")        // &nbsp;をスペースに変換
    .replace(/&lt;/g, "<")          // &lt;を<に変換
    .replace(/&gt;/g, ">")          // &gt;を>に変換
    .replace(/&amp;/g, "&")         // &amp;を&に変換
    .replace(/&quot;/g, '"')        // &quot;を"に変換
    .replace(/&#39;/g, "'")         // &#39;を'に変換
    .replace(/\s+/g, " ")           // 連続する空白を1つに
    .trim();                        // 前後の空白を削除

  // 指定文字数で切り詰め
  if (plainText.length <= maxLength) {
    return plainText;
  }

  return plainText.substring(0, maxLength) + "...";
}

/**
 * ブログ記事のメタ情報を生成
 *
 * @param title 記事タイトル
 * @param content 記事本文（HTML）
 * @param thumbnailUrl サムネイルURL（オプション）
 * @returns SEO用のメタ情報
 */
export interface BlogMetadata {
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
}

export function generateBlogMetadata(
  title: string,
  content: string,
  thumbnailUrl?: string
): BlogMetadata {
  const excerpt = extractExcerpt(content, 120); // meta descriptionは120文字推奨

  return {
    metaTitle: title,
    metaDescription: excerpt,
    ogImage: thumbnailUrl,
  };
}
