/**
 * 年齢制限コンテンツの年齢検証バリデーション
 *
 * 20歳以上の成人のみがアクセス可能なコンテンツの
 * 年齢検証ロジックに使用する型定義とスキーマを提供します。
 */

import { z } from "zod";

/**
 * 年齢検証結果（判別可能なユニオン型）
 *
 * 4つの状態を型安全に表現：
 * - adult: 成人（20歳以上）
 * - minor: 未成年（20歳未満）
 * - birthday_unknown: 生年月日未登録
 * - not_authenticated: 未認証
 */
export type AgeVerificationResult =
  | { status: "adult"; age: number; birthday: string }
  | { status: "minor"; age: number; birthday: string }
  | { status: "birthday_unknown"; memberId: string }
  | { status: "not_authenticated" };

/**
 * アクセス拒否理由
 */
export type AccessDeniedReason =
  | "not_authenticated"
  | "minor"
  | "birthday_unknown"
  | "invalid_birthday";

/**
 * アクセス拒否エラー情報
 *
 * ユーザーに表示するエラーメッセージと
 * 必要なアクション（ログイン、生年月日登録など）を含む
 */
export interface AccessDeniedError {
  reason: AccessDeniedReason;
  message: string;
  requiresAction: "login" | "update_birthday" | "wait_until_adult";
}

/**
 * 生年月日バリデーションスキーマ
 *
 * YYYY-MM-DD形式の生年月日を検証：
 * - 形式チェック（正規表現）
 * - 未来の日付を拒否
 * - 150歳以上を拒否（現実的な範囲）
 */
export const birthdaySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "生年月日はYYYY-MM-DD形式で入力してください")
  .refine(
    (val) => {
      const date = new Date(val);
      const now = new Date();

      // 未来の日付を拒否
      if (date > now) return false;

      // 150歳以上を拒否（現実的な範囲）
      const age = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
      );
      return age >= 0 && age <= 150;
    },
    { message: "有効な生年月日を入力してください" }
  );

/**
 * 年齢検証リクエストスキーマ（将来的なAPI用）
 */
export const ageVerificationRequestSchema = z.object({
  memberId: z.string().uuid(),
  birthday: birthdaySchema,
});

export type AgeVerificationRequest = z.infer<
  typeof ageVerificationRequestSchema
>;
