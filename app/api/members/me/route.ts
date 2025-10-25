import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getMemberById } from "@/lib/sheets";

/**
 * 会員情報取得API
 *
 * GET /api/members/me
 *
 * セッションからmemberIdを取得し、Google Sheetsから会員情報を返す
 * パスワードハッシュは除外して返却
 */
export async function GET(request: NextRequest) {
  try {
    // セッション確認
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.memberId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // Google Sheetsから会員情報を取得
    const member = await getMemberById(session.user.memberId);

    if (!member) {
      return NextResponse.json(
        { error: "会員情報が見つかりません" },
        { status: 404 }
      );
    }

    // パスワードハッシュを除外してレスポンス
    const { passwordHash, ...memberData } = member;

    return NextResponse.json(memberData, { status: 200 });
  } catch (error) {
    console.error("Get member info error:", error);
    return NextResponse.json(
      { error: "会員情報取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
