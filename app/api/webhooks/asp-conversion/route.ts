import { NextRequest, NextResponse } from "next/server";
import { afbWebhookSchema } from "@/lib/validations/asp-webhook";
import {
  verifyWebhookSignature,
  extractSignatureFromHeaders,
} from "@/lib/webhooks/verify-signature";
import {
  writeConversionData,
  getClickLogByEventId,
} from "@/lib/sheets";

/**
 * ASP Webhook受信エンドポイント
 *
 * POST /api/webhooks/asp-conversion?asp=afb
 *
 * ASP（Affiliate Service Provider）から送信される成果通知Webhookを受信し、
 * Google Sheets「成果CSV_RAW」シートに記録します。
 *
 * セキュリティ:
 * - HMAC-SHA256署名検証（必須）
 * - タイミング攻撃対策（timingSafeEqual使用）
 * - 環境変数でシークレットキー管理
 *
 * データフロー:
 * 1. ASP → Webhook → 「成果CSV_RAW」シートに追記
 * 2. GASが毎日3:10に自動処理
 * 3. クリックログとマッチング → キャッシュバック計算 → 「成果データ」シートに転記
 *
 * @param request - NextRequest オブジェクト
 * @returns NextResponse - { status: "success" } または エラーレスポンス
 *
 * @example
 * // afb Webhook送信例（推定）
 * POST /api/webhooks/asp-conversion?asp=afb
 * Headers:
 *   X-AFB-Signature: sha256=a1b2c3d4...
 * Body:
 * {
 *   "id1": "member-uuid-123",
 *   "eventId": "event-uuid-456",
 *   "program_id": "afb-prog-789",
 *   "order_id": "ORD-2025-001",
 *   "reward": 10000,
 *   "currency": "JPY",
 *   "status": "pending",
 *   "timestamp": "2025-01-03T12:00:00Z"
 * }
 *
 * // レスポンス（成功）
 * {
 *   "status": "success",
 *   "message": "Conversion recorded successfully"
 * }
 *
 * // レスポンス（署名検証失敗）
 * {
 *   "error": "Invalid signature"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // 1. ASP識別（クエリパラメータから取得）
    const searchParams = request.nextUrl.searchParams;
    const aspName = searchParams.get("asp") || "unknown";

    console.log(`[asp-webhook] Received webhook from ASP: ${aspName}`);

    // 2. 署名検証（セキュリティ必須）
    const signature = extractSignatureFromHeaders(request.headers);
    const rawBody = await request.text();

    // 環境変数からシークレットキーを取得
    const secretKey = getWebhookSecret(aspName);

    if (!secretKey) {
      console.error(`[asp-webhook] Secret key not configured for ASP: ${aspName}`);
      return NextResponse.json(
        { error: "Webhook secret not configured" },
        { status: 500 }
      );
    }

    if (!signature) {
      console.error(`[asp-webhook] Missing signature header`);
      return NextResponse.json(
        { error: "Missing signature" },
        { status: 401 }
      );
    }

    // 署名検証実行
    const isValidSignature = verifyWebhookSignature(
      rawBody,
      signature,
      secretKey
    );

    if (!isValidSignature) {
      console.error(`[asp-webhook] Invalid signature for ASP: ${aspName}`);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    console.log(`[asp-webhook] Signature verified successfully`);

    // 3. リクエストボディのバリデーション
    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch (parseError) {
      console.error(`[asp-webhook] Failed to parse JSON body:`, parseError);
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const validationResult = afbWebhookSchema.safeParse(body);

    if (!validationResult.success) {
      console.error(`[asp-webhook] Validation failed:`, validationResult.error.flatten());
      return NextResponse.json(
        {
          error: "Invalid webhook payload",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const payload = validationResult.data;

    console.log(`[asp-webhook] Payload validated:`, {
      id1: payload.id1,
      eventId: payload.eventId,
      reward: payload.reward,
      status: payload.status,
    });

    // 4. eventIdでクリックログを検索（存在確認とdealName取得）
    let dealName = payload.deal_name || "不明な案件";
    let finalTrackingId = payload.id1;

    if (payload.eventId) {
      const clickLog = await getClickLogByEventId(payload.eventId);

      if (clickLog) {
        // クリックログが見つかった場合、そこから情報を取得
        dealName = clickLog.dealName;
        finalTrackingId = clickLog.memberId; // クリックログのmemberIdを優先

        console.log(`[asp-webhook] Click log found:`, {
          eventId: payload.eventId,
          memberId: clickLog.memberId,
          dealName: clickLog.dealName,
        });
      } else {
        // eventIdが指定されているがクリックログが見つからない場合
        console.warn(`[asp-webhook] Click log not found for eventId: ${payload.eventId}`);
        console.warn(`[asp-webhook] Using trackingId from payload: ${payload.id1}`);
      }
    } else {
      // eventIdが指定されていない場合、id1のみを使用
      console.warn(`[asp-webhook] No eventId provided, using id1 only: ${payload.id1}`);
    }

    // 5. 成果データを「成果CSV_RAW」シートに記録
    await writeConversionData({
      trackingId: finalTrackingId,
      eventId: payload.eventId,
      dealName: dealName,
      aspName: aspName,
      rewardAmount: payload.reward,
      status: payload.status,
      orderId: payload.order_id,
      timestamp: payload.timestamp || new Date().toISOString(),
    });

    console.log(`[asp-webhook] Conversion recorded successfully`);

    // 6. 成功レスポンス返却（ASPは200 OKを期待）
    return NextResponse.json(
      {
        status: "success",
        message: "Conversion recorded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[asp-webhook] Error processing webhook:", error);

    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("[asp-webhook] Error details:", { message: errorMessage, stack: errorStack });

    // エラーレスポンス返却（500 Internal Server Error）
    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 }
    );
  }
}

/**
 * ASP名から対応する環境変数のシークレットキーを取得
 *
 * @param aspName ASP識別子（afb, a8net, moshimo, valuecommerce）
 * @returns シークレットキー（環境変数から取得）
 */
function getWebhookSecret(aspName: string): string | undefined {
  const secretMap: Record<string, string | undefined> = {
    afb: process.env.AFB_WEBHOOK_SECRET,
    a8net: process.env.A8NET_WEBHOOK_SECRET,
    moshimo: process.env.MOSHIMO_WEBHOOK_SECRET,
    valuecommerce: process.env.VALUECOMMERCE_WEBHOOK_SECRET,
  };

  return secretMap[aspName.toLowerCase()];
}
