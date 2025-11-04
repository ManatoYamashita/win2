# カスタムトラッキングパラメータ仕様

**最終更新日:** 2025-01-04
**対象:** 全ASP統合
**重要度:** 高

---

## 概要

カスタムトラッキングパラメータは、アフィリエイトリンクに **メンバーID** を付与し、成果発生時にメンバーを識別するための仕組みです。

---

## ASP別カスタムパラメータ一覧

| ASP | パラメータ名 | 最大文字数 | 使用可能文字 | 対応状況 |
|-----|------------|-----------|------------|---------|
| **AFB** | `paid` | 255文字 | 半角英数字、ハイフン、アンダースコア | ✅ 実装完了 |
| **ValueCommerce** | `sid` | 100文字 | 半角英数字、ハイフン、アンダースコア | 📋 Phase 2 |
| **もしも** | 要確認 | 要確認 | 要確認 | 🔍 Phase 3 |
| **AccessTrade** | `a8` | 255文字 | 半角英数字、ハイフン、アンダースコア | 🔍 Phase 3 |
| **LinkShare** | `u1` | 100文字 | 半角英数字、ハイフン、アンダースコア | ⏸️ Phase 4 |
| **JANet** | 要確認 | 要確認 | 要確認 | ⏸️ Phase 4 |
| **infotop** | 要確認 | 要確認 | 要確認 | ⏸️ Phase 5 |
| **A8.net** | `id1` | - | - | ⚠️ Media Member契約では利用不可 |

---

## パラメータ設計

### メンバーID形式

```
# 会員
member-{UUID v4}
例: member-a1b2c3d4-e5f6-7890-abcd-ef1234567890

# ゲスト
guest:{UUID v4}
例: guest:550e8400-e29b-41d4-a716-446655440000
```

### 実装例（AFB）

```typescript
// app/api/track-click/route.ts
const memberId = session?.user?.memberId || `guest:${uuid()}`;
const trackingUrl = `${affiliateUrl}?paid=${encodeURIComponent(memberId)}`;
```

---

## クリックログ記録

**Google Sheets「クリックログ」:**
- A列: 日時（ISO8601形式）
- B列: 会員ID（member-xxx または guest:xxx）
- C列: 案件名
- D列: 案件ID
- E列: eventId（カスタムパラメータ値）

```typescript
await writeClickLog({
  timestamp: new Date().toISOString(),
  memberId: memberId,
  dealName: "案件名",
  dealId: "deal-123",
  eventId: memberId, // ← カスタムパラメータ値
});
```

---

## 成果照合ロジック

### Step 1: APIから成果データ取得

```typescript
const orders = await fetchOrderReport({
  start_date: "2025-01-01",
  end_date: "2025-01-31",
});
```

### Step 2: カスタムパラメータ抽出

```typescript
// AFB
const memberId = order.paid;

// ValueCommerce
const memberId = order.clickId;

// AccessTrade
const memberId = order.a8;
```

### Step 3: クリックログと照合

```typescript
const clickLog = await findClickLogByEventId(memberId);
if (clickLog) {
  // メンバー識別成功
  await writeConversionData({
    trackingId: clickLog.memberId,
    orderId: order.orderId,
    rewardAmount: order.commission,
    // ...
  });
}
```

---

## セキュリティ考慮事項

### 1. UUID の利用

- **推奨:** UUID v4（ランダム性が高い）
- **非推奨:** 連番ID（推測されやすい）

### 2. URLエンコード

```typescript
// ✅ 正しい
const url = `${baseUrl}?paid=${encodeURIComponent(memberId)}`;

// ❌ 間違い（特殊文字が含まれる場合にエラー）
const url = `${baseUrl}?paid=${memberId}`;
```

### 3. パラメータ長制限

```typescript
if (memberId.length > 255) {
  throw new Error("Member ID too long");
}
```

---

## 参考リンク

- [成果マッチングアルゴリズム](./conversion-matching.md)
- [エラーハンドリング戦略](./error-handling.md)

---

_Last Updated: 2025-01-04_
