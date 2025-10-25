// microCMS共通型定義
import type { MicroCMSImage, MicroCMSDate, MicroCMSQueries } from "microcms-js-sdk";

// ========================================
// Category型定義
// ========================================
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  isVisible: boolean;
}

export type CategoryResponse = Category & MicroCMSDate;

// ========================================
// Deal型定義（ASP案件）
// ========================================
export interface Deal {
  id: string;
  dealId: string;                // ASP側のID
  dealName: string;
  aspName: "A8.net" | "AFB" | "もしも" | "バリュコマ";
  description: string;
  thumbnail: MicroCMSImage;
  rewardAmount: number;          // 報酬額
  cashbackRate: number;          // 還元率（既定値: 0.2）
  category: Category[];
  affiliateUrl: string;          // アフィリエイトURLテンプレート
  isActive: boolean;             // 公開状態
  ctaText: string;               // CTAボタンテキスト
  displayOrder: number;          // 表示順
  notes?: string;                // 管理メモ
}

export type DealResponse = Deal & MicroCMSDate;

// ========================================
// Blog型定義（ブログ記事）
// ========================================
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;               // リッチエディタコンテンツ
  excerpt: string;
  thumbnail: MicroCMSImage;
  category: Category[];
  relatedDeals: {
    id: string;
    dealName: string;
  }[];
  isPublic: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: MicroCMSImage;
}

export type BlogResponse = Blog & MicroCMSDate;

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
export type DealQueries = MicroCMSQueries;
export type CategoryQueries = MicroCMSQueries;
