import { readSheet, SHEET_NAMES, getDealById } from "@/lib/sheets";
import type { ClickLogRow, DealRow } from "@/lib/sheets";

/**
 * マッチング候補
 *
 * クリックログとの照合結果を表す型定義
 */
export interface ConversionMatchCandidate {
  /** クリックログ情報 */
  clickLog: ClickLogRow;
  /** マッチングスコア（0-100） */
  score: number;
  /** スコアの内訳 */
  scoreBreakdown: {
    /** 時間範囲内（10点） */
    timeRange: number;
    /** 案件名一致（完全:40点, 部分:20点） */
    dealNameMatch: number;
    /** 報酬額一致（完全:30点, 許容範囲:15点） */
    rewardMatch: number;
    /** デバイス・リファラ等の追加情報（将来拡張用、現在は0点） */
    additionalInfo: number;
  };
  /** 信頼度（高:90+, 中:70-89, 低:70未満） */
  confidence: "high" | "medium" | "low";
}

/**
 * マッチング結果
 *
 * 成果データに対するマッチング候補のリスト
 */
export interface MatchingResult {
  /** 成果データの注文ID（commit_id） */
  orderId: string;
  /** 成果データの案件名 */
  dealName: string;
  /** 成果データの報酬額 */
  rewardAmount: number;
  /** 成果データの発生日時 */
  commitTime: string;
  /** マッチング候補（スコア順、降順） */
  candidates: ConversionMatchCandidate[];
  /** 最高スコアの候補（存在する場合） */
  bestMatch: ConversionMatchCandidate | null;
}

/**
 * 成果データとクリックログの時間差を計算（ミリ秒）
 *
 * @param clickTime クリック時刻（ISO8601形式）
 * @param commitTime 成果発生時刻（ISO8601形式）
 * @returns 時間差（ミリ秒）
 */
function calculateTimeDifference(clickTime: string, commitTime: string): number {
  const clickDate = new Date(clickTime);
  const commitDate = new Date(commitTime);

  return Math.abs(commitDate.getTime() - clickDate.getTime());
}

/**
 * 案件名の類似度を計算
 *
 * @param name1 案件名1
 * @param name2 案件名2
 * @returns 類似度スコア（0-40点）
 */
function calculateDealNameSimilarity(name1: string, name2: string): number {
  const normalized1 = name1.toLowerCase().trim();
  const normalized2 = name2.toLowerCase().trim();

  // 完全一致
  if (normalized1 === normalized2) {
    return 40;
  }

  // 部分一致（どちらかが含まれているか）
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    return 20;
  }

  // 一致なし
  return 0;
}

/**
 * 報酬額の妥当性を評価
 *
 * @param expectedReward 期待される報酬額（案件マスタから）
 * @param actualReward 実際の報酬額（AFB APIから）
 * @returns 妥当性スコア（0-30点）
 */
function calculateRewardValidityScore(
  expectedReward: number | undefined,
  actualReward: number
): number {
  // 案件マスタに報酬額がない場合は評価不可
  if (!expectedReward || expectedReward === 0) {
    return 0;
  }

  // 完全一致
  if (expectedReward === actualReward) {
    return 30;
  }

  // 許容範囲内（±10%）
  const lowerBound = expectedReward * 0.9;
  const upperBound = expectedReward * 1.1;

  if (actualReward >= lowerBound && actualReward <= upperBound) {
    return 15;
  }

  // 範囲外
  return 0;
}

/**
 * マッチングスコアを計算
 *
 * @param clickLog クリックログ
 * @param conversionDealName 成果データの案件名
 * @param conversionReward 成果データの報酬額
 * @param conversionCommitTime 成果データの発生日時
 * @param dealInfo 案件マスタ情報（オプション）
 * @returns マッチング候補情報
 */
async function calculateMatchScore(
  clickLog: ClickLogRow,
  conversionDealName: string,
  conversionReward: number,
  conversionCommitTime: string,
  dealInfo?: DealRow | null
): Promise<ConversionMatchCandidate> {
  const scoreBreakdown = {
    timeRange: 0,
    dealNameMatch: 0,
    rewardMatch: 0,
    additionalInfo: 0,
  };

  // 1. 時間範囲チェック（±24時間以内で10点）
  const timeDiff = calculateTimeDifference(clickLog.timestamp, conversionCommitTime);
  const hoursIn24 = 24 * 60 * 60 * 1000; // 24時間（ミリ秒）

  if (timeDiff <= hoursIn24) {
    scoreBreakdown.timeRange = 10;
  }

  // 2. 案件名の一致（完全:40点, 部分:20点）
  scoreBreakdown.dealNameMatch = calculateDealNameSimilarity(
    clickLog.dealName,
    conversionDealName
  );

  // 3. 報酬額の妥当性（完全:30点, 許容範囲:15点）
  if (dealInfo?.rewardAmount !== undefined && dealInfo.rewardAmount !== null) {
    scoreBreakdown.rewardMatch = calculateRewardValidityScore(
      dealInfo.rewardAmount,
      conversionReward
    );
  }

  // 4. 追加情報（将来拡張用）
  // デバイス、リファラ、キーワード等を活用
  scoreBreakdown.additionalInfo = 0;

  // 合計スコア計算
  const totalScore =
    scoreBreakdown.timeRange +
    scoreBreakdown.dealNameMatch +
    scoreBreakdown.rewardMatch +
    scoreBreakdown.additionalInfo;

  // 信頼度判定
  let confidence: "high" | "medium" | "low";
  if (totalScore >= 90) {
    confidence = "high";
  } else if (totalScore >= 70) {
    confidence = "medium";
  } else {
    confidence = "low";
  }

  return {
    clickLog,
    score: totalScore,
    scoreBreakdown,
    confidence,
  };
}

/**
 * 成果データに対してクリックログから候補を検索
 *
 * @param orderId 成果データの注文ID（commit_id）
 * @param dealName 成果データの案件名
 * @param rewardAmount 成果データの報酬額
 * @param commitTime 成果データの発生日時
 * @returns マッチング結果
 *
 * @example
 * const result = await findMatchingCandidates(
 *   "AFB-12345",
 *   "楽天カード",
 *   10000,
 *   "2025-01-03T12:00:00Z"
 * );
 *
 * if (result.bestMatch && result.bestMatch.confidence === "high") {
 *   // 自動承認候補
 *   console.log("Auto-approve candidate:", result.bestMatch);
 * }
 */
export async function findMatchingCandidates(
  orderId: string,
  dealName: string,
  rewardAmount: number,
  commitTime: string
): Promise<MatchingResult> {
  try {
    console.log(`[conversion-matcher] Finding candidates for order ${orderId}...`);

    // 1. クリックログを全件取得
    const clickLogRows = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");
    const clickLogs: ClickLogRow[] = clickLogRows.map(row => ({
      timestamp: row[0] || "",
      memberId: row[1] || "",
      dealName: row[2] || "",
      dealId: row[3] || "",
      eventId: row[4] || "",
    }));

    console.log(`[conversion-matcher] Found ${clickLogs.length} click logs`);

    // 2. 時間範囲で事前フィルタリング（±24時間）
    const hoursIn24 = 24 * 60 * 60 * 1000;
    const commitDate = new Date(commitTime);
    const filteredLogs = clickLogs.filter(log => {
      const timeDiff = calculateTimeDifference(log.timestamp, commitTime);
      return timeDiff <= hoursIn24;
    });

    console.log(`[conversion-matcher] ${filteredLogs.length} logs within ±24 hours`);

    // 3. 各クリックログに対してマッチングスコアを計算
    const candidates: ConversionMatchCandidate[] = [];

    for (const clickLog of filteredLogs) {
      // 案件マスタから報酬額を取得（dealIdが存在する場合）
      let dealInfo: DealRow | null = null;
      if (clickLog.dealId) {
        try {
          dealInfo = await getDealById(clickLog.dealId);
        } catch (error) {
          console.warn(`[conversion-matcher] Failed to get deal info for ${clickLog.dealId}:`, error);
        }
      }

      const candidate = await calculateMatchScore(
        clickLog,
        dealName,
        rewardAmount,
        commitTime,
        dealInfo
      );

      candidates.push(candidate);
    }

    // 4. スコア順にソート（降順）
    candidates.sort((a, b) => b.score - a.score);

    console.log(`[conversion-matcher] Generated ${candidates.length} candidates`);

    // 5. 最高スコアの候補を取得
    const bestMatch: ConversionMatchCandidate | null = candidates.length > 0 ? (candidates[0] ?? null) : null;

    if (bestMatch) {
      console.log(
        `[conversion-matcher] Best match: score=${bestMatch.score}, confidence=${bestMatch.confidence}, memberId=${bestMatch.clickLog.memberId}`
      );
    } else {
      console.log(`[conversion-matcher] No matching candidates found`);
    }

    return {
      orderId,
      dealName,
      rewardAmount,
      commitTime,
      candidates,
      bestMatch,
    };
  } catch (error) {
    console.error("[conversion-matcher] Error finding matching candidates:", error);
    throw error;
  }
}

/**
 * バッチ処理：複数の成果データに対してマッチング候補を検索
 *
 * @param conversions 成果データ配列（orderId, dealName, rewardAmount, commitTime）
 * @returns マッチング結果配列
 */
export async function batchMatchConversions(
  conversions: Array<{
    orderId: string;
    dealName: string;
    rewardAmount: number;
    commitTime: string;
  }>
): Promise<MatchingResult[]> {
  const results: MatchingResult[] = [];

  for (const conversion of conversions) {
    try {
      const result = await findMatchingCandidates(
        conversion.orderId,
        conversion.dealName,
        conversion.rewardAmount,
        conversion.commitTime
      );
      results.push(result);
    } catch (error) {
      console.error(`[conversion-matcher] Error matching conversion ${conversion.orderId}:`, error);
    }
  }

  return results;
}
