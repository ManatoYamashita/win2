# 環境変数設定ガイド（AFB自動ポーリング）

## 概要

AFB自動ポーリング機能を有効化するため、以下の環境変数を設定する必要があります：

1. **GitHub Secrets**: GitHub Actions用の認証情報
2. **Vercel環境変数**: Next.js API用のAFB認証情報

---

## GitHub Secrets設定

### 設定する環境変数

| 変数名 | 説明 | 例 |
|--------|------|-----|
| `CRON_SECRET` | GitHub Actions → API認証用シークレット | ランダム文字列（32文字以上推奨） |
| `APP_URL` | VercelデプロイURL | `https://win2.vercel.app` |

### 設定手順

#### Step 1: GitHubリポジトリにアクセス

1. https://github.com/ManatoYamashita/win2 にアクセス
2. `Settings` タブをクリック

#### Step 2: Secrets設定画面を開く

1. 左サイドバー: `Secrets and variables` → `Actions` をクリック
2. `Repository secrets` セクションを確認

#### Step 3: CRON_SECRET生成と設定

**CRON_SECRET生成方法:**

**Option 1: OpenSSLコマンド（推奨）**
```bash
openssl rand -base64 32
```

**Option 2: Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: オンラインツール**
- https://www.random.org/strings/?num=1&len=32&digits=on&upperalpha=on&loweralpha=on&format=plain

**設定手順:**
1. `New repository secret` ボタンをクリック
2. Name: `CRON_SECRET`
3. Secret: 生成したランダム文字列（32文字以上）
4. `Add secret` ボタンをクリック

#### Step 4: APP_URL設定

1. `New repository secret` ボタンをクリック
2. Name: `APP_URL`
3. Secret: `https://win2.vercel.app`（本番環境URL）
4. `Add secret` ボタンをクリック

#### Step 5: 設定確認

以下の2つのSecretsが表示されていることを確認：

```
CRON_SECRET    ******* (hidden)
APP_URL        ******* (hidden)
```

---

## Vercel環境変数設定

### 設定する環境変数

| 変数名 | 説明 | 取得方法 |
|--------|------|---------|
| `CRON_SECRET` | GitHub Actionsと同じ値 | 上記で生成したCRON_SECRETをコピー |
| `AFB_PARTNER_ID` | AFBパートナーID | AFB管理画面から取得 |
| `AFB_API_KEY` | AFB APIキー | AFB管理画面から取得 |

### 設定手順

#### Step 1: Vercel Project設定画面にアクセス

1. https://vercel.com にログイン
2. `win2` プロジェクトを選択
3. `Settings` タブをクリック

#### Step 2: Environment Variables画面を開く

1. 左サイドバー: `Environment Variables` をクリック

#### Step 3: CRON_SECRET設定

1. `Add New` ボタンをクリック
2. Key: `CRON_SECRET`
3. Value: GitHub Secretsで設定した同じ値を貼り付け
4. Environments: `Production`, `Preview`, `Development` すべてにチェック
5. `Save` ボタンをクリック

#### Step 4: AFB_PARTNER_ID設定

**AFB管理画面からパートナーIDを取得:**

1. AFB管理画面にログイン
2. アカウント情報またはAPI設定ページにアクセス
3. `パートナーID`をコピー

**Vercelに設定:**

1. `Add New` ボタンをクリック
2. Key: `AFB_PARTNER_ID`
3. Value: AFBパートナーID（例: `1234567`）
4. Environments: `Production`, `Preview`, `Development` すべてにチェック
5. `Save` ボタンをクリック

#### Step 5: AFB_API_KEY設定

**AFB管理画面からAPIキーを取得:**

1. AFB管理画面にログイン
2. API設定ページにアクセス
3. `APIキー`をコピー（または新規生成）

**Vercelに設定:**

1. `Add New` ボタンをクリック
2. Key: `AFB_API_KEY`
3. Value: AFB APIキー（例: `abcdef1234567890`）
4. Environments: `Production`, `Preview`, `Development` すべてにチェック
5. `Save` ボタンをクリック

#### Step 6: 設定確認

以下の3つの環境変数が表示されていることを確認：

```
CRON_SECRET        Production, Preview, Development
AFB_PARTNER_ID     Production, Preview, Development
AFB_API_KEY        Production, Preview, Development
```

---

## 設定値のバックアップ

### セキュアな保管方法

**推奨方法:**
1. パスワードマネージャー（1Password, Bitwarden等）に保管
2. 暗号化されたドキュメントに記録

**保管すべき情報:**
```
CRON_SECRET: [生成した値]
APP_URL: https://win2.vercel.app
AFB_PARTNER_ID: [AFBパートナーID]
AFB_API_KEY: [AFB APIキー]
```

**⚠️ 注意: これらの値は絶対にGitHubリポジトリにコミットしないでください！**

---

## 既存環境変数との統合

WIN×Ⅱでは既に以下の環境変数が設定されています：

### Google Sheets API

```
GOOGLE_SHEETS_CLIENT_EMAIL
GOOGLE_SHEETS_PRIVATE_KEY
GOOGLE_SHEETS_SPREADSHEET_ID
```

### microCMS

```
MICROCMS_SERVICE_DOMAIN
MICROCMS_API_KEY
```

### Next-Auth

```
NEXTAUTH_URL
NEXTAUTH_SECRET
```

### Resend (Email)

```
RESEND_VALID
RESEND_API_KEY
RESEND_FROM_EMAIL
```

**新しく追加する環境変数（AFB自動ポーリング用）:**
```
CRON_SECRET
AFB_PARTNER_ID
AFB_API_KEY
```

---

## 環境変数設定後のデプロイ

### Vercel自動デプロイ

環境変数を追加した後、Vercelは自動的に再デプロイを行います：

1. Environment Variables画面で `Save` をクリック
2. Vercelが自動的に再デプロイを開始
3. `Deployments` タブで進捗を確認
4. デプロイ完了後、環境変数が反映される

### 手動デプロイ（必要な場合）

1. Vercel Project画面のトップに戻る
2. `Deployments` タブをクリック
3. 最新のコミットを選択
4. `Redeploy` ボタンをクリック

---

## 動作確認

### Step 1: GitHub Actions手動実行

1. GitHubリポジトリにアクセス
2. `Actions` タブをクリック
3. `AFB成果データ同期` workflowを選択
4. `Run workflow` ドロップダウンをクリック
5. `Run workflow` ボタンをクリック

### Step 2: 実行ログ確認

1. 実行中のworkflowをクリック
2. `sync-afb-conversions` jobをクリック
3. `Trigger AFB Sync API` ステップのログを確認

**正常時のログ:**
```
🚀 Starting AFB成果データ同期...
📊 HTTP Status: 200
📄 Response: {"success":true,"message":"AFB API polling completed successfully","summary":{...}}
✅ AFB同期が正常に完了しました
```

**エラー時のログ:**
```
❌ AFB同期に失敗しました (HTTP 401)
```

### Step 3: Google Sheets確認

1. Google Sheets「成果CSV_RAW」シートにアクセス
2. AFBの成果データが記録されていることを確認
3. C列（aspName）が「afb」であることを確認

---

## トラブルシューティング

### エラー: "Server configuration error" (HTTP 500)

**原因**: Vercel環境変数にCRON_SECRETが設定されていない

**解決策**:
1. Vercel Project Settings → Environment Variables
2. CRON_SECRETが設定されているか確認
3. 設定されていない場合は追加
4. 再デプロイ

### エラー: "Unauthorized" (HTTP 401)

**原因**: GitHub SecretsのCRON_SECRETとVercel環境変数のCRON_SECRETが一致していない

**解決策**:
1. GitHub Secrets: CRON_SECRETの値を確認
2. Vercel環境変数: CRON_SECRETの値を確認
3. 値が一致するように修正
4. Vercel再デプロイ

### エラー: AFB APIエラー

**原因**: AFB_PARTNER_IDまたはAFB_API_KEYが間違っている

**解決策**:
1. AFB管理画面でパートナーIDとAPIキーを再確認
2. Vercel環境変数を修正
3. 再デプロイ

---

## セキュリティベストプラクティス

### 1. 環境変数のローテーション

**推奨頻度:**
- CRON_SECRET: 6ヶ月毎
- AFB_API_KEY: AFB公式推奨に従う

**ローテーション手順:**
1. 新しい値を生成
2. GitHub SecretsとVercel環境変数を更新
3. Vercel再デプロイ
4. 動作確認

### 2. アクセス制限

**GitHub Secrets:**
- リポジトリの`Settings` → `Actions` → `General`
- `Fork pull request workflows from outside collaborators` を `Require approval for all outside collaborators` に設定

**Vercel環境変数:**
- `Production`環境のみに設定し、`Preview`/`Development`は別の値を使用（推奨）

### 3. 監査ログ

**GitHub:**
- Organization Audit Log（Enterprise Planの場合）

**Vercel:**
- Project Settings → Logs → Activity

---

## 関連ドキュメント

- `.env.example` - 環境変数テンプレート
- `docs/operations/afb-a8-hybrid-workflow.md` - 運用マニュアル
- `.github/workflows/afb-sync.yml` - GitHub Actions設定
- `app/api/cron/sync-afb-conversions/route.ts` - API実装

---

**作成日**: 2025-11-15
**最終更新**: 2025-11-15
**ステータス**: 完成
