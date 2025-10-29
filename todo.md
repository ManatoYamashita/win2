# WIN×Ⅱ 開発 TODO リスト

**最終更新:** 2025-10-29
**プロジェクト:** 会員制アフィリエイトブログプラットフォーム
**参照:** `docs/specs/spec.md`, `docs/specs/google.md`, `CLAUDE.md`

---

## 📊 実装状況サマリ

### Phase 1: 基盤構築 ✅ 100% Complete
- ✅ Next.js 15 + React 19 + TypeScript環境構築
- ✅ TailwindCSS v3.4.1 + shadcn/ui設定
- ✅ microCMS SDK統合（blogs, deals, categories API）
- ✅ Google Sheets API統合（googleapis v164.1.0）
- ✅ 基本レイアウト（Header, Footer）

### Phase 2: 認証・会員機能 ✅ 100% Complete (Phase 2-1)
- ✅ Next-Auth v4.24.11 + CredentialsProvider
- ✅ 会員登録API（/api/register）
- ✅ ログイン・セッション管理
- ✅ マイページ（/mypage）
- ✅ メール検証機能（Resend統合）
- ✅ パスワードリセット機能
- ⏭️ 管理画面（Phase 2-2）- スキップ
- ⏭️ 高度な機能（Phase 2-3）- スキップ

### Phase 3: ブログ機能 🚧 80% Complete
#### ✅ 実装済み（feature/phase2-advanced-featuresブランチ）
- ✅ ブログ一覧ページ（/blog/page.tsx）
- ✅ ブログ詳細ページ（/blog/[id]/page.tsx）
- ✅ カテゴリページ（/category/[id]/page.tsx）
- ✅ BlogCardコンポーネント
- ✅ BlogContentコンポーネント（Markdown/HTML対応、CTA shortcode対応）
- ✅ DealCTAButtonコンポーネント
- ✅ Paginationコンポーネント
- ✅ Markdown styling with @tailwindcss/typography（feature/blog-markdown-styling）

#### ❌ 未完了
- ❌ ブログ機能の現在ブランチへの統合
- ❌ トップページのブログ記事表示統合
- ❌ microCMSへのサンプルコンテンツ登録
- ❌ SEO/OGPの動作確認

### Phase 4: 案件機能・成果追跡 🚧 50% Complete
#### ✅ 実装済み
- ✅ /api/track-click（クリック追跡API）
- ✅ Guest UUID管理システム（lib/guest-uuid.ts）
- ✅ Google Sheetsへのクリックログ記録
- ✅ microCMS deals API統合

#### ❌ 未完了
- ❌ 案件一覧ページ（/deals）
- ❌ 案件詳細ページ（/deals/[id]）
- ❌ 成果履歴ページ（/mypage/history）
- ❌ GASとの連携動作確認
- ❌ キャッシュバック計算の動作確認

### Phase 5: テスト・最適化・デプロイ ❌ 0% Complete
- ❌ E2Eテスト（Playwright）
- ❌ パフォーマンス最適化
- ❌ Lighthouse スコア最適化（目標: 90+）
- ❌ セキュリティ監査
- ❌ Vercelデプロイ設定
- ❌ 本番環境テスト

---

## 🎯 Phase 3: ブログ機能統合タスク（優先度: 🔴 高）

### Task 3.1: feature/phase2-advanced-featuresからのブログ機能統合
**優先度:** 🔴 最高
**見積もり:** 2-3時間
**依存関係:** なし

#### サブタスク
1. **ブランチマージ戦略決定**
   - [ ] feature/blog-markdown-stylingをdevにマージ
   - [ ] feature/phase2-advanced-featuresから必要ファイルをcherry-pick
   - または、feature/phase2-advanced-featuresをdevにマージしてからblog-markdown-stylingを統合

2. **ブログページ統合**
   - [ ] `app/blog/page.tsx` を現在のdevブランチに追加
   - [ ] `app/blog/[id]/page.tsx` を現在のdevブランチに追加
   - [ ] `app/category/[id]/page.tsx` を現在のdevブランチに追加

3. **コンポーネント統合**
   - [ ] `components/blog/blog-card.tsx` を追加
   - [ ] `components/blog/blog-content.tsx` を最新版（Markdown styling適用済み）に更新
   - [ ] `components/deal/deal-cta-button.tsx` を追加
   - [ ] `components/ui/pagination.tsx` を追加

4. **型定義・API確認**
   - [ ] `types/microcms.ts` の存在確認（既存）
   - [ ] `lib/microcms.ts` の動作確認（既存）
   - [ ] microCMS APIキーの環境変数確認

5. **トップページ更新**
   - [ ] `app/page.tsx` を更新し、最新ブログ記事を表示
   - [ ] Heroセクション追加
   - [ ] "Coming Soon" メッセージを削除

#### 実装詳細

**app/blog/page.tsx の実装要件:**
```typescript
// 必要な機能:
- getBlogs() でブログ一覧取得
- ページネーション対応（1ページ10件）
- カテゴリフィルタリング（クエリパラメータ ?category=slug）
- BlogCard コンポーネントでレンダリング
- SEO metadata 生成
```

**app/blog/[id]/page.tsx の実装要件:**
```typescript
// 必要な機能:
- getBlogBySlug() でブログ詳細取得
- BlogContent コンポーネントで本文表示
- [CTA:dealId] shortcode のサポート
- 関連記事表示（relatedDeals）
- SEO/OGP metadata 生成
- generateStaticParams() で静的生成
```

**app/page.tsx の更新要件:**
```typescript
// 追加する機能:
- Heroセクション（キャッチコピー、CTA）
- 最新ブログ記事 3-6件表示
- カテゴリ一覧へのリンク
- サービス説明セクション
```

#### 動作確認項目
- [ ] `npm run dev` でエラーなく起動
- [ ] `/blog` にアクセスしてブログ一覧が表示される
- [ ] ページネーションが動作する
- [ ] `/blog/[slug]` でブログ詳細が表示される
- [ ] Markdownが正しくスタイリングされている（orange theme）
- [ ] [CTA:dealId] shortcode がボタンに変換される
- [ ] CTAボタンクリックで /api/track-click が呼ばれる
- [ ] `/category/[slug]` でカテゴリフィルタリングが動作する

---

### Task 3.2: microCMSコンテンツ登録
**優先度:** 🟡 中
**見積もり:** 1-2時間
**依存関係:** Task 3.1完了後

#### サブタスク
1. **Categories作成**
   - [ ] カテゴリ "クレジットカード" を作成（slug: credit-card）
   - [ ] カテゴリ "FX・投資" を作成（slug: fx-investment）
   - [ ] カテゴリ "美容・健康" を作成（slug: beauty-health）

2. **Deals登録**
   - [ ] A8.net案件を3-5件登録
     - dealId（例: "a8-rakuten-card"）
     - dealName（例: "楽天カード"）
     - aspName: "A8.net"
     - affiliateUrl（トラッキングURL）
     - rewardAmount, cashbackRate（20%）
     - thumbnail画像アップロード

3. **Blogs作成**
   - [ ] サンプルブログ記事を3-5件作成
   - [ ] Markdownフォーマットで本文作成
   - [ ] [CTA:dealId] shortcode を埋め込む
   - [ ] カテゴリ設定
   - [ ] relatedDeals 設定
   - [ ] thumbnail画像アップロード
   - [ ] SEO設定（metaTitle, metaDescription, ogImage）

#### コンテンツサンプル
```markdown
# 楽天カードの作り方完全ガイド

楽天カードは年会費無料で...（本文）

[CTA:a8-rakuten-card]

## ポイント還元率

楽天カードのポイント還元率は...
```

---

### Task 3.3: SEO/OGP最適化
**優先度:** 🟢 低
**見積もり:** 1-2時間
**依存関係:** Task 3.1, 3.2完了後

#### サブタスク
- [ ] 各ページのmetadata生成関数を確認
- [ ] OGP画像の動作確認（Twitter Card, Facebook）
- [ ] robots.txt 作成
- [ ] sitemap.xml 生成（Next.js dynamic sitemap）
- [ ] Google Search Console設定準備

---

## 🎯 Phase 4: 案件機能・成果追跡タスク（優先度: 🔴 高）

### Task 4.1: 案件一覧ページ実装
**優先度:** 🔴 高
**見積もり:** 3-4時間
**依存関係:** Task 3.1完了後（BlogCardコンポーネント参考）

#### サブタスク
1. **ページファイル作成**
   - [ ] `app/deals/page.tsx` を作成
   - [ ] 会員限定ページとして実装（middleware.ts で保護済み）

2. **コンポーネント作成**
   - [ ] `components/deal/deal-card.tsx` を作成
     - thumbnail, dealName, aspName, rewardAmount, cashbackRate 表示
     - "申し込む" ボタン → /api/track-click 呼び出し
   - [ ] `components/deal/deal-filter.tsx` を作成（カテゴリ、ASP別フィルタ）

3. **API統合**
   - [ ] `getDeals()` でmicroCMSから案件一覧取得
   - [ ] カテゴリフィルタリング実装
   - [ ] ASPフィルタリング実装
   - [ ] ソート機能（報酬額順、表示順）

4. **UI実装**
   - [ ] グリッドレイアウト（2-3カラム）
   - [ ] レスポンシブ対応
   - [ ] ページネーション実装

#### 実装詳細

**app/deals/page.tsx の実装要件:**
```typescript
// 必要な機能:
- getServerSession() で認証確認（middleware でも保護）
- getDeals() で案件一覧取得
- searchParams でフィルタ・ソート対応
- DealCard コンポーネントでレンダリング
- ページネーション（1ページ12件）
- SEO metadata 生成
```

**components/deal/deal-card.tsx の実装要件:**
```typescript
// 必要な機能:
- Deal型プロパティ受け取り
- サムネイル画像表示
- 報酬額・キャッシュバック額計算表示
- "申し込む" ボタン → handleApply()
- handleApply() で /api/track-click 呼び出し
- レスポンスのtrackingUrlへリダイレクト
- ローディング状態管理
```

#### 動作確認項目
- [ ] 非ログイン状態で /deals にアクセスすると /login にリダイレクト
- [ ] ログイン状態で /deals にアクセスすると案件一覧が表示される
- [ ] カテゴリフィルタが動作する
- [ ] ASPフィルタが動作する
- [ ] "申し込む" ボタンクリックでトラッキングURLが生成される
- [ ] Google Sheetsにクリックログが記録される
- [ ] ASPサイトへリダイレクトされる

---

### Task 4.2: 案件詳細ページ実装（オプション）
**優先度:** 🟢 低
**見積もり:** 2-3時間
**依存関係:** Task 4.1完了後

#### サブタスク
- [ ] `app/deals/[id]/page.tsx` を作成
- [ ] 詳細情報表示（description, thumbnail, 注意事項）
- [ ] "申し込む" ボタン実装
- [ ] 関連案件表示
- [ ] SEO metadata 生成

**注:** 現在の仕様では案件詳細ページは必須ではないため、優先度を下げる。

---

### Task 4.3: 成果履歴ページ実装
**優先度:** 🔴 高
**見積もり:** 3-4時間
**依存関係:** Task 4.1完了後

#### サブタスク
1. **ページファイル作成**
   - [ ] `app/mypage/history/page.tsx` を作成
   - [ ] 会員限定ページとして実装

2. **API作成**
   - [ ] `app/api/history/route.ts` を作成
     - getServerSession() で認証確認
     - getResultsByMemberId() でGoogle Sheetsから成果データ取得
     - レスポンス: `{ results: ResultRow[] }`

3. **UI実装**
   - [ ] テーブル表示（案件名、承認状況、キャッシュバック金額、日時）
   - [ ] ステータスバッジ（承認済み、未承認、否認）
   - [ ] 合計キャッシュバック金額表示
   - [ ] フィルタリング（承認状況別）
   - [ ] ソート機能（日時順）

#### 実装詳細

**app/api/history/route.ts の実装要件:**
```typescript
// GET /api/history
// 必要な機能:
- getServerSession() で認証確認
- session.user.memberId を取得
- getResultsByMemberId(memberId) で成果データ取得
- レスポンス: { results: ResultRow[] }
```

**app/mypage/history/page.tsx の実装要件:**
```typescript
// 必要な機能:
- useEffect() で /api/history を呼び出し
- テーブルで成果データ表示
- ステータスバッジの色分け
  - 承認済み: green
  - 未承認: yellow
  - 否認: red
- 合計キャッシュバック金額計算
- 空状態の表示（成果がない場合）
```

#### 動作確認項目
- [ ] /mypage/history にアクセスできる
- [ ] 成果データがテーブルで表示される
- [ ] ステータスバッジが正しく色分けされている
- [ ] 合計金額が正しく計算される
- [ ] 成果がない場合は空状態メッセージが表示される
- [ ] フィルタ・ソートが動作する

---

### Task 4.4: GAS連携動作確認
**優先度:** 🟡 中
**見積もり:** 2-3時間
**依存関係:** Task 4.1, 4.3完了後

#### サブタスク
1. **Google Sheetsデータ確認**
   - [ ] "会員リスト" シートに会員データが正しく記録されているか確認
   - [ ] "クリックログ" シートにクリックデータが正しく記録されているか確認
   - [ ] "成果CSV_RAW" シートにASPデータを手動で貼り付け

2. **GAS動作確認**
   - [ ] GAS code.gs を確認（docs/specs/google.md参照）
   - [ ] トリガー設定確認（毎日3:10実行）
   - [ ] 手動実行してprocessResults()の動作確認
   - [ ] "成果データ" シートに処理結果が出力されるか確認

3. **キャッシュバック計算確認**
   - [ ] 報酬額の20%が正しく計算されているか確認
   - [ ] 承認済み案件のみキャッシュバックが付与されているか確認
   - [ ] guest:UUID の場合は0円になっているか確認
   - [ ] 会員の場合はmemberIdと氏名が正しく紐付いているか確認

#### テストシナリオ
```
1. テスト会員でログイン
2. /deals で案件に申し込み → クリックログ記録
3. A8.netで成果発生（テスト環境）→ CSV出力
4. CSVを "成果CSV_RAW" に貼り付け
5. GASを手動実行
6. "成果データ" シートに結果が出力されることを確認
7. /mypage/history で成果が表示されることを確認
```

---

## 🎯 Phase 5: テスト・最適化・デプロイタスク（優先度: 🟡 中）

### Task 5.1: E2Eテスト実装
**優先度:** 🟡 中
**見積もり:** 4-6時間
**依存関係:** Phase 3, 4完了後

#### サブタスク
1. **Playwrightセットアップ**
   - [ ] `npm install -D @playwright/test` インストール
   - [ ] `playwright.config.ts` 作成
   - [ ] `tests/` ディレクトリ作成

2. **テストシナリオ作成**
   - [ ] `tests/auth.spec.ts` - 会員登録・ログイン・ログアウト
   - [ ] `tests/blog.spec.ts` - ブログ一覧・詳細表示
   - [ ] `tests/deals.spec.ts` - 案件一覧・申し込みフロー
   - [ ] `tests/tracking.spec.ts` - クリック追跡・リダイレクト
   - [ ] `tests/history.spec.ts` - 成果履歴表示

3. **CI統合**
   - [ ] GitHub Actions ワークフロー作成（.github/workflows/test.yml）
   - [ ] PR作成時にテスト自動実行
   - [ ] テスト失敗時はマージをブロック

---

### Task 5.2: パフォーマンス最適化
**優先度:** 🟡 中
**見積もり:** 3-4時間
**依存関係:** Phase 3完了後

#### サブタスク
1. **画像最適化**
   - [ ] next/image コンポーネント使用確認
   - [ ] microCMS画像のサイズ最適化（width, height指定）
   - [ ] WebP変換（microCMSのImage API利用）

2. **コード分割**
   - [ ] Dynamic Import 使用箇所の確認
   - [ ] 不要なクライアントコンポーネントをサーバーコンポーネント化
   - [ ] バンドルサイズ分析（`npm run build` で確認）

3. **キャッシング戦略**
   - [ ] microCMS APIのキャッシュ設定（revalidate）
   - [ ] Google Sheets APIのキャッシュ設定（検討）
   - [ ] ISR（Incremental Static Regeneration）設定

4. **Lighthouse監査**
   - [ ] Lighthouse CI セットアップ
   - [ ] Performance: 90+ 目標
   - [ ] Accessibility: 90+ 目標
   - [ ] Best Practices: 90+ 目標
   - [ ] SEO: 90+ 目標

---

### Task 5.3: セキュリティ監査
**優先度:** 🔴 高
**見積もり:** 2-3時間
**依存関係:** なし

#### サブタスク
1. **環境変数確認**
   - [ ] `.env.local` がgitignoreされているか確認
   - [ ] `.env.example` が最新か確認
   - [ ] Vercelに環境変数が正しく設定されているか確認

2. **認証・認可確認**
   - [ ] middleware.ts で保護されたルート確認
   - [ ] API routeでのセッション確認実装確認
   - [ ] CSRF保護確認（Next-Auth組み込み）

3. **入力バリデーション確認**
   - [ ] Zodスキーマによるバリデーション確認
   - [ ] XSS対策確認（React自動エスケープ）
   - [ ] SQL Injection対策確認（googleapis使用のため該当なし）

4. **依存関係監査**
   - [ ] `npm audit` 実行
   - [ ] 脆弱性のある依存関係の更新

---

### Task 5.4: Vercelデプロイ設定
**優先度:** 🔴 高
**見積もり:** 1-2時間
**依存関係:** Task 5.3完了後

#### サブタスク
1. **Vercel プロジェクト作成**
   - [ ] GitHubリポジトリ連携
   - [ ] mainブランチを本番環境に設定
   - [ ] devブランチをプレビュー環境に設定

2. **環境変数設定**
   - [ ] NEXTAUTH_SECRET (生成)
   - [ ] NEXTAUTH_URL (https://win2.vercel.app など)
   - [ ] MICROCMS_SERVICE_DOMAIN
   - [ ] MICROCMS_API_KEY
   - [ ] GOOGLE_APPLICATION_CREDENTIALS_JSON（Base64エンコード）
   - [ ] SPREADSHEET_ID
   - [ ] RESEND_API_KEY
   - [ ] RESEND_FROM_EMAIL

3. **ビルド設定**
   - [ ] Build Command: `npm run build`
   - [ ] Output Directory: `.next`
   - [ ] Install Command: `npm install`
   - [ ] Node.js Version: 18.x 以上

4. **カスタムドメイン設定（オプション）**
   - [ ] ドメイン購入（例: win2.jp）
   - [ ] Vercelにドメイン追加
   - [ ] DNS設定

5. **デプロイ確認**
   - [ ] 本番環境デプロイ成功確認
   - [ ] 全ページの動作確認
   - [ ] API routeの動作確認
   - [ ] Google Sheets連携の動作確認

---

## 🚀 Phase 6: 将来的な拡張タスク（優先度: 🟢 低）

### Task 6.1: 複数ASP対応
**優先度:** 🟢 低
**見積もり:** 6-8時間

#### サブタスク
- [ ] AFB API統合
- [ ] もしもアフィリエイトAPI統合
- [ ] バリューコマースAPI統合
- [ ] GASでのASP別処理分岐
- [ ] ASPごとのトラッキングパラメータ対応

---

### Task 6.2: 管理画面実装
**優先度:** 🟢 低
**見積もり:** 10-15時間

#### サブタスク
- [ ] 管理者認証（Next-Auth role拡張）
- [ ] 会員管理画面（/admin/members）
- [ ] 成果管理画面（/admin/results）
- [ ] ダッシュボード（/admin）
- [ ] CSV一括アップロード機能

---

### Task 6.3: 分析ダッシュボード
**優先度:** 🟢 低
**見積もり:** 8-10時間

#### サブタスク
- [ ] Google Analyticsタグ設置
- [ ] コンバージョン率分析
- [ ] 人気案件ランキング
- [ ] 会員別成果分析
- [ ] チャート表示（Recharts使用）

---

### Task 6.4: サブドメイン対応
**優先度:** 🟢 低
**見積もり:** 4-6時間

#### サブタスク
- [ ] gambling.win2.jp サブドメイン設定
- [ ] fortunetelling.win2.jp サブドメイン設定
- [ ] カテゴリ別コンテンツ分離
- [ ] サブドメインごとのデザインカスタマイズ

---

## 📋 即座に着手すべきタスク（推奨順序）

### 🔴 最優先（今すぐ着手）
1. **Task 3.1: ブログ機能統合** (2-3時間)
   - feature/phase2-advanced-featuresからのマージ
   - トップページ更新
   - 動作確認

2. **Task 3.2: microCMSコンテンツ登録** (1-2時間)
   - サンプルブログ記事作成
   - サンプル案件登録
   - [CTA:dealId] shortcode動作確認

3. **Task 4.1: 案件一覧ページ実装** (3-4時間)
   - /deals ページ作成
   - DealCardコンポーネント作成
   - フィルタリング実装

4. **Task 4.3: 成果履歴ページ実装** (3-4時間)
   - /mypage/history ページ作成
   - /api/history API作成
   - テーブル表示実装

### 🟡 次に着手（上記完了後）
5. **Task 4.4: GAS連携動作確認** (2-3時間)
6. **Task 5.3: セキュリティ監査** (2-3時間)
7. **Task 5.4: Vercelデプロイ設定** (1-2時間)
8. **Task 5.2: パフォーマンス最適化** (3-4時間)

### 🟢 余裕があれば着手
9. **Task 3.3: SEO/OGP最適化** (1-2時間)
10. **Task 5.1: E2Eテスト実装** (4-6時間)

---

## 📚 参照ドキュメント

- **要件定義:** `docs/specs/spec.md`
- **Google Sheets構成:** `docs/specs/google.md`
- **ASP認証情報:** `docs/specs/asp.md`
- **アーキテクチャ:** `docs/dev/architecture.md`
- **ブランチ戦略:** `docs/dev/branch.md`
- **プロジェクトガイド:** `CLAUDE.md`
- **ドキュメント索引:** `docs/index.md`

---

## 🔄 更新履歴

- **2025-10-29:** 初版作成（Phase 1-5の実装状況を反映）

---

## 今回の知見とルール更新提案

### 発見した問題・課題
- ブログ機能が feature/phase2-advanced-features ブランチに実装済みだが、現在のdevブランチには統合されていない
- Phase 3の80%が実装済みだが、コードベースが分散している
- Phase 4の案件機能の基盤（/api/track-click）は完成しているが、UIが未実装

### 解決した方法
- 詳細なtodo.mdを作成し、実装状況を可視化
- 優先度と見積もり時間を明記
- ブランチ統合戦略を提示
- 段階的な実装順序を推奨

### 推奨するルール追加・更新
- `docs/index.md` の更新履歴に todo.md 作成を追記
- プロジェクト進行時は todo.md を定期的に更新

### 次回同様のタスクで参照すべき情報
- `docs/specs/spec.md` の Phase チェックリスト
- 各ブランチの実装状況
- microCMS API構造（`types/microcms.ts`）
- Google Sheets API（`lib/sheets.ts`）

### 次に行うべきこと
1. **Task 3.1の着手準備:**
   - feature/blog-markdown-styling を dev にマージ
   - feature/phase2-advanced-features から必要ファイルを統合
2. **microCMSでサンプルコンテンツ作成**
3. **ブログ機能の動作確認**

---

**コミットメッセージ案:**
```
DOC: Create comprehensive todo.md with Phase 1-5 implementation status

- Document completed features (Phase 1-2: 100%, Phase 3: 80%, Phase 4: 50%)
- List remaining tasks with priority, estimates, and dependencies
- Provide detailed implementation requirements for each task
- Recommend immediate action items (Task 3.1, 3.2, 4.1, 4.3)
- Reference docs/specs/ documents for technical details
```
