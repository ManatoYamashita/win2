# ValueCommerce API - 概要

**最終更新日:** 2025-01-04
**API バージョン:** 注文レポートAPI v1
**実装優先度:** 🥈 Phase 2（32点/40点）
**実装ステータス:** 📋 準備中

---

## 目次

1. [ValueCommerceとは](#valuecommerceとは)
2. [WIN×ⅡでのValueCommerce統合目的](#winⅱでのvaluecommerce統合目的)
3. [利用可能なAPI機能](#利用可能なapi機能)
4. [カスタムトラッキングパラメータ](#カスタムトラッキングパラメータ)
5. [注文レポートAPI概要](#注文レポートapi概要)
6. [実装の前提条件](#実装の前提条件)
7. [実装アーキテクチャ](#実装アーキテクチャ)
8. [次のステップ](#次のステップ)

---

## ValueCommerceとは

### サービス概要

**ValueCommerce（バリューコマース）** は、日本最大級のアフィリエイトサービスプロバイダー（ASP）の一つで、以下の特徴があります：

- **設立:** 1999年（日本初のアフィリエイトサービス）
- **上場:** 東証一部上場（2006年）
- **広告主数:** 7,000社以上
- **主要クライアント:** Yahoo!ショッピング、Amazon、楽天市場、大手ECサイト

### WIN×Ⅱでの利用シーン

1. **大手EC案件の取り扱い**
   - Yahoo!ショッピング関連案件
   - 有名ブランド・メーカー直販サイト

2. **高報酬案件**
   - 金融商品（クレジットカード、FX）
   - 不動産関連（不動産投資、マンション査定）

   - メンバー別トラッキングによる正確な計算

---

## WIN×ⅡでのValueCommerce統合目的

### 主要目標

1. **個別成果の自動取得**
   - 注文レポートAPIを利用した定期的な成果データ取得
   - 手動CSV貼り付け作業の自動化

2. **メンバー別トラッキング**
   - カスタムトラッキングパラメータ `sid` の利用
   - クリックログとの自動照合

   - Google Sheets「成果データ」への自動出力

### 期待される効果

- **運用工数削減:** 手動CSV操作の廃止（月間2-3時間削減）
- **リアルタイム性向上:** 最短10分間隔での成果反映（手動運用は1日1回）
- **精度向上:** 人的ミスの排除、正確なメンバー識別

---

## 利用可能なAPI機能

### ValueCommerce Webサービス一覧

ValueCommerceは以下のAPIを提供しています：

| API名 | 機能 | WIN×Ⅱでの利用 |
|-------|------|--------------|
| **注文レポートAPI** | 成果データ取得（注文ID、報酬額、承認状況） | ✅ **メイン利用** |
| 広告検索API | 案件情報検索 | ⏸️ 今後検討 |
| MyLinkAPI | 動的リンク生成 | ⏸️ 今後検討 |

### 注文レポートAPIの主要機能

```
GET https://webservice.valuecommerce.ne.jp/OrderReport
```

**取得可能なデータ:**
- 注文ID（Order Number）
- 注文日時（Order Date）
- 報酬額（Commission）
- 承認状況（Status: pending/approved/rejected）
- Click ID（`sid` パラメータの値）← **重要**
- 広告主情報（Merchant Name）
- 商品名（Product Name）

**APIの特徴:**
- ✅ Click ID（`sid`）による個別メンバー識別が可能
- ✅ 承認・非承認・保留のステータス取得
- ✅ 日付範囲指定での絞り込み（最大31日間）
- ⚠️ レート制限: 1,000リクエスト/日
- ⚠️ OAuth 1.0a 認証必須

---

## カスタムトラッキングパラメータ

### `sid` パラメータとは

ValueCommerceの **Click ID (sid)** は、アフィリエイトリンクに付与できるカスタムパラメータで、クリック時の情報を記録できます。

#### 基本仕様

| 項目 | 詳細 |
|------|------|
| **パラメータ名** | `sid` |
| **最大文字数** | 100文字 |
| **使用可能文字** | 半角英数字、ハイフン（-）、アンダースコア（_） |
| **設定方法** | ValueCommerce管理画面「MyLink設定」 |
| **取得方法** | 注文レポートAPI の `clickId` フィールド |

#### WIN×Ⅱでの利用方法

```
# クリック時にメンバーIDをsidに設定
https://ck.jp.ap.valuecommerce.com/servlet/referral?sid={自サイトID}&pid={広告ID}&vc_url={遷移先URL}&sid={memberId}

例:
sid=member-a1b2c3d4-e5f6-7890-abcd-ef1234567890
sid=guest:550e8400-e29b-41d4-a716-446655440000
```

**データフロー:**
1. ユーザーが案件をクリック → `sid={memberId}` 付きリンクを生成
2. Google Sheets「クリックログ」に記録（日時, memberId, 案件名, クリックID）
3. ValueCommerceで成果発生
4. 注文レポートAPIで成果取得 → `clickId` フィールドに `sid` の値が格納

---

## 注文レポートAPI概要

### エンドポイント

```
GET https://webservice.valuecommerce.ne.jp/OrderReport
```

### 認証方式

**OAuth 1.0a** - 署名生成が必要

**必要な認証情報:**
- Consumer Key（API Key）
- Consumer Secret（API Secret）
- Access Token
- Access Token Secret

詳細は [authentication-setup.md](./authentication-setup.md) を参照してください。

### リクエストパラメータ

| パラメータ | 必須 | 説明 | 例 |
|-----------|------|------|-----|
| `start_date` | ✅ | 検索開始日（YYYY-MM-DD） | `2025-01-01` |
| `end_date` | ✅ | 検索終了日（YYYY-MM-DD） | `2025-01-31` |
| `status` | ❌ | ステータスフィルタ（pending/approved/rejected） | `approved` |
| `page` | ❌ | ページ番号（デフォルト: 1） | `1` |
| `count` | ❌ | 1ページあたりの件数（デフォルト: 20、最大: 100） | `100` |

**重要な制限:**
- `start_date` と `end_date` の期間は **最大31日間**
- ページング処理が必要（1リクエスト最大100件）

### レスポンス形式

**Content-Type:** `application/xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<orders>
  <order>
    <orderNumber>VC-12345678</orderNumber>
    <orderDate>2025-01-03T14:30:00+09:00</orderDate>
    <commission>10000</commission>
    <status>approved</status>
    <clickId>member-a1b2c3d4-e5f6-7890-abcd-ef1234567890</clickId>
    <merchantName>Example Shop</merchantName>
    <productName>商品名サンプル</productName>
  </order>
  ...
</orders>
```

**主要フィールド:**
- `clickId`: **`sid` パラメータの値**（メンバーID照合に使用）
- `orderNumber`: 注文の一意識別子（重複チェックに使用）
- `commission`: 報酬額（単位: 円）
- `status`: `pending`（保留）/ `approved`（承認）/ `rejected`（非承認）

---

## 実装の前提条件

### 1. ValueCommerce アカウント

- ✅ ValueCommerceメディア会員登録済み
- ✅ サイト審査通過
- ✅ 広告主提携完了（最低1件以上）

### 2. API認証情報

**ValueCommerce管理画面から取得:**

1. 「ツール」→「Webサービス」→「OAuth認証情報」
2. 以下の4つの情報を控える:
   - Consumer Key
   - Consumer Secret
   - Access Token
   - Access Token Secret

**環境変数設定（`.env.local`）:**

```bash
VALUECOMMERCE_CONSUMER_KEY=your_consumer_key
VALUECOMMERCE_CONSUMER_SECRET=your_consumer_secret
VALUECOMMERCE_ACCESS_TOKEN=your_access_token
VALUECOMMERCE_ACCESS_TOKEN_SECRET=your_access_token_secret
```

### 3. 技術要件

**Node.js パッケージ:**
- `oauth-1.0a` - OAuth 1.0a 署名生成
- `xml2js` - XMLレスポンスのパース
- `axios` - HTTPクライアント

**インストール:**

```bash
npm install oauth-1.0a xml2js axios
npm install --save-dev @types/oauth-1.0a @types/xml2js
```

### 4. Google Sheets準備

**クリックログシート:**
- 列構成: A=日時, B=会員ID, C=案件名, D=案件ID, E=eventId

**成果CSV_RAWシート:**
- 列構成: A=日時, B=会員ID, C=eventId, D=案件名, E=ASP名, F=報酬額, G=ステータス, H=注文ID

---

## 実装アーキテクチャ

### データフロー

```
[1. ユーザークリック]
    ↓
[2. /api/track-click]
    - sid={memberId} 付きリンク生成
    - Google Sheets「クリックログ」に記録
    ↓
[3. ValueCommerce管理画面]
    - 成果発生・承認処理
    ↓
[4. 定期ポーリング（10分間隔）]
    - Vercel Cron Job: /api/cron/valuecommerce-sync
    - 注文レポートAPI呼び出し（過去24時間の成果取得）
    ↓
[5. 成果データ処理]
    - XMLパース
    - clickId（sid）とクリックログ照合
    - メンバーID識別
    ↓
[6. Google Sheets書き込み]
    - 「成果CSV_RAW」に追記
    - 重複チェック（orderNumber）
    ↓
[7. GAS自動処理（毎日3:10）]
    - 「成果データ」シート出力
    ↓
[8. メンバーダッシュボード]
```

### ファイル構成（予定）

```
lib/
├── valuecommerce-api.ts          # API統合ロジック
│   ├── generateOAuthSignature()  # OAuth 1.0a 署名生成
│   ├── fetchOrderReport()        # 注文レポート取得
│   └── parseOrderReportXML()     # XML → JSON変換

app/api/cron/valuecommerce-sync/
└── route.ts                      # 定期同期Cronジョブ

types/
└── valuecommerce.ts              # 型定義
    ├── OrderReportRequest
    ├── OrderReportResponse
    └── Order
```

### Cron Job設定

**Vercel Cron（vercel.json）:**

```json
{
  "crons": [
    {
      "path": "/api/cron/valuecommerce-sync",
      "schedule": "*/10 * * * *"
    }
  ]
}
```

**実行頻度:** 10分間隔（1日144回）
**レート制限:** 1,000リクエスト/日 → 144回は許容範囲内

---

## 次のステップ

### Step 1: 認証設定

👉 [authentication-setup.md](./authentication-setup.md)

**内容:**
- OAuth 1.0a 署名生成の実装
- API認証のテスト
- エラーハンドリング

### Step 2: 注文レポートAPI実装

👉 [order-api-guide.md](./order-api-guide.md)

**内容:**
- API統合ロジックの実装
- XMLパース処理
- Click ID照合ロジック
- Google Sheets統合

### Step 3: トラブルシューティング

👉 [troubleshooting.md](./troubleshooting.md)

**内容:**
- よくあるエラーと対処法
- デバッグ手法
- 運用監視のポイント

---

## 参考リンク

### 公式ドキュメント

- [ValueCommerce Webサービス公式ドキュメント](https://www.valuecommerce.ne.jp/webservice/)
- [注文レポートAPI仕様](https://www.valuecommerce.ne.jp/webservice/order-report-api/)
- [OAuth 1.0a 認証ガイド](https://www.valuecommerce.ne.jp/webservice/oauth/)

### WIN×Ⅱ関連ドキュメント

- [ASP統合プロジェクト概要](../README.md)
- [ASP比較レポート](../asp-comparison-report.md)
- [AFB実装ガイド](../afb-implementation-guide.md)（参考実装）

---

## 評価スコア詳細

**総合スコア: 32/40点（Phase 2推奨）**

| 評価項目 | 配点 | 獲得点 | 理由 |
|---------|------|--------|------|
| 自動化レベル | 10点 | 7点 | 定期ポーリング（10分間隔）、Webhook非対応 |
| 会員別トラッキング精度 | 10点 | 10点 | `sid` パラメータで完全対応 |
| 実装難易度 | 5点 | 2点 | OAuth 1.0a 署名生成が必要 |
| ドキュメント品質 | 5点 | 5点 | 公式ドキュメント充実、実装例あり |
| ビジネス価値 | 4点 | 4点 | 大手EC案件、高報酬案件多数 |
| レスポンス速度 | 3点 | 2点 | 10分間隔ポーリング（最短） |
| エラーハンドリング | 3点 | 2点 | レート制限あり、XML解析エラーリスク |

**結論:** AFB完了後の次期実装として最適。OAuth認証の複雑性はあるが、ビジネス価値と精度が高い。

---

_Last Updated: 2025-01-04_
_Document Version: 1.0.0_
_Maintained by: WIN×Ⅱ Development Team_