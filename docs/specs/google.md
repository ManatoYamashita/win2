## Google Spread Sheets（win2_master）

[Sheet(win2_master)](https://docs.google.com/spreadsheets/d/1-EB589AjCpX7K1NRBhwsg4USMwtmX_frO9_Npb-RS64/edit?gid=1717230059#gid=1717230059)

[GAS](https://script.google.com/d/1jZhmEp6HaK73GPYJmZhxOQyV5LvfDoqJQ9_s_sUZU5gt1YYe-CkgcP6q/edit?usp=sharing)

### 会員リスト

**列構成（spec.md準拠）:**
```
A: 会員ID (UUID)
B: 氏名
C: メールアドレス
D: パスワード (bcrypt hash)
E: 生年月日 (YYYY-MM-DD)
F: 郵便番号
G: 電話番号
H: 登録日時 (ISO8601)
I: emailVerified (ISO8601)
```

**重要:**
- D列「パスワード」は必須（bcryptハッシュ値を格納）
- H列「登録日時」は必須（ISO8601形式のタイムスタンプ）
- 生年月日はYYYY-MM-DD形式で格納

### 案件マスタ

**列構成（2025/11 更新）:**
```
A: 整形済みアフィリエイトURL（システム利用値、優先）
B: 案件ID (例: "a8-rakuten-card") - 主キー
C: 案件名 (例: "楽天カード")
D: ASP名 (例: "A8.net", "AFB", "もしも", "バリューコマース") ※GASで自動判定
E: ROW URL（ASPから取得した元URL、Aが空の場合のフォールバック用）
F: 報酬額（GASで使用、Next.jsアプリでは未使用、デフォルト0）
H: 有効/無効（GASで使用、Next.jsアプリでは未使用、デフォルトTRUE）
```

**運用ルール:**
- B列「案件ID」は一意である必要があります（主キー）
- A列は `/api/track-click` が参照する整形済みURLです。**ここが空だと案件が配信されません**。
- D列「ASP名」は `deal-auto-fill.gs.js` で自動判定されます（A列URLから A8.net, AFB, もしも, バリューコマース を検出）
- E列にROW URLを貼り付けると、GASがC列（案件名）とD列（ASP名）を自動入力します
- F/G/H列はGAS処理で使用されますが、Next.jsアプリ側では読み込んでいません（範囲: A2:E）

**入力手順（推奨）:**
1. **A列にアフィリエイトURLを入力**（手動 or E列から自動生成）
2. **B列に案件ID**を入力（例: `a8-rakuten-card`）
3. E列にASPから発行されたROW URLを貼り付け
4. GAS（`deal-auto-fill.gs.js`）が自動実行:
   - C列: URLからページタイトルを取得して案件名を自動入力
   - D列: URLからASP名を自動判定（A8.net / AFB / もしも / バリューコマース）
   - F列: 報酬額のデフォルト値（0）を自動入力
   - H列: 有効/無効のデフォルト値（TRUE）を自動入力
5. （オプション）A列に `ARRAYFORMULA` を設定して、E列から整形済みURLを自動生成
   ```gs
   =ARRAYFORMULA(IF(LEN(E2:E)=0,"",TRIM(E2:E)))
   ```
   ※必要に応じて `REGEXREPLACE` で余計なクエリを除去

**使用イメージ:**
```
A列: https://px.a8.net/svt/ejp?a8mat=XXXXX
B列: a8-rakuten-card
C列: 楽天カード（GASで自動取得）
D列: A8.net（GASで自動判定）
E列: https://px.a8.net/svt/ejp?a8mat=XXXXX（ROW URL）
F列: 0（GASでデフォルト設定）
G列: 0.20（GASでデフォルト設定）
H列: TRUE（GASでデフォルト設定）
```

**ASP対応状況:**
- ✅ **A8.net** (`a8.net`) - 対応済み（手動CSV週次）
- ✅ **AFB** (`afi-b.com`, `afb.com`) - 対応済み（自動ポーリング10分毎）
- ✅ **もしもアフィリエイト** (`moshimo.com`) - 準備済み（運用開始待ち）
- ✅ **バリューコマース** (`valuecommerce.com`) - 準備済み（運用開始待ち）

**CTAボタンリンク生成ルール:**
microCMSの `[CTA:dealId]` ショートコードがクリックされると、以下の処理が実行されます：

1. `/api/track-click` にPOSTリクエスト（body: `{ dealId: "..." }`）
2. Google Sheets「案件マスタ」からA列（整形済みURL）を取得（A列が空の場合はE列をフォールバック）
3. URLに以下のパラメータを付与:
   ```
   ?id1={trackingId}&id2={eventId}&eventId={eventId}
   ```
   - `id1`: 会員ID または `guest:UUID`（非会員の場合）
   - `id2`: クリック毎に生成されるUUID v4
   - `eventId`: id2と同じ値（A8.net Parameter Tracking Report対応）
4. クリックログに記録（日時, 会員ID, 案件名, 案件ID, イベントID）
5. 生成されたtracking URLへリダイレクト

**重要**: URLパラメータの付与は**すべてのASPで共通**ですが、**成果追跡の実現方法はASPごとに異なります**。

**成果追跡の対応状況:**

| ASP | URLパラメータ保持 | マッチング方法 | 実装状況 |
|-----|-----------------|--------------|---------|
| **A8.net** | ✅ あり（Parameter Tracking Report） | eventIdベース完全マッチング | ✅ 実装済み |
| **AFB** | ❌ なし（API経由取得） | 時間ベース・案件名ベース | ⚠️ マッチング未完成 |
| **もしも** | ❓ 調査中 | 未定 | 🔜 準備中 |
| **バリューコマース** | ❓ 調査中 | 未定 | 🔜 準備中 |

**詳細説明:**
- **A8.net**: Parameter Tracking Report が `パラメータ(id1)` と `パラメータ(id2)` を返却するため、クリックログとの完全なマッチングが可能
- **AFB**: AFB APIは URLパラメータを返却しないため、`trackingId` と `eventId` は空白で記録され、別のマッチングロジック（時間・案件名ベース）が必要（現状未実装）
- **もしも・バリューコマース**: URLパラメータ保持機能の有無を調査し、対応方法を決定する必要あり

### クリックログ

**列構成:**
```
A: 日時 (YYYY年MM月DD日 HH時MM分SS秒 / JST)
B: 会員ID (memberId or guest:UUID)
C: 案件名 (dealName)
D: 案件ID (dealId)
E: イベントID (eventId) ← 新規追加（UUID v4）
F: 申し込み案件名 ← GASで自動記録（成果マッチング時）
G: STATUS ← GASで自動記録（成果マッチング時）
```

**重要:**
- E列「イベントID」は各クリック毎にユニークなUUID v4を生成
- ASPへのトラッキングURLに `?id1={memberId}&id2={eventId}&eventId={eventId}` として付与（A8.net向けにid2へも同値をセット）
- 成果CSV取込時に `eventId` で完全に紐付け可能（同じ会員の複数クリックを区別できる）
- F列・G列はGAS `recordConversionsToClickLog()` 関数が成果CSV_RAWとマッチング時に自動記録
  - F列：A8.net Parameter Tracking Reportの「プログラム名」を記録
  - G列：A8.net Parameter Tracking Reportの「ステータス名」を記録

| 日時 | 会員ID | 案件名 | 案件ID | イベントID | 申し込み案件名 | STATUS |
| --- | --- | --- | --- | --- | --- | --- |

### 成果データ

**列構成:**
```
A: 氏名
B: 案件名
C: 承認状況
E: memberId(参考)
F: イベントID(参考) ← 新規追加
G: 原始報酬額(参考)
H: メモ
```

| --- | --- | --- | --- | --- | --- | --- | --- |

### 成果CSV_RAW

**列構成:**
```
A: id1 (memberId or guest:UUID)
B: eventId (クリック時に生成されたUUID) ← 新規追加
C: dealName
D: reward
E: status
F: 
G: 
H: 
I: マッチングスコア（0-100の数値（例: 95）
J: マッチングステータス（未確認/確認済み/却下 のいずれか）
K: 確認者（管理者のメールアドレス）
L: 確認日時（ISO8601形式（例: 2025-01-03T12:00:00Z）
```

**重要:**
- ASPの成果CSVに `eventId` パラメータが含まれていることが前提
- A8.netなどの主要ASPは、URLパラメータを保持して返却します

| id1 | eventId | dealName | reward | status |
| --- | --- | --- | --- | --- |

### Google Apps Script

- `google-spread-sheet/code.gs.js` (v4.0.0 - 2025/11/15更新)
  - **内容**: A8.net Parameter Tracking Report CSVと「クリックログ」をマッチングして成果情報を記録するGASファイル。
  - **主な機能**:
    - `recordConversionsToClickLog()`: 成果CSV_RAWから id1+id2 でクリックログをマッチング、F列・G列を更新
    - A8.net Parameter Tracking Report CSV対応（パラメータ(id1)、パラメータ(id2)、プログラム名、ステータス名）
    - 柔軟なヘッダー検出（HEADER_CANDIDATES）
    - 手動実行トリガー: メニュー「成果処理」→「成果をクリックログに記録」
    - 詳細なエラーハンドリングとマッチング結果レポート
  - **処理フロー**:
    1. 成果CSV_RAWから id1（会員ID）、id2（イベントID）、プログラム名、ステータス名を取得
    2. クリックログの該当行（B列=id1, E列=id2）を検索
    3. 該当行のF列に「申し込み案件名」、G列に「ステータス」を記録
    4. マッチング結果をアラートで表示（成功件数、失敗件数、失敗詳細）
  - **更新履歴**:
    - v2.0.0: A8.net対応（HEADER_CANDIDATES拡張、ステータス値追加）
    - v3.0.0: onEdit()トリガー実装、時間ベーストリガー削除

### Google Apps Script（案件マスタ用）

- `google-spread-sheet/deal-auto-fill.gs.js`
  - **内容**: 案件マスタでROW URL入力時に案件名・ASP名補完とデフォルト設定を行うGAS。