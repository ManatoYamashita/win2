import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { addClickLog, getDealById } from "@/lib/sheets";
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
 * データ構造:
 * - 案件情報: Google Sheets「案件マスタ」シートで管理
 * - クリックログ: Google Sheets「クリックログ」シートに記録
 * - 成果データ: GASが毎日3:10に「成果CSV_RAW」から自動集計
 *
 * フロー:
 * 1. リクエストボディのバリデーション ({ dealId: string })
 * 2. セッション確認（会員 or 非会員判定）
 *    - 会員の場合: session.user.memberId を使用
 *    - 非会員の場合: Cookieから guest:UUID を取得 or 新規生成
 * 3. Google Sheets「案件マスタ」から案件情報取得
 *    - 案件が見つからない場合: 404エラー
 *    - isActive = FALSE の案件: 404エラー
 * 4. イベントID生成（UUID v4）
 *    - 各クリック毎にユニークなIDを生成
 * 5. Google Sheets「クリックログ」に記録
 *    - 列構成: 日時, 会員ID, 案件名, 案件ID, イベントID
 * 6. affiliateUrlに ?id1={trackingId}&eventId={eventId} を付与
 *    - trackingId = memberId or guest:UUID
 *    - eventId = UUID v4（クリック毎にユニーク）
 * 7. レスポンス返却（非会員の場合はguest UUID Cookieを設定）
 *
 * @param request - NextRequest オブジェクト
 * @returns NextResponse - { trackingUrl: string } または エラーレスポンス
 *
 * @example
 * // リクエスト
 * POST /api/track-click
 * Content-Type: application/json
 * { "dealId": "a8-rakuten-card" }
 *
 * // レスポンス（成功）
 * {
 *   "trackingUrl": "https://px.a8.net/svt/ejp?a8mat=XXXXX&id1=member-uuid-or-guest-uuid&eventId=event-uuid-v4"
 * }
 *
 * // レスポンス（案件が見つからない）
 * {
 *   "error": "指定された案件が見つかりません"
 * }
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

    // 3. Google Sheets APIから案件情報取得
    const deal = await getDealById(dealId);

    if (!deal) {
      return NextResponse.json(
        { error: "指定された案件が見つかりません" },
        { status: 404 }
      );
    }

    // 4. イベントID生成（UUID v4）
    const eventId = crypto.randomUUID();

    // 5. Google Sheets「クリックログ」に記録
    await addClickLog({
      timestamp: new Date().toISOString(),
      memberId: trackingId,
      dealName: deal.dealName,
      dealId: dealId,
      eventId: eventId,
    });

    console.log("[track-click] Click logged:", {
      dealId,
      dealName: deal.dealName,
      trackingId,
      eventId,
    });

    // 6. affiliateUrlに ?id1={trackingId}&eventId={eventId} を付与
    const trackingUrl = new URL(deal.affiliateUrl);
    trackingUrl.searchParams.set("id1", trackingId);
    trackingUrl.searchParams.set("eventId", eventId);

    // AFBの場合のみ paid パラメータを追加（ポストバック用の会員ID追跡）
    if (deal.aspName.toLowerCase() === "afb") {
      trackingUrl.searchParams.set("paid", trackingId);
      console.log("[track-click] AFB: Added paid parameter:", trackingId);
    }

    console.log("[track-click] Tracking URL generated:", trackingUrl.toString());

    // 7. レスポンス返却（非会員の場合はCookie設定）
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
