import { google } from "googleapis";

if (!process.env.GOOGLE_SHEETS_CLIENT_EMAIL) {
  throw new Error("GOOGLE_SHEETS_CLIENT_EMAIL is required");
}

if (!process.env.GOOGLE_SHEETS_PRIVATE_KEY) {
  throw new Error("GOOGLE_SHEETS_PRIVATE_KEY is required");
}

if (!process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
  throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is required");
}

/**
 * Google Sheets API認証設定（サービスアカウント）
 */
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
    // 環境変数の改行コード(\n)を実際の改行に変換
    private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, "\n"),
  },
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
  ],
});

/**
 * Google Sheets APIクライアント
 */
export const sheets = google.sheets({ version: "v4", auth });

/**
 * スプレッドシートID（環境変数から取得）
 */
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
