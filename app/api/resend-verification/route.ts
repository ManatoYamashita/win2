import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/email";
import { getMemberByEmail } from "@/lib/sheets";

/**
 * メール認証再送信API
 * POST /api/resend-verification
 *
 * ログイン済みユーザーが認証メールの再送信をリクエストする際に呼ばれる
 * セッション認証必須、新しいトークンを生成してメール送信
 */
export async function POST() {
  try {
    // セッション認証チェック
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
      return NextResponse.json(
        {
          success: false,
          error: "認証が必要です。ログインしてください。",
        },
        { status: 401 }
      );
    }

    const email = session.user.email;

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

    // 既に認証済みの場合
    if (member.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "メールアドレスは既に認証済みです",
        },
        { status: 400 }
      );
    }

    // TODO: レート制限チェック（Step 9で実装）
    // 現時点では簡易的なチェックのみ（将来的にはRedisベースのレート制限を実装）

    // 新しい認証トークンを生成（24時間有効）
    const verificationToken = generateVerificationToken(email);

    // 認証メールを送信
    const emailResult = await sendVerificationEmail(email, verificationToken);

    if (!emailResult.success) {
      console.error("Failed to send verification email:", emailResult.error);

      return NextResponse.json(
        {
          success: false,
          error: "メール送信に失敗しました。しばらくしてから再度お試しください。",
        },
        { status: 500 }
      );
    }

    console.log(`Verification email resent to: ${email} (messageId: ${emailResult.messageId})`);

    return NextResponse.json(
      {
        success: true,
        message: "認証メールを再送信しました。メールをご確認ください。",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error resending verification email:", error);

    return NextResponse.json(
      {
        success: false,
        error: "認証メール再送信中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
