# WIN×Ⅱ — 会員制キャッシュバック・ブログプラットフォーム

![WIN×Ⅱ OGP](public/ogp.jpg)

> microCMS と Google Sheets を核に、会員の行動を成果に変換する Next.js 15 製フルスタックアプリケーション。

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)](https://vercel.com/)

---

## 1. プロダクト概要
- ASP案件を紹介し、成果の20%を会員にキャッシュバックする会員制ブログ/メディア。
- microCMS でコンテンツ管理、Google Sheets で会員・成果データを一元集計。
- 会員/ゲスト双方を識別してクリックをトラッキングし、成果と紐付け。
- 包括的SEO（OGP/JSON-LD/構造化データ）を全ページで適用。

## 2. ハイライト
- **トラッキング精度**: 会員IDまたは guest:UUID を id1 パラメータとして付与し、クリックログに記録。
- **ハイブリッド成果反映**: A8.net（手動CSV）＋ AFB（API自動ポーリング）のハイブリッド運用を設計済み。
- **安全な認証**: Next-Auth (CredentialsProvider) + bcrypt ハッシュ。メール認証/パスワードリセットも実装済み（Feature Flag付き）。
- **CMS駆動の運用性**: microCMS でブログ・案件・カテゴリを一元管理。CTA ショートコードで記事内に案件ボタンを自動挿入。
- **UX最適化**: App Router + Turbopack による高速開発体験、包括的な SEO メタデータ、レスポンシブデザイン。

## 3. アーキテクチャ
```
Next.js 15 (App Router, RSC)
 ├─ microCMS (blogs / deals / categories)
 ├─ Google Sheets (会員リスト / クリックログ / 成果データ / 成果CSV_RAW)
 ├─ Next-Auth (CredentialsProvider)
 └─ Resend (メール認証・パスワードリセット) *Feature Flag
```
- 三層データ構造: microCMS（コンテンツ） / Google Sheets（会員・成果ログ） / Next.js API（集約・変換）
- クリック計測: `/api/track-click` でログ記録 → ASPへリダイレクト（id1, id2付与）
- 成果反映: GAS が日次処理し、会員マイページで閲覧

## 4. 主要機能
- 会員登録・ログイン・マイページ（履歴閲覧/情報更新）
- ブログ一覧・詳細・カテゴリページ（SEO対応・構造化データ）
- CTAショートコード (`[CTA:dealId]`) で記事内に案件ボタンを自動生成
- 成果トラッキング（会員/ゲスト対応）、クリックログ保存、id1パラメータ付与
- メール認証／パスワードリセット（Resend、Feature Flag制御）

## 5. 技術スタック
- **Frontend/Backend**: Next.js 15, React 19, TypeScript 5 (strict, noUncheckedIndexedAccess)
- **Styling/UI**: TailwindCSS 3.4, shadcn/ui, Radix UI primitives
- **Content**: microCMS v3.2.0
- **Data/Tracking**: Google Sheets API (googleapis v164.1.0)
- **Auth**: Next-Auth v4.24.11 (CredentialsProvider), bcryptjs v3.0.2
- **Validation**: zod v4.1.12
- **Infra**: Vercel（デプロイ対象）

## 6. クイックスタート
```bash
git clone <repository-url>
cd win2
npm install
cp .env.example .env.local
# .env.local を必要な値で編集
npm run dev   # http://localhost:3000
```

### 必須環境変数（抜粋）
```bash
# microCMS
MICROCMS_SERVICE_DOMAIN=xxx
MICROCMS_API_KEY=xxx

# Google Sheets
GOOGLE_SHEETS_CLIENT_EMAIL=xxx
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPREADSHEET_ID=xxx

# Auth / App
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
その他の変数は `.env.example` を参照。

### よく使うスクリプト
- 開発: `npm run dev`
- Lint: `npm run lint`
- 型チェック: `npx tsc --noEmit`
- 本番ビルド: `npm run build` → `npm run start`

## 7. ディレクトリ（抜粋）
```
app/              # App Router（ページ・API）
components/       # UI/レイアウト/ブログ・CTAなど
lib/              # microCMS/Sheets/Auth/Validation
docs/             # 仕様・ガイド・運用ドキュメント
public/ogp.jpg    # カバー画像 (OGP)
```

## 8. 主要APIとフロー
- `/api/track-click`: クリックログ記録＋ASPリダイレクトURL生成（id1=id, id2=eventId 付与）
- `/api/register`: 会員登録（Google Sheets 書き込み）
- `/api/members/me`: 会員情報取得/更新
- `/api/auth/[...nextauth]`: 認証・セッション管理
- `/api/verify-email`, `/api/reset-password`: メール認証・パスワードリセット（Feature Flag）

## 9. セキュリティと運用
- パスワードは bcrypt でハッシュ化（salt rounds: 10）
- セッションは Next-Auth 管理（HttpOnly/Secure cookie）
- .env* はコミット禁止
- GAS は 3:10 JST に日次実行（成果CSV_RAW → 成果データ）

## 10. ロードマップ（抜粋）
- 案件一覧ページ（会員限定フィルタリング）
- 詳細検索（ブログ・案件横断）
- 通知設定、プロフィール編集
- Lighthouse 90+ 最適化

## 11. ドキュメント
- `docs/index.md` — ドキュメント索引
- `docs/specs/spec.md` — 要件定義
- `docs/guides/cta-technical-guide.md` — CTA実装詳細
- `docs/seo-implementation.md` — SEO/OGP/構造化データ
- `docs/operations/` — A8/AFB ハイブリッド運用手順
- `CLAUDE.md` — 開発者向けガイド

## 12. ライセンス / 連絡先
- 本プロジェクトはプライベート利用を想定しています。
- ご質問・ご提案はプロジェクトオーナーまで。
