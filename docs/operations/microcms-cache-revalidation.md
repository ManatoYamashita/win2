# microCMS キャッシュ再検証設定ガイド

## 概要
このドキュメントでは、microCMSのコンテンツ更新がデプロイ済みサイトに反映されない問題とその解決策（ISR設定）について説明します。

## 問題の背景

### 発生した問題
- microCMSでブログ記事やカテゴリを更新しても、デプロイ済みサイト（win-otoku.com）に変更が反映されない
- ユーザーは古いコンテンツを見続けてしまう

### 原因
Next.js 15のApp Routerでは、**デフォルトでfetchリクエストが無期限にキャッシュされる**仕様になっています。

- Server Componentsでのデータフェッチは自動的にキャッシュされる
- microCMS SDKは内部的にfetchを使用しているため、同様にキャッシュされる
- キャッシュ無効化の設定がない場合、コンテンツは一度ビルドされた時点で固定される

**参考**: [Next.js 15 Data Fetching and Caching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)

## 解決策: ISR（Incremental Static Regeneration）

### ISRとは
ISRは、静的生成されたページを一定時間ごとに自動的に再生成する機能です。

**利点**:
- ✅ サーバー負荷が低い（毎回APIを呼ばない）
- ✅ 実装が簡単
- ✅ ユーザーエクスペリエンスとパフォーマンスのバランスが良い

**欠点**:
- ⚠️ 更新が即座に反映されない（最大60秒の遅延）

### 実装方法

#### 1. microCMS関数にrevalidateオプションを追加

**ファイル**: `lib/microcms.ts`

```typescript
export const getBlogs = async (queries?: BlogQueries) => {
  if (!client) {
    return emptyList<BlogResponse>();
  }

  const listData = await client.getList<BlogResponse>({
    endpoint: "blogs",
    queries: {
      ...queries,
      fields: queries?.fields || "id,title,content,thumbnail,...",
    },
    customRequestInit: {
      next: { revalidate: 60 }, // 60秒ごとに再検証
    },
  });
  return listData;
};
```

**適用した関数**:
- `getBlogs()` - ブログ一覧取得
- `getBlogById()` - ブログ詳細取得
- `getCategories()` - カテゴリ一覧取得
- `getCategoryById()` - カテゴリ詳細取得

#### 2. ページコンポーネントにrevalidate設定を追加

**対象ファイル**:
- `app/page.tsx` (ホームページ)
- `app/blog/page.tsx` (ブログ一覧)
- `app/blog/[id]/page.tsx` (ブログ詳細)
- `app/category/[id]/page.tsx` (カテゴリページ)

```typescript
// ISR: 60秒ごとに再検証
export const revalidate = 60;
```

#### 3. APIルートにrevalidate設定を追加

**ファイル**: `app/api/blogs/route.ts`

```typescript
// ISR: 60秒ごとに再検証
export const revalidate = 60;

export async function GET(request: NextRequest) {
  // ...
}
```

## 動作確認手順

### 1. 開発環境での確認
```bash
# ビルドして本番モードで起動
npm run build
npm run start

# ブラウザで http://localhost:3000 にアクセス
```

### 2. 本番環境での確認
1. microCMSでコンテンツを更新（例: ブログ記事のタイトル変更）
2. **60秒待機**（最大遅延時間）
3. win-otoku.comにアクセスして変更を確認
4. ページをリロードしても古いコンテンツが表示される場合は、さらに60秒待機

### 3. デバッグ方法
```bash
# Next.jsビルド時のキャッシュ情報を確認
npm run build

# 出力例:
# ○ (Static)  automatically rendered as static HTML (uses no initial props)
# ƒ (Dynamic) server-rendered on demand
```

- `○` マークが付いている場合: 静的生成 + ISR
- `ƒ` マークが付いている場合: 毎回サーバーレンダリング（revalidateが効いていない）

## 代替案

### オプション1: キャッシュ完全無効化（非推奨）
リアルタイム更新が必要な場合。

```typescript
export const getBlogs = async (queries?: BlogQueries) => {
  const listData = await client.getList<BlogResponse>({
    endpoint: "blogs",
    queries,
    customRequestInit: {
      cache: 'no-store', // キャッシュを完全に無効化
    },
  });
  return listData;
};
```

**欠点**:
- ❌ サーバー負荷が高い
- ❌ ページ表示速度が遅くなる
- ❌ microCMS APIレート制限に到達しやすい

### オプション2: On-Demand Revalidation（最も高度）
microCMSのWebhook機能を使用して、コンテンツ更新時に即座に再検証。

**実装手順**:
1. Next.js APIルートを作成
```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');

  // シークレットキー検証
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json();
  const contentId = body.id;
  const api = body.api; // "blogs" or "categories"

  // 該当ページを再検証
  if (api === 'blogs') {
    revalidatePath(`/blog/${contentId}`);
    revalidatePath('/blog');
  }

  return NextResponse.json({ revalidated: true });
}
```

2. microCMSのWebhook設定
   - microCMS管理画面 → API設定 → Webhook
   - URL: `https://win-otoku.com/api/revalidate?secret=YOUR_SECRET`
   - トリガー: 公開時、更新時

**利点**:
- ✅ 即座に反映（数秒以内）
- ✅ サーバー負荷が低い

**欠点**:
- ⚠️ 実装が複雑
- ⚠️ セキュリティ設定が必要

## トラブルシューティング

### 問題1: 60秒待っても更新が反映されない

**原因**:
- ブラウザキャッシュが残っている
- CDNキャッシュが残っている（Vercel）

**解決策**:
```bash
# 1. ブラウザのハードリロード
# - Chrome/Edge: Ctrl + Shift + R (Windows) / Cmd + Shift + R (Mac)
# - Safari: Cmd + Option + R

# 2. Vercelキャッシュをクリア
# Vercel Dashboard → Deployments → ... → Clear Cache and Redeploy
```

### 問題2: ビルドエラーが発生する

**エラー例**:
```
Error: Page "/blog/[id]" is using both "revalidate" and "dynamic = 'force-static'"
```

**解決策**:
- `dynamic = 'force-static'` の記述を削除
- `revalidate` のみを使用

### 問題3: microCMS APIレート制限に到達

**エラー例**:
```
429 Too Many Requests
```

**解決策**:
- revalidate時間を延長（60秒 → 120秒 or 300秒）
- microCMSプランをアップグレード

## 設定値の推奨

| ページタイプ | 推奨revalidate値 | 理由 |
|------------|----------------|------|
| ホームページ | 60秒 | 頻繁に更新されるコンテンツ |
| ブログ一覧 | 60秒 | 新規記事公開時に早めに反映 |
| ブログ詳細 | 60秒 | 記事修正時に早めに反映 |
| カテゴリページ | 60秒 | カテゴリ情報変更時に早めに反映 |
| 静的ページ | 300秒（5分） | ほとんど更新されない |

## 参考資料

- [Next.js 15 Data Fetching and Caching](https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating)
- [Next.js ISR Documentation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [microCMS Webhook Documentation](https://document.microcms.io/manual/webhook)
- [Vercel Deployment Caching](https://vercel.com/docs/concepts/edge-network/caching)

## 変更履歴

| 日付 | 変更内容 | 担当者 |
|------|---------|--------|
| 2025-11-17 | 初版作成（ISR 60秒設定） | Claude AI |

---

**最終更新**: 2025-11-17
