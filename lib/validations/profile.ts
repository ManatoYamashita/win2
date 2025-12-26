import { z } from "zod";

/**
 * プロフィール更新リクエストの検証スキーマ
 *
 * 編集可能フィールド:
 * - birthday: 生年月日（YYYY-MM-DD形式、任意）
 * - postalCode: 郵便番号（7桁または000-0000形式、任意）
 * - phone: 電話番号（10-11桁または000-0000-0000形式、任意）
 *
 * 参照: lib/validations/auth.ts（registerSchema Step 3と同等のvalidation）
 */
export const updateProfileSchema = z.object({
  birthday: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        return /^\d{4}-\d{2}-\d{2}$/.test(val);
      },
      { message: "生年月日はYYYY-MM-DD形式で入力してください" }
    ),
  postalCode: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // 7桁の数字（ハイフンなし）または3桁-4桁形式
        return /^\d{7}$/.test(val) || /^\d{3}-\d{4}$/.test(val);
      },
      { message: "郵便番号は7桁の数字または000-0000形式で入力してください" }
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // 10桁または11桁の数字（ハイフンあり・なし両対応）
        return /^\d{10,11}$/.test(val) || /^\d{2,4}-\d{2,4}-\d{4}$/.test(val);
      },
      { message: "電話番号は10〜11桁の数字または000-0000-0000形式で入力してください" }
    ),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
