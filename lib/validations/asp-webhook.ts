import { z } from "zod";

/**
 * ASP Webhook共通パラメータ
 *
 * 各ASPから送信されるWebhookペイロードの標準的な構造を定義します。
 * ASPごとにパラメータ名や形式が異なる場合がありますが、
 * 本スキーマは最大公約数的な項目を定義しています。
 *
 * 参考: docs/asp-api-integration.md - General Webhook Implementation Considerations
 */

/**
 * 承認状況の列挙型
 * - pending: 未承認（成果発生したが承認待ち）
 * - approved: 承認済み（キャッシュバック対象）
 * - cancelled: キャンセル（成果が取り消された）
 */
export const conversionStatusEnum = z.enum(["pending", "approved", "cancelled"]);

/**
 * ASP識別子
 * - a8net: A8.net
 * - afb: afb (アフィb)
 * - moshimo: もしもアフィリエイト
 * - valuecommerce: バリューコマース
 */
export const aspNameEnum = z.enum(["a8net", "afb", "moshimo", "valuecommerce"]);

/**
 * afb Webhook ペイロードスキーマ
 *
 * afbのリアルタイムポストバックシステムから送信されるペイロードを検証します。
 *
 * 注意: 実際のafb APIドキュメントを確認後、必要に応じて調整が必要です。
 * 現在は標準的なASP Webhookパラメータに基づく推定値です。
 */
export const afbWebhookSchema = z.object({
  // 追跡ID（会員ID or guest:UUID）
  // afbでは "id1" または "tracking_id" として送信される可能性
  id1: z.string().min(1, "追跡IDは必須です"),

  // イベントID（クリック時に生成したUUID v4）
  // afbでは "eventId" または "event_id" として送信される可能性
  eventId: z.string().uuid("イベントIDはUUID形式である必要があります").optional(),

  // プログラムID（アフィリエイトプログラムの識別子）
  program_id: z.string().min(1, "プログラムIDは必須です").optional(),

  // 注文ID（ASP側での注文/取引番号）
  order_id: z.string().min(1, "注文IDは必須です").optional(),

  // 報酬額（ASPから支払われる報酬金額）
  reward: z.union([
    z.number().min(0, "報酬額は0以上である必要があります"),
    z.string().regex(/^\d+(\.\d{1,2})?$/, "報酬額は数値形式である必要があります")
      .transform((val) => parseFloat(val))
  ]),

  // 通貨コード（日本のASPは基本的にJPY）
  currency: z.string().length(3, "通貨コードは3文字である必要があります").default("JPY"),

  // 承認状況
  status: conversionStatusEnum,

  // タイムスタンプ（ISO 8601形式）
  timestamp: z.string().datetime("タイムスタンプはISO 8601形式である必要があります").optional(),

  // 案件名（オプション：ASP側で提供される場合）
  deal_name: z.string().optional(),
});

/**
 * 汎用ASP Webhook ペイロードスキーマ
 *
 * 複数のASPに対応できるように、柔軟な構造を持つスキーマです。
 * ASP固有のパラメータは追加で定義することを推奨します。
 */
export const genericAspWebhookSchema = z.object({
  // ASP識別子（クエリパラメータで渡される想定）
  asp: aspNameEnum.optional(),

  // 追跡ID（会員ID or guest:UUID）
  tracking_id: z.string().min(1, "追跡IDは必須です")
    .or(z.string().min(1).transform((val) => val)), // id1 も許容

  // イベントID（クリック時に生成したUUID v4）
  event_id: z.string().uuid("イベントIDはUUID形式である必要があります").optional(),

  // プログラムID
  program_id: z.string().optional(),

  // 注文ID
  order_id: z.string().optional(),

  // 報酬額
  amount: z.union([
    z.number().min(0),
    z.string().regex(/^\d+(\.\d{1,2})?$/).transform((val) => parseFloat(val))
  ]),

  // 通貨コード
  currency: z.string().length(3).default("JPY"),

  // 承認状況
  status: conversionStatusEnum,

  // タイムスタンプ
  timestamp: z.string().datetime().optional(),

  // 署名（HMAC-SHA256）
  signature: z.string().optional(),
});

/**
 * Webhook署名検証用のヘッダースキーマ
 *
 * ASPから送信される署名情報を検証するためのスキーマです。
 * 一般的に、署名は以下のいずれかの方法で送信されます：
 * - X-Signature ヘッダー
 * - X-Hub-Signature ヘッダー（GitHub風）
 * - X-ASP-Signature ヘッダー（ASP固有）
 */
export const webhookSignatureHeaderSchema = z.object({
  "x-signature": z.string().optional(),
  "x-hub-signature": z.string().optional(),
  "x-asp-signature": z.string().optional(),
  "x-afb-signature": z.string().optional(),
});

/**
 * Webhook受信時のリクエスト全体のスキーマ
 *
 * ヘッダーとボディを含む完全なWebhookリクエストを検証します。
 */
export const webhookRequestSchema = z.object({
  headers: webhookSignatureHeaderSchema,
  body: afbWebhookSchema.or(genericAspWebhookSchema),
});

// 型エクスポート
export type ConversionStatus = z.infer<typeof conversionStatusEnum>;
export type AspName = z.infer<typeof aspNameEnum>;
export type AfbWebhookPayload = z.infer<typeof afbWebhookSchema>;
export type GenericAspWebhookPayload = z.infer<typeof genericAspWebhookSchema>;
export type WebhookSignatureHeader = z.infer<typeof webhookSignatureHeaderSchema>;
export type WebhookRequest = z.infer<typeof webhookRequestSchema>;
