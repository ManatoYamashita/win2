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
```

**重要:**
- D列「パスワード」は必須（bcryptハッシュ値を格納）
- H列「登録日時」は必須（ISO8601形式のタイムスタンプ）
- 生年月日はYYYY-MM-DD形式で格納

### クリックログ

| 日時
 | 会員ID
 | 案件名
 |
| --- | --- | --- |

### 成果データ

| 氏名
 | 案件名
 | 承認状況
 | キャッシュバック金額
 | memberId(参考)
 | 原始報酬額(参考)
 | メモ
 |
| --- | --- | --- | --- | --- | --- | --- |

### 成果**CSV_RAW**

| id
 | dealName
 | reward
 | status
 |
| --- | --- | --- | --- |

### Google Apps Script

- `code.gs`

    ```jsx
    /**
     * WIN×Ⅱ 成果CSV 取込～キャッシュバック集計（2025/10/05）
     * -------------------------------------------------------------------
     * シート:
     *  - `成果CSV_RAW`：ASP のCSV貼付（ヘッダ1行＋データ）
     *  - `成果データ` ：本スクリプトの出力先
     *  - `会員リスト` ：memberId -> 氏名 のマスタ（任意）
     *  - `クリックログ`：A:C = (日時(JST), memberId, dealName) フォールバック用
     *
     * 設定（スクリプトプロパティに保存）:
     *  - CASHBACK_RATE (Number)          既定 0.20
     *  - ONLY_PAY_ON_APPROVED (Boolean)  既定 true
     *  - ROUNDING_MODE (String)          "FLOOR" | "ROUND" | "CEIL" （既定 "FLOOR"）
     *
     * 動作:
     *  - 「承認のみ支払い」時、未承認はキャッシュバック 0
     *  - 丸めは ROUNDING_MODE に従い reward * rate を処理
     *  - バッチ出力でタイムアウト回避
     *  - メニュー「成果処理」から実行、または `setupTrigger()` で 03:10 自動実行
     */
    
    const SHEET_RAW = '成果CSV_RAW';
    const SHEET_OUT = '成果データ';
    const SHEET_MEMBERS = '会員リスト';
    const SHEET_CLICKLOG = 'クリックログ';
    
    const APPROVED_VALUES = ['承認', '確定', '承認済', '確定済', 'approved', 'Approved', 'APPROVED'];
    const BATCH_SIZE = 300; // 数百～数千行を想定
    
    const HEADER_CANDIDATES = {
      memberId: ['id1', 'memberid', 'member_id', '会員id', '会員ＩＤ', '会員ｉｄ', '会員id（id1）', '会員', 'id', 'ID'],
      reward:   ['reward', '成果報酬', '報酬額', '報酬', 'commission', '金額', '確定報酬', '承認報酬'],
      status:   ['status', '承認状況', 'ステータス', '状態'],
      dealName: ['dealname', '案件名', '商品名', '広告名', 'offer', 'program', 'サービス名', '広告主名', 'キャンペーン名', 'プログラム名'],
    };
    
    const MEMBER_SHEET_HEADERS = {
      memberId: ['memberid', 'member_id', '会員id', '会員ＩＤ', 'id', 'ID'],
      name:     ['氏名', '名前', 'name', 'お名前', '会員名', 'ニックネーム', 'displayname', '表示名']
    };
    const CLICKLOG_HEADERS = {
      memberId: ['memberid', 'member_id', '会員id', 'id', 'ID'],
      dealName: ['dealname', '案件名', '商品名', '広告名', 'サービス名']
    };
    
    // =============== メニュー ===============
    function onOpen() {
      SpreadsheetApp.getUi()
        .createMenu('成果処理')
        .addItem('CSV取込→集計', 'runImportAndAggregate')
        .addSeparator()
        .addItem('設定...', 'openSettingsDialog')
        .addSeparator()
        .addItem('毎日 03:10 自動実行を設定', 'setupTrigger')
        .addToUi();
    }
    
    // =============== 設定関連（スクリプトプロパティ） ===============
    function getScriptProps_() { return PropertiesService.getScriptProperties(); }
    function getConfig_() {
      const p = getScriptProps_().getProperties();
      return {
        CASHBACK_RATE: Number(p.CASHBACK_RATE ?? 0.20),
        ONLY_PAY_ON_APPROVED: String(p.ONLY_PAY_ON_APPROVED ?? 'true') === 'true',
        ROUNDING_MODE: (p.ROUNDING_MODE || 'FLOOR').toUpperCase(), // FLOOR | ROUND | CEIL
      };
    }
    function saveConfig_(cfg) {
      const p = getScriptProps_();
      const toSave = {
        CASHBACK_RATE: String(cfg.CASHBACK_RATE ?? 0.20),
        ONLY_PAY_ON_APPROVED: String(Boolean(cfg.ONLY_PAY_ON_APPROVED)),
        ROUNDING_MODE: (cfg.ROUNDING_MODE || 'FLOOR').toUpperCase()
      };
      p.setProperties(toSave, true);
    }
    
    // 簡易 UI ダイアログ
    function openSettingsDialog() {
      const ui = SpreadsheetApp.getUi();
      const cfg = getConfig_();
      const html = HtmlService.createHtmlOutput(`
        <html>
          <body style="font-family:system-ui, -apple-system, Segoe UI, Roboto, 'ヒラギノ角ゴ ProN', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif; padding:16px;">
            <h3>成果処理 設定</h3>
            <label>還元率 (例: 0.2 = 20%)<br>
              <input id="rate" type="number" min="0" max="1" step="0.001" value="${cfg.CASHBACK_RATE}" style="width:120px"/>
            </label><br><br>
            <label>
              <input id="only" type="checkbox" ${cfg.ONLY_PAY_ON_APPROVED ? 'checked' : ''}/> 承認のみ支払いに含める
            </label><br><br>
            <label>丸め方式
              <select id="rounding">
                <option ${cfg.ROUNDING_MODE==='FLOOR'?'selected':''}>FLOOR</option>
                <option ${cfg.ROUNDING_MODE==='ROUND'?'selected':''}>ROUND</option>
                <option ${cfg.ROUNDING_MODE==='CEIL'?'selected':''}>CEIL</option>
              </select>
            </label>
            <br><br>
            <button onclick="google.script.run
                .withSuccessHandler(() => google.script.host.close())
                .saveSettings({
                  CASHBACK_RATE: Number(document.getElementById('rate').value),
                  ONLY_PAY_ON_APPROVED: document.getElementById('only').checked,
                  ROUNDING_MODE: document.getElementById('rounding').value
                })">保存</button>
            <button onclick="google.script.host.close()">閉じる</button>
          </body>
        </html>
      `).setWidth(420).setHeight(300);
      ui.showModalDialog(html, '成果処理 設定');
    }
    function saveSettings(cfg) { saveConfig_(cfg); }
    
    // =============== トリガー ===============
    /** 毎日深夜の自動実行（例：03:10）をセットアップ */
    function setupTrigger() {
      ScriptApp.getProjectTriggers()
        .filter(t => t.getHandlerFunction() === 'runImportAndAggregate')
        .forEach(t => ScriptApp.deleteTrigger(t));
    
      ScriptApp.newTrigger('runImportAndAggregate')
        .timeBased()
        .atHour(3)
        .nearMinute(10)
        .everyDays(1)
        .create();
    
      console.log('[trigger] setup completed');
    }
    
    // =============== メイン集計 ===============
    function runImportAndAggregate() {
      const cfg = getConfig_(); // ← パラメタ読み込み
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const raw = ss.getSheetByName(SHEET_RAW);
      if (!raw) throw new Error(`シート "${SHEET_RAW}" が見つかりません。`);
    
      const out = getOrCreateSheet_(ss, SHEET_OUT);
      const membersSheet = ss.getSheetByName(SHEET_MEMBERS);
      const clicklogSheet = ss.getSheetByName(SHEET_CLICKLOG);
    
      const memberMap = buildMemberMap_(membersSheet);                  // memberId -> 氏名
      const latestDealByMember = buildLatestDealNameMap_(clicklogSheet);// memberId -> 最新 dealName
    
      const rawValues = raw.getDataRange().getValues(); // [ [header...], [row...] ... ]
      if (rawValues.length <= 1) { writeHeader_(out); return; }
      const header = normalizeHeader_(rawValues[0]);
    
      const col = {
        memberId: findColIdx_(header, HEADER_CANDIDATES.memberId),
        reward:   findColIdx_(header, HEADER_CANDIDATES.reward),
        status:   findColIdx_(header, HEADER_CANDIDATES.status),   // 任意
        dealName: findColIdx_(header, HEADER_CANDIDATES.dealName), // 任意（無ければクリックログ補完）
      };
      if (col.memberId < 0 || col.reward < 0) {
        throw new Error('CSVの列特定に失敗（memberId / reward は必須）。ヘッダ候補配列を見直してください。');
      }
    
      out.clear();
      writeHeader_(out);
    
      const rows = rawValues.slice(1);
      const outputChunk = [];
      let total = 0, wrote = 0, skipped = 0, approvedCount = 0;
    
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        if (isRowEmpty_(r)) continue;
    
        const memberIdRaw = safeCell_(r[col.memberId]);
        const rewardRaw   = safeCell_(r[col.reward]);
        const statusRaw   = col.status >= 0 ? safeCell_(r[col.status]) : '';
        const csvDealRaw  = col.dealName >= 0 ? safeCell_(r[col.dealName]) : '';
    
        if (!memberIdRaw || !rewardRaw) { skipped++; continue; }
    
        const isApproved = isApprovedStatus_(statusRaw);
        const reward = parseMoney_(rewardRaw);
    
        // ゲスト判定（guest: で始まるIDはゲストとして扱う）
        const isGuest = /^guest:/i.test(memberIdRaw);
    
        const basePay = (cfg.ONLY_PAY_ON_APPROVED && !isApproved) ? 0 : reward;
        const rawCashback = basePay * cfg.CASHBACK_RATE;
        // ゲストの場合は還元額0、会員の場合は計算結果を適用
        const cashback = isGuest ? 0 : applyRounding_(rawCashback, cfg.ROUNDING_MODE);
    
        if (isApproved) approvedCount++;
    
        // ゲストの場合は「非会員」表記、会員の場合は会員リストから取得または memberIdRaw
        const displayName = isGuest
          ? '非会員'
          : (memberMap.get(memberIdRaw) || memberIdRaw);
        const dealName = csvDealRaw || latestDealByMember.get(memberIdRaw) || '不明';
    
        outputChunk.push([
          displayName,       // 氏名
          dealName,          // 案件名
          statusRaw || '',   // 承認状況
          cashback,          // キャッシュバック金額（整数円）
          memberIdRaw,       // 参考: memberId
          reward,            // 参考: 原始報酬額
          ''                 // 予備メモ
        ]);
        total++;
    
        if (outputChunk.length >= BATCH_SIZE) {
          appendToOutput_(out, outputChunk);
          wrote += outputChunk.length;
          outputChunk.length = 0;
          Utilities.sleep(50);
        }
      }
    
      if (outputChunk.length) {
        appendToOutput_(out, outputChunk);
        wrote += outputChunk.length;
      }
    
      console.log(JSON.stringify({
        total_rows_processed: total,
        written: wrote,
        skipped,
        approvedCount,
        cashback_rate: cfg.CASHBACK_RATE,
        only_pay_on_approved: cfg.ONLY_PAY_ON_APPROVED,
        rounding_mode: cfg.ROUNDING_MODE
      }));
    }
    
    // =============== Utils ===============
    function applyRounding_(n, mode) {
      const x = Number(n || 0);
      if (!Number.isFinite(x)) return 0;
      switch ((mode || 'FLOOR').toUpperCase()) {
        case 'CEIL':  return Math.ceil(x);
        case 'ROUND': return Math.round(x);
        case 'FLOOR':
        default:      return Math.floor(x);
      }
    }
    function getOrCreateSheet_(ss, name) {
      let sh = ss.getSheetByName(name);
      if (!sh) sh = ss.insertSheet(name);
      return sh;
    }
    function writeHeader_(out) {
      const header = ['氏名', '案件名', '承認状況', 'キャッシュバック金額', 'memberId(参考)', '原始報酬額(参考)', 'メモ'];
      out.getRange(1, 1, 1, header.length).setValues([header]);
    }
    function appendToOutput_(out, rows) {
      if (!rows.length) return;
      const startRow = out.getLastRow() + 1;
      out.getRange(startRow, 1, rows.length, rows[0].length).setValues(rows);
    }
    function isRowEmpty_(arr) { return arr.every(v => !safeCell_(v)); }
    function safeCell_(v) {
      if (v === null || v === undefined) return '';
      const s = (typeof v === 'string') ? v : String(v);
      return s.trim();
    }
    function normalizeHeader_(headerArr) {
      return headerArr.map(h => safeCell_(h).toLowerCase()
        .replace(/[＿－—–‐―ー]/g, '_')
        .replace(/\s+/g, '')
        .replace(/[（）\(\)]/g, '')
        .replace(/　/g, '')
      );
    }
    function findColIdx_(normalizedHeaderArr, candidates) {
      if (!Array.isArray(candidates)) return -1;
      const cands = candidates.map(c => c.toLowerCase()
        .replace(/[＿－—–‐―ー]/g, '_')
        .replace(/\s+/g, '')
        .replace(/[（）\(\)]/g, '')
      );
      for (let i = 0; i < normalizedHeaderArr.length; i++) {
        const h = normalizedHeaderArr[i];
        if (cands.includes(h)) return i;
      }
      for (let i = 0; i < normalizedHeaderArr.length; i++) {
        const h = normalizedHeaderArr[i];
        if (cands.some(c => h.includes(c))) return i;
      }
      return -1;
    }
    function parseMoney_(s) {
      if (typeof s !== 'string') s = String(s);
      const cleaned = s.replace(/[^\d.]/g, '');
      const n = Number(cleaned);
      return Number.isFinite(n) ? n : 0;
    }
    function isApprovedStatus_(status) {
      if (!status) return false;
      const s = status.toString().trim().toLowerCase();
      return APPROVED_VALUES.some(v => s === v.toLowerCase());
    }
    function buildMemberMap_(sheet) {
      const map = new Map();
      if (!sheet) return map;
      const vals = sheet.getDataRange().getValues();
      if (vals.length <= 1) return map;
      const header = normalizeHeader_(vals[0]);
    
      const colId = findColIdx_(header, MEMBER_SHEET_HEADERS.memberId);
      const colName = findColIdx_(header, MEMBER_SHEET_HEADERS.name);
      if (colId < 0) { return map; }
    
      for (let i = 1; i < vals.length; i++) {
        const row = vals[i];
        const id = safeCell_(row[colId]);
        if (!id) continue;
        const name = (colName >= 0) ? safeCell_(row[colName]) : '';
        if (name) map.set(id, name);
      }
      return map;
    }
    /** クリックログ: 同一 memberId の最終行を採用（A:C 既定。ヘッダ名ゆれも許容） */
    function buildLatestDealNameMap_(sheet) {
      const map = new Map();
      if (!sheet) return map;
      const vals = sheet.getDataRange().getValues();
      if (vals.length <= 1) return map;
    
      const header = normalizeHeader_(vals[0]);
      const colId = findColIdx_(header, CLICKLOG_HEADERS.memberId);
      const colDeal = findColIdx_(header, CLICKLOG_HEADERS.dealName);
    
      const idxId = colId >= 0 ? colId : 1;       // 既定: B列
      const idxDeal = colDeal >= 0 ? colDeal : 2; // 既定: C列
    
      for (let i = 1; i < vals.length; i++) {
        const row = vals[i];
        const id = safeCell_(row[idxId]);
        const deal = safeCell_(row[idxDeal]);
        if (!id || !deal) continue;
        map.set(id, deal); // 後勝ち＝最後が最新
      }
      return map;
    }
    
    ```
