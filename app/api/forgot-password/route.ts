import { NextRequest, NextResponse } from "next/server";
import { forgotPasswordSchema } from "@/lib/validations/auth";
import { getMemberByEmail } from "@/lib/sheets";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail, isResendValid } from "@/lib/email";

/**
 * パスワードリセット要求API
 * POST /api/forgot-password
 *
 * メールアドレスを受け取り、パスワードリセット用のトークンを生成してメール送信
 * セキュリティ上、メールアドレスの存在有無に関わらず同じレスポンスを返す
 */
export async function POST(request: NextRequest) {
  try {
    // RESEND_VALID=false の場合はパスワードリセット機能を無効化
    if (!isResendValid) {
      return NextResponse.json(
        {
          success: false,
          error: "パスワードリセット機能は現在利用できません。管理者にお問い合わせください。",
        },
        { status: 503 } // Service Unavailable
      );
    }

    // リクエストボディの取得
    const body = await request.json();

    // Zodバリデーション
    const validationResult = forgotPasswordSchema.safeParse(body);

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

    const { email } = validationResult.data;

    // TODO: レート制限チェック（Step 9で実装）
    // 現時点では簡易的なチェックのみ

    // 会員情報を取得
    const member = await getMemberByEmail(email);

    // セキュリティ上、メールアドレスの存在有無を漏らさないため、
    // 会員が見つかった場合のみメール送信するが、レスポンスは常に同じ
    if (member) {
      // パスワードリセットトークン生成（1時間有効）
      const resetToken = generatePasswordResetToken(email);

      // パスワードリセットメールを送信
      const emailResult = await sendPasswordResetEmail(email, resetToken);

      if (!emailResult.success) {
        console.error("Failed to send password reset email:", emailResult.error);
        // エラーが発生してもセキュリティ上、同じレスポンスを返す
      } else {
        console.log(`Password reset email sent to ${email}, messageId: ${emailResult.messageId}`);
      }
    } else {
      console.log(`Password reset requested for non-existent email: ${email}`);
      // 会員が存在しない場合もログのみ出力し、レスポンスは変えない
    }

    // セキュリティ上、常に同じ成功レスポンスを返す
    return NextResponse.json(
      {
        success: true,
        message:
          "パスワードリセットのメールを送信しました。メールをご確認ください。",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "パスワードリセット要求中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
