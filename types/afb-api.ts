/**
 * AFB API型定義
 *
 * AFB成果データAPIのリクエスト・レスポンス型定義
 *
 * API仕様書: 2023-12-25版
 * エンドポイント: GET https://api.afi-b.com/partners/{partner_id}/conversion
 *
 * 参考: docs/asp-api-integration.md
 */

/**
 * 基準日タイプ
 * 1: クリック日
 * 2: 発生日
 * 3: 確定日
 */
export type ConversionDateType = 1 | 2 | 3;

/**
 * 成果承認状態
 * 0: 発生(未承認)
 * 1: 承認
 * 2: 却下
 */
export type ConversionStatus = 0 | 1 | 2;

/**
 * AFB API リクエストパラメータ
 */
export interface AfbApiRequest {
  /** パートナーID（パスパラメータ） */
  partner_id: string;

  /** 検索対象期間の開始日（YYYY-MM-DD） */
  start_date: string;

  /** 検索対象期間の終了日（YYYY-MM-DD） */
  end_date: string;

  /** 基準日タイプ（1: クリック日, 2: 発生日, 3: 確定日） */
  conversion_date_type: ConversionDateType;

  /** プロモーションID（カンマ区切り、オプション） */
  promotion_id?: string;

  /** パートナーサイトID（カンマ区切り、オプション） */
  partner_site_id?: string;

  /** 成果承認状態（カンマ区切り、オプション。例: "0,1,2"） */
  status?: string;
}

/**
 * AFB API レスポンス（個別成果データ）
 */
export interface AfbConversionData {
  /** 成果ID（afb固有） */
  commit_id: string;

  /** プロモーションID（afb固有） */
  adv_id: string;

  /** プロモーション名（広告主のプロモーション名称） */
  adv_name: string;

  /** パートナーサイトID（afb固有） */
  partner_site_id: string;

  /** パートナーサイト名（媒体が運営するサイト名） */
  partner_site_name: string;

  /** デバイス */
  device: string;

  /** キーワード */
  keyword: string;

  /** リファラ */
  ref: string;

  /** クリック日（ISO8601形式想定） */
  visit_time: string;

  /** 発生日（ISO8601形式想定） */
  commit_time: string;

  /** 確定日（ISO8601形式想定） */
  recognition_time: string | null;

  /** 報酬額 */
  margin: number;

  /** 成果承認状態（0: 承認待ち, 1: 承認, 2: 非承認） */
  commit_flg: ConversionStatus;
}

/**
 * AFB API レスポンス
 */
export interface AfbApiResponse {
  /** 成果データ配列 */
  response: AfbConversionData[];

  /** エラーメッセージ（エラー時のみ） */
  error_message?: string;
}

/**
 * AFB API エラーレスポンス
 */
export interface AfbApiError {
  /** HTTPステータスコード */
  status: number;

  /** エラーメッセージ */
  message: string;
}

/**
 * 成果承認状態の日本語ラベル
 */
export const AFB_STATUS_LABELS: Record<ConversionStatus, string> = {
  0: "承認待ち",
  1: "承認",
  2: "非承認",
} as const;

/**
 * 基準日タイプの日本語ラベル
 */
export const AFB_DATE_TYPE_LABELS: Record<ConversionDateType, string> = {
  1: "クリック日",
  2: "発生日",
  3: "確定日",
} as const;
