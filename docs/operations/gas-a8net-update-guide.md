# Google Apps Script修正ガイド（A8.net対応）

## 目的

A8.net Parameter Tracking Report CSVからGoogle Sheetsへのデータ取り込みに対応するため、GASコードにA8.net固有のヘッダー候補とステータス値を追加します。

---

## 修正対象ファイル

**Google Sheets**: WIN×Ⅱ成果管理シート
**ファイル**: `Code.gs`（Apps Script）
**参照**: `docs/specs/google.md` - GAS code.gs完全版

---

## 修正箇所1: HEADER_CANDIDATES（ヘッダー候補の追加）

### 該当行

行数: 約50-65行目（`HEADER_CANDIDATES` オブジェクト定義）

### 修正内容

A8.net Parameter Tracking Report CSVのカラム名に対応するため、以下のヘッダー候補を追加します。

#### 修正前（既存コード）

```javascript
const HEADER_CANDIDATES = {
  memberId: ['id1', 'memberid', 'member_id', '会員id', '会員ＩＤ', '会員ｉｄ', '会員id(id1)', '会員', 'id', 'ID'],
  reward: ['reward', '成果報酬', '報酬額', '報酬', 'commission', '金額', '確定報酬', '承認報酬'],
  status: ['status', '承認状況', 'ステータス', '状態'],
  dealName: ['dealname', '案件名', '商品名', '広告名', 'offer', 'program', 'サービス名', '広告主名', 'キャンペーン名', 'プログラム名'],
};
```

#### 修正後（A8.net対応追加）

```javascript
const HEADER_CANDIDATES = {
  memberId: [
    'id1', 'memberid', 'member_id', '会員id', '会員ＩＤ', '会員ｉｄ', '会員id(id1)', '会員', 'id', 'ID',
    // A8.net Parameter Tracking Report固有カラム名
    'パラメータ(id1)', 'パラメータid1', 'パラメータ（id1）', 'パラメータ（ID1）', 'パラメータID1'
  ],
  reward: [
    'reward', '成果報酬', '報酬額', '報酬', 'commission', '金額', '確定報酬', '承認報酬',
    // A8.net固有カラム名
    '発生報酬額', '確定報酬額'
  ],
  status: [
    'status', '承認状況', 'ステータス', '状態',
    // A8.net固有カラム名
    'ステータス名'
  ],
  dealName: [
    'dealname', '案件名', '商品名', '広告名', 'offer', 'program', 'サービス名', '広告主名', 'キャンペーン名',
    // A8.net固有カラム名
    'プログラム名'
  ],
};
```

---

## 修正箇所2: APPROVED_VALUES（承認ステータス値の追加）

### 該当行

行数: 約156行目（`APPROVED_VALUES` 配列定義）

### 修正内容

A8.net Parameter Tracking Report CSVのステータス名に対応するため、承認済みステータス値を追加します。

#### 修正前（既存コード）

```javascript
const APPROVED_VALUES = ['承認', '確定', '承認済', '確定済', 'approved', 'Approved', 'APPROVED'];
```

#### 修正後（A8.net対応追加）

```javascript
const APPROVED_VALUES = [
  '承認', '確定', '承認済', '確定済',
  'approved', 'Approved', 'APPROVED',
  // A8.net固有のステータス値
  '成果確定', '報酬確定', '支払済', '支払い済み', '確定'
];
```

---

## 修正箇所3: ステータス判定ロジック拡張（オプション）

### 目的

未確定・否認のステータスを明示的に判定し、キャッシュバック計算を正確に行う。

### 追加コード

`APPROVED_VALUES` の下に以下を追加（行156の後）：

```javascript
// 未確定ステータス値（キャッシュバック0円）
const PENDING_VALUES = ['未確定', '成果発生', '未承認', '審査中', '確認中'];

// 否認ステータス値（キャッシュバック0円）
const REJECTED_VALUES = ['否認', '却下', '非承認', 'キャンセル', '取消', '無効'];
```

### 修正箇所: `isApprovedStatus_` 関数

既存の `isApprovedStatus_` 関数を拡張（行174-179付近）：

#### 修正前

```javascript
function isApprovedStatus_(status) {
  if (!status) return false;
  const s = status.toString().trim().toLowerCase();
  return APPROVED_VALUES.some(v => s === v.toLowerCase());
}
```

#### 修正後

```javascript
function isApprovedStatus_(status) {
  if (!status) return false;
  const s = status.toString().trim().toLowerCase();

  // 未確定または否認の場合は明示的にfalseを返す
  if (PENDING_VALUES.some(v => s.includes(v.toLowerCase()))) {
    return false;
  }
  if (REJECTED_VALUES.some(v => s.includes(v.toLowerCase()))) {
    return false;
  }

  // 承認済みの場合のみtrueを返す
  return APPROVED_VALUES.some(v => s.includes(v.toLowerCase()));
}
```

---

## A8.net CSVカラム構成（参考）

Parameter Tracking Report CSVに含まれるカラム（2025年11月15日確認済み）：

```csv
プログラムID,プログラム名,パラメータ(ID1),パラメータ(ID2),パラメータ(ID3),パラメータ(ID4),パラメータ(ID5),ステータス名,クリック日,成果日,確定日,発生報酬額,確定報酬額,否認報酬額,成果ID,広告ID,広告タイプ,端末デバイス,コンバージョン参照ファイル
```

### 主要カラムのマッピング

| GAS変数 | A8.net CSVカラム名 | データ例 |
|---------|-------------------|---------|
| `memberId` | パラメータ(ID1) | `b91765a2-f57d-4c82-bd07-9e0436f560da` |
| `status` | ステータス名 | `未確定`, `成果確定`, `否認` |
| `reward` | 発生報酬額 | `280` |
| `dealName` | プログラム名 | `アンケートモニターになって現金がもらえる！【マクロミル新規モニタ登録】(15-0722)` |

---

## 実装手順

### Step 1: Google Sheetsを開く

1. WIN×Ⅱ成果管理シートにアクセス
2. メニュー: 拡張機能 → Apps Script

### Step 2: Code.gsを編集

1. `Code.gs` ファイルを開く
2. 上記の修正箇所1-3を実施
3. 保存（Ctrl+S / Cmd+S）

### Step 3: テスト実行

1. A8.net Parameter Tracking Report CSVをダウンロード
2. 「成果CSV_RAW」シートのA1セルに貼り付け
3. Apps Scriptメニュー: 「カスタムメニュー」→「成果データを更新」を実行
4. 「成果データ」シートに正しく反映されることを確認

### Step 4: 確認項目

- [ ] パラメータ(ID1)がmemberIdとして認識される
- [ ] ステータス名が承認状況として認識される
- [ ] 発生報酬額が報酬額として認識される
- [ ] プログラム名が案件名として認識される
- [ ] キャッシュバック金額が正しく計算される（承認時のみ）

---

## トラブルシューティング

### エラー: 「id1カラムが見つかりません」

**原因**: A8.net CSVのヘッダー名が `HEADER_CANDIDATES.memberId` に含まれていない
**解決策**: CSVファイルのヘッダー行（1行目）を確認し、実際のカラム名を `HEADER_CANDIDATES.memberId` 配列に追加

### 問題: キャッシュバック金額が0円のまま

**原因1**: ステータスが「未確定」のため（正常動作）
**解決策1**: 成果が確定したら再度CSVをダウンロードして貼り付け

**原因2**: ステータス値が `APPROVED_VALUES` に含まれていない
**解決策2**: 実際のステータス値（例: 「成果確定」）を `APPROVED_VALUES` 配列に追加

---

## 関連ドキュメント

- `docs/specs/google.md` - Google Sheets構造とGAS完全コード
- `docs/operations/afb-a8-hybrid-workflow.md` - 運用フロー（AFB自動 + A8.net手動）
- `docs/dev/a8-parameter-tracking-verification.md` - A8.net Parameter Tracking検証記録

---

**作成日**: 2025-11-15
**最終更新**: 2025-11-15
**ステータス**: 完成
