# セキュリティベストプラクティス

**最終更新日:** 2025-01-04
**対象:** 全ASP統合
**重要度:** 最高

---

## 概要

ASP統合における統一的なセキュリティガイドラインです。

---

## 認証情報管理

### 1. 環境変数の保護

**絶対にやってはいけないこと:**
- ❌ Gitにコミット
- ❌ ハードコード
- ❌ クライアントサイドで使用
- ❌ ログに出力

**推奨する管理方法:**
```bash
# .env.local（ローカル開発）
VALUECOMMERCE_CONSUMER_KEY=vc_xxxxx
VALUECOMMERCE_CONSUMER_SECRET=xxxxx # ← Gitignore必須

# Vercel環境変数（本番）
vercel env add VALUECOMMERCE_CONSUMER_SECRET production
```

### 2. 環境変数の検証

```typescript
// lib/config.ts
function validateEnv() {
  const required = [
    "GOOGLE_SHEETS_CLIENT_EMAIL",
    "GOOGLE_SHEETS_PRIVATE_KEY",
    "VALUECOMMERCE_CONSUMER_KEY",
    "VALUECOMMERCE_CONSUMER_SECRET",
  ];

  for (const key of required) {
    if (!process.env[key]) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
  }
}

// アプリ起動時に実行
validateEnv();
```

### 3. シークレットのローテーション

**推奨頻度:**
- 3-6ヶ月ごと
- 開発メンバー退職時
- 漏洩の疑いがある場合は即座に

**手順:**
1. ASP管理画面で新しい認証情報を生成
2. 環境変数を更新
3. アプリケーション再起動
4. 旧認証情報の無効化確認

---

## Webhook セキュリティ

### 1. IPホワイトリスト認証（AFB）

```typescript
// app/api/webhooks/afb-postback/route.ts
const allowedIPs = [
  "13.114.169.190",    // 本番送信元IP
  "180.211.73.218",    // 再送元IP1
  "112.137.189.110",   // 再送元IP2
];

const clientIp = getClientIP(request);

if (!isDevelopment && !allowedIPs.includes(clientIp)) {
  console.warn(`[afb-postback] Unauthorized IP: ${clientIp}`);
  return NextResponse.json(
    { error: "Unauthorized IP address" },
    { status: 401 }
  );
}
```

**注意点:**
- 開発環境ではIPチェックをスキップ（`NODE_ENV === "development"`）
- Vercelの `x-forwarded-for` ヘッダーを使用
- プロキシ経由の場合は最初のIPを取得

### 2. Cron認証（CRON_SECRET）

```typescript
// app/api/cron/valuecommerce-sync/route.ts
const authHeader = request.headers.get("authorization");
const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

if (authHeader !== expectedToken) {
  console.warn("[valuecommerce-sync] Unauthorized request");
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**CRON_SECRET生成:**
```bash
openssl rand -base64 32
```

### 3. リクエストレート制限

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"), // 10秒で10リクエスト
});

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/webhooks")) {
    const identifier = getClientIP(request);
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }
  }

  return NextResponse.next();
}
```

---

## データ検証

### 1. 入力バリデーション（Zod）

```typescript
// types/afb-postback.ts
import { z } from "zod";

export const AfbPostbackSchema = z.object({
  paid: z.string().min(1).max(255),
  adid: z.string().min(1),
  price: z.string().regex(/^\d+$/), // 数字のみ
  judge: z.enum(["0", "1", "9"]),
  u: z.string().min(1),
  time: z.string().datetime(),
});

// 使用例
const validated = AfbPostbackSchema.parse(params);
```

**バリデーションルール:**
- ✅ 型チェック（string, number, boolean）
- ✅ 長さ制限（min, max）
- ✅ 正規表現マッチング
- ✅ 列挙型チェック（enum）
- ✅ カスタムバリデーション

### 2. SQLインジェクション対策

**Google Sheets API使用時:**
- プレースホルダー不要（REST API）
- パラメータは自動エスケープ

**将来的にDB導入時:**
```typescript
// ✅ 正しい（プレースホルダー使用）
await db.query("SELECT * FROM conversions WHERE memberId = ?", [memberId]);

// ❌ 間違い（SQLインジェクション脆弱性）
await db.query(`SELECT * FROM conversions WHERE memberId = '${memberId}'`);
```

### 3. XSS対策

**Next.js自動エスケープ:**
```tsx
// ✅ 自動エスケープされる
<div>{userInput}</div>

// ❌ 危険（dangerouslySetInnerHTML）
<div dangerouslySetInnerHTML={{ __html: userInput }} />
```

---

## HTTPS強制

### Vercelでの設定

**自動対応:**
- Vercel デプロイは自動的にHTTPSを有効化
- HTTPリクエストは自動的にHTTPSへリダイレクト

**確認:**
```bash
curl -I https://your-app.vercel.app/api/webhooks/afb-postback
# → HTTP/2 200
```

---

## ログ出力の注意

### 1. 機密情報の除外

```typescript
// ❌ 悪い例
console.log("OAuth config:", {
  consumerKey: config.consumerKey,
  consumerSecret: config.consumerSecret, // ← 秘密鍵が丸見え
});

// ✅ 良い例
console.log("OAuth config:", {
  consumerKey: config.consumerKey,
  consumerSecretSet: !!config.consumerSecret, // ← 存在確認のみ
});
```

### 2. ログのサニタイズ

```typescript
function sanitizeLog(data: any): any {
  const sensitiveKeys = [
    "password",
    "secret",
    "token",
    "apiKey",
    "privateKey",
  ];

  if (typeof data !== "object") return data;

  const sanitized = { ...data };

  for (const key of Object.keys(sanitized)) {
    const lowerKey = key.toLowerCase();

    if (sensitiveKeys.some(sk => lowerKey.includes(sk))) {
      sanitized[key] = "***REDACTED***";
    }
  }

  return sanitized;
}

// 使用例
console.log("Request data:", sanitizeLog(requestData));
```

---

## CORS設定

### Webhook エンドポイント

```typescript
// app/api/webhooks/afb-postback/route.ts
export async function GET(request: NextRequest) {
  const response = NextResponse.json({ success: true });

  // CORS設定（必要な場合のみ）
  response.headers.set("Access-Control-Allow-Origin", "https://afb.jp");
  response.headers.set("Access-Control-Allow-Methods", "GET");

  return response;
}
```

**注意:**
- Webhookは通常CORSは不要（サーバー間通信）
- 管理画面APIは適切なOriginを設定

---

## セキュリティヘッダー

### Next.js設定

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
        ],
      },
    ];
  },
};
```

---

## データの暗号化

### Google Sheets データ

**現状:**
- Google Sheets APIは通信時にTLS暗号化
- データは平文で保存（Google内部で暗号化）

**個人情報の取り扱い:**
- 最小限の情報のみ記録（名前、メールアドレス、報酬額）
- パスワードはbcryptでハッシュ化（Google Sheetsに保存）
- クレジットカード情報は保存しない

### 将来的なDB移行時

```typescript
// パスワードのハッシュ化（bcrypt）
import bcrypt from "bcryptjs";

const hashedPassword = await bcrypt.hash(plainPassword, 10);

// 検証
const isValid = await bcrypt.compare(plainPassword, hashedPassword);
```

---

## 監査ログ

### 重要操作の記録

```typescript
interface AuditLog {
  timestamp: string;
  action: "conversion_created" | "member_updated" | "admin_action";
  actorId: string; // メンバーID or 管理者ID
  targetId?: string; // 対象ID
  details: Record<string, any>;
}

async function logAudit(log: AuditLog): Promise<void> {
  await appendSheet(SHEET_NAMES.AUDIT_LOG, [
    [
      log.timestamp,
      log.action,
      log.actorId,
      log.targetId || "",
      JSON.stringify(log.details),
    ],
  ]);
}

// 使用例
await logAudit({
  timestamp: new Date().toISOString(),
  action: "conversion_created",
  actorId: "system",
  targetId: order.orderId,
  details: {
    aspName: "afb",
    rewardAmount: 10000,
    memberId: "member-abc123",
  },
});
```

---

## セキュリティチェックリスト

実装時の確認項目:

### 認証・認可
- [ ] 環境変数が正しく設定されている
- [ ] 環境変数がGitにコミットされていない
- [ ] Webhook エンドポイントにIPホワイトリスト設定
- [ ] Cron エンドポイントにCRON_SECRET設定

### データ検証
- [ ] すべての入力にZodバリデーション
- [ ] 数値フィールドは数値型に変換
- [ ] 長さ制限を実装

### HTTPS・暗号化
- [ ] すべてのエンドポイントがHTTPS
- [ ] パスワードはbcryptでハッシュ化
- [ ] 個人情報は最小限

### ログ・監査
- [ ] 機密情報をログに出力していない
- [ ] 重要操作を監査ログに記録
- [ ] エラーログに十分な情報

### セキュリティヘッダー
- [ ] X-Content-Type-Options設定
- [ ] X-Frame-Options設定
- [ ] Strict-Transport-Security設定

---

## インシデント対応

### セキュリティインシデント発生時

1. **即座に対応:**
   - 環境変数の無効化・再生成
   - 該当エンドポイントの一時停止

2. **調査:**
   - ログ分析（Vercel Logs）
   - 影響範囲の特定
   - 漏洩データの確認

3. **復旧:**
   - 脆弱性の修正
   - 新しい認証情報で再デプロイ
   - 動作確認

4. **報告:**
   - インシデントレポート作成
   - 必要に応じて関係者へ通知

---

## 参考リンク

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Vercel Security Best Practices](https://vercel.com/docs/security)
- [Next.js Security Headers](https://nextjs.org/docs/app/api-reference/next-config-js/headers)

---

_Last Updated: 2025-01-04_
