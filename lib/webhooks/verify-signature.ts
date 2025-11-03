import { createHmac, timingSafeEqual } from "crypto";

/**
 * Webhook署名検証ユーティリティ
 *
 * ASPから送信されるWebhookリクエストの署名を検証し、
 * リクエストが正当なものであることを確認します。
 *
 * セキュリティ考慮事項:
 * - HMAC-SHA256アルゴリズムを使用
 * - タイミング攻撃を防ぐため、timingSafeEqualを使用
 * - 署名検証は必須（署名なしのリクエストは拒否）
 *
 * 参考:
 * - docs/asp-api-integration.md - Security Considerations
 * - docs/architecture/webhook-flow.md - Signature Verification
 */

/**
 * HMAC-SHA256署名を生成
 *
 * @param payload - 署名対象のペイロード（JSON文字列またはオブジェクト）
 * @param secret - 署名に使用するシークレットキー
 * @returns HMAC-SHA256署名（16進数文字列）
 *
 * @example
 * const signature = generateHmacSignature(
 *   JSON.stringify({ id1: "member-123", reward: 1000 }),
 *   "your-secret-key"
 * );
 * console.log(signature); // "a1b2c3d4e5f6..."
 */
export function generateHmacSignature(
  payload: string | Record<string, unknown>,
  secret: string
): string {
  const payloadString = typeof payload === "string" ? payload : JSON.stringify(payload);

  const hmac = createHmac("sha256", secret);
  hmac.update(payloadString);

  return hmac.digest("hex");
}

/**
 * Webhook署名を検証
 *
 * ASPから送信された署名と、ペイロードから生成した署名を比較し、
 * リクエストが改ざんされていないことを確認します。
 *
 * @param payload - 検証対象のペイロード（JSON文字列またはオブジェクト）
 * @param receivedSignature - ASPから送信された署名（ヘッダーから取得）
 * @param secret - 署名検証に使用するシークレットキー
 * @returns 署名が一致する場合はtrue、それ以外はfalse
 *
 * @example
 * const isValid = verifyWebhookSignature(
 *   req.body,
 *   req.headers["x-afb-signature"] as string,
 *   process.env.AFB_WEBHOOK_SECRET!
 * );
 *
 * if (!isValid) {
 *   return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
 * }
 */
export function verifyWebhookSignature(
  payload: string | Record<string, unknown>,
  receivedSignature: string,
  secret: string
): boolean {
  try {
    // 署名が空の場合は即座にfalseを返す
    if (!receivedSignature || !receivedSignature.trim()) {
      console.error("[verify-signature] Received signature is empty");
      return false;
    }

    // シークレットキーが設定されていない場合は即座にfalseを返す
    if (!secret || !secret.trim()) {
      console.error("[verify-signature] Secret key is not configured");
      return false;
    }

    // ペイロードから期待される署名を生成
    const expectedSignature = generateHmacSignature(payload, secret);

    // 受信した署名を正規化（プレフィックス除去、小文字化）
    const normalizedReceivedSignature = receivedSignature
      .replace(/^sha256=/, "") // GitHub風のプレフィックスを除去
      .replace(/^hmac-sha256=/, "") // 別のプレフィックスを除去
      .toLowerCase()
      .trim();

    const normalizedExpectedSignature = expectedSignature.toLowerCase().trim();

    // タイミング攻撃を防ぐため、timingSafeEqualを使用
    // Buffer長が異なる場合は事前にfalseを返す
    if (normalizedReceivedSignature.length !== normalizedExpectedSignature.length) {
      console.error("[verify-signature] Signature length mismatch");
      return false;
    }

    const receivedBuffer = Buffer.from(normalizedReceivedSignature, "hex");
    const expectedBuffer = Buffer.from(normalizedExpectedSignature, "hex");

    const isValid = timingSafeEqual(receivedBuffer, expectedBuffer);

    if (!isValid) {
      console.error("[verify-signature] Signature verification failed");
      console.error("[verify-signature] Expected:", normalizedExpectedSignature);
      console.error("[verify-signature] Received:", normalizedReceivedSignature);
    }

    return isValid;
  } catch (error) {
    console.error("[verify-signature] Error during signature verification:", error);
    return false;
  }
}

/**
 * 複数の署名ヘッダーから署名を抽出
 *
 * ASPによって異なるヘッダー名が使用される可能性があるため、
 * 複数のヘッダーから署名を探索します。
 *
 * @param headers - リクエストヘッダー（Next.js Headers APIまたは標準的なオブジェクト）
 * @returns 見つかった署名、または undefined
 *
 * @example
 * const signature = extractSignatureFromHeaders(request.headers);
 * if (!signature) {
 *   return NextResponse.json({ error: "Missing signature" }, { status: 401 });
 * }
 */
export function extractSignatureFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>
): string | undefined {
  // 優先順位付きのヘッダー名リスト
  const headerNames = [
    "x-afb-signature", // afb固有
    "x-asp-signature", // ASP汎用
    "x-signature", // 汎用
    "x-hub-signature", // GitHub風
    "x-hub-signature-256", // GitHub SHA-256
  ];

  for (const headerName of headerNames) {
    let value: string | undefined;

    if (headers instanceof Headers) {
      // Next.js Headers API
      value = headers.get(headerName) || undefined;
    } else {
      // 標準的なオブジェクト
      const headerValue = headers[headerName];
      value = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    }

    if (value && value.trim()) {
      return value.trim();
    }
  }

  console.warn("[verify-signature] No signature header found");
  return undefined;
}

/**
 * IP whitelist検証
 *
 * ASPのサーバーIPアドレスからのリクエストのみを許可します。
 * 署名検証と併用することを推奨します。
 *
 * @param requestIp - リクエスト元のIPアドレス
 * @param allowedIps - 許可するIPアドレスのリスト
 * @returns IPが許可リストに含まれる場合はtrue、それ以外はfalse
 *
 * @example
 * const isAllowed = verifyIpWhitelist(
 *   request.headers.get("x-forwarded-for") || request.ip,
 *   process.env.AFB_ALLOWED_IPS?.split(",") || []
 * );
 */
export function verifyIpWhitelist(requestIp: string, allowedIps: string[]): boolean {
  if (!requestIp || !requestIp.trim()) {
    console.error("[verify-signature] Request IP is empty");
    return false;
  }

  if (!allowedIps || allowedIps.length === 0) {
    console.warn("[verify-signature] IP whitelist is empty, allowing all IPs");
    return true; // ホワイトリストが設定されていない場合は許可
  }

  const normalizedRequestIp = requestIp.trim().toLowerCase();
  const normalizedAllowedIps = allowedIps.map((ip) => ip.trim().toLowerCase());

  const isAllowed = normalizedAllowedIps.includes(normalizedRequestIp);

  if (!isAllowed) {
    console.error("[verify-signature] IP not in whitelist:", normalizedRequestIp);
    console.error("[verify-signature] Allowed IPs:", normalizedAllowedIps);
  }

  return isAllowed;
}
