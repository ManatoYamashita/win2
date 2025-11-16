import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/microcms";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, Number(searchParams.get("limit")) || 12);
    const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
    const orders = searchParams.get("orders") || "-publishedAt";

    const data = await getCategories({
      limit,
      offset,
      orders,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("[api/categories] Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
