import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getMemberByEmail, addMember } from "@/lib/sheets";
import { registerSchema } from "@/lib/validations/auth";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail, isResendValid } from "@/lib/email";

/**
 * 会員登録API
 *
 * POST /api/register
 *
 * フロー:
 * 1. リクエストボディのバリデーション
 * 2. メールアドレス重複チェック
 * 3. パスワードのbcryptハッシュ化
 * 4. UUID v4でmemberId生成
 * 5. Google Sheets「会員リスト」に追記
 * 6. 成功レスポンス返却（フロントエンドで自動ログイン処理）
 */
export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body = await request.json();

    // Zodバリデーション
    const validationResult = registerSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "入力内容に誤りがあります",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password, birthday, postalCode, phone } =
      validationResult.data;

    // メールアドレス重複チェック
    const existingMember = await getMemberByEmail(email);

    if (existingMember) {
      return NextResponse.json(
        { error: "このメールアドレスは既に登録されています" },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化（salt rounds: 10）
    const passwordHash = await bcrypt.hash(password, 10);

    // memberId生成（UUID v4）
    const memberId = randomUUID();

    // 登録日時
    const registeredAt = new Date().toISOString();

    // RESEND_VALID による条件分岐
    if (isResendValid) {
      // パターンA: メール認証有効（RESEND_VALID=true）
      // Google Sheetsに会員情報を追加（emailVerified=false）
      await addMember({
        memberId,
        name,
        email,
        passwordHash,
        birthday,
        postalCode,
        phone,
        registeredAt,
        emailVerified: false, // メール未認証
      });

      // メール認証トークン生成と送信
      const verificationToken = generateVerificationToken(email);
      const emailResult = await sendVerificationEmail(email, verificationToken);

      if (!emailResult.success) {
        console.error("Failed to send verification email:", emailResult.error);
        // メール送信失敗でも登録自体は成功とする（後で再送信可能）
      } else {
        console.log(`Verification email sent to ${email}, messageId: ${emailResult.messageId}`);
      }

      // 成功レスポンス（メール送信あり）
      return NextResponse.json(
        {
          message: "会員登録が完了しました。認証メールを送信しましたので、メールをご確認ください。",
          memberId,
          email,
          emailSent: emailResult.success,
        },
        { status: 201 }
      );
    } else {
      // パターンB: メール認証スキップ（RESEND_VALID=false、デフォルト）
      // Google Sheetsに会員情報を追加（emailVerified=true）
      await addMember({
        memberId,
        name,
        email,
        passwordHash,
        birthday,
        postalCode,
        phone,
        registeredAt,
        emailVerified: true, // メール認証スキップのため即座に認証済み
      });

      console.log(`Member registered without email verification: ${email} (${memberId})`);

      // 成功レスポンス（メール送信なし）
      return NextResponse.json(
        {
          message: "会員登録が完了しました。",
          memberId,
          email,
          emailSent: false,
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error("Registration error:", error);

    // より詳細なエラー情報を返す（開発環境のみ）
    const errorMessage = error instanceof Error ? error.message : "不明なエラー";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("Error details:", { message: errorMessage, stack: errorStack });

    return NextResponse.json(
      {
        error: "会員登録中にエラーが発生しました",
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { status: 500 }
    );
  }
}
