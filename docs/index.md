# ドキュメント エンドポイント（docs/index.md）

## 概要
`docs/` 配下に保管される本プロジェクト（WIN×Ⅱ）のドキュメントの索引（インデックス）および運用ルールの"単一の入口"です。ドキュメントの追加・更新が発生した際は、本ファイルを必ず更新してください。

- プロジェクト: WIN×Ⅱ（会員制アフィリエイトブログプラットフォーム）
- 対象領域: 要件定義、アーキテクチャ、外部連携情報、開発規約、ワークフロー、運用、改善提案、メモ/知見 など
- 目的: 検索性と一貫性の向上、知見の継続的蓄積（PDCA運用）

---

## インデックス（docs ツリー）

```text
docs/
├── index.md                  ← 本ファイル（ドキュメント索引・運用ルール）
│
├── specs/                    ← プロジェクト仕様・外部連携情報
│   ├── spec.md              ← WIN×Ⅱ プロジェクト要件定義書（システム設計・機能要件）
│   ├── google.md            ← Google Sheets (win2_master) 構成・GAS仕様
│   └── asp.md               ← ASP認証情報（A8.net, AFB, もしも, バリュコマ）
│
└── dev/                      ← 開発ワークフロー・規約
    ├── architecture.md      ← アーキテクチャ詳細・ディレクトリ構成・設定ファイル解説
    └── branch.md            ← Git ブランチ戦略・CI/CD・コミット規約
```

### ドキュメント概要

#### `specs/` - 仕様・外部連携

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **spec.md** | プロジェクト要件定義書 | 技術スタック、データフロー、API設計、画面設計、開発フェーズ |
| **google.md** | Google Sheets構成 | 会員リスト、クリックログ、成果データ、GASコード |
| **asp.md** | ASP認証情報 | A8.net, AFB, もしも, バリューコマース のログイン情報 |

#### `dev/` - 開発規約

| ファイル | 内容 | 主要トピック |
|---------|------|------------|
| **architecture.md** | アーキテクチャ詳細 | ディレクトリ構成、TypeScript/TailwindCSS設定、実装済み機能、データフロー |
| **branch.md** | ブランチ戦略 | 2ブランチ管理（dev/main）、PR規約、コミットメッセージ形式、CI/CD |

### 今後追加が想定されるドキュメントカテゴリ

必要に応じて、以下のディレクトリ/ファイルを追加して構いません：

- `architecture/` - アーキテクチャ決定記録（ADR）、システム図
- `api/` - API仕様書、エンドポイント詳細
- `deployment/` - デプロイ手順、環境設定
- `testing/` - テスト戦略、テストケース
- `operations/` - 運用手順、トラブルシューティング
- `guides/` - 開発者向けガイド、オンボーディング資料

---

## 運用ルール（必須）

### 1. ドキュメント追加・更新時

1. 該当する `docs/` 配下の既存ファイルを更新するか、適切なディレクトリに新規 `*.md` を作成する
2. 変更後は必ず本ファイル（`docs/index.md`）を更新し、
   - ツリー（インデックス）を最新化
   - ドキュメント概要テーブルに新規ファイルを追加
   - 必要であれば簡単な「更新概要」を追記
3. コミットメッセージは `DOC:` プレフィックスで始める
   - 例: `DOC: Add API endpoint specification`
   - 例: `DOC: Update Google Sheets GAS code reference`

### 2. プルリクエスト・レビュー時

4. 変更規模が大きい場合は PR の説明に「対象ファイル・目的・影響範囲・運用変更点」を明記する
5. レビュー時は `docs/index.md` の更新漏れを確認する

### 3. 秘匿情報の管理

6. **PII/秘匿情報の取り扱い**:
   - `docs/specs/asp.md` には ASP 認証情報が含まれるため、**パブリックリポジトリには含めない**
   - 秘匿情報は `.gitignore` に追加するか、環境変数・シークレット管理サービスで管理
   - 社外提供するドキュメントは `docs/` から秘匿情報を除外したものを提供

---

## 追加ガイドライン

### 命名規則

- ドキュメントは目的が分かる短い英語名（`kebab-case.md` 推奨）
- 日本語ファイル名も許容（既存: `google.md`, `asp.md` など）
- カテゴリディレクトリは英語（`specs/`, `dev/`, `api/` など）

### 分割基準

- 1ファイルが 300 行を超える、もしくは領域が明確に分かれる場合はファイル/ディレクトリ分割
- 例: `specs/spec.md` が肥大化した場合、`specs/requirements.md`, `specs/api-design.md` に分割

### リンク方針

- 可能な限り相対リンクで相互参照
  - 例: `[要件定義書](./specs/spec.md)`
  - 例: `[Google Sheets仕様](./specs/google.md)`
- ルートレベルの `CLAUDE.md` や `README.md` からは絶対パス使用可

### アーカイブ

- 古い情報は「背景・経緯」を残して更新、または `archive/` へ移動
- フェーズ完了時のドキュメントは `archive/phase-1/` のように整理

---

## 更新フロー（PDCA）

本プロジェクトは PDCAサイクルによる継続的改善を重視します（詳細は `../CLAUDE.md` 参照）。

- **PLAN**: 既存の `docs/` と `docs/index.md` を確認し、追加/更新対象と適用ルールを決定
- **DO**: 対象の `*.md` を作成/更新。必要に応じてディレクトリを新設
- **CHECK**: 体裁・リンク切れ・索引（本ファイル）の更新漏れを確認
- **ACTION**: 不足ルールや運用改善点を追記し、次回の改善へフィードバック

---

## Task Master AI 統合

本プロジェクトは Task Master AI による タスク管理・PDCA運用 を採用しています。

### 関連ファイル

- `../.taskmaster/CLAUDE.md` - Task Master AI の使用方法・統合ガイド
- `../.taskmaster/config.json` - AI モデル設定
- `../.taskmaster/tasks/tasks.json` - タスク管理データベース

### ドキュメントとの連携

- タスク実装時に得られた知見は、適切な `docs/` 配下のファイルに反映する
- 新しいアーキテクチャ決定や運用ルールは `docs/architecture/` や `docs/operations/` に記録
- Task Master の `update-subtask` コマンドで記録した実装ノートは、必要に応じてドキュメント化

詳細は `../.taskmaster/CLAUDE.md` を参照してください。

---

## 更新履歴

このセクションは、ドキュメントの主要な更新を記録します。

### 2025-10-29

#### ブログ機能の完全統合（Phase 3完了）
- **feature/phase2-advanced-features からブログ機能を統合**
  - `app/blog/page.tsx`: ブログ一覧ページ（ページネーション対応）
  - `app/blog/[id]/page.tsx`: ブログ詳細ページ（SEO/OGP対応）
  - `app/category/[id]/page.tsx`: カテゴリページ（フィルタリング対応）
  - `components/blog/blog-card.tsx`: ブログカードコンポーネント
  - `components/deal/deal-cta-button.tsx`: 案件CTAボタンコンポーネント
  - `components/ui/pagination.tsx`: ページネーションコンポーネント
  - `lib/blog-utils.ts`: ブログユーティリティ（excerpt生成）
  - `lib/utils.ts`: formatDate関数追加（日本語日付フォーマット）
  - `app/page.tsx`: トップページに最新ブログ記事6件表示
  - **型修正**: Blog.category を Category[] 配列型に対応
  - **ステータス**: Phase 3（ブログ機能）完全実装完了、microCMS連携確認済み

#### Markdownパース機能の完全化とスタイリング最適化
- **@tailwindcss/typography プラグイン統合**
  - `tailwind.config.ts`: typographyプラグインを追加
  - `components/blog/blog-content.tsx`: proseクラスをオレンジテーマに最適化
    - 見出し（H1-H6）のスタイリング強化
    - リスト（ul/ol）、引用（blockquote）のデザイン改善
    - コードブロック（inline/block）のシンタックスハイライト対応
    - テーブル、画像、リンクのレスポンシブ対応
  - `react-markdown`, `remark-gfm`, `rehype-raw`: 再インストール（devブランチに追加）
  - `lib/sheets.ts`: TypeScript型エラー修正（parseFloat型安全性向上）
  - **ステータス**: Markdown表示機能完全対応、スタイリング最適化完了

### 2025-01-25
- **Phase 1 実装状況を反映**
  - `specs/spec.md`: 技術スタックに具体的なバージョン番号を追加（Next.js 15.1.4、React 19、TailwindCSS v3.4.1 等）
  - `specs/spec.md`: Phase 1 チェックリストを更新し、70%完了状況を反映
  - 完了項目: Next.js初期化、TailwindCSS、microCMS SDK、Google Sheets API、shadcn/ui、基本レイアウト
  - 実装中: Next-Auth設定
  - `dev/architecture.md`: 新規作成（ディレクトリ構成とTypeScript設定の詳細を文書化）
  - 本ファイル（`index.md`）: 更新履歴セクション追加

---

## 参照ドキュメント

本プロジェクトの全体像を理解するには、以下のドキュメントを参照してください：

- `../CLAUDE.md` - プロジェクト概要・アーキテクチャ・開発ガイド（Claude Code向け）
- `./specs/spec.md` - WIN×Ⅱ 要件定義書（必読）
- `./dev/branch.md` - Git ブランチ戦略・コミット規約
- `../.taskmaster/CLAUDE.md` - Task Master AI 統合ガイド
