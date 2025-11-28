# テスト戦略とテストケース

**最終更新日:** 2025-01-04
**対象:** 全ASP統合
**重要度:** 高

---

## 概要

ASP統合機能の品質保証のためのテスト戦略です。

---

## テストレベル

### 1. 単体テスト（Unit Test）

**対象:**
- 個別関数・ユーティリティ
- データ変換・パース処理
- バリデーション

**ツール:** Jest

**テストケース例:**

```typescript
// lib/__tests__/valuecommerce-api.test.ts
import { parseOrderReportXML } from "../valuecommerce-api";

describe("parseOrderReportXML", () => {
  test("正常なXMLレスポンスをパースできる", async () => {
    const xml = `
      <?xml version="1.0"?>
      <orderReport>
        <orders>
          <order>
            <orderNumber>VC-12345</orderNumber>
            <commission>10000</commission>
            <status>approved</status>
            <clickId>member-abc123</clickId>
          </order>
        </orders>
      </orderReport>
    `;

    const result = await parseOrderReportXML(xml);

    expect(result.orders).toHaveLength(1);
    expect(result.orders[0].orderNumber).toBe("VC-12345");
    expect(result.orders[0].commission).toBe(10000);
  });

  test("空のXMLレスポンスを処理できる", async () => {
    const xml = `<?xml version="1.0"?><orderReport><orders></orders></orderReport>`;
    const result = await parseOrderReportXML(xml);
    expect(result.orders).toHaveLength(0);
  });

  test("不正なXMLでエラーをスローする", async () => {
    const invalidXml = "not valid xml";
    await expect(parseOrderReportXML(invalidXml)).rejects.toThrow();
  });
});
```

---

### 2. 統合テスト（Integration Test）

**対象:**
- API統合ロジック全体
- Google Sheets連携
- クリックログ照合

**ツール:** Jest + テスト用Google Sheets

**テストケース例:**

```typescript
// app/api/webhooks/afb-postback/__tests__/route.test.ts
import { GET } from "../route";

describe("AFB Postback Webhook", () => {
  beforeEach(async () => {
    // テスト用Google Sheetsをクリア
    await clearTestSheet(SHEET_NAMES.RESULT_CSV_RAW);
  });

  test("正常なポストバックを処理できる", async () => {
    const request = new Request(
      "http://localhost:3000/api/webhooks/afb-postback?paid=member-test123&adid=12345&price=10000&judge=1&u=unique-123&time=2025-01-04T12:00:00Z"
    );

    const response = await GET(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.success).toBe(true);

    // Google Sheetsに記録されたか確認
    const rows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:H");
    expect(rows).toHaveLength(1);
    expect(rows[0][1]).toBe("member-test123"); // B列: 会員ID
  });

  test("重複成果をスキップする", async () => {
    // 1回目のリクエスト
    await GET(
      new Request(
        "http://localhost:3000/api/webhooks/afb-postback?paid=member-test123&adid=12345&price=10000&judge=1&u=unique-123&time=2025-01-04T12:00:00Z"
      )
    );

    // 2回目のリクエスト（同じu）
    const response = await GET(
      new Request(
        "http://localhost:3000/api/webhooks/afb-postback?paid=member-test123&adid=12345&price=10000&judge=1&u=unique-123&time=2025-01-04T12:05:00Z"
      )
    );

    const json = await response.json();
    expect(json.message).toContain("Duplicate");

    // Google Sheetsには1行のみ
    const rows = await readSheet(SHEET_NAMES.RESULT_CSV_RAW, "A2:H");
    expect(rows).toHaveLength(1);
  });
});
```

---

### 3. E2Eテスト（End-to-End Test）

**対象:**
- 実際のASP管理画面を使用
- 本番環境に近い条件

**ツール:** 手動テスト + curl

**テスト手順:**

#### AFB E2Eテスト

1. **クリックログ記録:**
   ```bash
   curl -X POST "http://localhost:3000/api/track-click" \
     -H "Content-Type: application/json" \
     -d '{
       "dealId": "afb-test-deal",
       "dealName": "AFBテスト案件",
       "memberId": "member-e2e-test"
     }'
   ```

2. **AFB管理画面でテスト成果発生:**
   - AFB管理画面 → テスト機能
   - ポストバックURL: `https://your-app.vercel.app/api/webhooks/afb-postback`
   - パラメータ: `paid=member-e2e-test`, `u=e2e-test-001`, ...

3. **成果記録確認:**
   ```bash
   # Google Sheets「成果CSV_RAW」を確認
   # B列に "member-e2e-test" が記録されているか
   ```

4. **GAS実行:**
   - Google Apps Script → 手動実行

5. **ダッシュボード確認:**
   ```
   http://localhost:3000/mypage/history
   ```

---

## テストケース一覧

### AFB統合

| # | テストケース | 期待結果 | 優先度 |
|---|------------|---------|--------|
| 1 | 正常なポストバック受信 | 200 OK, Google Sheetsに記録 | 高 |
| 2 | 必須パラメータ欠落 | 400 Bad Request | 高 |
| 3 | 重複成果（同じu） | 200 OK, スキップ | 高 |
| 4 | IPホワイトリスト外 | 401 Unauthorized | 中 |
| 5 | Google Sheets書き込み失敗 | 500, エラーログ | 高 |

---

### ValueCommerce統合

| # | テストケース | 期待結果 | 優先度 |
|---|------------|---------|--------|
| 1 | OAuth署名生成 | 正しい署名ヘッダー | 高 |
| 2 | 注文レポートAPI取得 | XMLレスポンス取得 | 高 |
| 3 | XMLパース（正常） | 注文データ配列 | 高 |
| 4 | XMLパース（空） | 空配列 | 中 |
| 5 | Click ID照合（成功） | メンバーID取得 | 高 |
| 6 | Click ID照合（失敗） | null返却 | 中 |
| 7 | 重複成果（同じorderNumber） | スキップ | 高 |
| 8 | API認証エラー | 401, エラーログ | 高 |
| 9 | レート制限エラー | 429, リトライ | 中 |

---

### 成果マッチングアルゴリズム

| # | テストケース | 期待結果 | 優先度 |
|---|------------|---------|--------|
| 1 | カスタムパラメータ完全一致 | メンバーID取得（100%精度） | 高 |
| 2 | 時間範囲フィルタ（±24時間以内） | 候補リスト返却 | 高 |
| 3 | 時間範囲フィルタ（範囲外） | 空配列 | 中 |
| 4 | 案件名完全一致 | スコア100 | 高 |
| 5 | 案件名部分一致 | スコア60-80 | 中 |
| 6 | 案件名不一致 | スコア0 | 低 |
| 7 | 複数候補（高スコア1件） | 自動承認 | 高 |
| 8 | 複数候補（高スコア複数） | 手動確認 | 中 |
| 9 | 候補0件 | エラーログ、管理者通知 | 高 |

---

## テスト環境

### ローカル開発環境

```bash
# .env.local（テスト用）
GOOGLE_SHEETS_SPREADSHEET_ID=test-spreadsheet-id
VALUECOMMERCE_API_KEY=test-api-key
AFB_API_KEY=test-api-key
NODE_ENV=test
```

### テスト用Google Sheets

**シート構成:**
- **クリックログ（テスト用）**
- **成果CSV_RAW（テスト用）**

**テスト前のクリア処理:**
```typescript
// tests/setup.ts
async function clearTestSheet(sheetName: string) {
  await clearSheet(sheetName, "A2:H1000");
}
```

---

## モック・スタブ

### ASP API のモック

```typescript
// lib/__tests__/__mocks__/valuecommerce-api.ts
export const mockFetchOrderReport = jest.fn().mockResolvedValue(`
  <?xml version="1.0"?>
  <orderReport>
    <orders>
      <order>
        <orderNumber>MOCK-123</orderNumber>
        <commission>10000</commission>
        <status>approved</status>
        <clickId>member-mock</clickId>
      </order>
    </orders>
  </orderReport>
`);
```

### Google Sheets のモック

```typescript
// lib/__tests__/__mocks__/sheets.ts
const mockSheetData: Record<string, string[][]> = {
  [SHEET_NAMES.CLICK_LOG]: [],
  [SHEET_NAMES.RESULT_CSV_RAW]: [],
};

export const mockReadSheet = jest.fn((sheetName, range) => {
  return Promise.resolve(mockSheetData[sheetName] || []);
});

export const mockWriteSheet = jest.fn((sheetName, rows) => {
  mockSheetData[sheetName].push(...rows);
  return Promise.resolve();
});
```

---

## CI/CD統合

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm test

      - name: Run TypeScript check
        run: npx tsc --noEmit

      - name: Run lint
        run: npm run lint
```

---

## テスト実行

### ローカル環境

```bash
# すべてのテスト実行
npm test

# 特定ファイルのみ
npm test -- afb-postback

# カバレッジレポート
npm test -- --coverage

# ウォッチモード
npm test -- --watch
```

---

## カバレッジ目標

| 種別 | 目標 | 現状 |
|------|------|------|
| 単体テスト | 80%以上 | TBD |
| 統合テスト | 主要フロー100% | TBD |
| E2Eテスト | 全ASP実施 | TBD |

---

## 参考リンク

- [エラーハンドリング戦略](./error-handling.md)
- [カスタムトラッキングパラメータ仕様](./tracking-parameters.md)
- [成果マッチングアルゴリズム](./conversion-matching.md)

---

_Last Updated: 2025-01-04_