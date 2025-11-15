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
A: 整形済みアフィリエイトURL（システム利用値）
B: 案件ID (例: "a8-rakuten-card")
C: 案件名 (例: "楽天カード")
D: 会社名（クライアント様が入力）
E: ROW URL（ASPから取得した元のURL）
```

**運用ルール:**
- B列「案件ID」は一意である必要があります（主キー）
- A列は `/api/track-click` が参照する整形済みURLです。ここが空だと案件が配信されません。
- D列「会社名」はユーザーに見せたい名称を入力してください。
- E列にROW URLを貼り付け、A列に整形済みURLを自動出力させる運用に切り替えてください。

**入力手順（推奨）:**
1. B列とC列に案件ID／案件名を入力
2. D列にユーザー向けの会社名を入力
3. E列にASPから発行されたROW URLを貼り付け
4. A列には次のような `ARRAYFORMULA` を設定し、E列をトリガーに整形済みURLを自動生成
   ```gs
   =ARRAYFORMULA(IF(LEN(E2:E)=0,"",TRIM(E2:E)))
   ```
   ※必要に応じて `REGEXREPLACE` やGASで余計なクエリを除去してください。

**使用イメージ:**
```
A列: https://px.a8.net/svt/ejp?a8mat=XXXXX
B列: a8-rakuten-card
C列: 楽天カード
D列: 楽天カード株式会社
E列: https://px.a8.net/svt/ejp?a8mat=XXXXX（ROW URL）
```

### クリックログ

**列構成:**
```
A: 日時 (YYYY年MM月DD日 HH時MM分SS秒 / JST)
B: 会員ID (memberId or guest:UUID)
C: 案件名 (dealName)
D: 案件ID (dealId)
E: イベントID (eventId) ← 新規追加（UUID v4）
```

**重要:**
- E列「イベントID」は各クリック毎にユニークなUUID v4を生成
- ASPへのトラッキングURLに `?id1={memberId}&eventId={eventId}` として付与
- 成果CSV取込時に `eventId` で完全に紐付け可能（同じ会員の複数クリックを区別できる）

| 日時 | 会員ID | 案件名 | 案件ID | イベントID |
| --- | --- | --- | --- | --- |

### 成果データ

**列構成:**
```
A: 氏名
B: 案件名
C: 承認状況
D: キャッシュバック金額
E: memberId(参考)
F: イベントID(参考) ← 新規追加
G: 原始報酬額(参考)
H: メモ
```

| 氏名 | 案件名 | 承認状況 | キャッシュバック金額 | memberId(参考) | イベントID(参考) | 原始報酬額(参考) | メモ |
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

- `google-spread-sheet/gode.gs`
  - 内容: 成果CSVの取り込み〜キャッシュバック集計、設定ダイアログ、日次トリガーを制御するメインGASファイル。

### Google Apps Script（案件マスタ用）

- `google-spread-sheet/deal-auto-fill.gs`
  - 内容: 案件マスタでROW URL入力時に案件名・ASP名補完とデフォルト設定を行うGAS。
