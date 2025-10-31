# 開発環境セットアップガイド

WIN×Ⅱ プロジェクトで統一されたローカル開発環境を準備する手順をまとめたドキュメントです。Node.js のバージョン管理、Next.js コマンドの利用方法、主要な環境変数の扱いをここで確認してください。

最終更新日: 2025-02-14

---

## Node.js / npm

- 標準バージョン: **Node.js 22.21.1 (npm 10.9.4)**  
  `nvm` を利用してインストール・切り替えを行います。

```bash
# 初回セットアップ例
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

nvm install 22
nvm use 22
nvm alias default 22
```

> **Note**: `.nvmrc` に `22.21.1` を追記することで `nvm use` で自動的に切り替わります。

---

## Next.js コマンド

`package.json` のスクリプトは Turbopack をデフォルトで利用するように構成されています。

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | `next dev --turbo` を起動。開発用サーバーを Turbopack で高速化。 |
| `npm run build` | `next build --turbo` により本番ビルドを実行。 |
| `npm run start` | Turbopack でビルド済みの成果物を提供。 |
| `npm run lint` | Next.js 同梱 ESLint を用いた静的解析。 |

ビルドや lint の前には `nvm use 22` で Node バージョンを揃えてから実行してください。

---

## 環境変数

| 変数名 | 用途 | 設定例 |
| --- | --- | --- |
| `NEXTAUTH_SECRET` | NextAuth.js のセッション暗号化 / サイン用秘密鍵 | `openssl rand -base64 32` で生成 |
| `MICROCMS_SERVICE_DOMAIN` | microCMS サービスドメイン | `win2-example` |
| `MICROCMS_API_KEY` | microCMS API キー | 管理画面から取得 |

`.env.local` を基準とし、秘匿値はリポジトリにコミットしないでください。テンプレートとして `.env.example` を参照します。

### NEXTAUTH_SECRET の発行例

```bash
openssl rand -base64 32
# または
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
# または
npx next-auth secret
```

---

## チェックリスト

- [ ] `nvm use 22` を実行し、`node -v` が `v22.21.1` であることを確認したか
- [ ] `npm install` 後、`npm run lint` → `npm run build` が成功するか
- [ ] `.env.local` に必要な環境変数を設定したか
- [ ] Turbopack によるビルドログが出力されているか（`Next.js 15.x (Turbopack)` の表示）

---

## トラブルシューティング

- **Node.js のバージョンが古い**  
  → `nvm install 22 && nvm use 22` を再実行し、`npm rebuild` を試します。

- **Turbopack が有効化されない**  
  → `node_modules` を削除後 `npm install` をやり直し、`npm run build` のログに `(Turbopack)` 表記があるか確認してください。

- **環境変数が適用されない**  
  → `.env.local` の保存場所と記法を見直し、開発サーバーを再起動します。

---

## ドキュメント更新ルール

- Node.js / npm のバージョン、Next.js の主要設定が変わった場合は本ドキュメントを最優先で更新してください。
- 新しい必須環境変数やセットアップ手順が追加された場合は、`docs/index.md` と本書を同時に修正します。
