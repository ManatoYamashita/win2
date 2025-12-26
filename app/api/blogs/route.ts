/**
 * ブログ一覧API
 *
 * microCMSからブログ記事を取得します。
 * includeRestrictedパラメータがtrueの場合は年齢検証を実行します。
 *
 * Query Parameters:
 * - limit: number (default: 10) - 取得件数
 * - offset: number (default: 0) - スキップ件数
 * - orders: string (default: '-publishedAt') - ソート順
 * - categoryId: string (optional) - カテゴリID
 * - includeRestricted: 'true' | 'false' (default: 'false') - 年齢制限コンテンツを含むか
 */

import { NextRequest, NextResponse } from "next/server";
import { getBlogs } from "@/lib/microcms";
import { verifyAge } from "@/lib/age-verification";

export const dynamic = "force-dynamic";

/**
 * GET /api/blogs
 *
 * ブログ記事一覧を取得します。
 * 年齢制限コンテンツを含む場合は、サーバーサイドで年齢検証を実行します。
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
  const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
  const orders = searchParams.get("orders") || "-publishedAt";
  const categoryId = searchParams.get("categoryId") || undefined;
  const includeRestricted = searchParams.get("includeRestricted") === "true";

  try {
    // 年齢制限コンテンツを含む場合は年齢検証
    let filters = "";

    if (includeRestricted) {
      const ageVerification = await verifyAge();

      // 成人でない場合はエラー
      if (ageVerification.status !== "adult") {
        return NextResponse.json(
          { error: "Age verification required" },
          { status: 403 }
        );
      }

      // 成人の場合はカテゴリフィルタのみ適用
      if (categoryId) {
        filters = `category[equals]${categoryId}`;
      }
    } else {
      // 年齢制限コンテンツを除外
      const restrictedFilter = "restricted[not_equals]true";
      filters = categoryId
        ? `${restrictedFilter}[and]category[equals]${categoryId}`
        : restrictedFilter;
    }

    const { contents, totalCount } = await getBlogs({
      limit,
      offset,
      orders,
      filters,
      fields: [
        "id",
        "title",
        "content",
        "thumbnail",
        "category.id",
        "category.name",
        "restricted",
        "createdAt",
        "publishedAt",
      ].join(","),
    });

    return NextResponse.json({
      contents,
      totalCount,
      hasMore: offset + limit < totalCount,
    });
  } catch (error) {
    console.error("[GET /api/blogs] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
