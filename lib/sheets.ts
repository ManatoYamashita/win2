import { sheets, SPREADSHEET_ID } from "./googleapis";

/**
 * Google Sheetsシート名定義（spec.mdに基づく）
 */
export const SHEET_NAMES = {
  MEMBERS: "会員リスト",
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
 * H: 登録日時
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
 * クリックログ型定義
 * シート構成:
 * A: 日時 (ISO8601)
 * B: memberId (or guest:UUID)
 * C: 案件名
 * D: 案件ID (dealId)
 */
export interface ClickLogRow {
  timestamp: string;
  memberId: string;
  dealName: string;
  dealId: string;
}

/**
 * 成果データ型定義
 * シート構成:
 * A: 氏名 (or "非会員")
 * B: 案件名
 * C: 承認状況
 * D: キャッシュバック金額
 * E: memberId(参考)
 * F: 原始報酬額(参考)
 * G: メモ
 */
export interface ResultRow {
  name: string;
  dealName: string;
  status: string;
  cashbackAmount: number;
  memberId: string;
  originalReward: number;
  memo?: string;
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
    const fullRange = range ? `${sheetName}!${range}` : sheetName;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
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
 */
export async function appendToSheet(
  sheetName: string,
  values: (string | number | undefined)[]
): Promise<void> {
  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: sheetName,
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
    const fullRange = `${sheetName}!${range}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
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
  ];

  await appendToSheet(SHEET_NAMES.CLICK_LOG, values);
}

/**
 * 指定した会員の申込履歴を取得（クリックログから）
 * @param memberId 会員ID
 */
export async function getClickLogsByMemberId(memberId: string): Promise<ClickLogRow[]> {
  try {
    const rows = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:D");

    const logs = rows
      .filter(row => row[1] === memberId)
      .map(row => ({
        timestamp: row[0] || "",
        memberId: row[1] || "",
        dealName: row[2] || "",
        dealId: row[3] || "",
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
        cashbackAmount: parseFloat(row[3] ?? "0") || 0,
        memberId: row[4] || "",
        originalReward: parseFloat(row[5] ?? "0") || 0,
        memo: row[6],
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
