import { createClient } from "microcms-js-sdk";
import type {
  BlogResponse,
  CategoryResponse,
  BlogQueries,
  CategoryQueries,
  MicroCMSListResponse,
} from "@/types/microcms";
// DealResponse, DealQueries は削除（Google Sheets/GASで管理）

const microcmsServiceDomain = process.env.MICROCMS_SERVICE_DOMAIN;
const microcmsApiKey = process.env.MICROCMS_API_KEY;

export const isMicrocmsConfigured = Boolean(
  microcmsServiceDomain && microcmsApiKey
);

export const client = isMicrocmsConfigured
  ? createClient({
      serviceDomain: microcmsServiceDomain!,
      apiKey: microcmsApiKey!,
    })
  : null;

const emptyList = <T>(): MicroCMSListResponse<T> => ({
  contents: [],
  totalCount: 0,
  offset: 0,
  limit: 0,
});

// ========================================
// Blogs API
// ========================================

/**
 * ブログ記事一覧を取得
 *
 * NOTE: categoryフィールドは単一コンテンツ参照のため、
 * category.id, category.name, category.descriptionを含めて取得されます
 */
export const getBlogs = async (queries?: BlogQueries) => {
  if (!client) {
    console.warn("[microCMS] Client is not configured. Returning empty blog list.");
    return emptyList<BlogResponse>();
  }

  const listData = await client.getList<BlogResponse>({
    endpoint: "blogs",
    queries: {
      ...queries,
      // categoryの詳細情報を取得
      fields: queries?.fields || "id,title,content,thumbnail,category.id,category.name,category.description,publishedAt,createdAt,updatedAt,revisedAt",
    },
    customRequestInit: {
      next: { revalidate: 60 }, // 60秒ごとに再検証
    },
  });
  return listData;
};

/**
 * ブログ記事詳細を取得（IDで）
 *
 * NOTE: microCMSのコンテンツIDを使用して記事を取得します
 * categoryフィールドの詳細情報も含めて取得されます
 */
export const getBlogById = async (contentId: string, queries?: BlogQueries) => {
  if (!client) {
    console.warn("[microCMS] Client is not configured. getBlogById will return null.");
    return null;
  }

  const detailData = await client.getListDetail<BlogResponse>({
    endpoint: "blogs",
    contentId,
    queries: {
      ...queries,
      // categoryの詳細情報を取得
      fields: queries?.fields || "id,title,content,thumbnail,category.id,category.name,category.description,publishedAt,createdAt,updatedAt,revisedAt",
    },
    customRequestInit: {
      next: { revalidate: 60 }, // 60秒ごとに再検証
    },
  });
  return detailData;
};

// getBlogBySlug は削除
// microCMSのコンテンツIDをスラッグとして使用するため、getBlogByIdを使用してください

// ========================================
// Deals API
// ========================================
// NOTE: 案件情報はmicroCMSではなく、Google Sheets/GASで管理されています
// 将来的にGoogle Sheets APIから取得する実装が必要になる可能性があります
//
// /**
//  * 案件一覧を取得
//  */
// export const getDeals = async (queries?: DealQueries) => {
//   if (!client) {
//     console.warn("[microCMS] Client is not configured. Returning empty deal list.");
//     return emptyList<DealResponse>();
//   }
//
//   const listData = await client.getList<DealResponse>({
//     endpoint: "deals",
//     queries,
//   });
//   return listData;
// };
//
// /**
//  * 案件詳細を取得（IDで）
//  */
// export const getDealById = async (contentId: string, queries?: DealQueries) => {
//   if (!client) {
//     console.warn("[microCMS] Client is not configured. getDealById will return null.");
//     return null;
//   }
//
//   const detailData = await client.getListDetail<DealResponse>({
//     endpoint: "deals",
//     contentId,
//     queries,
//   });
//   return detailData;
// };
//
// /**
//  * 案件詳細を取得（dealIdで）
//  */
// export const getDealByDealId = async (dealId: string) => {
//   if (!client) {
//     console.warn("[microCMS] Client is not configured. getDealByDealId will return null.");
//     return null;
//   }
//
//   const listData = await client.getList<DealResponse>({
//     endpoint: "deals",
//     queries: {
//       filters: `dealId[equals]${dealId}`,
//       limit: 1,
//     },
//   });
//
//   if (listData.contents.length === 0) {
//     return null;
//   }
//
//   return listData.contents[0];
// };

// ========================================
// Categories API
// ========================================

/**
 * カテゴリ一覧を取得
 */
export const getCategories = async (queries?: CategoryQueries) => {
  if (!client) {
    console.warn("[microCMS] Client is not configured. Returning empty category list.");
    return emptyList<CategoryResponse>();
  }

  const listData = await client.getList<CategoryResponse>({
    endpoint: "categories",
    queries,
    customRequestInit: {
      next: { revalidate: 60 }, // 60秒ごとに再検証
    },
  });
  return listData;
};

/**
 * カテゴリ詳細を取得（IDで）
 */
export const getCategoryById = async (contentId: string, queries?: CategoryQueries) => {
  if (!client) {
    console.warn("[microCMS] Client is not configured. getCategoryById will return null.");
    return null;
  }

  const detailData = await client.getListDetail<CategoryResponse>({
    endpoint: "categories",
    contentId,
    queries,
    customRequestInit: {
      next: { revalidate: 60 }, // 60秒ごとに再検証
    },
  });
  return detailData;
};

// getCategoryBySlug は削除
// microCMSのコンテンツIDをスラッグとして使用するため、getCategoryByIdを使用してください
