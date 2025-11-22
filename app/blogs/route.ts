import { NextResponse } from "next/server";
import { getBlogs } from "@/lib/microcms";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 6;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit"));
  const normalizedLimit = Number.isFinite(limitParam)
    ? Math.min(Math.max(Math.floor(limitParam), 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  try {
    const list = await getBlogs({
      limit: normalizedLimit,
      orders: "-publishedAt",
    });

    return NextResponse.json({
      contents: list.contents,
      totalCount: list.totalCount,
      limit: normalizedLimit,
    });
  } catch (error) {
    console.error("[GET /blogs] Failed to fetch blogs", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}
