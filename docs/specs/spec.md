# WIN×Ⅱ プロジェクト要件定義書

## 1. プロジェクト概要

### 1.1 背景・目的
会員制アフィリエイトブログ「WIN×Ⅱ」を構築し、会員および非会員にサービスを提供する。ASPで商材を仕入れ、利用者にサービスを提供し、アフィリエイト報酬を得るとともに、会員にキャッシュバックを行うことで双方の利益を図る。
アフィリエイトのCTAボタンを必ず含めるブログシステムに加え、クライアントは誰がどの案件に申し込んだかを把握することが目的。

### 1.2 技術スタック（確定版）

```
フロントエンド:
- Next.js 15 (App Router)
- TypeScript
- TailwindCSS 4
- shadcn/ui (UIコンポーネント)

バックエンド/API:
- Next.js API Routes
- Next-Auth (Auth.js) - 認証
- Google Sheets API - 会員・成果データ管理

CMS/データ管理:
- microCMS - ブログ記事・案件情報管理
- Google Sheets - 会員DB・成果データ（既存GAS継続利用）

外部連携:
- A8.net（優先実装）
- AFB, もしもアフィリエイト, バリューコマース（後日対応）

デプロイ:
- Vercel
```

---

## 2. 機能要件

### 2.1 フェーズ1：基本機能（初期リリース）

#### 2.1.1 一般公開機能（非会員も利用可）

**トップページ**
- サービス概要
- 新着ブログ記事一覧（最新5件程度）
- 会員登録への導線
- デザイン: liskul.com を参考（オレンジ基調、信頼感）

**ブログ記事一覧・詳細**
- 記事一覧ページ（ページネーション対応）
- カテゴリ別表示
- 記事詳細ページ
- SEO対応（メタタグ、OGP）
- **非会員でも案件に応募可能**（guest:UUID で追跡）

#### 2.1.2 会員限定機能

**会員登録**
```typescript
// 登録時の入力項目
{
  name: string;           // 氏名（必須）
  email: string;          // メールアドレス（必須・ユニーク）
  password: string;       // パスワード（必須・8文字以上）
  birthday?: string;      // 生年月日（任意）
  postalCode?: string;    // 郵便番号（任意）
  phone?: string;         // 電話番号（任意）
}
```
- メール確認は不要（後日実装可能性あり）
- 登録完了後、自動的にGoogle Sheets「会員リスト」に追加
- memberId は自動生成（UUID v4）

**ログイン/ログアウト**
- Next-Authによるセッション管理
- メールアドレス + パスワードで認証
- ログイン状態は30日間保持

**マイページ**
- 登録情報の確認・変更
- 申込履歴の表示
  - 案件名
  - 申込日時
  - 承認状況（応募済/承認/否認）
  - キャッシュバック金額

**案件一覧（会員限定ページ）**
- ASP案件の一覧表示
- カテゴリフィルタリング
- 各案件の詳細情報
  - 案件名
  - 報酬額
  - キャッシュバック率（20%）
  - 申込ボタン（CTAリンク生成）

#### 2.1.3 管理機能

**ブログ記事管理**
- microCMSの管理画面で実施
- 記事作成・編集・削除
- カテゴリ設定
- 公開/非公開設定

**案件管理**
- microCMSの管理画面で実施
- 案件情報の登録・編集
- アフィリエイトURLテンプレート管理
- 有効/無効設定

**会員管理**
- Google Sheetsで直接確認・編集
- 会員情報の検索・抽出
- 成果データとの照合

**成果データ管理**
- 既存のGoogle Apps Script継続利用
- ASP管理画面からCSVダウンロード
- Sheets「成果CSV_RAW」に貼り付け
- GAS自動実行（毎日3:10）で集計

---

### 2.2 フェーズ2：拡張機能（後日実装）

- メール確認機能
- パスワードリセット機能
- サブドメイン対応（ギャンブル・占いジャンル分離）
- 代理店機能（報酬配分の差異化）
- 複数ASP対応の拡充
- 管理者用ダッシュボード（Next.js製）

---

## 3. システム設計

### 3.1 データフロー

#### 3.1.1 会員登録フロー

```
1. ユーザーが登録フォーム送信
   ↓
2. /api/register (API Route)
   - バリデーション
   - パスワードをbcryptでハッシュ化
   - memberIdを生成（UUID v4）
   ↓
3. Google Sheets API
   - 「会員リスト」シートに新規行追加
   - [memberId, 氏名, メール, hash, 生年月日, 郵便番号, 電話, 登録日時]
   ↓
4. 登録完了画面表示
   ↓
5. 自動ログイン（Next-Authセッション作成）
```

#### 3.1.2 ASP案件申込フロー（重要）

```
1. ユーザーが案件詳細ページで「申込」ボタンクリック
   ↓
2. フロントエンド: /api/track-click を呼び出し
   POST { dealId, dealName, aspName }
   ↓
3. API Route (track-click):
   
   // ログイン状態を確認
   const session = await getServerSession(authOptions);
   
   if (session) {
     // 会員の場合
     memberId = session.user.memberId;
   } else {
     // 非会員の場合
     memberId = "guest:" + crypto.randomUUID();
     // Cookieに保存（同一ユーザーの追跡用）
   }
   
   // クリックログをGoogle Sheetsに記録
   await appendToSheet("クリックログ", [
     new Date().toISOString(),
     memberId,
     dealName,
     dealId,
   ]);
   
   // microCMSから案件情報を取得
   const deal = await microcms.get({
     endpoint: "deals",
     contentId: dealId,
   });
   
   // アフィリエイトURLにid1パラメータを付与
   const trackingUrl = `${deal.affiliateUrl}?id1=${memberId}`;
   
   // リダイレクトURLを返す
   return { url: trackingUrl };
   ↓
4. フロントエンド: 返されたURLへリダイレクト
   ↓
5. ユーザーがASPサイトで申込完了
   ↓
6. 後日、ASP管理画面から成果CSV取得
   ↓
7. クライアント様がSheets「成果CSV_RAW」に貼り付け
   ↓
8. GAS自動実行（毎日3:10）
   - id1とmemberIdを照合
   - 承認状況を確認
   - キャッシュバック金額を計算（報酬額 × 20%、承認のみ）
   - 「成果データ」シートに出力
   ↓
9. 会員はマイページで申込履歴・キャッシュバック金額を確認
```

### 3.2 データベース設計

#### 3.2.1 Google Sheets構成（現行維持）

**シート1: 会員リスト**
```
A: memberId (UUID)
B: 氏名
C: メールアドレス
D: パスワード(bcrypt hash)
E: 生年月日
F: 郵便番号
G: 電話番号
H: 登録日時
```

**シート2: クリックログ**
```
A: 日時 (ISO8601)
B: memberId (or guest:UUID)
C: 案件名
D: 案件ID (dealId)
```

**シート3: 成果データ**（GASが出力）
```
A: 氏名 (or "非会員")
B: 案件名
C: 承認状況
D: キャッシュバック金額
E: memberId(参考)
F: 原始報酬額(参考)
G: メモ
```

**シート4: 成果CSV_RAW**（手動貼付）
```
A: id1 (memberId or guest:UUID)
B: dealName
C: reward
D: status
```

#### 3.2.2 microCMS API設計

**API 1: ブログ記事 (blogs)**
```typescript
{
  id: string;                    // microCMSが自動生成
  title: string;                 // 記事タイトル（必須）
  slug: string;                  // URLスラッグ（必須・ユニーク）
  content: string;               // 本文（リッチエディタ、必須）
  excerpt: string;               // 抜粋（必須）
  thumbnail: {                   // サムネイル画像（必須）
    url: string;
    width: number;
    height: number;
  };
  category: {                    // カテゴリ（複数選択可）
    id: string;
    name: string;
  }[];
  relatedDeals: {                // 関連案件（複数選択可）
    id: string;
    dealName: string;
  }[];
  publishedAt: string;           // 公開日時
  isPublic: boolean;             // 公開/非公開
  
  // SEO設定
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: { url: string };
}
```

**API 2: ASP案件 (deals)**
```typescript
{
  id: string;                    // microCMSが自動生成
  dealId: string;                // 案件ID（ASP側のID、必須・ユニーク）
  dealName: string;              // 案件名（必須）
  aspName: string;               // ASP名（必須）
                                 // 選択肢: "A8.net", "AFB", "もしも", "バリュコマ"
  description: string;           // 案件説明（リッチエディタ）
  thumbnail: {                   // 案件画像
    url: string;
  };
  rewardAmount: number;          // 報酬額（必須）
  cashbackRate: number;          // 還元率（必須、既定値 0.2）
  category: {                    // カテゴリ（複数選択可）
    id: string;
    name: string;
  }[];
  affiliateUrl: string;          // アフィリエイトURLテンプレート（必須）
                                 // 例: "https://px.a8.net/..."
  isActive: boolean;             // 公開状態（必須、既定値 true）
  ctaText: string;               // CTAボタンテキスト（既定値 "詳細を見る"）
  displayOrder: number;          // 表示順（既定値 0）
  
  // 内部管理用
  notes?: string;                // 管理メモ
  updatedAt: string;             // 更新日時（microCMS自動）
}
```

**API 3: カテゴリ (categories)**
```typescript
{
  id: string;                    // microCMSが自動生成
  name: string;                  // カテゴリ名（必須・ユニーク）
  slug: string;                  // URLスラッグ（必須・ユニーク）
  description?: string;          // 説明
  displayOrder: number;          // 表示順（必須、既定値 0）
  isVisible: boolean;            // 表示/非表示（既定値 true）
}
```

### 3.3 API Routes設計

```typescript
// 認証関連
POST /api/auth/[...nextauth]     // Next-Auth (ログイン/ログアウト)
POST /api/register               // 会員登録

// 会員情報
GET  /api/members/me             // 自分の会員情報取得
PUT  /api/members/me             // 会員情報更新

// 申込履歴
GET  /api/history                // 自分の申込履歴取得（Sheetsから）

// ASP連携
POST /api/track-click            // クリック追跡＋リダイレクトURL生成

// 内部用（管理）
GET  /api/sheets/members         // 会員一覧取得（管理用）
GET  /api/sheets/results         // 成果データ取得（管理用）
```

---

## 4. 画面設計

### 4.1 サイトマップ

```
/ (トップページ)
├─ /blog (記事一覧)
│   └─ /blog/[slug] (記事詳細)
│
├─ /deals (案件一覧) ※会員限定
│
├─ /login (ログイン)
├─ /register (会員登録)
│
└─ /mypage (マイページ) ※会員限定
    ├─ /mypage (登録情報)
    └─ /mypage/history (申込履歴)
```

### 4.2 主要画面レイアウト

#### トップページ (/)
```
[ヘッダー: ロゴ | ブログ | 案件一覧 | ログイン/マイページ]

[ヒーローセクション]
- キャッチコピー
- 会員登録CTAボタン

[新着記事セクション]
- 最新5件のブログカード

[サービス説明セクション]

[フッター]
```

#### ブログ記事詳細 (/blog/[slug])
```
[ヘッダー]

[パンくずリスト]

[記事本文]
- タイトル
- サムネイル
- 公開日
- カテゴリタグ
- 本文（microCMSのリッチエディタ内容）
- 関連案件CTA（記事内に埋込）
  ※非会員でも「詳細を見る」ボタン押下可能

[関連記事]

[フッター]
```

#### 案件一覧 (/deals) ※会員限定
```
[ヘッダー]

[カテゴリフィルタ]

[案件カード一覧]
各カード:
- 案件画像
- 案件名
- ASP名バッジ
- 報酬額: ¥X,XXX
- キャッシュバック: ¥XXX (20%)
- [申込ボタン]

[フッター]
```

#### マイページ (/mypage)
```
[ヘッダー]

[サイドナビ]
- 登録情報
- 申込履歴
- ログアウト

[メインコンテンツ]
- 氏名
- メールアドレス
- 生年月日
- 郵便番号
- 電話番号
- [編集ボタン]

[フッター]
```

#### 申込履歴 (/mypage/history)
```
[ヘッダー]

[サイドナビ]

[申込履歴テーブル]
| 申込日 | 案件名 | 承認状況 | キャッシュバック |
|--------|--------|----------|------------------|
| 2025/10/15 | 案件A | 承認済 | ¥1,000 |
| 2025/10/10 | 案件B | 応募済 | - |

[フッター]
```

---

## 5. 非機能要件

### 5.1 パフォーマンス
- Lighthouseスコア目標: 90以上（全項目）
- 初回表示: 2秒以内（3G回線）
- 画像最適化: next/imageによる自動最適化

### 5.2 セキュリティ
- パスワード: bcryptでハッシュ化（salt rounds: 10）
- セッション: HttpOnly Cookie、Secure属性
- HTTPS必須（Vercel標準対応）
- CSRF対策: Next-Auth標準機能
- 個人情報: Google Sheets APIアクセスは環境変数で管理

### 5.3 アクセシビリティ
- セマンティックHTML
- ARIA属性の適切な使用
- キーボード操作対応
- カラーコントラスト比 4.5:1 以上

### 5.4 SEO
- 動的OGP生成（記事ごと）
- sitemap.xml自動生成
- robots.txt設定
- 構造化データ（JSON-LD）

---

## 6. 開発フェーズ

### Phase 1: 環境構築・基盤実装（1週間）
- [ ] Next.js 15プロジェクト初期化
- [ ] TailwindCSS 4セットアップ
- [ ] microCMS API設定（3つのAPI作成）
- [ ] Google Sheets API連携設定
- [ ] Next-Auth設定
- [ ] 基本レイアウト・UIコンポーネント作成

### Phase 2: 認証・会員機能（1週間）
- [ ] 会員登録機能
  - [ ] フォームバリデーション
  - [ ] Google Sheets書込API
  - [ ] パスワードハッシュ化
- [ ] ログイン/ログアウト機能
- [ ] マイページ
  - [ ] 登録情報表示・編集
  - [ ] 申込履歴表示（Sheetsから取得）

### Phase 3: CMS連携・ブログ機能（1週間）
- [ ] microCMS連携ライブラリ実装
- [ ] ブログ記事一覧ページ
  - [ ] ISR（Incremental Static Regeneration）設定
  - [ ] ページネーション
- [ ] ブログ記事詳細ページ
  - [ ] SSG（Static Site Generation）
  - [ ] OGP動的生成
- [ ] カテゴリフィルタリング

### Phase 4: ASP案件・追跡機能（1週間）
- [ ] 案件一覧ページ（会員限定）
- [ ] クリック追跡API (/api/track-click)
  - [ ] ログイン/非ログイン判定
  - [ ] guest:UUID生成（非会員）
  - [ ] Google Sheetsクリックログ記録
  - [ ] id1パラメータ付与
- [ ] 記事内CTA埋込機能

### Phase 5: テスト・最適化（1週間）
- [ ] A8.netテストアカウントで動作確認
- [ ] レスポンシブデザイン調整
- [ ] パフォーマンス最適化
- [ ] セキュリティ監査
- [ ] 本番環境デプロイ（Vercel）

---

## 7. 納品物

1. **ソースコード**（GitHubリポジトリ）
2. **本番サイト**（Vercelデプロイ済）
3. **microCMS設定手順書**
4. **Google Sheets API設定手順書**
5. **運用マニュアル**
   - 記事投稿方法
   - 案件追加方法
   - 成果CSV取込方法
   - 会員管理方法

---

## 8. 今後の拡張性

この設計により、以下の拡張が容易になります：

- **複数ASP対応**: microCMSのaspName選択肢を追加するだけ
- **サブドメイン分離**: Next.jsのmiddlewareでルーティング制御
- **代理店機能**: Google Sheetsに「会員種別」列を追加、GASで配分ロジック変更
- **メール送信**: Resend等のサービス追加
- **管理ダッシュボード**: /admin配下にページ追加
