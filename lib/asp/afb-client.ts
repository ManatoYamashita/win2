import type {
  AfbApiRequest,
  AfbApiResponse,
  AfbConversionData,
  ConversionDateType,
} from "@/types/afb-api";

/**
 * AFB API Client
 *
 * AFB成果データAPIとの通信を担当するクライアント
 *
 * エンドポイント: GET https://api.afi-b.com/partners/{partner_id}/conversion
 *
 * 環境変数:
 * - AFB_PARTNER_ID: パートナーID
 * - AFB_API_KEY: APIキー（authorizationtoken）
 *
 * 参考: docs/asp-api-integration.md
 */

const AFB_API_BASE_URL = "https://api.afi-b.com";
const AFB_PARTNER_ID = process.env.AFB_PARTNER_ID;
const AFB_API_KEY = process.env.AFB_API_KEY;

/**
 * AFB API設定チェック
 */
function checkAfbConfig(): void {
  if (!AFB_PARTNER_ID || !AFB_API_KEY) {
    throw new Error(
      "AFB API is not configured. Set AFB_PARTNER_ID and AFB_API_KEY in environment variables."
    );
  }
}

/**
 * 日付をYYYY-MM-DD形式に変換
 *
 * @param date Date object
 * @returns YYYY-MM-DD形式の文字列
 */
function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * AFB APIから成果データを取得
 *
 * @param params リクエストパラメータ
 * @returns 成果データ配列
 *
 * @example
 * const conversions = await fetchAfbConversions({
 *   start_date: "2025-01-01",
 *   end_date: "2025-01-03",
 *   conversion_date_type: 2, // 発生日基準
 *   status: "0,1" // 承認待ち・承認のみ
 * });
 */
export async function fetchAfbConversions(
  params: Omit<AfbApiRequest, "partner_id">
): Promise<AfbConversionData[]> {
  checkAfbConfig();

  const url = new URL(`${AFB_API_BASE_URL}/partners/${AFB_PARTNER_ID}/conversion`);

  // クエリパラメータ設定
  url.searchParams.set("start_date", params.start_date);
  url.searchParams.set("end_date", params.end_date);
  url.searchParams.set("conversion_date_type", String(params.conversion_date_type));

  if (params.promotion_id) {
    url.searchParams.set("promotion_id", params.promotion_id);
  }

  if (params.partner_site_id) {
    url.searchParams.set("partner_site_id", params.partner_site_id);
  }

  if (params.status) {
    url.searchParams.set("status", params.status);
  }

  console.log(`[afb-client] Fetching conversions from AFB API: ${url.toString()}`);

  try {
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorizationtoken": AFB_API_KEY!,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[afb-client] AFB API error: ${response.status} ${errorText}`);
      throw new Error(`AFB API error: ${response.status} ${errorText}`);
    }

    const data: AfbApiResponse = await response.json();

    if (data.error_message) {
      console.error(`[afb-client] AFB API returned error: ${data.error_message}`);
      throw new Error(`AFB API error: ${data.error_message}`);
    }

    console.log(`[afb-client] Fetched ${data.response.length} conversions from AFB API`);

    return data.response;
  } catch (error) {
    console.error("[afb-client] Error fetching AFB conversions:", error);
    throw error;
  }
}

/**
 * 指定期間の成果データを取得（発生日基準）
 *
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 成果データ配列
 */
export async function fetchAfbConversionsByDateRange(
  startDate: Date,
  endDate: Date
): Promise<AfbConversionData[]> {
  return fetchAfbConversions({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    conversion_date_type: 2, // 発生日基準
  });
}

/**
 * 過去N日間の成果データを取得（発生日基準）
 *
 * @param days 過去何日分取得するか（デフォルト: 7日）
 * @returns 成果データ配列
 */
export async function fetchAfbConversionsLastNDays(
  days: number = 7
): Promise<AfbConversionData[]> {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return fetchAfbConversionsByDateRange(startDate, endDate);
}

/**
 * 未承認・承認済み成果のみを取得
 *
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns 成果データ配列（非承認は除外）
 */
export async function fetchAfbPendingAndApprovedConversions(
  startDate: Date,
  endDate: Date
): Promise<AfbConversionData[]> {
  return fetchAfbConversions({
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
    conversion_date_type: 2, // 発生日基準
    status: "0,1", // 承認待ち・承認のみ（非承認=2は除外）
  });
}
