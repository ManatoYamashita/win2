// microCMS共通型定義
import type { MicroCMSImage, MicroCMSDate, MicroCMSQueries } from "microcms-js-sdk";

// ========================================
// Category型定義
// ========================================
export interface Category {
  id: string;                    // microCMSコンテンツID（スラッグとして使用）
  name: string;
  description?: string;
}

export type CategoryResponse = Category & MicroCMSDate;

// ========================================
// Deal型定義（ASP案件）
// ========================================
// NOTE: 案件情報はmicroCMSではなく、Google Sheets/GASで管理されています
// 将来的にGoogle Sheets APIから取得する際は、以下の型定義を使用してください
//
// export interface Deal {
//   id: string;
//   dealId: string;                // ASP側のID
//   dealName: string;
//   aspName: "A8.net" | "AFB" | "もしも" | "バリュコマ";
//   description: string;
//   thumbnail: MicroCMSImage;
//   rewardAmount: number;          // 報酬額
//   cashbackRate: number;          // 還元率（既定値: 0.2）
//   category: Category[];
//   affiliateUrl: string;          // アフィリエイトURLテンプレート
//   isActive: boolean;             // 公開状態
//   ctaText: string;               // CTAボタンテキスト
//   displayOrder: number;          // 表示順
//   notes?: string;                // 管理メモ
// }
//
// export type DealResponse = Deal & MicroCMSDate;

// ========================================
// Blog型定義（ブログ記事）
// ========================================
export interface Blog {
  id: string;                    // microCMSコンテンツID（スラッグとして使用）
  title: string;
  content: string;               // リッチエディタコンテンツ（HTML形式）
  thumbnail?: MicroCMSImage;     // サムネイル画像（オプション）
  category?: Category[];         // 複数カテゴリ参照（配列）
}

export type BlogResponse = Blog & MicroCMSDate;

// ========================================
// Blog関連のヘルパー型定義
// ========================================
// システム側で自動生成される項目:
// - excerpt: contentからHTMLタグを除去し、先頭150文字を抽出
// - metaTitle: titleフィールドの値を使用
// - metaDescription: 自動抽出したexcerptを使用
// - ogImage: thumbnailフィールドの画像を使用
// - 公開/非公開: publishedAtで管理（microCMS標準）

// ========================================
// microCMS APIレスポンス型
// ========================================
export interface MicroCMSListResponse<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}

// ========================================
// APIエンドポイント別のクエリ型
// ========================================
export type BlogQueries = MicroCMSQueries;
export type CategoryQueries = MicroCMSQueries;
// DealQueries は削除（Google Sheets/GASで管理）
