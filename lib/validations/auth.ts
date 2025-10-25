import { z } from "zod";

/**
 * 会員登録フォームのバリデーションスキーマ
 */
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, { message: "氏名を入力してください" })
    .max(100, { message: "氏名は100文字以内で入力してください" }),
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(8, { message: "パスワードは8文字以上で入力してください" })
    .max(100, { message: "パスワードは100文字以内で入力してください" }),
  passwordConfirm: z
    .string()
    .min(1, { message: "確認用パスワードを入力してください" }),
  birthday: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val) return true;
        // YYYY-MM-DD形式のチェック
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
}).refine((data) => data.password === data.passwordConfirm, {
  message: "パスワードが一致しません",
  path: ["passwordConfirm"],
});

/**
 * 会員登録フォームの型定義
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * ログインフォームのバリデーションスキーマ
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "メールアドレスを入力してください" })
    .email({ message: "有効なメールアドレスを入力してください" }),
  password: z
    .string()
    .min(1, { message: "パスワードを入力してください" }),
});

/**
 * ログインフォームの型定義
 */
export type LoginInput = z.infer<typeof loginSchema>;
