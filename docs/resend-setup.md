# Resend.com セットアップ手順書

WIN×Ⅱプロジェクトで使用するメール送信サービス Resend.com の設定手順。

## 目次
1. [概要](#概要)
2. [前提条件](#前提条件)
3. [Resendアカウント作成](#resendアカウント作成)
4. [ドメイン追加](#ドメイン追加)
5. [DNS設定（重要）](#dns設定重要)
6. [ドメイン検証](#ドメイン検証)
7. [APIキー取得](#apiキー取得)
8. [環境変数設定](#環境変数設定)
9. [テスト送信](#テスト送信)
10. [トラブルシューティング](#トラブルシューティング)

---

## 概要

Resend.com は開発者向けのメール送信サービスで、以下の機能を提供します：

- **メール認証**: 会員登録時のメールアドレス確認
- **パスワードリセット**: パスワード忘れ時のリセットメール送信
- **トランザクションメール**: システムからの自動通知メール

### 料金プラン

- **Free プラン**: 月間 3,000通まで無料
- **Pro プラン**: 月額 $20 で 50,000通まで

WIN×Ⅱの初期段階では Free プランで十分です。

---

## 前提条件

- **独自ドメイン所有**: 例: `example.com`
- **DNS管理画面へのアクセス権**: ドメインレジストラまたはDNSプロバイダー
  - お名前.com、ムームードメイン、Cloudflare、Route 53など
- **メールアドレス**: Resendアカウント登録用

---

## Resendアカウント作成

### 1. サインアップ

1. [https://resend.com](https://resend.com) にアクセス
2. 右上の **「Sign Up」** をクリック
3. 以下の情報を入力：
   - メールアドレス
   - パスワード
4. **「Create Account」** をクリック
5. 確認メールが届くので、リンクをクリックして認証

### 2. ダッシュボード確認

サインイン後、Resend Dashboard にアクセスできます：
- https://resend.com/dashboard

---

## ドメイン追加

### 1. ドメイン追加画面へ移動

1. ダッシュボード左サイドバーから **「Domains」** をクリック
2. 右上の **「+ Add Domain」** ボタンをクリック

### 2. ドメイン情報入力

**Domain Name** 欄に以下を入力：

```
example.com
```

または、サブドメインを使用する場合：

```
mail.example.com
```

**推奨**: ルートドメイン（`example.com`）を使用する方が設定がシンプルです。

### 3. Region 選択

- **US East (N. Virginia)** - デフォルト
- **EU (Frankfurt)** - ヨーロッパ向け

日本からのアクセスが主な場合は **US East** で問題ありません。

**「Add Domain」** をクリック。

---

## DNS設定（重要）

ドメインを追加すると、Resendが **DNS レコードの追加指示** を表示します。

### 必須DNSレコード

以下の3種類のレコードを DNS 管理画面で追加する必要があります：

1. **SPF レコード** (TXT)
2. **DKIM レコード** (TXT)
3. **Return-Path レコード** (CNAME) - オプションだが推奨

### DNS設定画面の確認

Resend Dashboard の **「Domains」** → 追加したドメインをクリック → **「DNS Records」** タブで確認できます。

---

## DNSレコード詳細

### 1. SPF レコード (TXT)

**SPF (Sender Policy Framework)**: 送信元サーバーの正当性を証明するレコード。

#### Resendが提供する値（例）

```
Type: TXT
Name: @ (または example.com)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600 (または Auto)
```

#### お名前.com での設定例

1. お名前.com にログイン
2. **「DNS設定/転送設定」** → **「ドメインのDNS設定」**
3. 対象ドメインを選択 → **「次へ」**
4. **「DNSレコード設定を利用する」** → **「設定する」**
5. **「追加」** ボタンをクリック
6. 以下を入力：
   - **TYPE**: `TXT`
   - **ホスト名**: 空欄（または `@`）
   - **VALUE**: `v=spf1 include:_spf.resend.com ~all`
   - **TTL**: `3600`
7. **「追加」** → **「確認画面へ進む」** → **「設定する」**

#### Cloudflare での設定例

1. Cloudflare Dashboard → 対象ドメイン選択
2. 左メニュー **「DNS」** → **「Records」**
3. **「Add record」** をクリック
4. 以下を入力：
   - **Type**: `TXT`
   - **Name**: `@`
   - **Content**: `v=spf1 include:_spf.resend.com ~all`
   - **TTL**: `Auto`
   - **Proxy status**: DNS only（グレー色）
5. **「Save」**

---

### 2. DKIM レコード (TXT)

**DKIM (DomainKeys Identified Mail)**: メールの改ざん防止と送信元認証。

#### Resendが提供する値（例）

```
Type: TXT
Name: resend._domainkey.example.com
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC... (長い文字列)
TTL: 3600
```

**重要**: `Name` と `Value` は Resend Dashboard に表示される **実際の値** を使用してください。

#### お名前.com での設定例

1. **「DNSレコード設定を利用する」** → **「設定する」**
2. **「追加」** ボタンをクリック
3. 以下を入力：
   - **TYPE**: `TXT`
   - **ホスト名**: `resend._domainkey` （`example.com` は自動付与）
   - **VALUE**: Resendが提供する `p=MIGfMA0GCSq...` の値をコピペ
   - **TTL**: `3600`
4. **「追加」** → **「確認画面へ進む」** → **「設定する」**

#### Cloudflare での設定例

1. **「Add record」** をクリック
2. 以下を入力：
   - **Type**: `TXT`
   - **Name**: `resend._domainkey`
   - **Content**: Resendが提供する値をコピペ
   - **TTL**: `Auto`
   - **Proxy status**: DNS only（グレー色）
3. **「Save」**

---

### 3. Return-Path レコード (CNAME)

**Return-Path**: バウンス（配信失敗）メールの受信先を指定。

#### Resendが提供する値（例）

```
Type: CNAME
Name: resend-bounces.example.com
Value: feedback.resend.com
TTL: 3600
```

#### お名前.com での設定例

1. **「追加」** ボタンをクリック
2. 以下を入力：
   - **TYPE**: `CNAME`
   - **ホスト名**: `resend-bounces`
   - **VALUE**: `feedback.resend.com`
   - **TTL**: `3600`
3. **「追加」** → **「確認画面へ進む」** → **「設定する」**

#### Cloudflare での設定例

1. **「Add record」** をクリック
2. 以下を入力：
   - **Type**: `CNAME`
   - **Name**: `resend-bounces`
   - **Target**: `feedback.resend.com`
   - **TTL**: `Auto`
   - **Proxy status**: DNS only（グレー色）
4. **「Save」**

---

### 4. DMARC レコード (TXT) - オプション

**DMARC (Domain-based Message Authentication, Reporting & Conformance)**: SPFとDKIMの認証ポリシーを定義。

#### 推奨設定（例）

```
Type: TXT
Name: _dmarc.example.com
Value: v=DMARC1; p=none; rua=mailto:dmarc@example.com
TTL: 3600
```

**説明**:
- `p=none`: 認証失敗時も配信（監視モード）
- `rua=mailto:dmarc@example.com`: レポート送信先

初期段階では **DMARC は必須ではありません**。後から追加可能です。

---

## DNS設定の反映確認

### 1. DNS反映時間

DNSレコード追加後、反映には **数分〜24時間** かかります。

- **Cloudflare**: 通常 5〜10分
- **お名前.com**: 通常 1〜6時間
- **最大**: 24時間

### 2. DNSレコード確認コマンド

ターミナルで以下を実行して、レコードが正しく設定されているか確認：

#### SPF レコード確認

```bash
dig example.com TXT +short | grep spf
```

期待される出力:
```
"v=spf1 include:_spf.resend.com ~all"
```

#### DKIM レコード確認

```bash
dig resend._domainkey.example.com TXT +short
```

期待される出力:
```
"p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC..."
```

#### CNAME レコード確認

```bash
dig resend-bounces.example.com CNAME +short
```

期待される出力:
```
feedback.resend.com.
```

### 3. オンラインツールで確認

- **MXToolbox**: https://mxtoolbox.com/SuperTool.aspx
  - ドメイン入力 → `TXT Lookup` で SPF/DKIM確認
- **DKIM Validator**: https://dkimvalidator.com/

---

## ドメイン検証

DNSレコードが反映されたら、Resendでドメイン検証を実行します。

### 1. 検証ボタンをクリック

1. Resend Dashboard → **「Domains」** → 追加したドメインをクリック
2. **「DNS Records」** タブ内の各レコードに **緑のチェックマーク** が表示されるまで待つ
3. すべてのレコードが緑になったら、**「Verify Domain」** ボタンをクリック

### 2. 検証成功

**「Domain Verified」** または **緑の「Active」** ステータスが表示されたら成功です。

### 3. 検証失敗時

- **「Pending」** 状態が続く場合：
  - DNS反映待ち（最大24時間）
  - DNSレコードの値が間違っている可能性
  - `dig` コマンドで再確認

---

## APIキー取得

ドメイン検証後、APIキーを取得します。

### 1. APIキー作成画面へ

1. Resend Dashboard 左メニュー → **「API Keys」**
2. **「+ Create API Key」** をクリック

### 2. APIキー設定

- **Name**: `WIN2 Production` （任意の名前）
- **Permission**: **「Full access」** または **「Sending access」**
- **Domain**: 追加したドメインを選択

**「Create」** をクリック。

### 3. APIキーをコピー

APIキーが表示されます（例: `re_123abc456def...`）。

**重要**: この画面を閉じるとAPIキーは二度と表示されません。必ずコピーして安全な場所に保管してください。

---

## 環境変数設定

### 1. ローカル環境（`.env.local`）

プロジェクトルートの `.env.local` ファイルに追加：

```bash
# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key_here
```

### 2. Vercel環境変数

1. Vercel Dashboard → プロジェクト選択
2. **「Settings」** タブ → **「Environment Variables」**
3. 以下を追加：
   - **Key**: `RESEND_API_KEY`
   - **Value**: `re_your_actual_api_key_here`
   - **Environment**: `Production`, `Preview`, `Development` すべて選択
4. **「Save」**

### 3. 環境変数の確認

`.env.example` にも参考として記載されています：

```bash
# Phase 2: Email Verification & Password Reset
RESEND_API_KEY=re_your_resend_api_key_here
```

---

## テスト送信

設定完了後、実際にメール送信をテストします。

### 1. メール認証機能のテスト

#### 会員登録テスト

1. ローカル環境で `npm run dev` 起動
2. ブラウザで `http://localhost:3000/register` にアクセス
3. テスト用メールアドレスで会員登録
4. 登録したメールアドレスに **認証メール** が届くか確認

**メール件名**: `WIN×Ⅱ - メールアドレス認証のお願い`

#### 届いたメールの確認項目

- ✅ 送信元が `noreply@your-domain.com` になっているか
- ✅ 認証リンクが正しく動作するか
- ✅ メールが迷惑メールに振り分けられていないか

### 2. パスワードリセット機能のテスト

1. `http://localhost:3000/forgot-password` にアクセス
2. メールアドレス入力 → 送信
3. **パスワードリセットメール** が届くか確認

**メール件名**: `WIN×Ⅱ - パスワードリセットのお願い`

### 3. Resend Logs で確認

Resend Dashboard → **「Logs」** で、送信ログを確認できます：

- **Status**: `delivered` (成功)、`bounced` (失敗)、`pending` (処理中)
- **Recipient**: 送信先メールアドレス
- **Subject**: メール件名

---

## トラブルシューティング

### 問題1: ドメイン検証が「Pending」のまま

**原因**:
- DNSレコードがまだ反映されていない
- DNSレコードの値が間違っている

**対策**:
1. DNS反映を待つ（最大24時間）
2. `dig` コマンドで現在の設定を確認
3. Resend Dashboard に表示されている値と完全一致しているか確認
4. TTLを短く設定（300秒など）してから再試行

---

### 問題2: メールが届かない

**原因**:
- APIキーが間違っている
- 環境変数が設定されていない
- 送信元ドメインが検証されていない

**対策**:
1. `.env.local` の `RESEND_API_KEY` を確認
2. Resend Dashboard → **「Logs」** でエラーを確認
3. ドメインが **「Active」** ステータスか確認
4. `lib/resend.ts` で送信元メールアドレスを確認：
   ```typescript
   from: 'WIN×Ⅱ <noreply@your-domain.com>',
   ```

---

### 問題3: メールが迷惑メールに振り分けられる

**原因**:
- DMARC レコードが未設定
- SPF/DKIM の設定ミス
- 送信元ドメインの評価が低い

**対策**:
1. DMARC レコードを追加（前述の設定参照）
2. SPF/DKIM レコードを再確認
3. メール本文に **配信停止リンク** を追加（将来的に）
4. 送信量を段階的に増やす（初日10通、翌日50通など）

---

### 問題4: `dig` コマンドが使えない（Windows）

**対策**:

#### オプション1: nslookup を使用

```cmd
nslookup -type=TXT example.com
```

#### オプション2: オンラインツールを使用

- **MXToolbox**: https://mxtoolbox.com/SuperTool.aspx
- **DNS Checker**: https://dnschecker.org/

---

### 問題5: DNSレコード削除したい

**手順**:
1. DNS管理画面で該当レコードを選択
2. **「削除」** または **「Delete」** をクリック
3. 反映まで数時間待つ

**注意**: Resendを使用し続ける限り、DNSレコードは削除しないでください。

---

## まとめ

### 設定完了チェックリスト

- [ ] Resendアカウント作成完了
- [ ] ドメイン追加完了
- [ ] SPF レコード追加・反映確認
- [ ] DKIM レコード追加・反映確認
- [ ] Return-Path レコード追加・反映確認
- [ ] Resendでドメイン検証成功（Active ステータス）
- [ ] APIキー取得・環境変数設定完了
- [ ] テストメール送信成功

### 所要時間

- **最短**: 30分（DNS反映が速い場合）
- **平均**: 2〜6時間（DNS反映待ち込み）
- **最長**: 24時間（DNS反映が遅い場合）

### 参考リンク

- **Resend公式ドキュメント**: https://resend.com/docs
- **Resend DNS設定ガイド**: https://resend.com/docs/dashboard/domains/introduction
- **SPF/DKIM/DMARC解説**: https://resend.com/blog/email-authentication-spf-dkim-dmarc

---

**最終更新日**: 2025-10-29
