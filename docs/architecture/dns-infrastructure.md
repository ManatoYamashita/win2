# DNS Infrastructure & Email Service Architecture

## 概要

WIN×Ⅱプロジェクトは、Wix.comでドメイン登録を行い、Vercelでホスティングする構成を採用しています。この構成におけるDNS制限により、メール送信サービス（Resend）の完全な統合が制限されているため、環境変数によるフィーチャーフラグで機能を制御しています。

## 現在のアーキテクチャ

### ドメイン管理: Wix.com

- **ドメインレジストラ:** Wix.com
- **DNS管理:** Wix DNS Manager
- **制限事項:**
  - MXレコードはWixが指定したメールサービスのみ設定可能
  - NSレコードの書き換えは禁止（Wixの管理下に固定）
  - Resendなどのサードパーティメールサービスに必要なMXレコードを設定できない

### ホスティング: Vercel

- **デプロイ先:** Vercel
- **接続方法:**
  - CNAMEレコード: `www` → `cname.vercel-dns.com`
  - Aレコード: `@` → Vercelが指定するIPアドレス
- **動作:** 正常にWebサイトが公開されている

### DNS設定の詳細

```
# Wix DNSで設定されているレコード（例）
Type    Name    Value                      TTL
A       @       76.76.21.21                3600
CNAME   www     cname.vercel-dns.com       3600
MX      @       mx.wix.com                 3600  # Wix固定、変更不可
TXT     @       "v=spf1 include:wix.com ~all"    # Wix固定
```

## メール送信機能の制限

### Resendの要件

Resend（および多くのメール送信サービス）を完全に統合するには、以下のDNSレコードが必要です：

1. **MXレコード:** メール受信用（必須）
2. **SPFレコード (TXT):** 送信元認証
3. **DKIMレコード (TXT):** メール署名
4. **DMARCレコード (TXT):** メール認証ポリシー

### Wixの制限

- **MXレコード:** Wix指定のメールサービス（mx.wix.com等）のみ設定可能
- **NSレコード:** 変更不可（他のDNSプロバイダーに委譲できない）
- **結果:** Resendの完全な統合が不可能

## 実装した解決策: フィーチャーフラグ

### 環境変数による制御

```env
# .env.local / .env.example
RESEND_VALID=false  # デフォルト: false（メール機能無効）
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 動作パターン

#### パターンA: `RESEND_VALID=false`（デフォルト、現在の構成）

**会員登録:**
- メール認証をスキップ
- `emailVerified=true` で即座に登録完了
- 認証メール送信なし

**パスワードリセット:**
- API呼び出し時に503エラー返却
- エラーメッセージ: 「パスワードリセット機能は現在利用できません」

**メール認証再送信:**
- API呼び出し時に503エラー返却
- エラーメッセージ: 「メール認証機能は現在利用できません」

**フロントエンド表示:**
- マイページにメール未認証バナー非表示（全員が認証済みのため）
- forgot-passwordページでAPIエラーが適切に表示される

#### パターンB: `RESEND_VALID=true`（将来的にDNS制限が解決された場合）

**会員登録:**
- 認証メール自動送信
- `emailVerified=false` で登録
- ユーザーがメール内リンクをクリックして認証完了

**パスワードリセット:**
- リセットメール自動送信
- メール内リンクから新パスワード設定

**メール認証再送信:**
- 認証メール再送信可能

## 影響を受ける機能

### 完全に無効化される機能（RESEND_VALID=false）

1. **メール認証**
   - 新規会員登録時の自動送信
   - 手動再送信（/api/resend-verification）

2. **パスワードリセット**
   - forgot-password経由の自動送信
   - reset-password経由のパスワード変更

3. **パスワード変更完了通知**
   - セキュリティ通知メール

### 影響を受けないコア機能

- 会員登録（メール認証なしで完了）
- ログイン・ログアウト
- アフィリエイトリンク生成・トラッキング
- キャッシュバック計算・履歴表示
- ブログ閲覧・カテゴリフィルタ
- 全てのmicroCMS連携機能

## セキュリティ上の考慮事項

### リスク

1. **パスワードリセット不可:**
   - ユーザーがパスワードを忘れた場合、管理者による手動対応が必要
   - Google Sheetsから直接パスワードハッシュを更新する必要がある

2. **メール認証スキップ:**
   - メールアドレスの所有確認ができない
   - 不正なメールアドレスでの登録が可能

3. **セキュリティレベル低下:**
   - 2要素認証の1要素（メール所有）が欠落

### 推奨される緩和策

1. **電話番号認証（SMS）の追加:**
   - Twilio等のSMS送信サービスを検討
   - メール認証の代替として実装

2. **秘密の質問の実装:**
   - パスワードリセットの代替手段
   - 会員登録時に秘密の質問を設定

3. **管理者ダッシュボードの強化:**
   - パスワードリセット要求の手動処理機能
   - 不正登録の監視・削除機能

## 代替メールサービスの検討

### 条件: MXレコード設定が不要なサービス

| サービス | MXレコード要件 | SPF/DKIM要件 | 推奨度 | 備考 |
|---------|--------------|-------------|--------|------|
| **Resend** | 必須 | 必須 | ❌ | 現在使用中だが、Wix DNS制限により不可 |
| **SendGrid** | オプション | 必須 | ⚠️ | API経由の送信のみなら可能。ドメイン認証には制限あり |
| **AWS SES** | 必須 | 必須 | ❌ | Route 53必須のため、Wix DNSでは不可 |
| **Mailgun** | 必須 | 必須 | ❌ | MXレコード必須 |
| **Postmark** | オプション | 推奨 | ⚠️ | API経由の送信は可能だが、ドメイン認証には制限 |
| **Brevo (Sendinblue)** | オプション | 推奨 | ⚠️ | API経由の送信は可能 |

### 推奨アプローチ

1. **短期的（現状維持）:**
   - `RESEND_VALID=false` で運用
   - パスワードリセットは管理者による手動対応
   - メール認証なしで会員登録を許可

2. **中期的（代替認証の実装）:**
   - 電話番号認証（SMS）の追加
   - SendGridまたはBrevoでのAPI経由送信を検討（ドメイン認証なし）

3. **長期的（DNS移管）:**
   - ドメインをCloudflare/Route 53/Google Domainsに移管
   - Wix Webサイトとの連携を解除
   - Resendの完全統合を実現

## ドメイン移管の選択肢

### オプション1: Cloudflare（推奨）

**メリット:**
- 無料のDNS管理
- 完全なDNSレコード制御
- CDN・セキュリティ機能統合
- Vercelとの連携が容易

**移管手順:**
1. Cloudflareアカウント作成
2. ドメイン追加（Cloudflareが現在のDNSレコードをスキャン）
3. Wixでネームサーバーを変更（Cloudflare指定のNSレコード）
4. Resendの必要なDNSレコードを追加
5. `RESEND_VALID=true` に変更

### オプション2: AWS Route 53

**メリット:**
- AWS SESとの完全統合
- プログラマティックなDNS管理
- 高可用性・グローバル分散

**デメリット:**
- 従量課金制（月額$0.50 + クエリ課金）
- AWSアカウントの管理が必要

### オプション3: Google Domains / Google Cloud DNS

**メリット:**
- シンプルなUI
- Google Workspaceとの統合
- 固定料金

**デメリット:**
- Google Domainsは2023年にSquarespaceに売却済み
- 今後の統合先は不透明

## 実装済みのコード変更

### 環境変数

```env
RESEND_VALID=false  # デフォルト: メール機能無効
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```

### `lib/email.ts`

```typescript
const resendValid = process.env.RESEND_VALID === "true"; // デフォルト: false
export const isResendValid = resendValid && Boolean(resendApiKey);

const resend = isResendValid ? new Resend(resendApiKey) : null;
```

### `app/api/register/route.ts`

```typescript
import { isResendValid } from "@/lib/email";

if (isResendValid) {
  // メール認証フロー（emailVerified=false）
  await addMember({ ..., emailVerified: false });
  await sendVerificationEmail(email, token);
} else {
  // メール認証スキップ（emailVerified=true）
  await addMember({ ..., emailVerified: true });
}
```

### `app/api/forgot-password/route.ts`

```typescript
import { isResendValid } from "@/lib/email";

if (!isResendValid) {
  return NextResponse.json(
    { error: "パスワードリセット機能は現在利用できません" },
    { status: 503 }
  );
}
```

### `app/api/resend-verification/route.ts`

```typescript
import { isResendValid } from "@/lib/email";

if (!isResendValid) {
  return NextResponse.json(
    { error: "メール認証機能は現在利用できません" },
    { status: 503 }
  );
}
```

## 運用フロー

### 開発環境（ローカル）

```bash
# .env.local
RESEND_VALID=false  # メール機能無効で開発
```

### ステージング環境（Vercel Preview）

```bash
# Vercel Environment Variables
RESEND_VALID=false  # DNS制限あり
```

### 本番環境（Vercel Production）

```bash
# Vercel Environment Variables
RESEND_VALID=false  # DNS制限あり
```

### 将来的にDNS移管後

```bash
# Vercel Environment Variables
RESEND_VALID=true  # メール機能有効化
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=noreply@yourdomain.com
```

### 検証結果（2025-01-03）

**テスト環境:** ローカル開発環境（`RESEND_VALID=false`）

**検証内容:**
1. ✅ **会員登録** - 正常に完了
   - メールアドレス入力後、認証メール送信をスキップ
   - `emailVerified=true` でGoogle Sheetsに即座に登録
   - 登録完了メッセージが表示される

2. ✅ **ログイン** - 正常に動作
   - 登録直後からログイン可能
   - セッション管理が正常に機能
   - マイページへのアクセスが可能

3. ✅ **ログアウト** - 正常に動作
   - セッションが正常に破棄される
   - 再ログインが必要な状態に戻る

**結論:**
- `RESEND_VALID=false` 構成において、コア機能（会員登録・ログイン・ログアウト）は正常に動作することを確認
- メール認証機能の無効化により、ユーザーは即座にサービスを利用可能
- パスワードリセット機能は無効化されているが、会員登録とログインに影響なし

## トラブルシューティング

### Q1: 会員がパスワードを忘れた場合の対応は？

**A1:** 管理者がGoogle Sheetsから直接パスワードハッシュを更新する必要があります。

**手順:**
1. 新しいパスワードをbcryptでハッシュ化
```bash
# Node.js REPLで実行
const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('new_password', 10);
console.log(hash);
```
2. Google Sheets「会員リスト」の該当行の「パスワード(hash)」列を更新

### Q2: メール認証なしでセキュリティは大丈夫？

**A2:** 以下の緩和策を推奨します：
- 登録時にreCAPTCHA導入（ボット対策）
- 電話番号認証（SMS）の追加
- 管理者による不正登録の定期監視

### Q3: DNS移管のタイミングは？

**A3:** 以下のタイミングで検討：
- 会員数が1000人を超えた時点
- パスワードリセット要求が月10件を超えた時点
- セキュリティ要件が厳格化された時点

## 参考リンク

- [Wix DNS設定ガイド](https://support.wix.com/ja/article/dns%E8%A8%AD%E5%AE%9A%E3%81%AE%E7%AE%A1%E7%90%86)
- [Vercel Custom Domains](https://vercel.com/docs/concepts/projects/domains)
- [Resend DNS Configuration](https://resend.com/docs/dashboard/domains/introduction)
- [Cloudflare Domain Transfer](https://www.cloudflare.com/products/registrar/)

## 履歴

- **2025-01-03:** 初版作成、RESEND_VALIDフィーチャーフラグ実装、検証完了（会員登録・ログイン・ログアウト正常動作確認）
