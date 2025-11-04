/**
 * AFBポストバック型定義
 *
 * AFBリアルタイムポストバックシステムのパラメータ型定義
 *
 * 参考: docs/specs/afb-postback.md
 * 送信元IP: 13.114.169.190（本番環境）
 * 再送元IP: 180.211.73.218, 112.137.189.110（再送時）
 *
 * @see https://docs.google.com/forms/d/e/1FAIpQLSfdulbxglFBUnSsIIIqJjw_jimnTDlgGB1gFmJW0985_800YQ/viewform
 */

/**
 * AFBポストバックステータス
 * 0: 未承認（発生）
 * 1: 承認
 * 9: 非承認（却下）
 */
export type AfbPostbackStatus = 0 | 1 | 9;

/**
 * AFBポストバックパラメータ
 *
 * GETメソッドでクエリパラメータとして送信される
 */
export interface AfbPostbackParams {
  /**
   * 会員ID（クリック時に付与したpaidパラメータの値）
   * これがあるおかげで完全自動マッチングが可能！
   */
  paid: string;

  /**
   * 広告ID（AFB内部の広告主管理番号）
   */
  adid: string;

  /**
   * 成果発生日時または変更日時
   * 形式: YYYY-MM-DD HH:mm:ss
   */
  time: string;

  /**
   * 成果確定日時（任意）
   * 形式: YYYY-MM-DD HH:mm:ss
   */
  judgetime?: string;

  /**
   * 成果報酬金額（円）
   */
  price: string; // 文字列で送信されるのでパースが必要

  /**
   * ステータス
   * 0: 未承認（発生）
   * 1: 承認
   * 9: 非承認（却下）
   */
  judge: string; // 文字列で送信されるのでパースが必要

  /**
   * 成果個別ID（ユニークキー）
   * 重複チェックに使用
   */
  u: string;

  /**
   * 売上金額（EC案件のみ、オプション）
   */
  amount?: string;
}

/**
 * 内部処理用のパース済みポストバックデータ
 */
export interface ParsedAfbPostbackData {
  /** 会員ID */
  memberId: string;

  /** 広告ID */
  adId: string;

  /** 成果発生日時（ISO8601形式に変換済み） */
  eventTime: string;

  /** 成果確定日時（ISO8601形式に変換済み、任意） */
  approvalTime?: string;

  /** 報酬額（数値） */
  rewardAmount: number;

  /** ステータス（内部形式） */
  status: "pending" | "approved" | "cancelled";

  /** 成果個別ID */
  uniqueId: string;

  /** 売上金額（数値、任意） */
  saleAmount?: number;
}

/**
 * ポストバックステータスの日本語ラベル
 */
export const AFB_POSTBACK_STATUS_LABELS: Record<AfbPostbackStatus, string> = {
  0: "未承認（発生）",
  1: "承認",
  9: "非承認（却下）",
} as const;

/**
 * ポストバックステータスを内部ステータスに変換
 *
 * @param judgeStatus AFBポストバックステータス（0, 1, 9）
 * @returns 内部ステータス（"pending" | "approved" | "cancelled"）
 */
export function convertAfbPostbackStatus(
  judgeStatus: AfbPostbackStatus
): "pending" | "approved" | "cancelled" {
  switch (judgeStatus) {
    case 0:
      return "pending"; // 未承認（発生）
    case 1:
      return "approved"; // 承認
    case 9:
      return "cancelled"; // 非承認（却下）
    default:
      console.warn(`[convertAfbPostbackStatus] Unknown judge status: ${judgeStatus}, defaulting to "pending"`);
      return "pending";
  }
}

/**
 * AFB日時形式（YYYY-MM-DD HH:mm:ss）をISO8601形式に変換
 *
 * @param afbTime AFB日時文字列
 * @returns ISO8601形式の文字列
 *
 * @example
 * convertAfbTimeToISO("2025-11-03 21:00:00") // "2025-11-03T21:00:00+09:00"
 */
export function convertAfbTimeToISO(afbTime: string): string {
  // AFBの日時はJST（UTC+9）と仮定
  const [datePart, timePart] = afbTime.split(" ");
  return `${datePart}T${timePart}+09:00`;
}

/**
 * ポストバックパラメータをパースして内部形式に変換
 *
 * @param params AFBポストバックパラメータ
 * @returns パース済みポストバックデータ
 */
export function parseAfbPostbackParams(params: AfbPostbackParams): ParsedAfbPostbackData {
  const judgeStatus = parseInt(params.judge, 10) as AfbPostbackStatus;
  const rewardAmount = parseFloat(params.price);
  const saleAmount = params.amount ? parseFloat(params.amount) : undefined;

  return {
    memberId: params.paid,
    adId: params.adid,
    eventTime: convertAfbTimeToISO(params.time),
    approvalTime: params.judgetime ? convertAfbTimeToISO(params.judgetime) : undefined,
    rewardAmount,
    status: convertAfbPostbackStatus(judgeStatus),
    uniqueId: params.u,
    saleAmount,
  };
}
