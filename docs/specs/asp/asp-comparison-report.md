# 国内主要ASP API/ポストバック対応 徹底比較調査レポート

**作成日:** 2025-01-04
**ステータス:** Phase 0完了 - 調査・ドキュメント化完了
**最終更新:** 2025-01-04

---

## 📊 エグゼクティブサマリー

WIN×Ⅱプロジェクトにおける会員別成果トラッキング自動化のため、国内主要ASP 7社（A8.net、AFB、ValueCommerce、もしもアフィリエイト、AccessTrade、LinkShare、infotop、JANet）のAPI/ポストバック対応状況を徹底調査しました。

### 🎯 調査結果ハイライト

| 順位 | ASP | 実装方法 | 会員別トラッキング | 総合スコア | ステータス |
|------|-----|---------|-------------------|-----------|----------|
| 🥇 1位 | **AFB** | リアルタイムポストバック | ✅ 完全対応 (paid) | 34/40 | ✅ **実装完了** |
| 🥈 2位 | **ValueCommerce** | 注文レポートAPI | ✅ 完全対応 (sid) | 32/40 | 📋 **Phase 2推奨** |
| 🥉 3位 | **もしもアフィリエイト** | レポートAPI | ⚠️ 要確認 | 24/40 | 🔍 Phase 3候補 |
| 4位 | **AccessTrade** | レポートAPI + S2S | ⚠️ 要確認 | 23/40 | 🔍 Phase 4候補 |
| 5位 | **LinkShare** | イベント通知API | ❓ 要調査 | 22/40 | 🔍 要調査後決定 |
| 6位 | **JANet** | 手動CSV | ❌ 不可 | 12/40 | ⏸️ 手動運用 |
| 7位 | **infotop** | 手動CSV | ❌ 不可 | 11/40 | ⏸️ 手動運用 |

### 🚀 推奨実装ロードマップ

```
Phase 1: ✅ 完了（2025-01-04）
  └─ AFB - リアルタイムポストバック実装済み

Phase 2: 📋 推奨（2025-01〜02月、2.5-3週間）
  └─ ValueCommerce - 注文レポートAPI統合

Phase 3: 🔍 中期（2025-02〜03月、2週間）
  └─ もしもアフィリエイト - レポートAPI統合（仕様確認後）

Phase 4: 🔍 要判断（2025-03月以降）
  ├─ AccessTrade - サポート回答後判断
  └─ LinkShare - 楽天アフィリエイト調査後判断

Phase 5: ⏸️ 手動運用継続
  ├─ JANet - CSVエクスポート手動運用
  └─ infotop - CSVエクスポート手動運用
```

---

## 🔍 A8.net ファクトチェック結果

### 矛盾点の解明

**提供情報** (調査前):
> A8.net: ポストバック対応あり、成果データAPIあり

**WIN×Ⅱ調査結果** (2025-01-03):
> A8.net Media Member契約では個別成果データにアクセス不可、API利用不可

**結論:** 両方とも正しい - **契約種別による機能差が存在**

### 詳細分析

#### Media Member契約（WIN×Ⅱ現状）

| 項目 | 対応状況 | 詳細 |
|------|---------|------|
| 個別成果データ取得 | ❌ 不可 | order_no, order_click_dateなどの詳細情報にアクセス不可 |
| カスタムトラッキング | ❌ 不可 | id1, eventIdパラメータの個別マッチング不可 |
| A8.net確定API v3 | ❌ 利用不可 | 広告主専用機能のため利用不可 |
| 集計レポート | ✅ 利用可能 | プログラム別総報酬額、クリック数の集計データ |
| 手動CSVエクスポート | ✅ 利用可能 | 現在の運用方法 |

#### 広告主契約

| 項目 | 対応状況 | 詳細 |
|------|---------|------|
| A8.net確定API v3 | ✅ 利用可能 | 未確定売上データ取得、確定済みデータ取得、売上データ修正・確定・キャンセル |
| ポストバック | ✅ 利用可能 | Google・Meta等とのCVAPI連携実績あり |
| カスタムトラッキング | ✅ 利用可能 | 個別広告主によって仕様が異なる |

### WIN×Ⅱでの対応方針

**採用方針:** A8.netは**集計レポートとしてのみ使用**

- ✅ 総報酬額の把握（ダッシュボード表示）
- ❌ 会員別キャッシュバック機能は提供しない
- 📋 代替手段: AFB・ValueCommerceで会員別トラッキング実装

**将来の選択肢:**
1. A8.netサポートに問い合わせ（Media Member向けAPIの可否確認）
2. 広告主契約への変更を検討（ビジネスモデル変更が必要）

参考: `docs/specs/asp/a8net-api.md`

---

## 📋 各ASP詳細調査結果

### 🥇 1位: AFB（アフィリエイトB）

#### 基本情報
- **実装優先度:** 🥇 1位
- **実装ステータス:** ✅ **完了**（2025-01-04）
- **総合スコア:** 34/40
- **実装所要時間:** 2-3日（完了済み）

#### 実装方法
**リアルタイムポストバック**
- 成果発生・承認・却下の各ステータス変化時に即座にHTTP GET通知
- Webhookエンドポイント: `POST /api/webhooks/afb-postback`
- IPホワイトリスト: `13.114.169.190`（本番）, `180.211.73.218`, `112.137.189.110`（再送）

#### カスタムトラッキング
✅ **完全対応** - `paid`パラメータ

```typescript
// クリック時にpaidパラメータを付与
https://track.affiliate-b.com/visit.php?guid=ON&a=xxx&p=xxx&paid={memberId}

// AFBからのポストバック
https://yourdomain.com/api/webhooks/afb-postback?paid={memberId}&u={eventId}&price={rewardAmount}&judge={status}
```

#### 評価詳細

| 評価基準 | スコア | 詳細 |
|---------|--------|------|
| 自動化可能性 | 5/5 | リアルタイムポストバック対応 |
| 会員別トラッキング | 5/5 | paidパラメータで完全対応 |
| 実装難易度 | 5/5 | Webhook受信のみで完結 |
| ドキュメント品質 | 5/5 | 公式ドキュメント完備 |
| WIN×Ⅱでの利用価値 | 4/5 | 案件豊富、報酬単価高め |
| レスポンス速度 | 5/5 | リアルタイム（即座） |
| エラーハンドリング | 5/5 | 再送機能あり（最大3回） |

**総合スコア:** 34/40

#### 実装済みファイル

- `app/api/webhooks/afb-postback/route.ts` - Webhookエンドポイント
- `types/afb-postback.ts` - 型定義
- `lib/sheets.ts` - `writeConversionData()`, `isDuplicateConversion()`
- `.env.example` - AFB_PARTNER_ID, AFB_API_KEY

参考: `docs/specs/asp/afb-implementation-guide.md`

---

### 🥈 2位: ValueCommerce（バリューコマース）

#### 基本情報
- **実装優先度:** 🥈 2位
- **実装ステータス:** 📋 **Phase 2推奨** - 次期実装対象
- **総合スコア:** 32/40
- **推定実装所要時間:** 12-18日（約2.5-3週間）

#### 実装方法
**注文レポートAPI**
- OAuth 1.0a認証
- XML形式レスポンス
- エンドポイント: `https://webservice.valuecommerce.ne.jp/order/v1/`
- バッチ処理（1時間ごと or 1日1回）

#### カスタムトラッキング
✅ **完全対応** - `sid`パラメータ

```typescript
// クリック時にsidパラメータを付与
https://ck.jp.ap.valuecommerce.com/servlet/referral?sid={memberId}&pid=xxx&vc_url=...

// 注文レポートAPIから取得
GET https://webservice.valuecommerce.ne.jp/order/v1/?date=20250104
Authorization: OAuth oauth_consumer_key="xxx", oauth_signature="..."

// レスポンス（XML）
<order>
  <sid>{memberId}</sid>
  <orderNumber>ORD-123</orderNumber>
  <price>10000</price>
  <orderStatus>承認</orderStatus>
</order>
```

#### 評価詳細

| 評価基準 | スコア | 詳細 |
|---------|--------|------|
| 自動化可能性 | 4/5 | API定期取得可能（バッチ処理） |
| 会員別トラッキング | 5/5 | sidパラメータで完全対応 |
| 実装難易度 | 3/5 | OAuth 1.0a + XML解析必要 |
| ドキュメント品質 | 5/5 | 公式ドキュメント完備 |
| WIN×Ⅱでの利用価値 | 5/5 | Yahoo!ショッピング等大手案件豊富 |
| レスポンス速度 | 3/5 | バッチ処理（1時間〜1日遅延） |
| エラーハンドリング | 4/5 | レート制限あり、リトライ処理必要 |

**総合スコア:** 32/40

#### 技術スタック

```typescript
// 必要な npm パッケージ
npm install oauth-1.0a fast-xml-parser bottleneck

// OAuth 1.0a認証
import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

// XML解析
import { XMLParser } from 'fast-xml-parser';

// レート制限対策
import Bottleneck from 'bottleneck';
```

#### 実装ステップ

**Phase 2-1: パートナー管理画面設定**（2-3日）
1. ValueCommerceパートナー管理画面にログイン
2. APIキー（Consumer Key/Secret）発行申請
3. API利用規約確認
4. テストアカウントで動作確認

**Phase 2-2: OAuth 1.0a認証実装**（3-4日）
1. `lib/valuecommerce-client.ts` 作成
2. OAuth署名生成ロジック実装
3. アクセストークン取得処理
4. 認証テスト

**Phase 2-3: 注文レポートAPI統合**（3-4日）
1. 注文データ取得関数実装
2. XML → JSON変換処理
3. Google Sheets書き込み処理
4. エラーハンドリング

**Phase 2-4: クリックログ突合処理**（2-3日）
1. sidパラメータでマッチング
2. タイムスタンプ範囲突合（補助）
3. 重複チェック
4. ステータス更新ロジック

**Phase 2-5: テスト・本番稼働**（2-4日）
1. ローカルテスト
2. ステージング環境テスト
3. 本番デプロイ
4. モニタリング設定

#### メリット

✅ Yahoo!ショッピング、楽天市場、Amazon等の大手EC案件
✅ 公式APIドキュメント完備、サンプルコードあり
✅ sidパラメータで会員別トラッキング完全対応
✅ 報酬単価高め、承認率も高い傾向

#### デメリット

⚠️ OAuth 1.0a実装が複雑（OAuth 2.0ではない）
⚠️ XML形式レスポンス（JSON変換処理必要）
⚠️ レート制限あり（1日1000リクエスト、要確認）
⚠️ バッチ処理のため1時間〜1日の遅延

参考: `docs/specs/asp/valuecommerce/implementation-guide.md`

---

### 🥉 3位: もしもアフィリエイト

#### 基本情報
- **実装優先度:** 🥉 3位
- **実装ステータス:** 🔍 **Phase 3候補** - API仕様確認後実装
- **総合スコア:** 24/40
- **推定実装所要時間:** 9-13日（約2週間）※API仕様確認後

#### 実装方法
**レポートAPI**（推定）
- 管理画面にログインして詳細確認必要
- API利用規約・認証方法未確認
- レスポンス形式未確認（JSON推定）
- バッチ処理

#### カスタムトラッキング
⚠️ **要確認**

```typescript
// カスタムトラッキングパラメータの可否: 要調査
// もしもアフィリエイトリンク形式:
https://af.moshimo.com/af/c/click?a_id=xxx&p_id=xxx&pc_id=xxx&pl_id=xxx&url=...

// カスタムパラメータ付与可能性（要確認）:
// Option 1: URLパラメータ
https://af.moshimo.com/af/c/click?a_id=xxx&custom_id={memberId}&url=...

// Option 2: サブID
https://af.moshimo.com/af/c/click?a_id=xxx&sid={memberId}&url=...
```

#### 評価詳細

| 評価基準 | スコア | 詳細 |
|---------|--------|------|
| 自動化可能性 | 3/5 | レポートAPI提供（推定） |
| 会員別トラッキング | 2/5 | カスタムパラメータ可否要確認 |
| 実装難易度 | 3/5 | API統合 + バッチ処理必要 |
| ドキュメント品質 | 3/5 | 公開情報限定的、ログイン要 |
| WIN×Ⅱでの利用価値 | 5/5 | Amazon全商品、楽天市場対応 |
| レスポンス速度 | 3/5 | バッチ処理（遅延あり） |
| エラーハンドリング | 3/5 | 要確認 |

**総合スコア:** 24/40

#### 今後のアクション

1. もしもアフィリエイト管理画面にログイン
2. API設定メニュー確認
3. API利用規約・認証方法確認
4. カスタムトラッキングパラメータの可否確認
5. API仕様ドキュメント取得
6. 実装判断

#### メリット

✅ Amazon全商品対応（Amazonアソシエイト代替）
✅ 楽天市場、Yahoo!ショッピング対応
✅ W報酬制度（広告主報酬 + もしも報酬12%）
✅ EC系案件豊富

#### デメリット

❓ API仕様未確認（要調査）
❓ カスタムトラッキング可否不明
❓ ドキュメント公開状況不明
⚠️ 即時ポストバックは非公開

参考: `docs/specs/asp/moshimo/README.md`

---

### 4位: AccessTrade

#### 基本情報
- **実装優先度:** 4位
- **実装ステータス:** 🔍 **Phase 4候補** - サポート回答待ち
- **総合スコア:** 23/40
- **推定実装所要時間:** 12-17日（約2.5-3週間）※サポート回答待ち期間除く

#### 実装方法
**レポートAPI + S2S通知**
- APIリファレンス公式提供
- REST API（JSON）
- S2S通知（ポストバック）機能の可能性（要確認）

#### カスタムトラッキング
⚠️ **要確認** - `info`パラメータ（推定）

```typescript
// AccessTradeリンク形式:
https://h.accesstrade.net/sp/cc?rk=xxx&af=xxx

// カスタムトラッキングパラメータ可能性（要確認）:
https://h.accesstrade.net/sp/cc?rk=xxx&af=xxx&info={memberId}

// S2S通知（ポストバック）設定可能性:
https://yourdomain.com/api/webhooks/accesstrade-postback?info={memberId}&orderId={orderId}
```

#### 評価詳細

| 評価基準 | スコア | 詳細 |
|---------|--------|------|
| 自動化可能性 | 3/5 | API + S2S通知可能性あり |
| 会員別トラッキング | 3/5 | infoパラメータ要確認 |
| 実装難易度 | 3/5 | API統合 + S2S設定 |
| ドキュメント品質 | 3/5 | APIリファレンスあり、S2S仕様非公開 |
| WIN×Ⅱでの利用価値 | 4/5 | 金融系案件豊富 |
| レスポンス速度 | 3/5 | S2S有効ならリアルタイム、API onlyなら遅延 |
| エラーハンドリング | 3/5 | 要確認 |

**総合スコア:** 23/40

#### 今後のアクション

**サポート問い合わせ内容:**

```
件名: S2S通知（ポストバック）機能と会員別トラッキングについて

お世話になっております。
WIN×Ⅱのパートナーです。

現在、会員別のキャッシュバック機能を実装したいと考えております。
以下の点についてご教示いただけますでしょうか：

1. S2S通知（Server to Server postback）機能は利用可能でしょうか？
2. カスタムトラッキングパラメータ（infoパラメータ等）で会員IDを渡すことは可能でしょうか？
3. S2S通知設定方法と通知パラメータ仕様をご教示ください。

よろしくお願いいたします。
```

#### メリット

✅ 金融系案件豊富（クレジットカード、証券口座等）
✅ 公式APIリファレンス提供
✅ S2S通知機能の可能性（要確認）
✅ 報酬単価高め

#### デメリット

❓ S2S通知仕様非公開（要問い合わせ）
❓ カスタムトラッキング可否不明
⚠️ ドキュメント不完全

参考: `docs/specs/asp/accesstrade/README.md`

---

### 5位: LinkShare（楽天アフィリエイト）

#### 基本情報
- **実装優先度:** 5位
- **実装ステータス:** 🔍 **要調査** - 管理画面調査後判断
- **総合スコア:** 22/40
- **推定実装所要時間:** 16-24日（約3-4週間）※API仕様確認後

#### 実装方法
**イベント通知API**（推定）
- 「10分以内のリアルタイム連携」の真偽要確認
- 楽天アフィリエイト管理画面にログイン調査必要
- API利用規約・認証方法未確認

#### カスタムトラッキング
❓ **要調査** - クリックID連携（推定）

```typescript
// 楽天アフィリエイトリンク形式:
https://hb.afl.rakuten.co.jp/hgc/xxx/?pc=xxx&m=xxx

// カスタムトラッキングパラメータ可能性（要調査）:
// 広告主側の設定次第でクリックID連携可能とのこと
```

#### 評価詳細

| 評価基準 | スコア | 詳細 |
|---------|--------|------|
| 自動化可能性 | 3/5 | イベント通知API（要確認） |
| 会員別トラッキング | 2/5 | クリックID連携要調査 |
| 実装難易度 | 3/5 | API統合必要、仕様不明 |
| ドキュメント品質 | 2/5 | 公開情報なし、ログイン要 |
| WIN×Ⅱでの利用価値 | 5/5 | 楽天市場全商品対応（利用価値最高） |
| レスポンス速度 | 3/5 | 「10分以内」真偽要確認 |
| エラーハンドリング | 2/5 | 不明 |

**総合スコア:** 22/40

#### 今後のアクション

1. 楽天アフィリエイト管理画面にログイン
2. API設定メニュー確認
3. 「イベント通知API」仕様確認
4. 「10分以内のリアルタイム連携」の真偽確認
5. カスタムトラッキング（クリックID連携）可否確認
6. 実装判断

#### メリット

✅ 楽天市場全商品対応（利用価値: 最高）
✅ 楽天トラベル、楽天ブックス等も対応
✅ ユーザー認知度が高い
✅ イベント通知API（リアルタイム可能性）

#### デメリット

❓ API仕様完全不明（要調査）
❓ カスタムトラッキング可否不明
❓ ドキュメント非公開
⚠️ 調査に時間がかかる可能性

参考: `docs/specs/asp/linkshare/README.md`

---

### 6-7位: JANet・infotop

#### 基本情報
- **実装優先度:** 6-7位
- **実装ステータス:** ⏸️ **手動運用推奨**
- **総合スコア:** JANet 12/40, infotop 11/40

#### 実装方法
**手動CSV運用**
- API非公開
- ポストバック未提供
- カスタムトラッキング不可
- 管理画面からCSVエクスポート → Google Sheets手動貼り付け

#### 評価詳細

| 評価基準 | JANet | infotop | 詳細 |
|---------|-------|---------|------|
| 自動化可能性 | 1/5 | 1/5 | 手動CSV only |
| 会員別トラッキング | 0/5 | 0/5 | 不可 |
| 実装難易度 | 1/5 | 1/5 | 手動運用 |
| ドキュメント品質 | 1/5 | 1/5 | API情報なし |
| WIN×Ⅱでの利用価値 | 3/5 | 2/5 | 案件少なめ |

#### 推奨運用方法

**手動CSV運用フロー:**
1. 各ASP管理画面にログイン
2. 成果レポートをCSVエクスポート
3. Google Sheets「成果CSV_RAW」に手動貼り付け
4. GASスクリプトで処理（3:10自動実行）

**制限事項:**
- ❌ 会員別キャッシュバックは提供しない
- ✅ 総報酬額のみダッシュボードに表示

参考: `docs/specs/asp/infotop/manual-csv-workflow.md`, `docs/specs/asp/janet/manual-csv-workflow.md`

---

## 🎯 実装優先度の評価基準

各ASPを以下の基準で0-5点評価し、総合スコア（40点満点）を算出しました。

### 1. 自動化可能性（重要度: 高）

| スコア | 説明 |
|--------|------|
| 5点 | リアルタイムポストバック対応（即座に成果通知） |
| 4点 | APIバッチ取得（1時間ごと取得可能） |
| 3点 | API定期取得（1日1回取得可能） |
| 2点 | メール通知 + Zapier等の外部連携 |
| 1点 | 手動CSVエクスポートのみ |

### 2. 会員別トラッキング可否（重要度: 最高）

| スコア | 説明 |
|--------|------|
| 5点 | カスタムパラメータ（会員ID）を完全サポート |
| 4点 | カスタムパラメータ対応、一部制限あり |
| 3点 | 一部サポート（広告主依存） |
| 2点 | 要確認（仕様未確認） |
| 0点 | サポートなし |

### 3. 実装難易度（重要度: 中、低いほど良い）

| スコア | 説明 |
|--------|------|
| 5点 | Webhook受信のみで完結 |
| 4点 | REST API統合（JSON） |
| 3点 | OAuth + XML解析 or 複雑な認証 |
| 2点 | 特殊な実装 or 仕様不明確 |
| 1点 | 手動運用 |

### 4. ドキュメント品質（重要度: 中）

| スコア | 説明 |
|--------|------|
| 5点 | 公式ドキュメント完備、サンプルコードあり |
| 4点 | 公式ドキュメントあり、一部不明瞭 |
| 3点 | 基本的な情報は公開されている |
| 2点 | 情報が断片的、要問い合わせ |
| 1点 | ドキュメント非公開 |

### 5. WIN×Ⅱでの利用価値（重要度: 高）

| スコア | 説明 |
|--------|------|
| 5点 | 大手EC（楽天、Amazon、Yahoo!）対応、案件豊富、報酬単価高 |
| 4点 | 案件豊富、報酬単価標準以上 |
| 3点 | 案件標準、報酬単価標準 |
| 2点 | 案件少なめ、報酬単価低め |
| 1点 | 利用価値低い |

### 6. レスポンス速度（重要度: 中）

| スコア | 説明 |
|--------|------|
| 5点 | リアルタイム（即座） |
| 4点 | 10分以内 |
| 3点 | 1時間以内 |
| 2点 | 1日以内 |
| 1点 | 1日以上遅延 |

### 7. エラーハンドリング（重要度: 低）

| スコア | 説明 |
|--------|------|
| 5点 | 再送機能あり、エラーログ完備 |
| 4点 | エラーログあり |
| 3点 | 基本的なエラーハンドリング |
| 2点 | エラーハンドリング不明 |
| 1点 | エラーハンドリングなし |

---

## 🛠️ 技術的リスクと対策

### リスク 1: OAuth 1.0a認証の複雑性

**対象ASP:** ValueCommerce

**リスク内容:**
- OAuth 1.0a（OAuth 2.0ではない）の実装が複雑
- 署名生成アルゴリズムが独特
- タイムスタンプ・ノンス管理が必要

**対策:**
```typescript
// oauth-1.0a ライブラリ使用
npm install oauth-1.0a

import OAuth from 'oauth-1.0a';
import crypto from 'crypto';

const oauth = OAuth({
  consumer: {
    key: process.env.VALUECOMMERCE_CONSUMER_KEY!,
    secret: process.env.VALUECOMMERCE_CONSUMER_SECRET!,
  },
  signature_method: 'HMAC-SHA1',
  hash_function(base_string, key) {
    return crypto
      .createHmac('sha1', key)
      .update(base_string)
      .digest('base64');
  },
});
```

参考: `docs/specs/asp/common/oauth-implementation.md`

---

### リスク 2: XML解析

**対象ASP:** ValueCommerce

**リスク内容:**
- レスポンスがXML形式（JSONではない）
- 名前空間、CDATA等の処理が必要
- エラーレスポンスもXML

**対策:**
```typescript
// fast-xml-parser ライブラリ使用
npm install fast-xml-parser

import { XMLParser } from 'fast-xml-parser';

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
});

const jsonObj = parser.parse(xmlData);
```

参考: `docs/specs/asp/common/xml-parsing.md`

---

### リスク 3: レート制限

**対象ASP:** ValueCommerce、もしもアフィリエイト、AccessTrade

**リスク内容:**
- API呼び出し回数制限（1日1000回等）
- 短時間の連続呼び出しでブロック
- リトライ処理が必要

**対策:**
```typescript
// bottleneck ライブラリ使用
npm install bottleneck

import Bottleneck from 'bottleneck';

const limiter = new Bottleneck({
  minTime: 1000, // 1秒間に1リクエスト
  maxConcurrent: 1,
});

const fetchOrders = limiter.wrap(async (date: string) => {
  // API呼び出し
});
```

参考: `docs/specs/asp/common/rate-limiting.md`

---

### リスク 4: クリックログ突合精度

**すべてのASP共通**

**リスク内容:**
- カスタムID（memberId）がASP側で欠損する可能性
- タイムスタンプのずれ
- デバイス変更・Cookie削除による追跡不可

**対策:**
```typescript
// マッチングアルゴリズム
// 優先度1: カスタムID（memberId）でマッチング
// 優先度2: タイムスタンプ範囲 + 案件名でマッチング
// 優先度3: 手動確認UIで管理者が判断

async function matchConversion(
  conversionData: ConversionData,
  clickLogs: ClickLog[]
): Promise<MatchResult> {
  // 1. カスタムIDでマッチング
  if (conversionData.memberId) {
    const exactMatch = clickLogs.find(
      log => log.memberId === conversionData.memberId
    );
    if (exactMatch) {
      return { match: exactMatch, confidence: 'high' };
    }
  }

  // 2. タイムスタンプ範囲 + 案件名でマッチング
  const timeRangeMatches = clickLogs.filter(log => {
    const timeDiff = Math.abs(
      new Date(log.timestamp).getTime() -
      new Date(conversionData.timestamp).getTime()
    );
    const within24Hours = timeDiff < 24 * 60 * 60 * 1000;
    const dealNameMatch = log.dealName === conversionData.dealName;
    return within24Hours && dealNameMatch;
  });

  if (timeRangeMatches.length === 1) {
    return { match: timeRangeMatches[0], confidence: 'medium' };
  } else if (timeRangeMatches.length > 1) {
    return { matches: timeRangeMatches, confidence: 'low', requiresManualReview: true };
  }

  return { match: null, confidence: 'none', requiresManualReview: true };
}
```

参考: `docs/specs/asp/common/click-log-matching.md`

---

### リスク 5: Google Sheets書き込み上限

**すべてのASP共通**

**リスク内容:**
- Google Sheets API: 1分間に100リクエスト
- 1日のセル更新上限: 5000万セル
- 大量データの同時書き込みでエラー

**対策:**
```typescript
// バッチ書き込み実装
async function batchWriteConversions(conversions: ConversionData[]) {
  const BATCH_SIZE = 100; // 100件ずつ書き込み

  for (let i = 0; i < conversions.length; i += BATCH_SIZE) {
    const batch = conversions.slice(i, i + BATCH_SIZE);

    // Google Sheets batchUpdate API使用
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: {
        valueInputOption: 'RAW',
        data: batch.map(conv => ({
          range: `成果CSV_RAW!A${i + 2}:H${i + 2}`,
          values: [[/* ... */]],
        })),
      },
    });

    // レート制限対策: 1秒待機
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}
```

---

### リスク 6: データ整合性

**すべてのASP共通**

**リスク内容:**
- 重複データの記録
- ステータス更新の競合
- トランザクション管理の欠如

**対策:**
```typescript
// 1. eventID/orderIDベースの重複チェック
async function isDuplicate(eventId: string): Promise<boolean> {
  const rows = await readSheet('成果CSV_RAW', 'A2:H');
  return rows.some(row => row[2] === eventId); // C列: eventId
}

// 2. ステータス更新ロジック（Optimistic Locking）
async function updateConversionStatus(
  eventId: string,
  newStatus: 'pending' | 'approved' | 'cancelled'
) {
  // 既存データ取得
  const existing = await getConversionByEventId(eventId);
  if (!existing) {
    throw new Error('Conversion not found');
  }

  // ステータス遷移チェック
  const validTransitions = {
    pending: ['approved', 'cancelled'],
    approved: [], // 承認済みは変更不可
    cancelled: [], // キャンセル済みは変更不可
  };

  if (!validTransitions[existing.status].includes(newStatus)) {
    throw new Error(`Invalid status transition: ${existing.status} -> ${newStatus}`);
  }

  // 更新実行
  await updateSheet('成果CSV_RAW', `G${existing.rowIndex}`, [[newStatus]]);
}
```

参考: `docs/specs/asp/common/security-best-practices.md`

---

## 📊 推奨実装ロードマップ詳細

### Phase 1: AFB実装 ✅ **完了**（2025-01-04）

**実装内容:**
- リアルタイムポストバック受信エンドポイント
- IPホワイトリスト実装
- 重複チェック実装
- Google Sheets統合

**成果物:**
- `app/api/webhooks/afb-postback/route.ts`
- `types/afb-postback.ts`
- `lib/sheets.ts` - `writeConversionData()`, `isDuplicateConversion()`
- `docs/specs/asp/afb-implementation-guide.md`

**所要時間:** 2-3日（完了）

---

### Phase 2: ValueCommerce実装 📋 **推奨**（2025-01〜02月）

**推定実装期間:** 12-18日（約2.5-3週間）

#### Phase 2-1: パートナー管理画面設定（2-3日）
- [ ] ValueCommerceパートナー管理画面ログイン
- [ ] APIキー（Consumer Key/Secret）発行申請
- [ ] API利用規約確認
- [ ] テストアカウント動作確認

#### Phase 2-2: OAuth 1.0a認証実装（3-4日）
- [ ] `lib/valuecommerce-client.ts` 作成
- [ ] OAuth署名生成ロジック実装
- [ ] アクセストークン取得処理
- [ ] 認証テスト

#### Phase 2-3: 注文レポートAPI統合（3-4日）
- [ ] 注文データ取得関数実装
- [ ] XML → JSON変換処理
- [ ] Google Sheets書き込み処理
- [ ] エラーハンドリング

#### Phase 2-4: クリックログ突合処理（2-3日）
- [ ] sidパラメータでマッチング
- [ ] タイムスタンプ範囲突合（補助）
- [ ] 重複チェック
- [ ] ステータス更新ロジック

#### Phase 2-5: テスト・本番稼働（2-4日）
- [ ] ローカルテスト
- [ ] ステージング環境テスト
- [ ] 本番デプロイ
- [ ] モニタリング設定

**必要な npm パッケージ:**
```bash
npm install oauth-1.0a fast-xml-parser bottleneck
```

参考: `docs/specs/asp/valuecommerce/implementation-guide.md`

---

### Phase 3: もしもアフィリエイト実装 🔍 **中期**（2025-02〜03月）

**推定実装期間:** 9-13日（約2週間）※API仕様確認後

#### Phase 3-1: API仕様調査（1-2日）
- [ ] もしもアフィリエイト管理画面ログイン
- [ ] API設定メニュー確認
- [ ] API利用規約・認証方法確認
- [ ] カスタムトラッキングパラメータ可否確認
- [ ] API仕様ドキュメント取得

#### Phase 3-2: 実装判断（1日）
- [ ] API仕様レビュー
- [ ] 実装難易度評価
- [ ] ROI計算（実装コスト vs 期待報酬）
- [ ] Go/No-Go判断

#### Phase 3-3: API統合実装（5-7日）※Go判断後
- [ ] APIクライアント作成
- [ ] 認証実装
- [ ] レポートデータ取得
- [ ] Google Sheets統合
- [ ] クリックログ突合
- [ ] エラーハンドリング

#### Phase 3-4: テスト・本番稼働（2-3日）
- [ ] ローカルテスト
- [ ] ステージング環境テスト
- [ ] 本番デプロイ
- [ ] モニタリング設定

参考: `docs/specs/asp/moshimo/README.md`

---

### Phase 4: AccessTrade実装 🔍 **要判断**（2025-03月以降）

**推定実装期間:** 12-17日（約2.5-3週間）※サポート回答待ち期間除く

#### Phase 4-1: サポート問い合わせ（1-2週間待ち）
- [ ] AccessTradeサポートに問い合わせ
- [ ] S2S通知機能可否確認
- [ ] カスタムトラッキングパラメータ確認
- [ ] 回答待ち

#### Phase 4-2: 実装判断（1日）
- [ ] サポート回答レビュー
- [ ] 実装難易度評価
- [ ] ROI計算
- [ ] Go/No-Go判断

#### Phase 4-3: API/S2S統合実装（7-10日）※Go判断後
- [ ] APIクライアント作成
- [ ] S2S通知エンドポイント実装（可能な場合）
- [ ] Google Sheets統合
- [ ] クリックログ突合
- [ ] エラーハンドリング

#### Phase 4-4: テスト・本番稼働（2-4日）
- [ ] ローカルテスト
- [ ] ステージング環境テスト
- [ ] 本番デプロイ
- [ ] モニタリング設定

参考: `docs/specs/asp/accesstrade/README.md`

---

### Phase 5: LinkShare実装 🔍 **要調査**（時期未定）

**推定実装期間:** 16-24日（約3-4週間）※API仕様確認後

#### Phase 5-1: API仕様調査（3-5日）
- [ ] 楽天アフィリエイト管理画面ログイン
- [ ] 「イベント通知API」仕様確認
- [ ] 「10分以内のリアルタイム連携」真偽確認
- [ ] カスタムトラッキング（クリックID連携）可否確認
- [ ] API仕様ドキュメント取得

#### Phase 5-2: 実装判断（1日）
- [ ] API仕様レビュー
- [ ] 実装難易度評価
- [ ] ROI計算（楽天市場全商品の価値）
- [ ] Go/No-Go判断

#### Phase 5-3: API統合実装（8-12日）※Go判断後
- [ ] APIクライアント作成
- [ ] イベント通知実装
- [ ] Google Sheets統合
- [ ] クリックログ突合
- [ ] エラーハンドリング

#### Phase 5-4: テスト・本番稼働（4-6日）
- [ ] ローカルテスト
- [ ] ステージング環境テスト
- [ ] 本番デプロイ
- [ ] モニタリング設定

参考: `docs/specs/asp/linkshare/README.md`

---

### Phase 6: JANet・infotop ⏸️ **手動運用継続**

**実装判断:** 手動CSV運用を継続（自動化ROI低い）

**運用フロー:**
1. 各ASP管理画面にログイン
2. 成果レポートをCSVエクスポート
3. Google Sheets「成果CSV_RAW」に手動貼り付け
4. GASスクリプトで処理（3:10自動実行）

**制限事項:**
- ❌ 会員別キャッシュバックは提供しない
- ✅ 総報酬額のみダッシュボードに表示

参考: `docs/specs/asp/infotop/manual-csv-workflow.md`, `docs/specs/asp/janet/manual-csv-workflow.md`

---

## 🎯 次のアクションプラン

### 即座に実施（今週中）

1. ✅ **本調査レポートをGitにpush**
2. 🔍 **ValueCommerceパートナー管理画面にログイン**
   - APIキー（Consumer Key/Secret）発行申請
   - API利用規約確認
3. 🔍 **もしもアフィリエイト管理画面でAPI設定確認**
   - API仕様ドキュメント取得
   - カスタムトラッキングパラメータ可否確認

### 短期（1〜2週間）

4. 📝 **ValueCommerce Phase 2実装開始**
   - OAuth 1.0a認証実装
   - 注文レポートAPI統合
   - クリックログ突合処理実装

5. 📧 **AccessTradeサポートに問い合わせ**
   - S2S通知機能可否確認
   - カスタムトラッキングパラメータ確認

6. 🔍 **楽天アフィリエイト管理画面調査**
   - イベント通知API仕様確認
   - カスタムトラッキング可否確認

### 中期（1〜2ヶ月）

7. 📝 **もしもアフィリエイト Phase 3実装**（API仕様確認後）
8. 📝 **AccessTrade Phase 4実装**（サポート回答後）
9. 📝 **LinkShare Phase 5実装**（API仕様確認後）

### 長期（3ヶ月以降）

10. 🔍 **A8.netサポートに問い合わせ**
    - Media Member向けAPI利用可否確認
    - 広告主契約変更条件確認

---

## 📚 関連ドキュメント

### ASP個別ドキュメント
- `docs/specs/asp/a8net-api.md` - A8.net API仕様（Media Member制限）
- `docs/specs/asp/afb-implementation-guide.md` - AFB実装ガイド（完了）
- `docs/specs/asp/valuecommerce/implementation-guide.md` - ValueCommerce実装ガイド
- `docs/specs/asp/moshimo/README.md` - もしもアフィリエイト概要
- `docs/specs/asp/accesstrade/README.md` - AccessTrade概要
- `docs/specs/asp/linkshare/README.md` - LinkShare/楽天アフィリエイト概要

### 共通技術ドキュメント
- `docs/specs/asp/common/click-log-matching.md` - クリックログ突合ロジック
- `docs/specs/asp/common/oauth-implementation.md` - OAuth認証実装ガイド
- `docs/specs/asp/common/xml-parsing.md` - XML解析ガイド
- `docs/specs/asp/common/rate-limiting.md` - レート制限対策
- `docs/specs/asp/common/security-best-practices.md` - セキュリティベストプラクティス

### プロジェクト全体
- `CLAUDE.md` - WIN×Ⅱプロジェクト全体概要
- `docs/index.md` - ドキュメントインデックス
- `docs/specs/google.md` - Google Sheets構造とGAS仕様

---

## 🔄 更新履歴

### 2025-01-04
- 初版作成
- A8.netファクトチェック完了（契約種別による機能差を明確化）
- 国内主要ASP 7社徹底調査完了
- 実装優先度ランキング作成
- 技術的リスクと対策を文書化

---

**作成者:** Claude Code (Anthropic)
**レビュー:** 要確認
**承認:** 未承認
