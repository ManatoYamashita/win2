import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { getMemberById, updateMember } from "@/lib/sheets";
import { updateProfileSchema } from "@/lib/validations/profile";

/**
 * 会員情報取得API
 *
 * GET /api/members/me
 *
 * セッションからmemberIdを取得し、Google Sheetsから会員情報を返す
 * パスワードハッシュは除外して返却
 */
export async function GET() {
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
    const { passwordHash: _passwordHash, ...memberData } = member;
    void _passwordHash;

    return NextResponse.json(memberData, { status: 200 });
  } catch (error) {
    console.error("Get member info error:", error);
    return NextResponse.json(
      { error: "会員情報取得中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

/**
 * 会員情報更新API
 *
 * PUT /api/members/me
 *
 * セッションからmemberIdを取得し、Google Sheetsの会員情報を更新
 * 現在は生年月日のみ更新可能（将来的に他フィールドも追加可能）
 */
export async function PUT(req: Request) {
  try {
    // 1. セッション認証
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.memberId) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      );
    }

    // 2. リクエストボディ検証
    const body = await req.json();
    const validatedData = updateProfileSchema.parse(body);

    // 3. Google Sheets更新
    const updatedMember = await updateMember(
      session.user.memberId,
      validatedData
    );

    if (!updatedMember) {
      return NextResponse.json(
        { error: "会員情報が見つかりません" },
        { status: 404 }
      );
    }

    // 4. 成功レスポンス（パスワードハッシュ除外）
    const { passwordHash: _passwordHash, ...memberData } = updatedMember;
    void _passwordHash;

    return NextResponse.json(memberData, { status: 200 });
  } catch (error) {
    console.error("Update member info error:", error);

    // Zodバリデーションエラー
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "入力データが不正です" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "会員情報更新中にエラーが発生しました" },
      { status: 500 }
    );
  }
}
