# 成果マッチングアルゴリズム

**最終更新日:** 2025-01-04
**対象:** 全ASP統合
**重要度:** 高

---

## 概要

成果データとクリックログを照合し、メンバーを識別するアルゴリズムです。

---

## マッチングレベル

### Level 1: カスタムパラメータ完全一致（推奨）

**精度:** 100%
**対応ASP:** AFB, ValueCommerce, AccessTrade

```typescript
async function matchByCustomParameter(customParam: string): Promise<string | null> {
  const clickLogs = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");

  // eventId列（E列）でカスタムパラメータを検索
  const matched = clickLogs.find(log => log[4] === customParam);

  if (matched) {
    return matched[1]; // B列: 会員ID
  }

  return null;
}
```

**成功条件:**
- ✅ カスタムパラメータがクリックログに記録されている
- ✅ ASPの成果データにカスタムパラメータが含まれる

---

### Level 2: 時間範囲＋案件名マッチング（代替案）

**精度:** 70-80%
**対応ASP:** もしも、JANet、infotop（カスタムパラメータ不明の場合）

```typescript
async function matchByTimeAndDealName(
  conversionTime: string,
  dealName: string,
  rewardAmount: number
): Promise<MatchingResult> {
  const clickLogs = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");

  // Step 1: 時間範囲フィルタ（±24時間）
  const conversionDate = new Date(conversionTime);
  const candidates = clickLogs.filter(log => {
    const clickDate = new Date(log[0]);
    const diff = Math.abs(conversionDate.getTime() - clickDate.getTime());
    const hoursIn24 = 24 * 60 * 60 * 1000;
    return diff <= hoursIn24;
  });

  // Step 2: 案件名スコアリング
  const scored = candidates.map(log => {
    const clickDealName = log[2];
    const score = calculateDealNameSimilarity(clickDealName, dealName);
    return { log, score };
  });

  // Step 3: スコア順にソート
  scored.sort((a, b) => b.score - a.score);

  return {
    candidates: scored,
    bestMatch: scored[0] || null,
    confidence: scored[0]?.score >= 80 ? "high" : "medium",
  };
}

function calculateDealNameSimilarity(name1: string, name2: string): number {
  const normalized1 = name1.toLowerCase().trim();
  const normalized2 = name2.toLowerCase().trim();

  // 完全一致: 100点
  if (normalized1 === normalized2) return 100;

  // 部分一致: 60-80点
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) {
    const ratio = Math.min(normalized1.length, normalized2.length) /
                  Math.max(normalized1.length, normalized2.length);
    return 60 + (ratio * 20);
  }

  // 一致なし: 0点
  return 0;
}
```

**成功条件:**
- ✅ クリックログに案件名が記録されている
- ✅ 成果発生時刻が±24時間以内
- ⚠️ 案件名が完全一致または高い類似度

**課題:**
- 同一案件に複数のメンバーがクリックした場合、識別が困難
- 案件名の表記ゆれでマッチング失敗の可能性

---

### Level 3: 手動確認（最終手段）

**精度:** 100%（手動確認後）
**対応ASP:** すべて（Level 1-2が失敗した場合）

```typescript
async function createManualReviewTask(
  order: Order,
  candidates: MatchingCandidate[]
): Promise<void> {
  // 管理画面に手動確認タスクを作成
  await createAdminTask({
    type: "manual_conversion_matching",
    orderId: order.orderId,
    dealName: order.dealName,
    rewardAmount: order.commission,
    candidates: candidates.map(c => ({
      memberId: c.clickLog.memberId,
      clickTime: c.clickLog.timestamp,
      score: c.score,
    })),
  });
}
```

**UI例（/admin/conversion-matching）:**
```
注文ID: AFB-12345678
案件名: 楽天カード
報酬額: 10,000円
成果発生日時: 2025-01-03 14:30:00

候補メンバー:
[ ] member-abc123 (クリック: 2025-01-03 14:25:00, スコア: 85)
[ ] member-def456 (クリック: 2025-01-03 13:00:00, スコア: 60)
[ ] member-ghi789 (クリック: 2025-01-02 18:00:00, スコア: 40)

[承認] [却下]
```

---

## 実装パターン

### AFB実装例（Level 1）

```typescript
// app/api/webhooks/afb-postback/route.ts
const memberId = params.paid; // カスタムパラメータ

// クリックログ照合不要（直接メンバーID取得）
await writeConversionData({
  trackingId: memberId,
  eventId: "",
  dealName: `AFB広告ID:${params.adid}`,
  aspName: "afb",
  rewardAmount: parsedData.rewardAmount,
  status: parsedData.status,
  orderId: parsedData.uniqueId,
  timestamp: parsedData.eventTime,
});
```

### ValueCommerce実装例（Level 1）

```typescript
// app/api/cron/valuecommerce-sync/route.ts
for (const order of orders) {
  // Click ID（sid）でクリックログ照合
  const memberId = await matchClickIdWithMember(order.clickId);

  if (!memberId) {
    console.warn(`No member found for order ${order.orderNumber}`);
    continue;
  }

  await writeConversionData({
    trackingId: memberId,
    eventId: order.clickId,
    dealName: `${order.merchantName} - ${order.productName}`,
    aspName: "valuecommerce",
    rewardAmount: order.commission,
    status: order.status === "approved" ? "承認" : "保留",
    orderId: order.orderNumber,
    timestamp: order.orderDate,
  });
}
```

### もしも実装例（Level 2 - カスタムパラメータ不明の場合）

```typescript
// app/api/cron/moshimo-sync/route.ts
for (const order of orders) {
  const matchingResult = await matchByTimeAndDealName(
    order.conversionTime,
    order.dealName,
    order.rewardAmount
  );

  if (matchingResult.confidence === "high") {
    // 自動承認
    await writeConversionData({
      trackingId: matchingResult.bestMatch.log.memberId,
      // ...
    });
  } else {
    // 手動確認
    await createManualReviewTask(order, matchingResult.candidates);
  }
}
```

---

## エラーハンドリング

### ケース1: カスタムパラメータが空

```typescript
if (!order.customParam || order.customParam.trim() === "") {
  console.warn(`Empty custom parameter for order ${order.orderId}`);
  // Level 2マッチングにフォールバック
  const matchingResult = await matchByTimeAndDealName(...);
}
```

### ケース2: 複数候補がある

```typescript
if (matchingResult.candidates.length > 1) {
  const topScores = matchingResult.candidates.filter(c => c.score >= 80);

  if (topScores.length === 1) {
    // 高スコアが1件のみ → 自動承認
    await writeConversionData({ ... });
  } else {
    // 複数の高スコア候補 → 手動確認
    await createManualReviewTask(...);
  }
}
```

### ケース3: 候補が0件

```typescript
if (matchingResult.candidates.length === 0) {
  console.error(`No matching candidates for order ${order.orderId}`);
  // 未照合成果として記録
  await writeUnmatchedConversion(order);
  // 管理者にアラート通知
  await sendAdminAlert({
    type: "unmatched_conversion",
    orderId: order.orderId,
  });
}
```

---

## パフォーマンス最適化

### クリックログのキャッシュ

```typescript
// 10分間キャッシュ
let clickLogCache: ClickLogRow[] | null = null;
let cacheExpiry: number = 0;

async function getClickLogs(): Promise<ClickLogRow[]> {
  const now = Date.now();

  if (clickLogCache && now < cacheExpiry) {
    return clickLogCache;
  }

  clickLogCache = await readSheet(SHEET_NAMES.CLICK_LOG, "A2:E");
  cacheExpiry = now + (10 * 60 * 1000); // 10分後

  return clickLogCache;
}
```

---

## 参考リンク

- [カスタムトラッキングパラメータ仕様](./tracking-parameters.md)
- [エラーハンドリング戦略](./error-handling.md)

---

_Last Updated: 2025-01-04_
