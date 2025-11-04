# Git Workflow - 安全な開発フロー

このドキュメントは、WIN×IIプロジェクトにおけるGit運用のベストプラクティスを定義します。

## ブランチ運用ルール

### ブランチ命名規則

```
feature/{機能名}  # 新機能開発
fix/{修正内容}    # バグ修正
docs/{ドキュメント名}  # ドキュメント更新
hotfix/{緊急修正}  # 本番環境の緊急修正
```

**命名例**:
- `feature/blog-design-update`
- `fix/auth-session-timeout`
- `docs/api-documentation`
- `hotfix/payment-error`

### ブランチ階層

```
main (本番環境)
 ↑
dev (開発環境) ← featureブランチをここにマージ
 ↑
feature/* (機能開発ブランチ)
```

**重要**: featureブランチは常に`dev`から作成し、`dev`にマージします。

---

## ブランチ切り替え前のチェックリスト

### 1. 作業状態の確認

```bash
git status
```

**確認項目**:
- [ ] Untracked files (新規ファイル)
- [ ] Modified files (変更ファイル)
- [ ] Staged files (ステージング済みファイル)

### 2. 未コミット変更の処理

**オプションA: コミットする**
```bash
git add .
git commit -m "WIP: 作業中の内容"
```

**オプションB: 一時保存する（stash）**
```bash
git stash push -m "作業中: 機能名"
# ブランチ切り替え後に復元
git stash pop
```

### 3. 切り替え先ブランチの最新化

```bash
git checkout dev
git pull origin dev
git checkout -b feature/new-feature  # 新規ブランチ作成
```

---

## PRマージフロー

### 1. PR作成前

```bash
# ローカルでdevの最新を取り込む
git fetch origin dev
git merge origin/dev

# コンフリクトがある場合は解決
# → 手動解決 → git add . → git commit

# ビルドテスト
npm run build

# 問題なければプッシュ
git push origin feature/your-branch
```

### 2. GitHub上でPR作成

**PRテンプレート**:
```markdown
## 変更内容
- 機能Aを追加
- バグBを修正

## 影響範囲
- app/blog/page.tsx
- components/blog/blog-card.tsx

## テスト確認
- [ ] ローカルビルド成功
- [ ] TypeScript型チェック通過
- [ ] 主要ページの動作確認
```

### 3. マージ前確認

**自動チェック**:
- [ ] GitHub ActionsのCIが成功
- [ ] コンフリクトがない
- [ ] ビルドエラーがない

**手動チェック**:
- [ ] コードレビュー（必要に応じて）
- [ ] デザイン確認
- [ ] レスポンシブデザイン確認

### 4. マージ後

```bash
# ローカルのdevブランチを最新化
git checkout dev
git pull origin dev

# 不要になったブランチを削除（オプション）
git branch -d feature/your-branch
```

---

## コンフリクト解決フロー

### 1. コンフリクトの検出

```bash
git merge origin/dev
# Auto-merging app/blog/page.tsx
# CONFLICT (content): Merge conflict in app/blog/page.tsx
```

### 2. コンフリクトファイルの確認

```bash
git status
# Unmerged paths:
#   both modified:   app/blog/page.tsx
```

### 3. 解決戦略の選択

**戦略A: 手動編集**
```bash
# エディタでファイルを開き、コンフリクトマーカーを解決
# <<<<<<< HEAD
# =======
# >>>>>>> origin/dev
```

**戦略B: 一方を優先**
```bash
# HEADの変更を優先（自分の変更）
git checkout --ours app/blog/page.tsx

# origin/devの変更を優先（リモートの変更）
git checkout --theirs app/blog/page.tsx
```

### 4. 解決後のフロー

```bash
# 解決したファイルをステージング
git add app/blog/page.tsx

# ビルドテストで確認
npm run build

# マージコミット作成
git commit -m "MERGE: Resolve conflicts with origin/dev"

# プッシュ
git push origin feature/your-branch
```

---

## コミットメッセージ規約

### フォーマット

```
PREFIX: 変更内容の簡潔な説明

詳細説明（オプション）
- 変更点1
- 変更点2

関連Issue: #123
```

### プレフィックス一覧

| PREFIX | 用途 | 例 |
|--------|------|-----|
| FEATURE | 新機能追加 | `FEATURE: ブログ一覧ページのデザイン刷新` |
| FIX | バグ修正 | `FIX: ログイン時のセッションタイムアウト修正` |
| REFACTOR | リファクタリング | `REFACTOR: blog-card コンポーネントの型安全性向上` |
| DOC | ドキュメント更新 | `DOC: Git workflow ガイド追加` |
| STYLE | スタイル変更（機能変更なし） | `STYLE: Tailwind class の整理` |
| TEST | テスト追加/修正 | `TEST: blog-utils の単体テスト追加` |
| CHORE | ビルド・設定変更 | `CHORE: ESLint ルール更新` |
| MERGE | マージコミット | `MERGE: Resolve conflicts with origin/dev` |

### コミット例

```bash
git commit -m "FEATURE: 共通Headerコンポーネント実装

- WIN×II ロゴとナビゲーション追加
- ログイン/ログアウト状態の切り替え対応
- レスポンシブデザイン対応（ハンバーガーメニュー）

関連Issue: #42
"
```

---

## 緊急時の対応

### コミットを取り消す（未プッシュ）

```bash
# 直前のコミットを取り消し、変更はワーキングツリーに戻す
git reset --soft HEAD~1

# 直前のコミットを完全に削除
git reset --hard HEAD~1
```

### プッシュ済みコミットの修正

```bash
# 注意: プッシュ済みの場合は force push が必要
# チーム開発では避けるべき

git reset --hard HEAD~1
git push --force origin feature/your-branch
```

### ブランチをリセットする

```bash
# ローカルブランチをリモートの状態に完全にリセット
git fetch origin
git reset --hard origin/feature/your-branch
```

---

## よくある問題と解決方法

### 問題1: マージ後もGitHub上でコンフリクトが表示される

**原因**: ローカルで古いバージョンのorigin/devとマージした

**解決方法**:
```bash
git fetch origin dev
git merge origin/dev
# コンフリクト解決 → ビルドテスト
git push origin feature/your-branch
```

### 問題2: package-lock.jsonのコンフリクト

**解決方法**:
```bash
# origin/devの package-lock.json を採用
git checkout --theirs package-lock.json
git add package-lock.json

# npm install で再生成
npm install

# 再生成されたファイルをステージング
git add package-lock.json
git commit -m "MERGE: Regenerate package-lock.json"
```

### 問題3: ブランチ切り替え時にエラー

```
error: Your local changes to the following files would be overwritten by checkout
```

**解決方法**:
```bash
# 一時保存してから切り替え
git stash
git checkout target-branch
git stash pop  # 必要に応じて
```

---

## ベストプラクティス

### 1. 頻繁な小さいコミット

❌ **悪い例**: 1週間分の作業を1コミット
```bash
git commit -m "色々修正"
```

✅ **良い例**: 機能単位で細かくコミット
```bash
git commit -m "FEATURE: Header コンポーネント作成"
git commit -m "FEATURE: Footer コンポーネント作成"
git commit -m "REFACTOR: layout.tsx を Header/Footer で更新"
```

### 2. ビルドテストを忘れない

```bash
# コミット前に必ず実行
npm run build
npm run lint
```

### 3. PRは小さく保つ

- 1つのPRで1つの機能
- レビューしやすいサイズ（300行以下が目安）
- 大きな機能は複数のPRに分割

### 4. 定期的にdevと同期

```bash
# 週に1回、または長期featureブランチの場合
git fetch origin dev
git merge origin/dev
```

---

## まとめ

このワークフローに従うことで:
- ✅ コンフリクトの発生を最小化
- ✅ 安全なブランチ切り替え
- ✅ チーム開発でのコード品質維持
- ✅ 問題発生時の迅速な対応

最終更新日: 2025-10-29
