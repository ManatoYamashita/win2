import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { resetPasswordSchema } from "@/lib/validations/auth";
import { verifyToken } from "@/lib/tokens";
import { getMemberByEmail, readSheet, updateSheet, SHEET_NAMES } from "@/lib/sheets";
import { sendPasswordResetNotification } from "@/lib/email";

/**
 * パスワードリセット実行API
 * POST /api/reset-password
 *
 * リセットトークンと新しいパスワードを受け取り、パスワードを更新する
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body = await request.json();

    // Zodバリデーション
    const validationResult = resetPasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "入力内容に誤りがあります",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token, password } = validationResult.data;

    // トークン検証
    const verificationResult = verifyToken(token);

    if (!verificationResult.valid || !verificationResult.payload) {
      return NextResponse.json(
        {
          success: false,
          error: verificationResult.error || "無効なトークンです",
        },
        { status: 400 }
      );
    }

    // トークンタイプの確認
    if (verificationResult.payload.type !== "password-reset") {
      return NextResponse.json(
        {
          success: false,
          error: "無効なトークンタイプです",
        },
        { status: 400 }
      );
    }

    const { email } = verificationResult.payload;

    // 会員情報を取得
    const member = await getMemberByEmail(email);

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "会員情報が見つかりません",
        },
        { status: 404 }
      );
    }

    // 新しいパスワードのハッシュ化（salt rounds: 10）
    const newPasswordHash = await bcrypt.hash(password, 10);

    // Google Sheetsでパスワードを更新（D列: パスワードハッシュ）
    const rows = await readSheet(SHEET_NAMES.MEMBERS, "A2:I");
    const rowIndex = rows.findIndex((row) => row[2] === email);

    if (rowIndex === -1) {
      return NextResponse.json(
        {
          success: false,
          error: "会員情報が見つかりません",
        },
        { status: 404 }
      );
    }

    // 行番号は2から開始（ヘッダー行が1行目）
    const sheetRowNumber = rowIndex + 2;

    // D列（4列目）のパスワードハッシュを更新
    await updateSheet(
      SHEET_NAMES.MEMBERS,
      `D${sheetRowNumber}:D${sheetRowNumber}`,
      [[newPasswordHash]]
    );

    console.log(`Password reset successful for member: ${email} (${member.memberId})`);

    // セキュリティ通知メールを送信（パスワード変更完了）
    const notificationResult = await sendPasswordResetNotification(email);

    if (!notificationResult.success) {
      console.error("Failed to send password reset notification:", notificationResult.error);
      // 通知メール送信失敗でもパスワード変更自体は成功として扱う
    }

    return NextResponse.json(
      {
        success: true,
        message: "パスワードのリセットが完了しました。新しいパスワードでログインしてください。",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "パスワードリセット中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
