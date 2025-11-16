import { NextRequest, NextResponse } from "next/server";
import { fetchAfbConversionsLastNDays } from "@/lib/asp/afb-client";
import type { ConversionStatus } from "@/types/afb-api";
import { writeConversionData, readSheet, SHEET_NAMES } from "@/lib/sheets";
import type { ConversionWebhookData } from "@/lib/sheets";

/**
 * AFB API ポーリング Cronジョブ
 *
 * 定期的にAFB APIをポーリングし、過去7日間の成果データを取得してGoogle Sheetsに記録します。
 *
 * エンドポイント: POST /api/cron/sync-afb-conversions
 * 実行頻度: 10分毎（GitHub Actions Schedulerで設定）
 * 認証: Authorization: Bearer {CRON_SECRET}
 *
 * 処理フロー:
 * 1. CRON_SECRET検証（認証）
 * 2. AFB APIから過去7日間の成果データを取得
 * 3. 既存データと照合（commit_idで重複チェック）
 * 4. 新規データのみをGoogle Sheets「成果CSV_RAW」に記録
 * 5. 結果をJSON形式で返却
 *
 * 注意事項:
 * - AFB APIはid1パラメータをレスポンスに含まないため、trackingIdとeventIdは空白で記録
 * - マッチングアルゴリズムが後で時間ベース・案件名ベースで照合を行う
 * - GASが毎日3:10にキャッシュバック計算を実行
 *
 * セキュリティ:
 * - GitHub Actionsからのリクエストのみ許可（CRON_SECRET検証）
 * - 不正なリクエストは401 Unauthorizedで拒否
 *
 * 参考: docs/handoff/asp-integration-session-handoff.md
 */
export async function POST(request: NextRequest) {
  // 1. CRON_SECRET検証（認証）
  const authHeader = request.headers.get("authorization");
  const expectedAuth = `Bearer ${process.env.CRON_SECRET}`;

  if (!process.env.CRON_SECRET) {
    console.error("[sync-afb-conversions] CRON_SECRET is not configured");
    return NextResponse.json(
      { success: false, error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (authHeader !== expectedAuth) {
    console.warn("[sync-afb-conversions] Unauthorized access attempt");
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // 2. AFB APIポーリング実行
  try {
    console.log("[sync-afb-conversions] Starting AFB API polling...");

    // 1. AFB APIから過去7日間の成果データを取得
    console.log("[sync-afb-conversions] Fetching conversions from AFB API...");
    const conversions = await fetchAfbConversionsLastNDays(7);
    console.log(`[sync-afb-conversions] Fetched ${conversions.length} conversions from AFB API`);

    // 2. 既存データを読み込み（重複チェック用）
    console.log("[sync-afb-conversions] Reading existing data from Google Sheets...");
    const existingRows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:H");
    const existingOrderIds = new Set(existingRows.map(row => row[7])); // H列: 注文ID (commit_id)
    console.log(`[sync-afb-conversions] Found ${existingOrderIds.size} existing conversions`);

    // 3. 新規データのみをフィルター
    const newConversions = conversions.filter(
      conversion => !existingOrderIds.has(conversion.commit_id)
    );
    console.log(`[sync-afb-conversions] ${newConversions.length} new conversions to record`);

    // 4. Google Sheetsに記録
    let successCount = 0;
    let errorCount = 0;

    for (const conversion of newConversions) {
      try {
        const data: ConversionWebhookData = {
          trackingId: "", // AFB APIにはid1が含まれないため空白（後でマッチング）
          eventId: "",    // AFB APIにはeventIdが含まれないため空白（後でマッチング）
          dealName: conversion.adv_name,
          aspName: "afb",
          rewardAmount: conversion.margin,
          status: convertAfbStatus(conversion.commit_flg),
          orderId: conversion.commit_id,
          timestamp: conversion.commit_time, // 発生日を使用
        };

        await writeConversionData(data);
        successCount++;

        console.log(`[sync-afb-conversions] Recorded conversion: ${conversion.commit_id} - ${conversion.adv_name}`);
      } catch (error) {
        errorCount++;
        console.error(`[sync-afb-conversions] Error recording conversion ${conversion.commit_id}:`, error);
      }
    }

    console.log(`[sync-afb-conversions] Completed: ${successCount} success, ${errorCount} errors`);

    // 5. 結果をJSON形式で返却
    return NextResponse.json({
      success: true,
      message: `AFB API polling completed successfully`,
      summary: {
        total: conversions.length,
        new: newConversions.length,
        skipped: conversions.length - newConversions.length,
        recorded: successCount,
        errors: errorCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[sync-afb-conversions] Fatal error during AFB API polling:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * AFBのステータスを内部ステータスに変換
 *
 * @param commitFlg AFBの成果承認状態（0: 発生(未承認), 1: 承認, 2: 却下）
 * @returns 内部ステータス（"pending" | "approved" | "cancelled"）
 */
function convertAfbStatus(commitFlg: ConversionStatus): "pending" | "approved" | "cancelled" {
  switch (commitFlg) {
    case 0:
      return "pending";   // 発生(未承認)
    case 1:
      return "approved";  // 承認
    case 2:
      return "cancelled"; // 却下
    default:
      console.warn(`[convertAfbStatus] Unknown commit_flg: ${commitFlg}, defaulting to "pending"`);
      return "pending";
  }
}
