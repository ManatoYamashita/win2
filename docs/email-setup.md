# Email送信設定ガイド

WIN×Ⅱプロジェクトのメール送信機能（Phase 2-1）の設定手順とロードマップ

## 現状（開発環境）

### 使用サービス: Resend

- **公式サイト:** https://resend.com
- **Next.js公式推奨:** React Email + Resend の組み合わせ
- **料金:** 月3,000通まで無料

### 開発環境の制限事項

現在、独自ドメインを取得していないため、以下の制限があります：

- ✅ 開発用メールアドレス `onboarding@resend.dev` を使用
- ⚠️ **自分のメールアドレスにのみ送信可能**
- ⚠️ 送信数に制限あり
- ❌ 本番環境での使用は不可

## 開発環境セットアップ手順

### Step 1: Resendアカウント作成

1. https://resend.com にアクセス
2. GitHub または Google アカウントでサインアップ
3. ダッシュボードにアクセス

### Step 2: API Key取得

1. Resend ダッシュボードで **API Keys** メニューを選択
2. **Create API Key** をクリック
3. 名前を入力（例: `WIN2-Development`）
4. Permission: `Sending access` を選択
5. **Create** をクリックしてキーをコピー

### Step 3: 環境変数設定

プロジェクトルートに `.env.local` ファイルを作成（または追記）：

```bash
# Phase 2: Email Verification & Password Reset

# Resend API Key（Step 2で取得したキー）
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx

# 送信元メールアドレス（開発環境用）
RESEND_FROM_EMAIL=onboarding@resend.dev

# JWT Secret（パスワードリセット・メール認証用）
# 生成コマンド: openssl rand -base64 32
JWT_SECRET=your_super_secret_jwt_key_here_change_me

# アプリケーションURL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**重要:** `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

### Step 4: JWT Secret生成

ターミナルで以下のコマンドを実行：

```bash
openssl rand -base64 32
```

出力された文字列を `.env.local` の `JWT_SECRET` に設定してください。

### Step 5: 開発サーバー再起動

環境変数を読み込むため、開発サーバーを再起動：

```bash
# 既存のサーバーを停止（Ctrl+C）
npm run dev
```

## メール送信テスト

### 1. 会員登録テスト

1. http://localhost:3000/register にアクセス
2. **自分のメールアドレス**で新規登録
3. 登録完了後、メールボックスを確認
4. 認証メールが届く → リンクをクリックして認証完了

### 2. パスワードリセットテスト

1. http://localhost:3000/login にアクセス
2. 「パスワードをお忘れですか？」をクリック
3. **登録済みのメールアドレス**を入力
4. メールボックスを確認
5. リセットメールが届く → リンクをクリックして新パスワード設定

### 3. メール再送信テスト

1. 認証前のアカウントでログイン
2. http://localhost:3000/mypage にアクセス
3. 黄色の警告バナーが表示される
4. 「認証メールを再送信」ボタンをクリック
5. メールボックスを確認

## トラブルシューティング

### メールが届かない

**確認項目:**
1. `.env.local` の `RESEND_API_KEY` が正しく設定されているか
2. 送信先が**自分のメールアドレス**か（他人には送れません）
3. 迷惑メールフォルダを確認
4. Resendの送信制限に達していないか（ダッシュボードで確認）

**デバッグ方法:**
サーバーのコンソールログを確認：

```
Verification email sent to example@example.com, messageId: xxxxxx
```

このログが出ていれば、Resend API呼び出しは成功しています。

### JWT_SECRET が設定されていないエラー

```
Error: JWT_SECRET environment variable is not set
```

**解決策:**
1. `.env.local` に `JWT_SECRET` を追加
2. 開発サーバーを再起動（`npm run dev`）

### Resend API エラー

```
Resend API error: { message: "..." }
```

**よくある原因:**
1. API Keyが無効または期限切れ → 新しいキーを生成
2. 送信元メールアドレスが未検証 → `onboarding@resend.dev` を使用
3. 送信先が自分のメールアドレス以外 → 開発環境では自分宛のみ

## 将来の本番環境移行計画

### Phase 1: ドメイン取得（優先度: HIGH）

**推奨タイミング:** Phase 2完了前、または Phase 3開始前

**推奨ドメインレジストラ:**

1. **お名前.com**（日本）
   - 料金: 年間1,000円程度（.com）
   - 日本語サポート
   - 支払い: クレジットカード、コンビニ決済

2. **Vercel Domains**
   - 料金: 年間$15程度
   - Vercel統合で簡単
   - 自動HTTPS、DNS管理も統合

3. **Cloudflare Registrar**
   - 料金: 原価販売（安い）
   - Cloudflare CDN統合
   - 高速DNS

**推奨ドメイン名:**
- `win2-affiliate.com`
- `win2.jp`
- `win-square.com`

### Phase 2: Resendドメイン検証

ドメイン取得後、以下の手順でResendにドメインを追加：

1. Resend ダッシュボードで **Domains** メニューを選択
2. **Add Domain** をクリック
3. 取得したドメイン（例: `win2-affiliate.com`）を入力
4. DNS設定を追加（TXTレコード、MXレコード）
5. 検証完了を確認

**DNS設定例:**

| Type | Name | Value |
|------|------|-------|
| TXT  | @    | resend-verify=xxxxxx |
| MX   | @    | feedback-smtp.us-east-1.amazonses.com |

### Phase 3: 環境変数更新

本番環境（Vercel）の環境変数を更新：

```bash
# 本番環境用
RESEND_FROM_EMAIL=noreply@win2-affiliate.com

# または
RESEND_FROM_EMAIL=support@win2-affiliate.com
```

**注意:** `RESEND_API_KEY` と `JWT_SECRET` は開発環境と本番環境で別々に管理してください。

### Phase 4: 本番テスト

1. Vercelにデプロイ
2. 本番環境で会員登録テスト
3. メール送信が成功することを確認
4. SPF/DKIM設定の確認（メール到達率向上）

## メール送信の技術仕様

### 送信メールの種類

| メール種類 | 送信タイミング | トークン有効期限 | テンプレート |
|-----------|--------------|----------------|------------|
| 認証メール | 会員登録時 | 24時間 | `emails/verification-email.tsx` |
| 認証再送信 | 再送信リクエスト | 24時間 | `emails/verification-email.tsx` |
| パスワードリセット | リセットリクエスト | 1時間 | `emails/password-reset-email.tsx` |
| リセット完了通知 | パスワード変更後 | - | `lib/email.ts:139-174` |

### メールテンプレート

**使用フレームワーク:** React Email v3.0.0

**ブランディング:**
- メインカラー: Orange-600 (`#ea580c`)
- フォント: システムフォント（Apple, Segoe UI, Roboto）
- レスポンシブデザイン対応

**テンプレートファイル:**
- `emails/verification-email.tsx` - メール認証用
- `emails/password-reset-email.tsx` - パスワードリセット用

### セキュリティ仕様

**JWT トークン:**
- アルゴリズム: HS256
- Secret: 環境変数 `JWT_SECRET`（32バイト以上推奨）
- Payload: `{ email, type, iat, exp }`

**トークン検証:**
- 期限切れチェック
- 署名検証
- タイプチェック（email-verification / password-reset）

**パスワードハッシュ:**
- アルゴリズム: bcrypt
- Salt Rounds: 10

## 参考リンク

- [Resend公式ドキュメント](https://resend.com/docs)
- [React Email公式ドキュメント](https://react.email/docs)
- [Next.js環境変数ガイド](https://nextjs.org/docs/basic-features/environment-variables)
- [JWT公式サイト](https://jwt.io/)

## 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2025-10-25 | 1.0.0 | 初版作成（開発環境用設定） |

---

**最終更新:** 2025-10-25
**担当:** Claude Code (Sonnet 4.5)
**ステータス:** 開発環境用設定完了、本番環境移行待ち
