import { sheets, SPREADSHEET_ID, isGoogleSheetsConfigured } from "./googleapis";

/**
 * Google Sheetsシート名定義（spec.mdに基づく）
 */
export const SHEET_NAMES = {
  MEMBERS: "会員リスト",
  DEALS: "案件マスタ",
  CLICK_LOG: "クリックログ",
  RESULT_DATA: "成果データ",
  RESULT_CSV_RAW: "成果CSV_RAW",
} as const;

/**
 * 会員リスト型定義
 * シート構成:
 * A: memberId (UUID)
 * B: 氏名
 * C: メールアドレス
 * D: パスワード(bcrypt hash)
 * E: 生年月日
 * F: 郵便番号
 * G: 電話番号
 * H: 登録日時 (日本時間表記)
 * I: emailVerified (TRUE/FALSE) - Phase 2追加
 */
export interface MemberRow {
  memberId: string;
  name: string;
  email: string;
  passwordHash: string;
  birthday?: string;
  postalCode?: string;
  phone?: string;
  registeredAt: string;
  emailVerified?: boolean;
}

/**
 * 案件マスタ型定義
 * シート構成:
 * A: 整形済みアフィリエイトURL
 * B: 案件ID (一意)
 * C: 案件名
 * D: 会社名（手書き）
 * E: ROW URL（ASP発行の元URL）
 */
export interface DealRow {
  dealId: string;
  dealName: string;
  affiliateUrl: string;
  aspName?: string;
  companyName?: string;
  rawAffiliateUrl?: string;
  rewardAmount?: number;
  isActive?: boolean;
}

/**
 * クリックログ型定義
 * シート構成:
 * A: 日時 (ISO8601)
 * B: memberId (or guest:UUID)
 * C: 案件名
 * D: 案件ID (dealId)
 * E: イベントID (eventId) - UUID v4
 */
export interface ClickLogRow {
  timestamp: string;
  memberId: string;
  dealName: string;
  dealId: string;
  eventId: string;
}

/**
 * 成果データ型定義
 * シート構成:
 * A: 氏名 (or "非会員")
 * B: 案件名
 * C: 承認状況
 * D: 参考報酬額
 * E: memberId(参考)
 * F: 原始報酬額(参考)
 * G: メモ
 */
export interface ResultRow {
  name: string;
  dealName: string;
  status: string;
  referenceReward: number;
  memberId: string;
  originalReward: number;
  memo?: string;
}

function getSheetsClient() {
  if (!isGoogleSheetsConfigured || !sheets || !SPREADSHEET_ID) {
    throw new Error(
      "Google Sheets client is not configured. Set GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and GOOGLE_SHEETS_SPREADSHEET_ID."
    );
  }

  return { sheetsClient: sheets, spreadsheetId: SPREADSHEET_ID };
}

/**
 * シートからデータを読み取る（範囲指定）
 * @param sheetName シート名
 * @param range 範囲（例: "A2:H100"）指定しない場合は全体
 */
export async function readSheet(
  sheetName: string,
  range?: string
): Promise<string[][]> {
  try {
    const { sheetsClient, spreadsheetId } = getSheetsClient();
    const fullRange = range ? `${sheetName}!${range}` : sheetName;

    const response = await sheetsClient.spreadsheets.values.get({
      spreadsheetId,
      range: fullRange,
    });

    return (response.data.values as string[][]) || [];
  } catch (error) {
    console.error(`Error reading sheet ${sheetName}:`, error);
    throw error;
  }
}

/**
 * シートに行を追加（末尾に追記）
 * @param sheetName シート名
 * @param values 追加する値の配列
 *
 * 注意: A列から確実に記録するため、range を明示的に指定
 * 会員リストの場合: A列（memberId）からI列（emailVerified）までの9列
 */
export async function appendToSheet(
  sheetName: string,
  values: (string | number | undefined)[]
): Promise<void> {
  try {
    const { sheetsClient, spreadsheetId } = getSheetsClient();

    // A列から始まる範囲を明示的に指定
    // 値の長さに基づいて終了列を決定（最大26列までサポート）
    const endColumn = String.fromCharCode(64 + Math.min(values.length, 26)); // A=65, Z=90
    const explicitRange = `${sheetName}!A:${endColumn}`;

    await sheetsClient.spreadsheets.values.append({
      spreadsheetId,
      range: explicitRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values.map(v => v ?? "")],
      },
    });
  } catch (error) {
    console.error(`Error appending to sheet ${sheetName}:`, error);
    throw error;
  }
}

function extractAffiliateUrl(row: string[]): string {
  const primary = row[0]?.trim();
  if (primary) {
    return primary;
  }
  const fallback = row[4]?.trim();
  return fallback || "";
}

/**
 * シートを更新（特定範囲）
 * @param sheetName シート名
 * @param range 範囲（例: "A2:H2"）
 * @param values 更新する値の配列
 */
export async function updateSheet(
  sheetName: string,
  range: string,
  values: (string | number | undefined)[][]
): Promise<void> {
  try {
    const { sheetsClient, spreadsheetId } = getSheetsClient();
    const fullRange = `${sheetName}!${range}`;

    await sheetsClient.spreadsheets.values.update({
      spreadsheetId,
      range: fullRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });
  } catch (error) {
    console.error(`Error updating sheet ${sheetName}:`, error);
    throw error;
  }
}

/**
 * 会員リストから会員情報を取得（メールアドレスで検索）
 * @param email メールアドレス
 */
export async function getMemberByEmail(email: string): Promise<MemberRow | null> {
  try {
    const rows = await readSheet(SHEET_NAMES.MEMBERS, "A2:I");

    const memberRow = rows.find(row => row[2] === email);

    if (!memberRow) {
      return null;
    }

    return {
      memberId: memberRow[0] || "",
      name: memberRow[1] || "",
      email: memberRow[2] || "",
      passwordHash: memberRow[3] || "",
      birthday: memberRow[4],
      postalCode: memberRow[5],
      phone: memberRow[6],
      registeredAt: memberRow[7] || "",
      emailVerified: memberRow[8] === "TRUE" || memberRow[8] === "true",
    };
  } catch (error) {
    console.error("Error getting member by email:", error);
    throw error;
  }
}

/**
 * 会員リストから会員情報を取得（memberIdで検索）
 * @param memberId 会員ID
 */
export async function getMemberById(memberId: string): Promise<MemberRow | null> {
  try {
    const rows = await readSheet(SHEET_NAMES.MEMBERS, "A2:I");

    const memberRow = rows.find(row => row[0] === memberId);

    if (!memberRow) {
      return null;
    }

    return {
      memberId: memberRow[0] || "",
      name: memberRow[1] || "",
      email: memberRow[2] || "",
      passwordHash: memberRow[3] || "",
      birthday: memberRow[4],
      postalCode: memberRow[5],
      phone: memberRow[6],
      registeredAt: memberRow[7] || "",
      emailVerified: memberRow[8] === "TRUE" || memberRow[8] === "true",
    };
  } catch (error) {
    console.error("Error getting member by ID:", error);
    throw error;
  }
}

/**
 * 会員リストに新規会員を追加
 * @param member 会員情報
 */
export async function addMember(member: MemberRow): Promise<void> {
  const values = [
    member.memberId,
    member.name,
    member.email,
    member.passwordHash,
    member.birthday || "",
    member.postalCode || "",
    member.phone || "",
    member.registeredAt,
    member.emailVerified === true ? "TRUE" : "FALSE", // Phase 2: Email verification flag
  ];

  await appendToSheet(SHEET_NAMES.MEMBERS, values);
}

/**
 * クリックログを記録
 * @param log クリックログ情報
 */
export async function addClickLog(log: ClickLogRow): Promise<void> {
  const values = [
    log.timestamp,
    log.memberId,
    log.dealName,
    log.dealId,
    log.eventId,
  ];

  await appendToSheet(SHEET_NAMES.CLICK_LOG, values);
}

/**
 * 指定した会員の申込履歴を取得（クリックログから）
 * @param memberId 会員ID
 */
export async function getClickLogsByMemberId(memberId: string): Promise<ClickLogRow[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");

    const logs = rows
      .filter(row => row[1] === memberId)
      .map(row => ({
        timestamp: row[0] || "",
        memberId: row[1] || "",
        dealName: row[2] || "",
        dealId: row[3] || "",
        eventId: row[4] || "",
      }));

    return logs;
  } catch (error) {
    console.error("Error getting click logs by member ID:", error);
    throw error;
  }
}

/**
 * 指定した会員の成果データを取得
 * @param memberId 会員ID
 */
export async function getResultsByMemberId(memberId: string): Promise<ResultRow[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.RESULT_DATA, "A2:G");

    const results = rows
      .filter(row => row[4] === memberId)
      .map(row => ({
        name: row[0] || "",
        dealName: row[1] || "",
        status: row[2] || "",
        referenceReward: parseFloat(row[3] || "0") || 0,
        memberId: row[4] || "",
        originalReward: parseFloat(row[5] || "0") || 0,
        memo: row[6] || "",
      }));

    return results;
  } catch (error) {
    console.error("Error getting results by member ID:", error);
    throw error;
  }
}

/**
 * 会員のメール認証状態を更新（Phase 2）
 * @param memberId 会員ID
 * @param verified 認証状態（true: 認証済み, false: 未認証）
 */
export async function updateMemberEmailVerified(
  memberId: string,
  verified: boolean
): Promise<void> {
  try {
    const rows = await readSheet(SHEET_NAMES.MEMBERS, "A2:I");

    // memberIdで行を検索
    const rowIndex = rows.findIndex(row => row[0] === memberId);

    if (rowIndex === -1) {
      throw new Error(`Member not found: ${memberId}`);
    }

    // 行番号は2から開始（ヘッダー行が1行目）
    const sheetRowNumber = rowIndex + 2;

    // I列（9列目）のみを更新
    await updateSheet(
      SHEET_NAMES.MEMBERS,
      `I${sheetRowNumber}:I${sheetRowNumber}`,
      [[verified ? "TRUE" : "FALSE"]]
    );

    console.log(`Updated emailVerified for member ${memberId} to ${verified}`);
  } catch (error) {
    console.error("Error updating member email verified status:", error);
    throw error;
  }
}

/**
 * 会員情報を更新（汎用的な部分更新対応）
 * @param memberId 会員ID
 * @param updates 更新するフィールド（Partial型で部分更新可能）
 * @returns 更新後の会員情報（会員が見つからない場合はnull）
 *
 * 注意: memberId と registeredAt は更新不可（型定義で排除）
 */
export async function updateMember(
  memberId: string,
  updates: Partial<Omit<MemberRow, "memberId" | "registeredAt">>
): Promise<MemberRow | null> {
  try {
    const rows = await readSheet(SHEET_NAMES.MEMBERS, "A2:I");

    // memberIdで行を検索
    const rowIndex = rows.findIndex(row => row[0] === memberId);

    if (rowIndex === -1) {
      console.warn(`Member not found for update: ${memberId}`);
      return null;
    }

    // 現在のデータを取得
    const currentRow = rows[rowIndex];
    const currentMember: MemberRow = {
      memberId: currentRow[0] || "",
      name: currentRow[1] || "",
      email: currentRow[2] || "",
      passwordHash: currentRow[3] || "",
      birthday: currentRow[4],
      postalCode: currentRow[5],
      phone: currentRow[6],
      registeredAt: currentRow[7] || "",
      emailVerified: currentRow[8] === "TRUE" || currentRow[8] === "true",
    };

    // データをマージ
    const updatedMember: MemberRow = {
      ...currentMember,
      ...updates,
    };

    // 行番号は2から開始（ヘッダー行が1行目）
    const sheetRowNumber = rowIndex + 2;

    // A列からI列までの全フィールドを更新
    const updatedValues = [
      updatedMember.memberId,         // A: memberId（変更不可だが一貫性のため含める）
      updatedMember.name,              // B: 氏名
      updatedMember.email,             // C: メールアドレス
      updatedMember.passwordHash,      // D: パスワードハッシュ
      updatedMember.birthday || "",    // E: 生年月日
      updatedMember.postalCode || "",  // F: 郵便番号
      updatedMember.phone || "",       // G: 電話番号
      updatedMember.registeredAt,      // H: 登録日時（変更不可だが一貫性のため含める）
      updatedMember.emailVerified === true ? "TRUE" : "FALSE", // I: メール認証状態
    ];

    await updateSheet(
      SHEET_NAMES.MEMBERS,
      `A${sheetRowNumber}:I${sheetRowNumber}`,
      [updatedValues]
    );

    console.log(`Updated member ${memberId} successfully`);
    return updatedMember;
  } catch (error) {
    console.error("Error updating member:", error);
    throw error;
  }
}

// ========================================
// 案件マスタ関連の関数
// ========================================

/**
 * 案件マスタから案件情報を取得（dealIdで検索）
 * @param dealId 案件ID
 * @returns 案件情報（見つからない場合はnull）
 */
export async function getDealById(dealId: string): Promise<DealRow | null> {
  try {
    const rows = await readSheet(SHEET_NAMES.DEALS, "A2:E");

    // B列（案件ID）で検索
    const index = rows.findIndex(row => row[1] === dealId);
    if (index === -1) {
      return null;
    }

    const dealRow = rows[index];
    if (!dealRow) {
      return null;
    }
    const affiliateUrl = extractAffiliateUrl(dealRow);
    if (!affiliateUrl) {
      console.warn(`Deal ${dealId} is missing affiliate URL`);
      return null;
    }

    return {
      dealId: dealRow[1] || "",           // B列: 案件ID
      dealName: dealRow[2] || "",         // C列: 案件名
      affiliateUrl,
      aspName: dealRow[3] || "",
      companyName: dealRow[3] || "",
      rawAffiliateUrl: dealRow[4] || "",
    };
  } catch (error) {
    console.error("Error getting deal by ID:", error);
    throw error;
  }
}

/**
 * 案件マスタから全ての有効な案件を取得
 * @returns 有効な案件一覧（有効/無効 = TRUEのもののみ）
 */
export async function getAllActiveDeals(): Promise<DealRow[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.DEALS, "A2:E");

    const deals = rows
      .map((row) => {
        const affiliateUrl = extractAffiliateUrl(row);
        if (!row[1] || !affiliateUrl) {
          return null;
        }
        return {
          dealId: row[1] || "",
          dealName: row[2] || "",
          affiliateUrl,
          aspName: row[3] || "",
          companyName: row[3] || "",
          rawAffiliateUrl: row[4] || "",
        } satisfies DealRow;
      })
      .filter(Boolean) as DealRow[];

    return deals;
  } catch (error) {
    console.error("Error getting all active deals:", error);
    throw error;
  }
}

// ========================================
// Webhook成果データ記録関連の関数
// ========================================

/**
 * Webhookから受信した成果データ型定義
 *
 * ASP Webhookから受信した成果情報を「成果CSV_RAW」シートに記録するための型定義
 * GASによる自動処理の対象となります
 */
export interface ConversionWebhookData {
  /** 追跡ID（会員ID or guest:UUID） */
  trackingId: string;
  /** イベントID（クリック時に生成したUUID v4） */
  eventId?: string;
  /** 案件名 */
  dealName: string;
  /** ASP名 */
  aspName: string;
  /** 報酬額（ASPから支払われる金額） */
  rewardAmount: number;
  /** 承認状況（pending: 未承認, approved: 承認済み, cancelled: キャンセル） */
  status: "pending" | "approved" | "cancelled";
  /** 注文ID（ASP側の注文番号、オプション） */
  orderId?: string;
  /** タイムスタンプ（ISO8601形式、未指定の場合は現在時刻を使用） */
  timestamp?: string;
}

/**
 * eventIdからクリックログを検索
 *
 * Webhookで受信したeventIdを使って、クリックログから対応する会員情報を取得します。
 * eventIdが一致するログが複数ある場合は最初のものを返します。
 *
 * @param eventId イベントID（UUID v4）
 * @returns クリックログ情報（見つからない場合はnull）
 */
export async function getClickLogByEventId(eventId: string): Promise<ClickLogRow | null> {
  try {
    const rows = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");

    // E列（eventId）で検索
    const logRow = rows.find(row => row[4] === eventId);

    if (!logRow) {
      console.log(`Click log not found for eventId: ${eventId}`);
      return null;
    }

    return {
      timestamp: logRow[0] || "",
      memberId: logRow[1] || "",
      dealName: logRow[2] || "",
      dealId: logRow[3] || "",
      eventId: logRow[4] || "",
    };
  } catch (error) {
    console.error("Error getting click log by eventId:", error);
    throw error;
  }
}

/**
 * Webhook受信データを「成果CSV_RAW」シートに記録
 *
 * ASP Webhookから受信した成果データを「成果CSV_RAW」シートに追記します。
 * このデータは後でGAS（Google Apps Script）によって処理され、
 * 「成果データ」シートへの転記が行われます。
 *
 * シート構成（成果CSV_RAW）:
 * A: 日時 (ISO8601)
 * B: 追跡ID (id1: memberId or guest:UUID)
 * C: イベントID (eventId: UUID v4)
 * D: 案件名
 * E: ASP名
 * F: 報酬額
 * G: 承認状況 (pending/approved/cancelled)
 * H: 注文ID（オプション）
 *
 * @param data Webhook受信データ
 *
 * @example
 * await writeConversionData({
 *   trackingId: "member-uuid-123",
 *   eventId: "event-uuid-456",
 *   dealName: "楽天カード",
 *   aspName: "afb",
 *   rewardAmount: 10000,
 *   status: "pending",
 *   orderId: "ORD-2025-001",
 *   timestamp: "2025-01-03T12:00:00Z"
 * });
 */
export async function writeConversionData(data: ConversionWebhookData): Promise<void> {
  try {
    const values = [
      data.timestamp || new Date().toISOString(), // A列: 日時
      data.trackingId,                             // B列: 追跡ID (id1)
      data.eventId || "",                          // C列: イベントID
      data.dealName,                               // D列: 案件名
      data.aspName,                                // E列: ASP名
      data.rewardAmount,                           // F列: 報酬額
      data.status,                                 // G列: 承認状況
      data.orderId || "",                          // H列: 注文ID（オプション）
    ];

    await appendToSheet(SHEET_NAMES.RESULT_CSV_RAW, values);

    console.log(`[writeConversionData] Successfully recorded conversion:`, {
      trackingId: data.trackingId,
      eventId: data.eventId,
      dealName: data.dealName,
      status: data.status,
      rewardAmount: data.rewardAmount,
    });
  } catch (error) {
    console.error("[writeConversionData] Error writing conversion data:", error);
    throw error;
  }
}

/**
 * 重複チェック（eventIDベース）
 *
 * AFB Webhookなどから同じ成果が複数回送信された場合、
 * eventIDをキーに重複をチェックします。
 *
 * @param eventId イベントID（UUID v4）
 * @returns 重複している場合はtrue、重複していない場合はfalse
 *
 * @example
 * const isDuplicate = await isDuplicateConversion("event-uuid-456");
 * if (isDuplicate) {
 *   console.log("Duplicate conversion detected, skipping...");
 *   return;
 * }
 */
export async function isDuplicateConversion(eventId: string): Promise<boolean> {
  try {
    const rows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:H");

    // C列（eventId）で検索
    const isDuplicate = rows.some(row => row[2] === eventId);

    if (isDuplicate) {
      console.log(`[isDuplicateConversion] Duplicate eventId detected: ${eventId}`);
    }

    return isDuplicate;
  } catch (error) {
    console.error("[isDuplicateConversion] Error checking duplicate conversion:", error);
    throw error;
  }
}
