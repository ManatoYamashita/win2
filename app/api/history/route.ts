import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { readSheet, SHEET_NAMES, getResultsByMemberId } from "@/lib/sheets";

/**
 * 拡張クリックログ型定義（F列・G列を含む）
 */
interface ClickLogRowExtended {
  timestamp: string;
  memberId: string;
  dealName: string;
  dealId: string;
  eventId: string;
  appliedDealName?: string; // F列: GASが記録する申し込み案件名
  status?: string;           // G列: GASが記録するステータス
}

/**
 * 申込履歴レスポンス型
 */
interface HistoryItem {
  timestamp: string;          // 申込日時
  dealName: string;           // 案件名
  dealId: string;             // 案件ID
  eventId: string;            // イベントID
  status: string | null;      // ステータス（未確定/確定/否認、G列が空の場合はnull）
  statusLabel: string | null; // ステータス表示ラベル（G列が空の場合はnull）
  originalReward?: number;    // 原始報酬額（参考、成果がある場合）
}

/**
 * GET /api/history
 * 会員の申込履歴を取得
 */
export async function GET(_request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession(authOptions);

    if (!session?.user?.memberId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    const memberId = session.user.memberId;

    // クリックログを取得（A2:G - F列・G列も含む）
    const clickLogRows = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:G");

    // 会員のクリックログのみをフィルタリング
    const memberClickLogs: ClickLogRowExtended[] = clickLogRows
      .filter(row => row[1] === memberId)
      .map(row => ({
        timestamp: row[0] || "",
        memberId: row[1] || "",
        dealName: row[2] || "",
        dealId: row[3] || "",
        eventId: row[4] || "",
        appliedDealName: row[5] || undefined, // F列
        status: row[6] || undefined,           // G列
      }));

    // 成果データを取得
    const results = await getResultsByMemberId(memberId);

    // クリックログをベースに履歴を作成
    const history: HistoryItem[] = memberClickLogs.map(log => {
      // F列・G列に値があればGASがマッチング済み
      const hasGASStatus = Boolean(log.status);

      // 成果データとマッチング（eventIdベース - 将来的な拡張用）
      const result = results.find(r => r.dealName === log.dealName);

      // ステータス判定ロジック
      let status: string | null;
      let statusLabel: string | null;
      let originalReward: number | undefined;

      if (hasGASStatus && log.status) {
        // GASが記録したステータスを使用
        const normalizedStatus = log.status.toLowerCase();

        if (normalizedStatus.includes("未確定") || normalizedStatus.includes("pending")) {
          status = "pending";
          statusLabel = "未確定";
          originalReward = result?.originalReward;
        } else if (normalizedStatus.includes("確定") || normalizedStatus.includes("確定") || normalizedStatus.includes("approved")) {
          status = "approved";
          statusLabel = "確定";
          originalReward = result?.originalReward;
        } else if (normalizedStatus.includes("否認") || normalizedStatus.includes("cancelled")) {
          status = "cancelled";
          statusLabel = "否認";
        } else {
          status = "applied";
          statusLabel = "申込済み";
        }
      } else if (result) {
        // 成果データがある場合
        const resultStatus = result.status.toLowerCase();

        if (resultStatus.includes("未確定") || resultStatus.includes("pending")) {
          status = "pending";
          statusLabel = "未確定";
          originalReward = result.originalReward;
        } else if (resultStatus.includes("確定") || resultStatus.includes("確定") || resultStatus.includes("approved")) {
          status = "approved";
          statusLabel = "確定";
          originalReward = result.originalReward;
        } else if (resultStatus.includes("否認") || resultStatus.includes("cancelled")) {
          status = "cancelled";
          statusLabel = "否認";
        } else {
          status = "applied";
          statusLabel = "申込済み";
        }
      } else {
        // クリックログのみ（成果データなし、G列も空）
        status = null;
        statusLabel = null;
      }

      return {
        timestamp: log.timestamp,
        dealName: log.appliedDealName || log.dealName, // GAS記録の案件名を優先
        dealId: log.dealId,
        eventId: log.eventId,
        status,
        statusLabel,
        originalReward,
      };
    });

    // 時系列順にソート（新しい順）
    history.sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return dateB - dateA; // 降順
    });

    return NextResponse.json(history, { status: 200 });
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json(
      { error: "申込履歴の取得に失敗しました" },
      { status: 500 }
    );
  }
}
