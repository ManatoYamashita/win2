import { NextRequest, NextResponse } from "next/server";
import { getBlogs } from "@/lib/microcms";

// ISR: 60秒ごとに再検証
export const revalidate = 60;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 10);
    const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
    const orders = searchParams.get("orders") || "-publishedAt";

    const data = await getBlogs({
      limit,
      offset,
      orders,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[api/blogs] Failed to fetch blogs:", error);
    return NextResponse.json(
      { error: "Failed to fetch blogs" },
      { status: 500 }
    );
  }
}
