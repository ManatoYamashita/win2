/**
 * 年齢制限コンテンツの年齢検証ユーティリティ
 *
 * サーバーサイドでの年齢検証を行う関数群を提供します。
 * 全ての検証はGoogle Sheetsから最新のデータを取得して実行されます。
 */

import { differenceInYears, parseISO, isValid } from "date-fns";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getMemberById } from "./sheets";
import type {
  AgeVerificationResult,
  AccessDeniedError,
} from "./validations/age-verification";

/**
 * 生年月日から現在の年齢を計算
 *
 * @param birthday - YYYY-MM-DD形式の生年月日
 * @returns 年齢（整数） | null（無効な日付の場合）
 *
 * @example
 * calculateAge("2000-01-01") // 24（2024年の場合）
 * calculateAge("invalid") // null
 */
export function calculateAge(birthday: string): number | null {
  try {
    const birthDate = parseISO(birthday);
    if (!isValid(birthDate)) return null;

    const today = new Date();
    const age = differenceInYears(today, birthDate);

    // 負の年齢や非現実的な年齢を拒否
    if (age < 0 || age > 150) return null;

    return age;
  } catch {
    return null;
  }
}

/**
 * 成人判定（日本の成人年齢: 20歳）
 *
 * @param birthday - YYYY-MM-DD形式の生年月日
 * @returns true: 成人（20歳以上）, false: 未成年 or 無効な日付
 *
 * @example
 * isAdult("2000-01-01") // true（2024年の場合）
 * isAdult("2010-01-01") // false
 */
export function isAdult(birthday: string): boolean {
  const age = calculateAge(birthday);
  return age !== null && age >= 20;
}

/**
 * 生年月日の妥当性検証
 *
 * @param birthday - YYYY-MM-DD形式の生年月日
 * @returns 検証結果オブジェクト
 *
 * @example
 * validateBirthday("2000-01-01") // { valid: true }
 * validateBirthday("2030-01-01") // { valid: false, error: "未来の日付は指定できません" }
 * validateBirthday("invalid") // { valid: false, error: "無効な日付形式です" }
 */
export function validateBirthday(birthday: string): {
  valid: boolean;
  error?: string;
} {
  try {
    const birthDate = parseISO(birthday);

    if (!isValid(birthDate)) {
      return { valid: false, error: "無効な日付形式です" };
    }

    const today = new Date();
    if (birthDate > today) {
      return { valid: false, error: "未来の日付は指定できません" };
    }

    const age = calculateAge(birthday);
    if (age === null || age > 150) {
      return { valid: false, error: "有効な生年月日を入力してください" };
    }

    return { valid: true };
  } catch {
    return { valid: false, error: "日付の解析に失敗しました" };
  }
}

/**
 * サーバーサイド年齢検証（核心関数）
 *
 * セッションから会員情報を取得し、Google Sheetsの生年月日から年齢を検証します。
 * この関数は必ずサーバーサイド（Server Components, API Routes）でのみ実行してください。
 *
 * @returns 年齢検証結果（4つの状態のいずれか）
 *
 * @example
 * // Server Component内での使用例
 * const result = await verifyAge();
 * if (result.status !== 'adult') {
 *   const error = getAccessDeniedError(result);
 *   return <AccessDeniedMessage error={error} />;
 * }
 *
 * // API Route内での使用例
 * const result = await verifyAge();
 * if (result.status !== 'adult') {
 *   return NextResponse.json({ error: 'Age verification required' }, { status: 403 });
 * }
 */
export async function verifyAge(): Promise<AgeVerificationResult> {
  const session = await getServerSession(authOptions);

  // 未認証
  if (!session?.user?.memberId) {
    return { status: "not_authenticated" };
  }

  try {
    // Google Sheetsから会員情報取得（セッション改ざん防止のため毎回取得）
    const member = await getMemberById(session.user.memberId);

    if (!member) {
      // セッションは有効だが会員データが見つからない（異常系）
      console.warn(
        `[verifyAge] Member not found for memberId: ${session.user.memberId}`
      );
      return { status: "not_authenticated" };
    }

    // 生年月日未登録
    if (!member.birthday || member.birthday.trim() === "") {
      return {
        status: "birthday_unknown",
        memberId: member.memberId,
      };
    }

    // 生年月日の妥当性検証
    const validation = validateBirthday(member.birthday);
    if (!validation.valid) {
      console.warn(
        `[verifyAge] Invalid birthday for memberId ${member.memberId}: ${validation.error}`
      );
      return {
        status: "birthday_unknown",
        memberId: member.memberId,
      };
    }

    const age = calculateAge(member.birthday);
    if (age === null) {
      return {
        status: "birthday_unknown",
        memberId: member.memberId,
      };
    }

    // 成人判定（20歳以上）
    if (age >= 20) {
      return {
        status: "adult",
        age,
        birthday: member.birthday,
      };
    } else {
      return {
        status: "minor",
        age,
        birthday: member.birthday,
      };
    }
  } catch (error) {
    console.error("[verifyAge] Error during age verification:", error);
    // エラー時は安全側に倒す（認証失敗扱い）
    return { status: "not_authenticated" };
  }
}

/**
 * アクセス拒否エラーメッセージ生成
 *
 * 年齢検証結果に基づいて、ユーザーに表示するエラーメッセージと
 * 必要なアクション（ログイン、生年月日登録など）を生成します。
 *
 * @param result - verifyAge()の返却値
 * @returns AccessDeniedError | null（成人の場合はnull）
 *
 * @example
 * const result = await verifyAge();
 * const error = getAccessDeniedError(result);
 *
 * if (error) {
 *   // エラーメッセージとアクションボタンを表示
 *   return <AccessDeniedMessage error={error} />;
 * }
 *
 * // アクセス許可（成人）
 * return <RestrictedContent />;
 */
export function getAccessDeniedError(
  result: AgeVerificationResult
): AccessDeniedError | null {
  switch (result.status) {
    case "not_authenticated":
      return {
        reason: "not_authenticated",
        message: "このコンテンツは会員限定です。ログインしてください。",
        requiresAction: "login",
      };

    case "birthday_unknown":
      return {
        reason: "birthday_unknown",
        message:
          "年齢確認が必要です。マイページで生年月日を登録してください。",
        requiresAction: "update_birthday",
      };

    case "minor":
      return {
        reason: "minor",
        message: `このコンテンツは20歳以上の方のみご覧いただけます。（現在${result.age}歳）`,
        requiresAction: "wait_until_adult",
      };

    case "adult":
      return null; // アクセス許可
  }
}
