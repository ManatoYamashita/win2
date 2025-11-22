# クライアントサイドデータ処理アーキテクチャ

**最終更新日**: 2025-11-22
**対象**: Next.js 15 App Router / React 19 / TypeScript 5

## 概要

このドキュメントは、WIN×Ⅱプロジェクトにおけるクライアントサイドでのデータ処理（フィルタリング、ソート、検索）のベストプラクティスとアーキテクチャパターンを定義します。

---

## 基本方針

### クライアントサイド vs サーバーサイド処理の判断基準

| データ量 | 処理方式 | 理由 |
|---|---|---|
| **~100件** | クライアントサイド | サーバー往復コスト > 処理コスト、UX向上 |
| **100~1000件** | クライアントサイド（条件付き） | useMemoメモ化必須、パフォーマンス監視 |
| **1000件~** | サーバーサイド | APIクエリパラメータ + ページネーション推奨 |

**現状**: 申し込み履歴は数十~数百件想定のため、クライアントサイド処理を採用。

---

## useMemoを活用したパフォーマンス最適化

### 基本パターン

#### 1. フィルタリング処理
```typescript
const filteredData = useMemo(() => {
  return data.filter((item) => {
    // 検索クエリフィルタ
    if (searchQuery && !item.name.includes(searchQuery)) {
      return false;
    }

    // ステータスフィルタ
    if (statusFilter.size > 0 && !statusFilter.has(item.status)) {
      return false;
    }

    return true;
  });
}, [data, searchQuery, statusFilter]);
```

**ポイント**:
- 依存配列: `[data, searchQuery, statusFilter]` - 変更時のみ再計算
- 早期リターン: 不要な処理をスキップ（`if (!condition) return false`）

#### 2. ソート処理
```typescript
const sortedData = useMemo(() => {
  const sorted = [...filteredData]; // 元配列を破壊しない

  sorted.sort((a, b) => {
    if (sortKey === "timestamp") {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    }
    // その他のソートキー...
    return 0;
  });

  return sorted;
}, [filteredData, sortKey, sortOrder]);
```

**ポイント**:
- スプレッド演算子で新配列作成（元データを保護）
- 依存配列: `[filteredData, sortKey, sortOrder]`
- 数値ソートは`localeCompare`不要（日時・金額）

#### 3. 2段階処理パターン（推奨）
```typescript
// フェーズ1: フィルタリング
const filteredHistory = useMemo(() => {
  return history.filter(...);
}, [history, searchQuery, statusFilter]);

// フェーズ2: ソート（フィルタ済みデータに対して）
const sortedAndFilteredHistory = useMemo(() => {
  const sorted = [...filteredHistory];
  sorted.sort(...);
  return sorted;
}, [filteredHistory, sortKey, sortOrder]);
```

**メリット**:
- フィルタ条件変更時、ソート処理は再実行されない（filteredHistoryが同じ場合）
- ソート条件変更時、フィルタ処理は再実行されない
- 依存関係が明確で保守性が高い

---

## Set型を活用した高速フィルタリング

### 複数選択フィルタの実装

#### 配列 vs Set の比較

| 操作 | 配列 (`Array<string>`) | Set (`Set<string>`) |
|---|---|---|
| 存在チェック | `O(n)` - `array.includes(value)` | `O(1)` - `set.has(value)` |
| 追加 | `O(n)` - `[...array, value]` | `O(1)` - `set.add(value)` |
| 削除 | `O(n)` - `array.filter(x => x !== value)` | `O(1)` - `set.delete(value)` |
| 重複排除 | 手動処理必要 | 自動保証 |

**結論**: 複数選択フィルタは **Set型** を使用することを推奨。

#### Set型の状態管理パターン

```typescript
// useState初期化
const [statusFilter, setStatusFilter] = useState<Set<string>>(new Set());

// チェックボックストグル関数
const handleStatusFilterToggle = (value: string) => {
  setStatusFilter((prev) => {
    const newSet = new Set(prev); // 新しいSetを作成（イミュータブル）
    if (newSet.has(value)) {
      newSet.delete(value); // チェックOFF
    } else {
      newSet.add(value);    // チェックON
    }
    return newSet;
  });
};

// フィルタリング処理での使用
const filtered = data.filter((item) => {
  if (statusFilter.size > 0 && !statusFilter.has(item.status)) {
    return false;
  }
  return true;
});
```

**注意点**:
- `new Set(prev)` で新しいSetを作成（Reactの不変性原則）
- `statusFilter.size > 0` で空チェック（全て未選択 = フィルタなし）

---

## 型安全なソート実装

### ソートキー・順序の型定義

```typescript
/**
 * ソートキー型定義
 */
type SortKey = "timestamp" | "cashbackAmount" | "dealName";

/**
 * ソート順序型定義
 */
type SortOrder = "desc" | "asc";

/**
 * ソートオプション型定義
 */
interface SortOption {
  value: string;       // UI用の一意な値（例: "timestamp-desc"）
  label: string;       // UI表示ラベル（例: "新しい順"）
  sortKey: SortKey;    // ソート対象フィールド
  sortOrder: SortOrder; // ソート順序
}

/**
 * ソートオプション一覧（定数）
 */
const SORT_OPTIONS: SortOption[] = [
  { value: "timestamp-desc", label: "新しい順", sortKey: "timestamp", sortOrder: "desc" },
  { value: "timestamp-asc", label: "古い順", sortKey: "timestamp", sortOrder: "asc" },
  { value: "cashback-desc", label: "キャッシュバック高い順", sortKey: "cashbackAmount", sortOrder: "desc" },
  { value: "cashback-asc", label: "キャッシュバック低い順", sortKey: "cashbackAmount", sortOrder: "asc" },
];
```

**メリット**:
- 型リテラルで値を制限（タイポ防止）
- UIとロジックの分離（`value` vs `sortKey`/`sortOrder`）
- 定数配列で集中管理（保守性向上）

### ソート実装の完全版

```typescript
const [sortValue, setSortValue] = useState<string>("timestamp-desc");

const sortedData = useMemo(() => {
  const sorted = [...filteredData];
  const selectedSort = SORT_OPTIONS.find(opt => opt.value === sortValue);

  if (!selectedSort) {
    return sorted; // デフォルト順序を維持
  }

  sorted.sort((a, b) => {
    // 日時ソート
    if (selectedSort.sortKey === "timestamp") {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return selectedSort.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    }

    // 数値ソート（null/undefined対応）
    if (selectedSort.sortKey === "cashbackAmount") {
      const amountA = a.cashbackAmount ?? 0; // undefined → 0
      const amountB = b.cashbackAmount ?? 0;
      return selectedSort.sortOrder === "desc" ? amountB - amountA : amountA - amountB;
    }

    // 文字列ソート（日本語対応）
    if (selectedSort.sortKey === "dealName") {
      return selectedSort.sortOrder === "desc"
        ? b.dealName.localeCompare(a.dealName, "ja")
        : a.dealName.localeCompare(b.dealName, "ja");
    }

    return 0;
  });

  return sorted;
}, [filteredData, sortValue]);
```

**ポイント**:
- `SORT_OPTIONS.find()` でソート設定を取得（型安全）
- `??` Null合体演算子で`undefined`/`null`を0に変換
- `localeCompare("ja")` で日本語の50音順ソート

---

## レスポンシブUI実装パターン

### Tailwind CSSブレークポイント

```typescript
{/* モバイル: 縦並び、デスクトップ: 横並び */}
<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* ソートセレクト */}
  <Select>...</Select>

  {/* 検索ボックス（モバイル: 100%幅、デスクトップ: 最大幅制限） */}
  <div className="relative flex-1 sm:max-w-xs">
    <Input ... />
  </div>
</div>

{/* フィルタチェックボックス: 自動折り返し */}
<div className="flex flex-wrap gap-3">
  {options.map(...)}
</div>
```

**ブレークポイント**:
- `sm:` - 640px以上（タブレット/デスクトップ）
- デフォルト（プレフィックスなし）- モバイル

**レイアウトパターン**:
1. モバイル: `flex-col`（縦並び）+ `gap-4`
2. デスクトップ: `sm:flex-row`（横並び）+ `sm:items-center`（中央揃え）
3. 自動折り返し: `flex-wrap`（チェックボックス等）

---

## 実装チェックリスト

### パフォーマンス
- [ ] `useMemo`でフィルタ/ソート処理をメモ化
- [ ] 依存配列が正確（不足/過剰なし）
- [ ] スプレッド演算子で配列コピー（元データ保護）
- [ ] 早期リターンでネストを削減

### 型安全性
- [ ] ソートキー・順序を型リテラルで定義
- [ ] フィルタ条件をインターフェースで定義
- [ ] `??` Null合体演算子で`undefined`対応

### UI/UX
- [ ] デフォルトソート順序を明確に（通常は新しい順）
- [ ] フィルタクリアボタンを実装
- [ ] 絞り込み結果件数を表示（「◯件中◯件」）
- [ ] レスポンシブ対応（モバイル/デスクトップ）

### アクセシビリティ
- [ ] `aria-label`をボタンに設定
- [ ] キーボード操作対応（Radix UI使用推奨）
- [ ] フォーカスリング表示（`focus-visible:`）

---

## 実装例リファレンス

### 申し込み履歴ページ（実装完了）
**ファイル**: `/app/mypage/history/page.tsx`

**実装機能**:
- ソート: 4オプション（新しい順/古い順/キャッシュバック高い順/低い順）
- フィルタ: ステータス複数選択 + 案件名検索
- UI: shadcn/ui Select/Checkbox + レスポンシブ対応

**参照箇所**:
- **Line 224-243**: フィルタリングロジック（useMemo）
- **Line 245-268**: ソートロジック（useMemo）
- **Line 277-288**: Set型フィルタトグル関数
- **Line 398-482**: レスポンシブUI実装

---

## 将来的な拡張

### サーバーサイド移行の目安
データ量が1000件を超えた場合、以下の対応を検討：

1. **APIクエリパラメータ化**
```typescript
// クライアント側
const response = await fetch(
  `/api/history?sort=timestamp&order=desc&status=pending,approved&search=案件A`
);

// サーバー側（route.ts）
const { searchParams } = new URL(request.url);
const sortKey = searchParams.get("sort") || "timestamp";
const sortOrder = searchParams.get("order") || "desc";
const statusFilter = searchParams.get("status")?.split(",") || [];
const searchQuery = searchParams.get("search") || "";
```

2. **ページネーション実装**
- カーソルベース: `?cursor=xxx&limit=20`（推奨）
- オフセットベース: `?page=2&limit=20`

3. **キャッシュ戦略**
- SWR/React Queryで取得済みデータをキャッシュ
- Incremental Static Regeneration (ISR) で静的生成

---

## 関連ドキュメント

- [Google Sheets構造仕様](/docs/specs/google.md) - データソース仕様
- [申し込み履歴API仕様](/docs/specs/api-history.md) - APIエンドポイント仕様
- [フロントエンド改善ログ](/docs/FRONTEND_IMPROVEMENTS.md) - UI/UX改善履歴

---

## 更新履歴

| 日付 | バージョン | 変更内容 |
|---|---|---|
| 2025-11-22 | v1.0.0 | 初版作成（申し込み履歴ページ実装完了に伴う） |
