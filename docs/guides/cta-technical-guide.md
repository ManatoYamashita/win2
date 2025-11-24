# CTA機能 技術ガイド（開発者向け）

## 概要

WIN×ⅡのCTA（Call To Action）機能は、ブログ記事内のショートコード `[CTA:dealId]` を自動的にトラッキング機能付きのボタンに変換するシステムです。

このドキュメントでは、CTA機能の技術的な実装詳細を説明します。

## アーキテクチャ

### システム構成

```
┌─────────────────────────────────────────────────────────────┐
│                       クライアント                           │
│                                                               │
│  1. ブログ記事表示                                            │
│     └─ BlogContent コンポーネント                             │
│        ├─ [CTA:dealId] 検出                                  │
│        ├─ ボタンHTML生成                                      │
│        └─ クリックイベント設定                                │
│                                                               │
│  2. ボタンクリック                                            │
│     └─ POST /api/track-click { dealId }                      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      Next.js API                             │
│                                                               │
│  /api/track-click                                            │
│  ├─ セッション確認（会員/非会員判定）                        │
│  ├─ イベントID生成（UUID v4）                                │
│  ├─ Google Sheets「案件マスタ」から案件情報取得              │
│  ├─ Google Sheets「クリックログ」に記録                      │
│  └─ トラッキングURL生成・返却                                │
│     ?id1={memberId}&id2={eventId}&eventId={eventId}          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Google Sheets                             │
│                                                               │
│  1. 案件マスタ                                                │
│     ├─ A: アフィリエイトURL                                   │
│     ├─ B: 案件ID（主キー）                                    │
│     ├─ C: 案件名（GAS自動入力）                               │
│     ├─ D: ASP名（GAS自動入力）                                │
│                                                               │
│  2. クリックログ                                              │
│     ├─ A: 日時                                                │
│     ├─ B: 会員ID (or guest:UUID)                             │
│     ├─ C: 案件名                                              │
│     ├─ D: 案件ID                                              │
│     └─ E: イベントID（UUID v4）                               │
│                                                               │
│  3. 成果CSV_RAW（手動貼付）                                   │
│     ├─ A: id1 (memberId or guest:UUID)                       │
│     ├─ B: eventId                                            │
│     ├─ C: dealName                                           │
│     ├─ D: reward                                             │
│     └─ E: status                                             │
│                                                               │
│  4. 成果データ（GAS自動生成）                                 │
│     └─ 毎日3:10に自動集計                                     │
└─────────────────────────────────────────────────────────────┘
```

## コンポーネント実装

### BlogContent コンポーネント

**ファイル:** `components/blog/blog-content.tsx`

#### 主要機能

1. **HTML/Markdown自動判定**
2. **ショートコード検出と変換**
3. **イベントハンドラー設定**
4. **APIコール処理**

#### 実装詳細

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [processedContent, setProcessedContent] = useState<string>(content);
  const [isMarkdown, setIsMarkdown] = useState<boolean>(false);

  // 1. Markdown/HTML判定
  useEffect(() => {
    const hasHtmlTags = /<[^>]+>/.test(content);
    const hasMarkdownSyntax = /^#+\s|^\*\s|\[.+\]\(.+\)|```/.test(content);

    if (!hasHtmlTags && hasMarkdownSyntax) {
      setIsMarkdown(true);
    }
  }, [content]);

  // 2. ショートコード変換
  useEffect(() => {
    const shortcodePattern = /\[CTA:([\w-]+)\]/g;
    const matches = [...content.matchAll(shortcodePattern)];

    if (matches.length === 0) {
      setProcessedContent(content);
      return;
    }

    let newHtml = content;
    matches.forEach((match) => {
      const dealId = match[1];
      const buttonHtml = `
        <div class="cta-button-wrapper my-8 text-center">
          <button
            class="cta-button ..."
            data-deal-id="${dealId}"
          >
            このサービスに進む
          </button>
        </div>
      `;
      newHtml = newHtml.replace(match[0], buttonHtml);
    });

    setProcessedContent(newHtml);
  }, [content]);

  // 3. イベントハンドラー設定
  useEffect(() => {
    if (!contentRef.current) return;

    const buttons = contentRef.current.querySelectorAll<HTMLButtonElement>(".cta-button");
    buttons.forEach((button) => {
      button.addEventListener("click", handleCTAClick);
    });

    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleCTAClick);
      });
    };
  }, [processedContent]);

  // 4. クリックハンドラー
  const handleCTAClick = async (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const dealId = button.dataset.dealId;

    button.disabled = true;

    const response = await fetch("/api/track-click", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dealId }),
    });

    const data = await response.json();
    window.location.href = data.trackingUrl;
  };

  // 5. レンダリング
  if (isMarkdown) {
    return (
      <div ref={contentRef} className={proseClasses}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div
      ref={contentRef}
      className={proseClasses}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
```

#### 重要なポイント

**1. State駆動のHTML生成**

```typescript
// ❌ 間違い: dangerouslySetInnerHTML後にinnerHTMLを直接書き換え
useEffect(() => {
  element.innerHTML = newHtml; // Reactの仮想DOMと不一致
}, []);

// ✅ 正しい: stateで管理してdangerouslySetInnerHTMLに渡す
useEffect(() => {
  setProcessedContent(newHtml); // Reactのstate経由
}, [content]);

return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
```

**2. useEffectの依存配列**

```typescript
// ショートコード変換: contentが変更されたら再実行
useEffect(() => {
  // ...
}, [content]);

// イベントハンドラー設定: processedContentが変更されたら再実行
useEffect(() => {
  // ...
}, [processedContent]);
```

**3. Markdown対応**

```typescript
// HTML/Markdown自動判定
const hasHtmlTags = /<[^>]+>/.test(content);
const hasMarkdownSyntax = /^#+\s|^\*\s|\[.+\]\(.+\)|```/.test(content);

// 判定結果に応じてレンダリング方法を切り替え
if (isMarkdown) {
  return <ReactMarkdown>{processedContent}</ReactMarkdown>;
} else {
  return <div dangerouslySetInnerHTML={{ __html: processedContent }} />;
}
```

## API実装

### /api/track-click

**ファイル:** `app/api/track-click/route.ts`

#### フロー

```typescript
export async function POST(request: NextRequest) {
  // 1. リクエストボディのバリデーション
  const { dealId } = await request.json();
  if (!dealId) {
    return NextResponse.json({ error: "dealId is required" }, { status: 400 });
  }

  // 2. セッション確認（会員/非会員判定）
  const session = await getServerSession(authOptions);
  let trackingId: string;

  if (session?.user?.memberId) {
    trackingId = session.user.memberId;
  } else {
    const existingGuestId = request.cookies.get("guestId")?.value;
    trackingId = existingGuestId || `guest:${crypto.randomUUID()}`;
  }

  // 3. Google Sheets「案件マスタ」から案件情報取得
  const deal = await getDealById(dealId);
  if (!deal) {
    return NextResponse.json(
      { error: "指定された案件が見つかりません" },
      { status: 404 }
    );
  }

  // 4. イベントID生成（UUID v4）
  const eventId = crypto.randomUUID();

  // 5. Google Sheets「クリックログ」に記録
  await addClickLog({
    timestamp: new Date().toISOString(),
    memberId: trackingId,
    dealName: deal.dealName,
    dealId: dealId,
    eventId: eventId,
  });

  // 6. affiliateUrlに ?id1={trackingId}&id2={eventId}&eventId={eventId} を付与
  const trackingUrl = new URL(deal.affiliateUrl);
  trackingUrl.searchParams.set("id1", trackingId);
  trackingUrl.searchParams.set("eventId", eventId);

  // 7. レスポンス返却（非会員の場合はguest UUID Cookieを設定）
  const response = NextResponse.json(
    { trackingUrl: trackingUrl.toString() },
    { status: 200 }
  );

  if (!session?.user?.memberId) {
    response.cookies.set("guestId", trackingId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1年
    });
  }

  return response;
}
```

#### レスポンス例

```json
{
  "trackingUrl": "https://px.a8.net/svt/ejp?a8mat=XXXXX&id1=member-uuid&id2=event-uuid-v4&eventId=event-uuid-v4"
}
```

## Google Sheets統合

### lib/sheets.ts

**主要関数:**

#### getDealById

```typescript
/**
 * 案件マスタから案件情報を取得（dealIdで検索）
 */
export async function getDealById(dealId: string): Promise<DealRow | null> {
  const rows = await readSheet(SHEET_NAMES.DEALS, "A2:G");

  // B列（案件ID）で検索
  const dealRow = rows.find(row => row[1] === dealId);

  if (!dealRow) return null;

  // G列（有効/無効）がTRUEの案件のみ返す
  const isActive = dealRow[6] === "TRUE" || dealRow[6] === "true";
  if (!isActive) return null;

  return {
    dealId: dealRow[1],           // B列: 案件ID
    dealName: dealRow[2],         // C列: 案件名
    aspName: dealRow[3],          // D列: ASP名
    affiliateUrl: dealRow[0],     // A列: アフィリエイトURL
    rewardAmount: parseFloat(dealRow[4] ?? "0") || 0,
    isActive: true,
  };
}
```

#### addClickLog

```typescript
/**
 * クリックログを記録
 */
export async function addClickLog(log: ClickLogRow): Promise<void> {
  const values = [
    log.timestamp,
    log.memberId,
    log.dealName,
    log.dealId,
    log.eventId,
  ];

  await appendToSheet(SHEET_NAMES.CLICK_LOG, values);
}
```

### Google Apps Script（GAS）

**ファイル:** `docs/specs/google.md` 内の `deal-auto-fill.gs`

#### 自動入力機能

```javascript
function onEdit(e) {
  const sheet = e.source.getActiveSheet();

  if (sheet.getName() !== '案件マスタ') return;

  const row = e.range.getRow();
  if (row === 1) return; // ヘッダー行は無視

  const editedColumn = e.range.getColumn();

  // A列（アフィリエイトURL）が編集されたら
  if (editedColumn === 1) {
    const affiliateUrl = sheet.getRange(row, 1).getValue();

    if (affiliateUrl) {
      // 1. 案件名を自動取得
      const dealName = fetchPageTitle(affiliateUrl);
      const finalDealName = dealName || '不明なタイトル';

      if (!sheet.getRange(row, 3).getValue()) {
        sheet.getRange(row, 3).setValue(finalDealName);
      }

      // 2. ASP名を自動判定
      const aspName = detectASP(affiliateUrl);

      if (aspName && !sheet.getRange(row, 4).getValue()) {
        sheet.getRange(row, 4).setValue(aspName);
      }
    }
  }

  // デフォルト値の自動入力
  autoFillDefaults(sheet, row);
}
```

## デバッグ

### クライアントサイド

ブラウザのコンソールに以下のログが出力されます：

```
[BlogContent] Content detected as HTML
[BlogContent] Found 2 CTA shortcodes: ["a8-rakuten-card", "afb-epos-card"]
[BlogContent] Attaching click handlers to 2 buttons
```

### サーバーサイド

Next.jsのサーバーログに以下が出力されます：

```
[track-click] Click logged: {
  dealId: 'a8-rakuten-card',
  dealName: '楽天カード',
  trackingId: 'member-uuid',
  eventId: 'event-uuid-v4'
}
[track-click] Tracking URL generated: https://px.a8.net/...
```

### Google Sheets確認

1. **クリックログシート**
   - 最新行に記録が追加されているか確認

2. **案件マスタシート**
   - G列（有効/無効）が `TRUE` になっているか確認

## テスト

### 単体テスト

```typescript
// components/blog/blog-content.test.tsx
describe('BlogContent', () => {
  it('should detect CTA shortcode', () => {
    const content = 'Test [CTA:test-deal] content';
    const pattern = /\[CTA:([\w-]+)\]/g;
    const matches = [...content.matchAll(pattern)];

    expect(matches.length).toBe(1);
    expect(matches[0][1]).toBe('test-deal');
  });

  it('should convert shortcode to button HTML', () => {
    const content = '[CTA:test-deal]';
    // ... テストロジック
  });
});
```

### E2Eテスト

```typescript
// tests/e2e/cta-button.spec.ts
test('CTA button click flow', async ({ page }) => {
  // 1. ブログ記事ページへ遷移
  await page.goto('/blog/test-article');

  // 2. CTAボタンが表示されることを確認
  const button = page.locator('.cta-button');
  await expect(button).toBeVisible();

  // 3. ボタンクリック
  await button.click();

  // 4. トラッキングURLへリダイレクトされることを確認
  await page.waitForURL(/id1=.+&id2=.+&eventId=.+/);
});
```

## トラブルシューティング

### ボタンが表示されない

**デバッグ手順:**

1. ブラウザコンソールで以下を実行：
   ```javascript
   document.querySelector('.prose').innerHTML
   ```
   → `[CTA:dealId]` が含まれているか確認

2. コンソールログで以下を確認：
   ```
   [BlogContent] Found 0 CTA shortcodes
   ```
   → 0の場合、ショートコードが検出されていない

**解決策:**
- ショートコードが `[CTA:dealId]` 形式（大文字、半角）か確認
- microCMSのcontentフィールドに正しく保存されているか確認

### ボタンクリック時にエラー

**デバッグ手順:**

1. ネットワークタブで `/api/track-click` のレスポンスを確認
2. ステータスコードが 404 の場合：
   - Google Sheetsの「案件マスタ」に案件IDが登録されているか確認
   - B列（案件ID）の値が一致しているか確認

3. ステータスコードが 500 の場合：
   - サーバーログでエラー詳細を確認
   - Google Sheets APIのクレデンシャルが正しいか確認

## パフォーマンス最適化

### クライアントサイド

1. **useEffectの依存配列を最適化**
   - 不要な再レンダリングを防ぐ

2. **イベントハンドラーのメモ化**
   - `useCallback` でハンドラーをメモ化

3. **ボタンの遅延レンダリング**
   - Intersection Observer APIで画面内に入ったらイベントハンドラーを設定

### サーバーサイド

1. **Google Sheets APIの呼び出し最小化**
   - 案件情報のキャッシング（Redis等）

2. **並列処理**
   - 案件取得とクリックログ記録を並列化

3. **エッジキャッシング**
   - Vercel Edge Functionsでレスポンスをキャッシュ

## セキュリティ

### XSS対策

- `dangerouslySetInnerHTML` 使用時は必ずサニタイズ
- microCMSから取得したHTMLは信頼できるソースのみ

### CSRF対策

- Next-Auth の CSRF保護機能を活用
- カスタムヘッダーでトークン検証

### Rate Limiting

- `/api/track-click` へのリクエスト数制限
- Vercel Edge Middlewareで実装

## 今後の拡張

### 計画中の機能

1. **CTAボタンのカスタマイズ**
   - ボタンテキストの変更: `[CTA:dealId:今すぐ申し込む]`
   - ボタンスタイルの選択: `[CTA:dealId:style=primary]`

2. **A/Bテスト対応**
   - 複数のボタンデザインを自動切り替え
   - クリック率の計測と最適化

3. **リアルタイム分析**
   - クリック数のリアルタイム表示
   - 人気案件のランキング

4. **自動最適化**
   - AIによるボタン配置の最適化
   - 成果率の高い位置への自動配置

## 参考資料

- [Next.js App Router - Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [React - dangerouslySetInnerHTML](https://react.dev/reference/react-dom/components/common#dangerously-setting-the-inner-html)
- [Google Sheets API - Node.js Quickstart](https://developers.google.com/sheets/api/quickstart/nodejs)
- [react-markdown Documentation](https://github.com/remarkjs/react-markdown)