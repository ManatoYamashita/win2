import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDealByDealId } from "@/lib/microcms";
import { addClickLog } from "@/lib/sheets";
import { trackClickSchema } from "@/lib/validations/tracking";
import { getOrCreateGuestUuid, setGuestUuidCookie } from "@/lib/guest-uuid";

/**
 * クリック追跡API
 *
 * POST /api/track-click
 *
 * 会員・非会員が案件に応募した際、追跡ID (id1) を付与してアフィリエイトURLを生成し、
 * Google Sheetsにクリックログを記録します。
 *
 * フロー:
 * 1. リクエストボディのバリデーション ({ dealId: string })
 * 2. セッション確認（会員 or 非会員判定）
 *    - 会員の場合: session.user.memberId を使用
 *    - 非会員の場合: Cookieから guest:UUID を取得 or 新規生成
 * 3. microCMS APIで案件情報取得
 * 4. Google Sheets「クリックログ」に記録
 * 5. affiliateUrlに ?id1={trackingId} を付与
 * 6. レスポンス返却（非会員の場合はguest UUID Cookieを設定）
 *
 * @param request - NextRequest オブジェクト
 * @returns NextResponse - { trackingUrl: string } または エラーレスポンス
 */
export async function POST(request: NextRequest) {
  try {
    // 1. リクエストボディ取得とバリデーション
    const body = await request.json();
    const validationResult = trackClickSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "無効なリクエストです",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { dealId } = validationResult.data;

    // 2. セッション確認（会員 or 非会員判定）
    const session = await getServerSession(authOptions);
    const trackingId = session?.user?.memberId || getOrCreateGuestUuid(request);

    console.log("[track-click] Tracking ID:", trackingId);
    console.log("[track-click] Is member:", !!session?.user?.memberId);

    // 3. microCMSから案件情報取得
    const deal = await getDealByDealId(dealId);

    if (!deal) {
      return NextResponse.json(
        { error: "指定された案件が見つかりません" },
        { status: 404 }
      );
    }

    console.log("[track-click] Deal found:", deal.dealName);

    // 4. クリックログ記録
    await addClickLog({
      timestamp: new Date().toISOString(),
      memberId: trackingId,
      dealName: deal.dealName,
      dealId: deal.dealId,
    });

    console.log("[track-click] Click log recorded");

    // 5. トラッキングURL生成
    const trackingUrl = new URL(deal.affiliateUrl);
    trackingUrl.searchParams.set("id1", trackingId);

    console.log("[track-click] Tracking URL generated:", trackingUrl.toString());

    // 6. レスポンス返却（非会員の場合はCookie設定）
    const response = NextResponse.json(
      { trackingUrl: trackingUrl.toString() },
      { status: 200 }
    );

    // 非会員の場合、guest UUIDをCookieに保存
    if (!session?.user?.memberId && trackingId.startsWith("guest:")) {
      setGuestUuidCookie(response, trackingId);
      console.log("[track-click] Guest UUID cookie set");
    }

    return response;
  } catch (error) {
    console.error("Track click error:", error);

    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", { message: errorMessage, stack: errorStack });

    return NextResponse.json(
      {
        error: "クリック追跡中にエラーが発生しました",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}
