import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/tokens";
import { getMemberByEmail, updateMemberEmailVerified } from "@/lib/sheets";

/**
 * メール認証API
 * GET /api/verify-email?token=xxx
 *
 * ユーザーが認証メールのリンクをクリックした際に呼ばれる
 * トークンを検証し、会員のemailVerifiedフラグをTRUEに更新
 */
export async function GET(request: NextRequest) {
  try {
    // URLからトークンを取得
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "トークンが指定されていません",
        },
        { status: 400 }
      );
    }

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
    if (verificationResult.payload.type !== "email-verification") {
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

    // 既に認証済みの場合
    if (member.emailVerified) {
      return NextResponse.json(
        {
          success: true,
          message: "メールアドレスは既に認証済みです",
          alreadyVerified: true,
        },
        { status: 200 }
      );
    }

    // メール認証状態を更新
    await updateMemberEmailVerified(member.memberId, true);

    console.log(`Email verified for member: ${member.email} (${member.memberId})`);

    return NextResponse.json(
      {
        success: true,
        message: "メールアドレスの認証が完了しました",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying email:", error);

    return NextResponse.json(
      {
        success: false,
        error: "メール認証処理中にエラーが発生しました",
      },
      { status: 500 }
    );
  }
}
