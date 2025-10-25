import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

/**
 * ゲストUUID管理ユーティリティ
 *
 * 非会員ユーザーに対して、guest:UUID形式のユニークIDを生成・管理します。
 * このIDはCookieに保存され、アフィリエイト追跡のid1パラメータとして使用されます。
 *
 * Cookie仕様:
 * - 名前: guest_uuid
 * - 値: guest:{UUID v4}
 * - 有効期限: 365日
 * - httpOnly: false (フロントエンドからも読み取り可能)
 * - sameSite: lax
 * - secure: true (本番環境のみ)
 */

const GUEST_UUID_COOKIE_NAME = "guest_uuid";
const GUEST_UUID_MAX_AGE = 365 * 24 * 60 * 60; // 365日（秒）

/**
 * Cookieからguest UUIDを取得、存在しない場合は新規生成
 *
 * @param request - NextRequest オブジェクト
 * @returns guest:UUID 形式の文字列
 *
 * @example
 * const guestUuid = getOrCreateGuestUuid(request);
 * // => "guest:550e8400-e29b-41d4-a716-446655440000"
 */
export function getOrCreateGuestUuid(request: NextRequest): string {
  const existingUuid = request.cookies.get(GUEST_UUID_COOKIE_NAME)?.value;

  // 既存のguest UUIDが存在し、正しいフォーマットの場合は再利用
  if (existingUuid && existingUuid.startsWith("guest:")) {
    return existingUuid;
  }

  // 新規UUID生成（guest:プレフィックス付き）
  return `guest:${randomUUID()}`;
}

/**
 * レスポンスにguest UUID Cookieを設定
 *
 * @param response - NextResponse オブジェクト
 * @param guestUuid - guest:UUID 形式の文字列
 * @returns Cookie設定済みのNextResponse
 *
 * @example
 * const response = NextResponse.json({ trackingUrl: "..." });
 * setGuestUuidCookie(response, "guest:550e8400-e29b-41d4-a716-446655440000");
 */
export function setGuestUuidCookie(
  response: NextResponse,
  guestUuid: string
): NextResponse {
  response.cookies.set(GUEST_UUID_COOKIE_NAME, guestUuid, {
    httpOnly: false, // フロントエンドからも読み取り可能にする
    sameSite: "lax",
    maxAge: GUEST_UUID_MAX_AGE,
    path: "/",
    secure: process.env.NODE_ENV === "production", // 本番環境のみHTTPS必須
  });

  return response;
}
