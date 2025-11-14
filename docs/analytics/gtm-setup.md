# Google Tag Manager (GTM) × GA4 × GSC 一元管理セットアップガイド

**最終更新日**: 2025-01-14
**実装状況**: Phase 1 (GTM基本設定) 完了、Phase 2 (コード実装) 完了、Phase 3 (ドキュメント) 完了

## 概要

WIN×Ⅱでは、Google Tag Manager (GTM)を経由して、Google Analytics 4 (GA4) と Google Search Console (GSC) を一元管理します。これにより、タグの追加・変更をコード修正なしで実施でき、マーケティング施策の柔軟性が向上します。

## 技術スタック

- **GTM**: イベント計測・タグ管理
- **GA4**: ユーザー行動分析・コンバージョン計測
- **GSC**: 検索パフォーマンス分析・サイトマップ管理
- **Next.js 15**: App Router (Server Components + Client Components)
- **TypeScript**: 型安全なGTM実装

---

## Phase 1: GTM基本設定（完了済み）

### 1.1 GTMアカウント・コンテナ作成

1. [Google Tag Manager](https://tagmanager.google.com/) にアクセス
2. アカウント作成: "WIN×Ⅱ"
3. コンテナ作成: "WIN×Ⅱ Production" (Web用)
4. **GTM ID** (GTM-XXXXXXX) をメモ

### 1.2 環境変数設定

`.env.local` に以下を追加:

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX  # 本番用コンテナID
```

### 1.3 GTMコンポーネント統合（実装済み）

以下のファイルは既に実装済みです:

#### `components/analytics/google-tag-manager.tsx`
```typescript
import Script from "next/script";

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  if (!gtmId) {
    console.warn("GTM ID is not provided.");
    return null;
  }
  return (
    <Script
      id="google-tag-manager"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');`,
      }}
    />
  );
}

export function GoogleTagManagerNoScript({ gtmId }: { gtmId: string }) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
```

#### `app/layout.tsx`（抜粋）

```typescript
import { GoogleTagManager, GoogleTagManagerNoScript } from "@/components/analytics/google-tag-manager";

const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <GoogleTagManager gtmId={gtmId} />
      </head>
      <body>
        <GoogleTagManagerNoScript gtmId={gtmId} />
        {children}
      </body>
    </html>
  );
}
```

---

## Phase 2: コード実装（完了済み）

### 2.1 TypeScript型定義（完了）

#### `types/gtm.d.ts`

完全な型定義を実装済み:

```typescript
export interface GTMSignUpEvent {
  event: "sign_up";
  user_id: string;
  method: "email";
  timestamp: string;
}

export interface GTMDealClickEvent {
  event: "deal_click";
  deal_id: string;
  deal_name: string;
  asp_name: string;
  tracking_id: string;
  event_id: string;
  is_member: boolean;
  timestamp: string;
}

export type GTMEventType = GTMSignUpEvent | GTMDealClickEvent;

declare global {
  interface Window {
    dataLayer: GTMEventType[];
  }
}
```

### 2.2 GTMヘルパー関数（完了）

#### `lib/gtm.ts`

型安全なヘルパー関数を実装済み:

```typescript
export function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    console.warn("[GTM] Cannot push to dataLayer: window is undefined (SSR context)");
    return;
  }
  if (!window.dataLayer) {
    console.warn("[GTM] dataLayer is not initialized.");
    return;
  }
  try {
    window.dataLayer.push(data);
    console.log("[GTM] Event pushed to dataLayer:", data);
  } catch (error) {
    console.error("[GTM] Failed to push to dataLayer:", error);
  }
}

export function trackSignUp(params: {
  memberId: string;
  method: "email";
  timestamp: string;
}): void {
  pushToDataLayer({
    event: "sign_up",
    user_id: params.memberId,
    method: params.method,
    timestamp: params.timestamp,
  });
}

export function trackDealClick(params: {
  dealId: string;
  dealName: string;
  aspName: string;
  trackingId: string;
  eventId: string;
  isMember: boolean;
  timestamp: string;
}): void {
  pushToDataLayer({
    event: "deal_click",
    deal_id: params.dealId,
    deal_name: params.dealName,
    asp_name: params.aspName,
    tracking_id: params.trackingId,
    event_id: params.eventId,
    is_member: params.isMember,
    timestamp: params.timestamp,
  });
}
```

### 2.3 API拡張（完了）

#### `app/api/track-click/route.ts`（抜粋）

GTM用追加フィールドをレスポンスに含める実装済み:

```typescript
const response = NextResponse.json({
  trackingUrl: trackingUrl.toString(),
  // GTM event tracking data
  dealId: dealId,
  dealName: deal.dealName,
  aspName: deal.aspName,
  trackingId: trackingId,
  eventId: eventId,
  isMember: !!session?.user?.memberId,
  timestamp: new Date().toISOString(),
}, { status: 200 });
```

#### `app/api/register/route.ts`（抜粋）

登録成功時のtimestampを追加:

```typescript
return NextResponse.json({
  message: "会員登録が完了しました。",
  memberId,
  email,
  emailSent: false,
  timestamp: new Date().toISOString(), // GTM tracking用
}, { status: 201 });
```

### 2.4 コンポーネント統合（完了）

#### `components/deal/deal-cta-button.tsx`（抜粋）

案件クリック時のGTMイベント送信:

```typescript
import { trackDealClick } from "@/lib/gtm";

const data = await response.json();

if (data.trackingUrl) {
  // GTM イベント送信
  trackDealClick({
    dealId: data.dealId,
    dealName: data.dealName,
    aspName: data.aspName,
    trackingId: data.trackingId,
    eventId: data.eventId,
    isMember: data.isMember,
    timestamp: data.timestamp,
  });

  window.open(data.trackingUrl, '_blank');
  // ...
}
```

#### `app/register/page.tsx`（抜粋）

会員登録完了時のGTMイベント送信:

```typescript
import { trackSignUp } from "@/lib/gtm";

const result = await response.json();

if (response.ok) {
  // 登録成功 → GTMイベント送信
  trackSignUp({
    memberId: result.memberId,
    method: "email",
    timestamp: result.timestamp,
  });
  // ...
}
```

---

## Phase 3: GTM管理画面設定（手動実施必要）

### 3.1 dataLayer変数設定

GTM管理画面で以下のユーザー定義変数を作成:

| 変数名 | 変数の種類 | データレイヤーの変数名 |
|--------|-----------|---------------------|
| DLV - user_id | データレイヤーの変数 | user_id |
| DLV - method | データレイヤーの変数 | method |
| DLV - timestamp | データレイヤーの変数 | timestamp |
| DLV - deal_id | データレイヤーの変数 | deal_id |
| DLV - deal_name | データレイヤーの変数 | deal_name |
| DLV - asp_name | データレイヤーの変数 | asp_name |
| DLV - tracking_id | データレイヤーの変数 | tracking_id |
| DLV - event_id | データレイヤーの変数 | event_id |
| DLV - is_member | データレイヤーの変数 | is_member |

### 3.2 トリガー設定

#### トリガー1: sign_up（会員登録完了）

- トリガーのタイプ: カスタムイベント
- イベント名: `sign_up`

#### トリガー2: deal_click（案件クリック）

- トリガーのタイプ: カスタムイベント
- イベント名: `deal_click`

### 3.3 GA4タグ設定

#### タグ1: GA4設定（ページビュー）

- タグの種類: Google アナリティクス: GA4 設定
- 測定ID: `G-XXXXXXXXXX` (GA4プロパティから取得)
- トリガー: All Pages

#### タグ2: GA4イベント - sign_up

- タグの種類: Google アナリティクス: GA4 イベント
- 設定タグ: {{GA4設定}}
- イベント名: `sign_up`
- イベントパラメータ:
  - `user_id`: {{DLV - user_id}}
  - `method`: {{DLV - method}}
- トリガー: sign_up

#### タグ3: GA4イベント - deal_click

- タグの種類: Google アナリティクス: GA4 イベント
- 設定タグ: {{GA4設定}}
- イベント名: `deal_click`
- イベントパラメータ:
  - `deal_id`: {{DLV - deal_id}}
  - `deal_name`: {{DLV - deal_name}}
  - `asp_name`: {{DLV - asp_name}}
  - `tracking_id`: {{DLV - tracking_id}}
  - `event_id`: {{DLV - event_id}}
  - `is_member`: {{DLV - is_member}}
- トリガー: deal_click

---

## Phase 4: GA4設定（手動実施必要）

### 4.1 GA4プロパティ作成

1. [Google Analytics](https://analytics.google.com/) にアクセス
2. プロパティ作成: "WIN×Ⅱ"
3. データストリーム作成: "WIN×Ⅱ Web"
4. **測定ID** (G-XXXXXXXXXX) をメモ
5. GTMの「GA4設定」タグに測定IDを設定

### 4.2 カスタムディメンション設定

GA4管理画面で以下のカスタムディメンションを作成:

| ディメンション名 | 範囲 | イベントパラメータ |
|---------------|------|----------------|
| ASP名 | イベント | asp_name |
| トラッキングID | イベント | tracking_id |
| イベントID | イベント | event_id |
| 会員フラグ | イベント | is_member |

### 4.3 コンバージョンイベント設定

GA4管理画面で以下をコンバージョンとしてマーク:

- `sign_up` (会員登録完了)
- `deal_click` (案件クリック)

---

## Phase 5: Google Search Console (GSC) 設定

### 5.1 GSC所有権確認

**方法1: HTMLタグ（推奨）**

1. [Google Search Console](https://search.google.com/search-console/) にアクセス
2. プロパティ追加: `https://yourdomain.com`
3. 所有権確認方法: "HTMLタグ"
4. 提供されたmetaタグをコピー

`app/layout.tsx` に追加:

```typescript
export const metadata: Metadata = {
  // ...
  verification: {
    google: "your-verification-code-here",
  },
};
```

5. GSCで確認ボタンをクリック

**方法2: GTM経由（より柔軟）**

1. GTM管理画面で新しいタグ作成:
   - タグの種類: カスタムHTML
   - HTML: GSCから提供されたmetaタグをそのまま貼り付け
   - トリガー: All Pages
2. GTMコンテナを公開
3. GSCで確認ボタンをクリック

### 5.2 サイトマップ送信

1. GSC管理画面で「サイトマップ」を選択
2. サイトマップURL入力: `https://yourdomain.com/sitemap.xml`
3. 送信ボタンをクリック

**注意**: WIN×Ⅱでは、`app/sitemap.ts` で動的サイトマップを生成済みです。

---

## 検証・テスト手順

### ローカル環境でのGTM動作確認

1. **GTM Preview Mode を起動**
   - GTM管理画面で「プレビュー」ボタンをクリック
   - ローカル環境URL (`http://localhost:3000`) を入力

2. **会員登録フローテスト**
   - `/register` ページで会員登録
   - GTM Debuggerで `sign_up` イベントが発火することを確認
   - dataLayerに以下が含まれていることを確認:
     - `user_id`: UUID
     - `method`: "email"
     - `timestamp`: ISO 8601形式

3. **案件クリックフローテスト**
   - ブログ記事内の `[CTA:dealId]` ボタンをクリック
   - GTM Debuggerで `deal_click` イベントが発火することを確認
   - dataLayerに以下が含まれていることを確認:
     - `deal_id`, `deal_name`, `asp_name`
     - `tracking_id`, `event_id`
     - `is_member`: true/false

4. **ブラウザコンソールでの確認**
   ```javascript
   console.log(window.dataLayer);
   // 出力例:
   // [
   //   { event: "sign_up", user_id: "...", method: "email", timestamp: "..." },
   //   { event: "deal_click", deal_id: "...", ... }
   // ]
   ```

### 本番環境でのGA4確認

1. **リアルタイムレポート確認**
   - GA4管理画面で「リアルタイム」を選択
   - 自分で会員登録・案件クリックを実施
   - イベントが即座にカウントされることを確認

2. **イベントデバッガー確認**
   - GA4管理画面で「設定 > DebugView」を有効化
   - `sign_up`, `deal_click` イベントの詳細を確認
   - カスタムパラメータが正しく送信されていることを確認

3. **コンバージョン確認**
   - GA4管理画面で「設定 > コンバージョン」を選択
   - `sign_up`, `deal_click` がコンバージョンとしてカウントされることを確認

---

## トラブルシューティング

### GTMイベントが発火しない

**症状**: ブラウザコンソールで `window.dataLayer` が空、またはGTM Debuggerでイベントが表示されない

**原因と対処法**:

1. **GTM IDが未設定 or 誤り**
   - `.env.local` で `NEXT_PUBLIC_GTM_ID` が正しく設定されているか確認
   - ブラウザでページソースを表示し、GTM scriptタグに正しいIDが埋め込まれているか確認

2. **Client Componentでの実行タイミング問題**
   - `useEffect` 内でイベント送信している場合、依存配列を確認
   - `window.dataLayer` が初期化される前に実行されていないか確認

3. **SSRコンテキストでの実行エラー**
   - `lib/gtm.ts` の `pushToDataLayer()` 内で `typeof window === "undefined"` チェックが機能しているか確認
   - Server Componentから直接GTM関数を呼び出していないか確認

### GA4にイベントが届かない

**症状**: GTMでイベントは発火しているが、GA4のリアルタイムレポートに表示されない

**原因と対処法**:

1. **GA4測定IDが誤り**
   - GTMの「GA4設定」タグで測定ID (G-XXXXXXXXXX) が正しいか確認

2. **タグの発火トリガーが未設定**
   - GTM管理画面でタグのトリガーが正しく設定されているか確認
   - Preview Modeで該当タグが発火しているか確認

3. **イベントパラメータの型不一致**
   - GA4は文字列・数値以外のパラメータを無視する
   - `lib/gtm.ts` で送信しているデータ型を確認

### GSC所有権確認が失敗する

**症状**: metaタグを追加しても「確認できませんでした」エラー

**原因と対処法**:

1. **metaタグの設置場所が誤り**
   - `<head>` 内に設置されているか確認
   - Next.jsの `metadata.verification.google` を使用しているか確認

2. **本番デプロイ前に確認を試みている**
   - Vercel等にデプロイし、本番URLで確認を実施
   - ローカル環境では確認不可

3. **GTM経由で設置したが、コンテナが未公開**
   - GTM管理画面で「公開」ボタンをクリック
   - 公開後、数分待ってから再度GSCで確認

---

## セキュリティ・プライバシー考慮事項

### 個人情報の取り扱い

**送信してはいけないデータ**:
- メールアドレス（ハッシュ化していても避ける）
- 電話番号
- 生年月日
- 住所情報

**送信してよいデータ**:
- UUID形式のmemberId（個人を直接特定できない）
- トラッキングID（guest:UUID含む）
- 案件ID、案件名（サービス情報）

### GDPR/CCPA対応

1. **プライバシーポリシーへの記載**
   - GTM/GA4を使用していることを明記
   - データ収集目的を説明
   - オプトアウト方法を提供

2. **Cookieバナー実装（将来対応）**
   - EU圏ユーザー向けに同意取得フロー実装
   - GA4の`consent` APIと連携

---

## メンテナンス・運用

### GTMコンテナのバージョン管理

- 変更前に必ず「バージョンを作成」
- バージョン名に変更内容を記載（例: "2025-01-14: deal_click イベント追加"）
- 問題発生時は過去バージョンにロールバック可能

### GA4データ保持期間

- デフォルト: 2ヶ月
- 推奨設定: 14ヶ月（GA4管理画面で変更可能）
- 長期分析が必要な場合はBigQuery連携を検討

### 定期監視項目

- **週次**: GA4リアルタイムレポートでイベント発火を確認
- **月次**: コンバージョン率の推移を確認
- **四半期**: GTMタグの整理（不要タグの削除）

---

## 参考リンク

- [Google Tag Manager公式ドキュメント](https://support.google.com/tagmanager)
- [Google Analytics 4ヘルプ](https://support.google.com/analytics)
- [Google Search Consoleヘルプ](https://support.google.com/webmasters)
- [Next.js Script Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/scripts)

---

## 実装チェックリスト

### Phase 1: GTM基本設定

- [x] GTMアカウント・コンテナ作成
- [x] 環境変数 `NEXT_PUBLIC_GTM_ID` 設定
- [x] `components/analytics/google-tag-manager.tsx` 実装
- [x] `app/layout.tsx` にGTMコンポーネント統合

### Phase 2: コード実装

- [x] `types/gtm.d.ts` 型定義完全版作成
- [x] `lib/gtm.ts` ヘルパー関数実装
- [x] `app/api/track-click/route.ts` レスポンス拡張
- [x] `app/api/register/route.ts` レスポンス拡張
- [x] `components/deal/deal-cta-button.tsx` GTMイベント統合
- [x] `app/register/page.tsx` GTMイベント統合

### Phase 3: GTM管理画面設定

- [ ] dataLayer変数設定（9個）
- [ ] トリガー設定（sign_up, deal_click）
- [ ] GA4タグ設定（ページビュー、sign_up, deal_click）
- [ ] GTMコンテナ公開

### Phase 4: GA4設定

- [ ] GA4プロパティ作成
- [ ] データストリーム作成
- [ ] カスタムディメンション設定（4個）
- [ ] コンバージョンイベント設定（2個）

### Phase 5: GSC設定

- [ ] 所有権確認（HTMLタグ or GTM経由）
- [ ] サイトマップ送信

### テスト・検証

- [ ] ローカル環境でGTM Preview Mode動作確認
- [ ] 会員登録フロー `sign_up` イベント発火確認
- [ ] 案件クリックフロー `deal_click` イベント発火確認
- [ ] GA4リアルタイムレポート確認
- [ ] GA4コンバージョン計測確認
- [ ] GSCサイトマップ認識確認

---

**次のアクション**: Phase 3のGTM管理画面設定を実施し、チェックリストの [ ] 項目を完了させてください。

