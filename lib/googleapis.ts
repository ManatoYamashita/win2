import { google, sheets_v4 } from "googleapis";

const REQUIRED_ENV_VARS = [
  "GOOGLE_SHEETS_CLIENT_EMAIL",
  "GOOGLE_SHEETS_PRIVATE_KEY",
  "GOOGLE_SHEETS_SPREADSHEET_ID",
] as const;

const missingEnvVars = REQUIRED_ENV_VARS.filter(
  key => !process.env[key]
);

if (missingEnvVars.length > 0) {
  console.warn(
    `[Google Sheets] Missing environment variables: ${missingEnvVars.join(", ")}`
  );
}

const isConfigured = missingEnvVars.length === 0;

/**
 * Google Sheets API認証設定（サービスアカウント）
 */
const auth = isConfigured
  ? new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    })
  : null;

/**
 * Google Sheets APIクライアント
 */
export const sheets: sheets_v4.Sheets | null = auth
  ? google.sheets({ version: "v4", auth })
  : null;

/**
 * スプレッドシートID（環境変数から取得）
 */
export const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID ?? "";

/**
 * Google Sheets連携が適切に構成されているかどうか
 */
export const isGoogleSheetsConfigured = isConfigured;
