# WIN×Ⅱ Phase 2 機能拡張 PRD

## 概要

Phase 2では、Phase 1で実装した基本機能を拡張し、セキュリティ強化、管理機能、ビジネス拡張機能を実装します。メール認証・パスワードリセットによるセキュリティ向上、管理画面による運用効率化、代理店制度による収益拡大を目指します。

## 前提条件（Phase 1完了機能）

- ✅ 会員登録・ログイン機能（Next-Auth v4）
- ✅ ブログ一覧・詳細ページ（microCMS統合、SEO最適化）
- ✅ クリック追跡API（会員・非会員対応、guest UUID生成）
- ✅ マイページ（登録情報表示、申込履歴）
- ✅ 案件一覧ページ（会員限定、カテゴリフィルタ）
- ✅ Google Sheets連携（会員データ、クリックログ、成果データ）

## 実装が必要な機能

### 優先度 HIGH（必須機能）

#### 1. Email Verification（メール認証）

**目的:** アカウントの正当性を確保し、スパム登録を防止する

**要件:**

##### 1.1 メール送信基盤構築
- メール送信サービス選定: **Resend** 推奨（Next.js公式推奨、無料枠あり）
- 代替案: SendGrid, Postmark, AWS SES
- メールテンプレート作成（React Email使用）
- 環境変数設定（RESEND_API_KEY）

##### 1.2 会員登録時のメール認証フロー
1. 会員登録時、`emailVerified: false` でGoogle Sheetsに保存
2. メール認証トークン生成（JWT, 有効期限24時間）
3. 認証メール送信（トークン付きURL）
4. 認証完了ページ表示 (`/verify-email?token=xxx`)
5. トークン検証後、`emailVerified: true` に更新

##### 1.3 未認証ユーザーの制限
- ログイン可能、ただし一部機能制限
- 案件申込時に「メール認証が必要です」警告表示
- マイページに「メール未認証」バッジ表示
- 再送信ボタン実装

**技術的詳細:**
- `lib/email.ts` - メール送信ユーティリティ
- `lib/tokens.ts` - JWT生成・検証ユーティリティ
- `app/api/verify-email/route.ts` - メール認証API
- `app/verify-email/page.tsx` - 認証完了ページ
- `app/api/resend-verification/route.ts` - 再送信API
- Google Sheets「会員リスト」に `emailVerified` 列追加

---

#### 2. Password Reset（パスワードリセット）

**目的:** パスワードを忘れた会員が自力でパスワードを再設定できるようにする

**要件:**

##### 2.1 パスワードリセット申請フロー
1. 「パスワードを忘れた方」リンク（ログインページ）
2. メールアドレス入力ページ (`/forgot-password`)
3. リセットトークン生成（JWT, 有効期限1時間）
4. パスワードリセットメール送信
5. リセットページにリダイレクト (`/reset-password?token=xxx`)

##### 2.2 パスワード再設定フロー
1. トークン検証
2. 新しいパスワード入力（確認用含む）
3. パスワードバリデーション（8文字以上、大小英数字含む）
4. bcryptでハッシュ化
5. Google Sheetsのパスワードハッシュ更新
6. 完了メッセージ表示、ログインページにリダイレクト

##### 2.3 セキュリティ対策
- レート制限（同一メールアドレスで1時間に3回まで）
- トークン使用後の無効化（トークン再利用防止）
- 成功時に通知メール送信（不正アクセス検知）

**技術的詳細:**
- `app/forgot-password/page.tsx` - メールアドレス入力ページ
- `app/reset-password/page.tsx` - パスワード再設定ページ
- `app/api/forgot-password/route.ts` - リセットトークン生成・メール送信API
- `app/api/reset-password/route.ts` - パスワード更新API
- `lib/validations/password.ts` - パスワードバリデーションスキーマ

---

### 優先度 MEDIUM（運用効率化）

#### 3. Admin Dashboard（管理画面）

**目的:** 管理者が会員・成果データを効率的に管理できるようにする

**要件:**

##### 3.1 管理者認証システム
- 管理者用メールアドレスリスト（環境変数）
- Next-Auth セッションに `role` フィールド追加
- 管理画面アクセス制限（`role === 'admin'` のみ）

##### 3.2 会員管理機能 (`/admin/members`)
- 会員一覧表示（ページネーション、検索）
- 会員詳細表示（登録情報、申込履歴、成果データ）
- メール認証ステータス表示
- 会員情報編集（管理者のみ）
- 会員削除機能（論理削除）

##### 3.3 成果データ管理 (`/admin/results`)
- 成果データ一覧表示（フィルタ: 承認/否認/保留）
- 手動承認・否認機能
- キャッシュバック金額の手動調整
- CSVエクスポート機能

##### 3.4 ダッシュボード (`/admin/dashboard`)
- 統計情報表示:
  - 会員数（総数、今月の新規登録）
  - 申込件数（今月、先月比較）
  - 成果件数（承認/否認/保留）
  - 総キャッシュバック金額
  - ASP別の成果集計
- グラフ表示（Chart.js or Recharts）

**技術的詳細:**
- `middleware.ts` 更新 - 管理画面アクセス制限
- `app/admin/layout.tsx` - 管理画面レイアウト
- `app/admin/dashboard/page.tsx` - ダッシュボード
- `app/admin/members/page.tsx` - 会員一覧
- `app/admin/results/page.tsx` - 成果データ管理
- `app/api/admin/*` - 管理用API群

---

### 優先度 LOW（ビジネス拡張）

#### 4. Agency/Referral System（代理店・紹介制度）

**目的:** 紹介経由での会員獲得とアフィリエイターの収益化

**要件:**

##### 4.1 紹介コード機能
- 会員ごとに固有の紹介コード生成（8文字の英数字）
- 紹介URL生成 (`https://example.com/register?ref=ABC12345`)
- 紹介コード入力欄（会員登録ページ）
- Google Sheetsに `referredBy` 列追加

##### 4.2 階層化キャッシュバック
- **直接紹介**: 紹介者に成果の5%を追加還元
- **2段階紹介**: 紹介者の紹介者に成果の2%を追加還元
- キャッシュバック履歴に紹介報酬を記録

##### 4.3 紹介実績ページ (`/mypage/referrals`)
- 紹介した会員一覧
- 紹介経由の成果件数
- 紹介報酬の合計金額

**技術的詳細:**
- `lib/referral.ts` - 紹介コード生成・検証
- `app/mypage/referrals/page.tsx` - 紹介実績ページ
- `app/api/referrals/route.ts` - 紹介データ取得API
- Google Sheets「会員リスト」に `referralCode`, `referredBy` 列追加

---

#### 5. Subdomain Support（サブドメイン対応）

**目的:** ギャンブル・占いカテゴリを別サブドメインで運用

**要件:**

##### 5.1 サブドメイン設定
- メインドメイン: `example.com`
- ギャンブルカテゴリ: `casino.example.com`
- 占いカテゴリ: `fortune.example.com`

##### 5.2 サブドメインルーティング
- `middleware.ts` でサブドメイン検出
- サブドメインごとにカテゴリフィルタを自動適用
- ブログ・案件一覧がサブドメイン専用に

##### 5.3 SEO対策
- サブドメインごとの sitemap.xml
- サブドメインごとの robots.txt
- Canonical URL設定

**技術的詳細:**
- `middleware.ts` 更新 - サブドメイン検出・ルーティング
- `next.config.js` 更新 - ドメイン設定
- Vercel設定 - カスタムドメイン追加

---

#### 6. Multiple ASP Support Expansion（複数ASP対応拡張）

**目的:** A8.net以外のASPにも対応し、案件数を増やす

**要件:**

##### 6.1 対応ASP追加
- AFB（アフィリエイトB）
- もしもアフィリエイト
- バリューコマース

##### 6.2 ASP別の追跡パラメータ対応
- A8.net: `?id1=xxx`
- AFB: `?a_id=xxx`
- もしも: `?a_id=xxx&p_id=xxx`
- バリューコマース: `?sid=xxx`

##### 6.3 ASP別の成果データ管理
- Google Sheets「成果データ」に `aspName` 列追加
- ASPごとのCSVインポート機能

**技術的詳細:**
- `lib/microcms.ts` - Deal型に `trackingParams` フィールド追加
- `app/api/track-click/route.ts` 更新 - ASP別パラメータ生成
- microCMS `deals` API - `trackingParams` カスタムフィールド追加

---

## 技術仕様

### 新規依存関係

```json
{
  "resend": "^4.0.0",
  "react-email": "^3.0.0",
  "@react-email/components": "^0.0.25",
  "jsonwebtoken": "^9.0.2",
  "@types/jsonwebtoken": "^9.0.7",
  "recharts": "^2.13.3",
  "rate-limiter-flexible": "^5.0.3"
}
```

### 新規環境変数

```bash
# Resend API Key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# JWT Secret（メール認証・パスワードリセット用）
JWT_SECRET=your_super_secret_key_here

# 管理者メールアドレス（カンマ区切り）
ADMIN_EMAILS=admin@example.com,manager@example.com

# フロントエンドURL（メール内リンク用）
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Google Sheets スキーマ更新

#### 会員リスト
既存列に以下を追加:
- I列: `emailVerified` (TRUE/FALSE)
- J列: `referralCode` (8文字の英数字)
- K列: `referredBy` (紹介者の referralCode)

#### 成果データ
既存列に以下を追加:
- H列: `aspName` (ASP名: A8.net/AFB/もしも/バリュコマ)

---

## 優先順位と実装順序

### フェーズ2-1: セキュリティ強化（2週間）
1. メール送信基盤構築（Resend + React Email）
2. Email Verification実装
3. Password Reset実装

### フェーズ2-2: 運用効率化（2週間）
4. 管理者認証システム
5. Admin Dashboard実装
6. 会員管理機能
7. 成果データ管理機能

### フェーズ2-3: ビジネス拡張（3週間）
8. 紹介コード機能
9. 階層化キャッシュバック
10. サブドメイン対応
11. 複数ASP対応拡張

---

## 成功基準

### フェーズ2-1
- ✅ 会員登録時にメール認証メールが送信される
- ✅ メール認証リンクからアカウントが有効化される
- ✅ パスワードリセット申請でメールが送信される
- ✅ パスワードリセットが正常に完了する
- ✅ レート制限が正常に動作する

### フェーズ2-2
- ✅ 管理者のみ管理画面にアクセスできる
- ✅ 会員一覧・検索・詳細表示が動作する
- ✅ 成果データの手動承認・否認ができる
- ✅ ダッシュボードに統計情報が正しく表示される

### フェーズ2-3
- ✅ 紹介コード経由の会員登録が記録される
- ✅ 紹介報酬が正しく計算される
- ✅ サブドメインで正しいカテゴリが表示される
- ✅ 複数ASPの追跡パラメータが正しく付与される

---

## 非機能要件

- すべての新機能でTypeScript strict mode準拠
- メール送信のエラーハンドリング徹底
- 管理画面のアクセス制御徹底
- パスワードリセットのセキュリティ対策徹底
- レスポンシブデザイン対応
- Lighthouse スコア 90以上維持

---

## リスクと対策

### リスク1: メール送信の失敗
**対策:** エラー時のリトライ機構、ログ記録、管理画面から手動再送信機能

### リスク2: トークン期限切れ
**対策:** 再送信ボタン、明確なエラーメッセージ、有効期限の視覚的表示

### リスク3: 管理画面の不正アクセス
**対策:** 厳格な認証、IPホワイトリスト（将来）、操作ログ記録

### リスク4: 紹介システムの悪用
**対策:** 紹介報酬の承認制、不正検知アルゴリズム、レート制限

---

## 今後の拡張（Phase 3以降）

- ポイント制度
- ランク制度（会員ランク、案件ランク）
- LINE連携
- プッシュ通知
- モバイルアプリ
- AI案件レコメンデーション
