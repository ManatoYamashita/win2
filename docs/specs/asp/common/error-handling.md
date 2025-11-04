# エラーハンドリング戦略

**最終更新日:** 2025-01-04
**対象:** 全ASP統合
**重要度:** 高

---

## 概要

ASP統合における統一的なエラーハンドリング戦略です。

---

## エラー分類

### レベル1: 致命的エラー（Critical）

**特徴:**
- システム全体の動作に影響
- 即座の対応が必要

**例:**
- Google Sheets API認証エラー
- 環境変数の欠落
- データベース接続エラー

**対応:**
```typescript
try {
  await writeConversionData(data);
} catch (error) {
  console.error("[CRITICAL] Failed to write conversion data:", error);
  await sendAdminAlert({
    level: "critical",
    message: "Google Sheets write failed",
    error: error.message,
  });
  throw error; // エラーを再スロー
}
```

---

### レベル2: 重要エラー（Error）

**特徴:**
- 特定機能の動作に影響
- データ損失の可能性あり

**例:**
- ASP API認証エラー
- 成果データパースエラー
- 重複チェックエラー

**対応:**
```typescript
try {
  const orders = await fetchOrderReport(params);
} catch (error) {
  console.error("[ERROR] Failed to fetch order report:", error);
  await logError({
    level: "error",
    source: "valuecommerce-api",
    message: error.message,
  });
  return []; // 空配列を返してCron継続
}
```

---

### レベル3: 警告（Warning）

**特徴:**
- 部分的な機能不全
- データ損失なし

**例:**
- カスタムパラメータが空
- クリックログに候補なし
- 案件名マッチング失敗

**対応:**
```typescript
if (!order.customParam) {
  console.warn("[WARN] Empty custom parameter:", order.orderId);
  // フォールバック処理
  await createManualReviewTask(order);
}
```

---

### レベル4: 情報（Info）

**特徴:**
- 正常動作の記録
- デバッグ用

**例:**
- 成果データ取得成功
- 重複スキップ
- Cron実行完了

**対応:**
```typescript
console.log("[INFO] Sync completed:", {
  totalFetched: 10,
  newConversions: 5,
  skippedDuplicates: 3,
});
```

---

## リトライ戦略

### 指数バックオフ

```typescript
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;

      if (isLastAttempt) {
        throw error;
      }

      const waitTime = Math.pow(2, i) * 1000; // 1秒, 2秒, 4秒
      console.warn(`[RETRY] Attempt ${i + 1}/${maxRetries} failed, retrying in ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  throw new Error("Max retries exceeded");
}
```

**使用例:**
```typescript
const orders = await fetchWithRetry(() =>
  fetchOrderReport({
    start_date: "2025-01-01",
    end_date: "2025-01-31",
  })
);
```

---

### リトライ条件

**リトライすべきエラー:**
- ✅ ネットワークタイムアウト
- ✅ 500 Internal Server Error
- ✅ 503 Service Unavailable
- ✅ Google Sheets API quota exceeded

**リトライすべきでないエラー:**
- ❌ 401 Unauthorized（認証エラー）
- ❌ 400 Bad Request（不正なパラメータ）
- ❌ 404 Not Found

```typescript
function shouldRetry(error: AxiosError): boolean {
  if (!error.response) {
    return true; // ネットワークエラー
  }

  const status = error.response.status;
  return status === 500 || status === 503 || status === 429;
}
```

---

## エラーログ記録

### 構造化ログ

```typescript
interface ErrorLog {
  timestamp: string;
  level: "critical" | "error" | "warning" | "info";
  source: string; // "afb-postback", "valuecommerce-sync", etc.
  message: string;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  context?: Record<string, any>;
}

async function logError(log: ErrorLog): Promise<void> {
  console.error(JSON.stringify(log));

  // Vercel Logsに記録される
  // 将来的にはSentry、Datadogなどの外部サービスに送信
}
```

**使用例:**
```typescript
try {
  await writeConversionData(data);
} catch (error) {
  await logError({
    timestamp: new Date().toISOString(),
    level: "error",
    source: "afb-postback",
    message: "Failed to write conversion data",
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    context: {
      orderId: data.orderId,
      memberId: data.trackingId,
    },
  });
}
```

---

## API別エラーハンドリング

### AFB Webhook

```typescript
// app/api/webhooks/afb-postback/route.ts
export async function GET(request: NextRequest) {
  try {
    // ... 処理

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[afb-postback] Error:", error);

    // ⚠️ 重要: Webhookは常に200を返す
    // エラーでも200を返すことで、AFB側の不要なリトライを防止
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 200 } // ← 200を返す
    );
  }
}
```

---

### ValueCommerce Cron

```typescript
// app/api/cron/valuecommerce-sync/route.ts
export async function GET(request: NextRequest) {
  try {
    // ... 処理

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error("[valuecommerce-sync] Error:", error);

    await logError({
      level: "error",
      source: "valuecommerce-sync",
      message: error.message,
    });

    // Cronエラーは500を返す
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

---

## Google Sheets エラー

### Quota Exceeded

```typescript
// lib/sheets.ts
export async function writeConversionData(data: ConversionWebhookData): Promise<void> {
  try {
    await appendSheet(SHEET_NAMES.RESULT_CSV_RAW, [
      [data.timestamp, data.trackingId, data.eventId, ...],
    ]);
  } catch (error) {
    if (error.message.includes("Quota exceeded")) {
      console.warn("[sheets] Quota exceeded, retrying after 60s");
      await new Promise(resolve => setTimeout(resolve, 60000));
      // リトライ
      await appendSheet(SHEET_NAMES.RESULT_CSV_RAW, [...]);
    } else {
      throw error;
    }
  }
}
```

---

### バッチ書き込みでの最適化

```typescript
// 複数行を1リクエストで書き込む
export async function batchWriteConversionData(
  conversions: ConversionWebhookData[]
): Promise<void> {
  const rows = conversions.map(data => [
    data.timestamp,
    data.trackingId,
    data.eventId,
    data.dealName,
    data.aspName,
    data.rewardAmount,
    data.status,
    data.orderId,
  ]);

  try {
    await appendSheet(SHEET_NAMES.RESULT_CSV_RAW, rows);
    console.log(`[sheets] Batch wrote ${rows.length} conversions`);
  } catch (error) {
    console.error("[sheets] Batch write failed:", error);
    // 個別書き込みにフォールバック
    for (const row of rows) {
      await appendSheet(SHEET_NAMES.RESULT_CSV_RAW, [row]);
    }
  }
}
```

---

## 通知・アラート

### 管理者アラート

```typescript
async function sendAdminAlert(alert: {
  level: "critical" | "error" | "warning";
  message: string;
  context?: Record<string, any>;
}): Promise<void> {
  // メール通知（Resend）
  await sendEmail({
    to: process.env.ADMIN_EMAIL,
    subject: `[${alert.level.toUpperCase()}] WIN×Ⅱ ASP Integration Alert`,
    body: `
      Level: ${alert.level}
      Message: ${alert.message}
      Context: ${JSON.stringify(alert.context, null, 2)}
    `,
  });

  // 将来的にはSlack通知も実装
}
```

---

## デバッグ支援

### 環境別ログレベル

```typescript
const LOG_LEVEL = process.env.NODE_ENV === "development" ? "debug" : "info";

function log(level: string, message: string, data?: any) {
  const levels = ["debug", "info", "warning", "error", "critical"];
  const currentLevelIndex = levels.indexOf(LOG_LEVEL);
  const messageLevelIndex = levels.indexOf(level);

  if (messageLevelIndex >= currentLevelIndex) {
    console.log(`[${level.toUpperCase()}] ${message}`, data || "");
  }
}

// 使用例
log("debug", "Fetching orders", { start_date: "2025-01-01" }); // 開発環境のみ出力
log("error", "API error", error); // 常に出力
```

---

## チェックリスト

実装時の確認項目:

- [ ] すべてのtry-catchでエラーログを記録
- [ ] 致命的エラーはアラート通知
- [ ] Webhookは常に200を返す
- [ ] Cronエラーは500を返す
- [ ] リトライ可能なエラーは指数バックオフ
- [ ] Google Sheets quota exceeded対策
- [ ] 環境別ログレベル設定

---

## 参考リンク

- [カスタムトラッキングパラメータ仕様](./tracking-parameters.md)
- [成果マッチングアルゴリズム](./conversion-matching.md)
- [テスト戦略](./testing-strategy.md)

---

_Last Updated: 2025-01-04_
