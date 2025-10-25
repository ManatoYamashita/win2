import { createClient } from "microcms-js-sdk";
import type {
  BlogResponse,
  DealResponse,
  CategoryResponse,
  BlogQueries,
  DealQueries,
  CategoryQueries,
} from "@/types/microcms";

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

// microCMSクライアント初期化
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

// ========================================
// Blogs API
// ========================================

/**
 * ブログ記事一覧を取得
 */
export const getBlogs = async (queries?: BlogQueries) => {
  const listData = await client.getList<BlogResponse>({
    endpoint: "blogs",
    queries,
  });
  return listData;
};

/**
 * ブログ記事詳細を取得（IDで）
 */
export const getBlogById = async (contentId: string, queries?: BlogQueries) => {
  const detailData = await client.getListDetail<BlogResponse>({
    endpoint: "blogs",
    contentId,
    queries,
  });
  return detailData;
};

/**
 * ブログ記事詳細を取得（slugで）
 */
export const getBlogBySlug = async (slug: string) => {
  const listData = await client.getList<BlogResponse>({
    endpoint: "blogs",
    queries: {
      filters: `slug[equals]${slug}`,
      limit: 1,
    },
  });

  if (listData.contents.length === 0) {
    return null;
  }

  return listData.contents[0];
};

// ========================================
// Deals API
// ========================================

/**
 * 案件一覧を取得
 */
export const getDeals = async (queries?: DealQueries) => {
  const listData = await client.getList<DealResponse>({
    endpoint: "deals",
    queries,
  });
  return listData;
};

/**
 * 案件詳細を取得（IDで）
 */
export const getDealById = async (contentId: string, queries?: DealQueries) => {
  const detailData = await client.getListDetail<DealResponse>({
    endpoint: "deals",
    contentId,
    queries,
  });
  return detailData;
};

/**
 * 案件詳細を取得（dealIdで）
 */
export const getDealByDealId = async (dealId: string) => {
  const listData = await client.getList<DealResponse>({
    endpoint: "deals",
    queries: {
      filters: `dealId[equals]${dealId}`,
      limit: 1,
    },
  });

  if (listData.contents.length === 0) {
    return null;
  }

  return listData.contents[0];
};

// ========================================
// Categories API
// ========================================

/**
 * カテゴリ一覧を取得
 */
export const getCategories = async (queries?: CategoryQueries) => {
  const listData = await client.getList<CategoryResponse>({
    endpoint: "categories",
    queries,
  });
  return listData;
};

/**
 * カテゴリ詳細を取得（IDで）
 */
export const getCategoryById = async (contentId: string, queries?: CategoryQueries) => {
  const detailData = await client.getListDetail<CategoryResponse>({
    endpoint: "categories",
    contentId,
    queries,
  });
  return detailData;
};

/**
 * カテゴリ詳細を取得（slugで）
 */
export const getCategoryBySlug = async (slug: string) => {
  const listData = await client.getList<CategoryResponse>({
    endpoint: "categories",
    queries: {
      filters: `slug[equals]${slug}`,
      limit: 1,
    },
  });

  if (listData.contents.length === 0) {
    return null;
  }

  return listData.contents[0];
};
