# ValueCommerce OAuth 1.0a 認証設定ガイド

**最終更新日:** 2025-01-04
**必要な権限:** ValueCommerceメディア会員（サイト審査通過済み）
**所要時間:** 15-20分

---

## 目次

1. [OAuth 1.0a とは](#oauth-10a-とは)
2. [認証情報の取得手順](#認証情報の取得手順)
3. [環境変数設定](#環境変数設定)
4. [署名生成のテスト](#署名生成のテスト)
5. [よくある認証エラー](#よくある認証エラー)
6. [セキュリティベストプラクティス](#セキュリティベストプラクティス)

---

## OAuth 1.0a とは

### 概要

**OAuth 1.0a** は、APIリクエストに対して「署名」を付与することで、リクエストの正当性を証明する認証プロトコルです。

**特徴:**
- リクエストごとに一意の署名を生成
- Consumer Secret と Access Token Secret を使用した暗号化
- タイムスタンプ・Nonce（一度きりの値）による再送攻撃防止

**ValueCommerceでの利用:**
- 注文レポートAPI
- 広告検索API
- MyLinkAPI

### 必要な認証情報（4つ）

| 項目 | 説明 | 取得元 |
|------|------|--------|
| **Consumer Key** | アプリケーション識別子 | ValueCommerce管理画面 |
| **Consumer Secret** | Consumer Keyの秘密鍵 | ValueCommerce管理画面 |
| **Access Token** | ユーザー認証トークン | ValueCommerce管理画面 |
| **Access Token Secret** | Access Tokenの秘密鍵 | ValueCommerce管理画面 |

**重要:** これらの情報は **絶対に公開しない** でください。環境変数で管理します。

---

## 認証情報の取得手順

### Step 1: ValueCommerce管理画面にログイン

1. [ValueCommerce メディア会員管理画面](https://aff.valuecommerce.ne.jp/) にアクセス
2. メールアドレスとパスワードでログイン

### Step 2: Webサービス設定画面へ移動

1. 画面上部メニューから **「ツール」** をクリック
2. ドロップダウンメニューから **「Webサービス」** を選択
3. 「OAuth認証情報」セクションへスクロール

### Step 3: 認証情報の確認・生成

**初回利用の場合:**
1. 「OAuth認証情報を生成」ボタンをクリック
2. 確認ダイアログで「OK」をクリック
3. 4つの認証情報が表示される

**既に生成済みの場合:**
1. 「認証情報を表示」ボタンをクリック
2. パスワード再入力を求められる場合がある
3. 4つの認証情報が表示される

### Step 4: 認証情報のコピー

以下の4つの値を **安全な場所** にコピーしてください：

```
Consumer Key: vc_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Consumer Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Access Token: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Access Token Secret: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**注意事項:**
- ⚠️ この情報は画面を閉じると再表示できない場合があります
- ⚠️ 紛失した場合は再生成が必要（既存のAPIリクエストが無効化される）
- ⚠️ スクリーンショットは取らず、パスワードマネージャーに保存推奨

---

## 環境変数設定

### ローカル開発環境（.env.local）

プロジェクトルートの `.env.local` ファイルに以下を追加：

```bash
# ValueCommerce OAuth 1.0a 認証情報
VALUECOMMERCE_CONSUMER_KEY=vc_your_consumer_key_here
VALUECOMMERCE_CONSUMER_SECRET=your_consumer_secret_here
VALUECOMMERCE_ACCESS_TOKEN=your_access_token_here
VALUECOMMERCE_ACCESS_TOKEN_SECRET=your_access_token_secret_here
```

**重要:**
- `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません
- 各値は改行なし、スペースなしで入力

### 本番環境（Vercel）

Vercel Dashboardまたはコマンドラインで設定：

#### 方法1: Vercel Dashboard

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. 「Settings」→「Environment Variables」
4. 以下の4つの変数を追加:
   - Key: `VALUECOMMERCE_CONSUMER_KEY`、Value: `（コピーした値）`、Environment: `Production`
   - Key: `VALUECOMMERCE_CONSUMER_SECRET`、Value: `（コピーした値）`、Environment: `Production`
   - Key: `VALUECOMMERCE_ACCESS_TOKEN`、Value: `（コピーした値）`、Environment: `Production`
   - Key: `VALUECOMMERCE_ACCESS_TOKEN_SECRET`、Value: `（コピーした値）`、Environment: `Production`

#### 方法2: Vercel CLI

```bash
vercel env add VALUECOMMERCE_CONSUMER_KEY production
# プロンプトで値を入力

vercel env add VALUECOMMERCE_CONSUMER_SECRET production
# プロンプトで値を入力

vercel env add VALUECOMMERCE_ACCESS_TOKEN production
# プロンプトで値を入力

vercel env add VALUECOMMERCE_ACCESS_TOKEN_SECRET production
# プロンプトで値を入力
```

### 環境変数の確認

```bash
# ローカル環境
echo $VALUECOMMERCE_CONSUMER_KEY

# Vercel環境
vercel env ls
```

---

## 署名生成のテスト

### 1. テストスクリプト作成

**ファイル:** `scripts/test-valuecommerce-auth.js`

```javascript
const OAuth = require("oauth-1.0a");
const crypto = require("crypto");
const axios = require("axios");

// 環境変数から認証情報取得
const config = {
  consumerKey: process.env.VALUECOMMERCE_CONSUMER_KEY || "",
  consumerSecret: process.env.VALUECOMMERCE_CONSUMER_SECRET || "",
  accessToken: process.env.VALUECOMMERCE_ACCESS_TOKEN || "",
  accessTokenSecret: process.env.VALUECOMMERCE_ACCESS_TOKEN_SECRET || "",
};

// OAuth 1.0a インスタンス作成
const oauth = new OAuth({
  consumer: {
    key: config.consumerKey,
    secret: config.consumerSecret,
  },
  signature_method: "HMAC-SHA1",
  hash_function(base_string, key) {
    return crypto.createHmac("sha1", key).update(base_string).digest("base64");
  },
});

const token = {
  key: config.accessToken,
  secret: config.accessTokenSecret,
};

// テストリクエスト
const testRequest = {
  url: "https://webservice.valuecommerce.ne.jp/OrderReport",
  method: "GET",
  data: {
    start_date: "2025-01-01",
    end_date: "2025-01-04",
    count: 1,
  },
};

// OAuth署名生成
const authHeader = oauth.toHeader(oauth.authorize(testRequest, token));

console.log("=== OAuth 1.0a Authentication Test ===");
console.log("Request URL:", testRequest.url);
console.log("Authorization Header:", authHeader["Authorization"]);
console.log("\n=== Sending Test Request ===");

// API呼び出し
const url = new URL(testRequest.url);
Object.entries(testRequest.data).forEach(([key, value]) => {
  url.searchParams.append(key, String(value));
});

axios
  .get(url.toString(), {
    headers: {
      Authorization: authHeader["Authorization"],
      Accept: "application/xml",
    },
    timeout: 30000,
  })
  .then((response) => {
    console.log("✅ Success! Status:", response.status);
    console.log("Response (first 500 chars):", response.data.substring(0, 500));
  })
  .catch((error) => {
    console.error("❌ Error:", error.response?.status, error.response?.statusText);
    console.error("Response data:", error.response?.data);
  });
```

### 2. テスト実行

```bash
# 依存パッケージインストール（初回のみ）
npm install oauth-1.0a crypto axios

# テスト実行
node scripts/test-valuecommerce-auth.js
```

### 3. 成功パターン

```
=== OAuth 1.0a Authentication Test ===
Request URL: https://webservice.valuecommerce.ne.jp/OrderReport
Authorization Header: OAuth oauth_consumer_key="vc_...", oauth_nonce="...", oauth_signature="...", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1704364800", oauth_token="...", oauth_version="1.0"

=== Sending Test Request ===
✅ Success! Status: 200
Response (first 500 chars): <?xml version="1.0" encoding="UTF-8"?><orderReport><orders><order>...</order></orders></orderReport>
```

### 4. 失敗パターン

**401 Unauthorized:**
```
❌ Error: 401 Unauthorized
Response data: Invalid signature
```

→ 認証情報が間違っている可能性があります。[よくある認証エラー](#よくある認証エラー) を参照してください。

---

## よくある認証エラー

### エラー1: `401 Unauthorized - Invalid signature`

**原因:**
- Consumer Secret または Access Token Secret が間違っている
- 署名アルゴリズムの実装ミス

**対処法:**
1. 環境変数の値を再確認（コピペミス、スペース混入）
2. ValueCommerce管理画面で認証情報を再確認
3. 必要に応じて認証情報を再生成

```bash
# 環境変数の確認
echo "Consumer Key: $VALUECOMMERCE_CONSUMER_KEY"
echo "Consumer Secret: ${VALUECOMMERCE_CONSUMER_SECRET:0:10}..." # 最初の10文字のみ表示
```

### エラー2: `401 Unauthorized - Invalid consumer key`

**原因:**
- Consumer Key が間違っている
- Consumer Keyが無効化されている

**対処法:**
1. Consumer Key を再確認（特に `vc_` プレフィックスの有無）
2. ValueCommerce管理画面で認証情報が有効か確認
3. 別のValueCommerceアカウントの認証情報を使用していないか確認

### エラー3: `401 Unauthorized - Invalid access token`

**原因:**
- Access Token が期限切れ
- Access Token が間違っている

**対処法:**
1. ValueCommerce管理画面で認証情報を再生成
2. 新しい Access Token と Access Token Secret を環境変数に設定
3. アプリケーションを再起動

### エラー4: `403 Forbidden`

**原因:**
- APIへのアクセス権限がない
- サイト審査が未承認

**対処法:**
1. ValueCommerceメディア会員のサイト審査状況を確認
2. 必要な広告主と提携済みか確認
3. ValueCommerceサポートに問い合わせ

### エラー5: `429 Too Many Requests`

**原因:**
- レート制限超過（1,000リクエスト/日）

**対処法:**
1. Cron頻度を減らす（10分間隔 → 15分間隔）
2. 過去にテストで大量リクエストを送信していないか確認
3. 翌日まで待機（レート制限は日次リセット）

### エラー6: `500 Internal Server Error`

**原因:**
- ValueCommerce API側の一時的な障害
- 不正なリクエストパラメータ

**対処法:**
1. 数分待ってから再試行
2. リクエストパラメータを確認（日付形式、範囲など）
3. ValueCommerceのお知らせページで障害情報を確認

---

## セキュリティベストプラクティス

### 1. 認証情報の保護

**絶対にやってはいけないこと:**
- ❌ Gitにコミット
- ❌ Slackなどのチャットツールに貼り付け
- ❌ スクリーンショットをクラウドに保存
- ❌ クライアントサイドコード（ブラウザ）で使用

**推奨する保管方法:**
- ✅ 環境変数（`.env.local`, Vercel Environment Variables）
- ✅ パスワードマネージャー（1Password, LastPassなど）
- ✅ チーム内共有が必要な場合は暗号化ツール使用

### 2. 環境変数の命名規則

```bash
# ❌ 悪い例（本番環境の認証情報が漏洩する）
VALUECOMMERCE_CONSUMER_KEY=vc_production_key_here

# ✅ 良い例（環境ごとに分離）
# .env.local（開発環境）
VALUECOMMERCE_CONSUMER_KEY=vc_dev_key_here

# Vercel Production（本番環境）
VALUECOMMERCE_CONSUMER_KEY=vc_prod_key_here
```

### 3. アクセス制限

**Vercel環境変数の設定:**
- Production環境とPreview環境で異なる認証情報を使用
- 開発用のValueCommerceアカウントを別途作成（推奨）

**ローカル開発:**
- `.env.local.example` ファイルを作成（値は空）
- チームメンバーは各自の認証情報を設定

```bash
# .env.local.example（Gitにコミット可）
VALUECOMMERCE_CONSUMER_KEY=
VALUECOMMERCE_CONSUMER_SECRET=
VALUECOMMERCE_ACCESS_TOKEN=
VALUECOMMERCE_ACCESS_TOKEN_SECRET=
```

### 4. 定期的なローテーション

**推奨頻度:**
- 3-6ヶ月ごとに認証情報を再生成
- 開発メンバーの退職時
- 漏洩の疑いがある場合は即座に再生成

**再生成手順:**
1. ValueCommerce管理画面で新しい認証情報を生成
2. 環境変数を更新（ローカル + Vercel）
3. アプリケーションを再デプロイ
4. 旧認証情報の無効化を確認

### 5. ログ出力の注意

**悪い例:**
```typescript
console.log("OAuth config:", config); // ❌ 秘密鍵が丸見え
```

**良い例:**
```typescript
console.log("OAuth config:", {
  consumerKey: config.consumerKey, // ✅ Keyは公開情報
  consumerSecretSet: !!config.consumerSecret, // ✅ 存在確認のみ
  accessTokenSet: !!config.accessToken,
  accessTokenSecretSet: !!config.accessTokenSecret,
}); // 出力: { consumerKey: "vc_...", consumerSecretSet: true, ... }
```

---

## 次のステップ

### 認証設定完了後

1. ✅ [注文レポートAPI実装ガイド](./order-api-guide.md) へ進む
2. ✅ テストリクエストを送信して動作確認
3. ✅ Cronジョブの設定

### トラブルシューティング

認証エラーが解決しない場合:
- [troubleshooting.md](./troubleshooting.md) を参照
- ValueCommerceサポートに問い合わせ（メール: support@valuecommerce.ne.jp）

---

## 参考リンク

- [ValueCommerce Webサービス公式ドキュメント](https://www.valuecommerce.ne.jp/webservice/)
- [OAuth 1.0a 仕様（RFC 5849）](https://tools.ietf.org/html/rfc5849)
- [oauth-1.0a npmパッケージ](https://www.npmjs.com/package/oauth-1.0a)

---

_Last Updated: 2025-01-04_
_Document Version: 1.0.0_
_Maintained by: WIN×Ⅱ Development Team_
