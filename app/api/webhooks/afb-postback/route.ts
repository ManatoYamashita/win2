import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import type { AfbPostbackParams } from "@/types/afb-postback";
import { parseAfbPostbackParams } from "@/types/afb-postback";
import { writeConversionData, readSheet, SHEET_NAMES } from "@/lib/sheets";
import type { ConversionWebhookData } from "@/lib/sheets";

/**
 * AFBポストバック受信エンドポイント
 *
 * AFBリアルタイムポストバックシステムからの成果通知を受信します。
 *
 * エンドポイント: GET /api/webhooks/afb-postback
 * メソッド: GET
 * 送信元IP: 13.114.169.190（本番）, 180.211.73.218 / 112.137.189.110（再送）
 *
 * パラメータ:
 * - paid: 会員ID（クリック時に付与）
 * - adid: 広告ID
 * - price: 報酬額
 * - judge: ステータス（0:未承認, 1:承認, 9:非承認）
 * - u: 成果個別ID（ユニークキー）
 * - time: 成果発生日時
 * - judgetime: 成果確定日時（任意）
 * - amount: 売上金額（任意）
 *
 * 処理フロー:
 * 1. 送信元IP検証（セキュリティ）
 * 2. パラメータバリデーション
 * 3. 重複チェック（u パラメータでユニーク制約）
 * 4. Google Sheets「成果CSV_RAW」に記録
 * 5. 200 OK返却
 *
 * 参考: docs/specs/afb-postback.md
 */
export async function GET(request: NextRequest) {
  try {
    const headersList = await headers();
    const forwardedFor = headersList.get("x-forwarded-for");
    const realIp = headersList.get("x-real-ip");
    const clientIp = (forwardedFor?.split(",")[0]?.trim()) || realIp || "unknown";

    console.log(`[afb-postback] Received postback from IP: ${clientIp}`);

    // 1. 送信元IP検証（本番環境のみ、開発環境ではスキップ）
    const isDevelopment = process.env.NODE_ENV === "development";
    const allowedIPs = [
      "13.114.169.190",    // 本番送信元IP
      "180.211.73.218",    // 再送元IP1
      "112.137.189.110",   // 再送元IP2
    ];

    if (!isDevelopment && !allowedIPs.includes(clientIp)) {
      console.warn(`[afb-postback] Unauthorized IP: ${clientIp}`);
      return NextResponse.json(
        { error: "Unauthorized IP address" },
        { status: 401 }
      );
    }

    // 2. パラメータ取得
    const searchParams = request.nextUrl.searchParams;
    const params: Partial<AfbPostbackParams> = {
      paid: searchParams.get("paid") || undefined,
      adid: searchParams.get("adid") || undefined,
      time: searchParams.get("time") || undefined,
      judgetime: searchParams.get("judgetime") || undefined,
      price: searchParams.get("price") || undefined,
      judge: searchParams.get("judge") || undefined,
      u: searchParams.get("u") || undefined,
      amount: searchParams.get("amount") || undefined,
    };

    console.log("[afb-postback] Received params:", params);

    // 3. 必須パラメータチェック
    if (!params.paid || !params.adid || !params.price || !params.judge || !params.u || !params.time) {
      console.error("[afb-postback] Missing required parameters:", params);
      return NextResponse.json(
        { error: "Missing required parameters: paid, adid, price, judge, u, time" },
        { status: 400 }
      );
    }

    // 4. パラメータをパース
    const parsedData = parseAfbPostbackParams(params as AfbPostbackParams);

    console.log("[afb-postback] Parsed data:", parsedData);

    // 5. 重複チェック（u パラメータで既存データを確認）
    const existingRows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:H");
    const existingUniqueIds = new Set(existingRows.map(row => row[7])); // H列: 注文ID（u）

    if (existingUniqueIds.has(parsedData.uniqueId)) {
      console.log(`[afb-postback] Duplicate conversion detected: ${parsedData.uniqueId}, skipping`);
      return NextResponse.json(
        {
          success: true,
          message: "Duplicate conversion skipped",
          uniqueId: parsedData.uniqueId,
        },
        { status: 200 }
      );
    }

    // 6. Google Sheets「成果CSV_RAW」に記録
    const conversionData: ConversionWebhookData = {
      trackingId: parsedData.memberId,  // ★ ここが重要！会員IDを直接設定
      eventId: "",                       // ポストバックにはeventIdがないため空白
      dealName: `AFB広告ID:${parsedData.adId}`, // 広告IDを記録（案件名は後で照合）
      aspName: "afb",
      rewardAmount: parsedData.rewardAmount,
      status: parsedData.status,
      orderId: parsedData.uniqueId,     // u パラメータを注文IDとして記録
      timestamp: parsedData.eventTime,
    };

    await writeConversionData(conversionData);

    console.log(`[afb-postback] Successfully recorded conversion: ${parsedData.uniqueId} for member: ${parsedData.memberId}`);

    // 7. 200 OK返却
    return NextResponse.json(
      {
        success: true,
        message: "Postback received and recorded successfully",
        data: {
          memberId: parsedData.memberId,
          uniqueId: parsedData.uniqueId,
          rewardAmount: parsedData.rewardAmount,
          status: parsedData.status,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[afb-postback] Error processing postback:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
