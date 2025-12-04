/**
 * WIN×Ⅱ A8.net成果マッチング処理（2025/11/15 v4.0.0）
 * -------------------------------------------------------------------
 * シート:
 *  - `成果CSV_RAW`：A8.net Parameter Tracking Report CSV貼付（ヘッダ1行＋データ）
 *  - `クリックログ`：成果情報を記録する対象シート
 *
 * 処理内容:
 *  - 成果CSV_RAWから id1（会員ID） + id2（イベントID）、案件名、ステータスを取得
 *  - クリックログの該当行（B列=id1, E列=id2）を検索
 *  - 該当行のF列に「申し込み案件名」、G列に「ステータス」を記録
 *
 * 実行方法:
 *  - 手動実行: メニュー「成果処理」→「成果をクリックログに記録」
 *
 * A8.net Parameter Tracking Report 対応:
 *  - HEADER_CANDIDATES: パラメータ(id1)、パラメータ(id2)、プログラム名、ステータス名
 */

const SHEET_RAW = '成果CSV_RAW';
const SHEET_CLICKLOG = 'クリックログ';

const HEADER_CANDIDATES = {
  memberId: [
    // === 既存A8.net用（変更なし） ===
    'パラメータ(id1)', 'パラメータid1', 'パラメータ（id1）', 'パラメータ（ID1）', 'パラメータID1',
    'id1', 'memberid', 'member_id', '会員id', '会員ＩＤ', '会員ｉｄ',

    // === Rentracks用を追加 ===
    'uix', '備考', 'remarks', 'note', 'memo'
  ],

  eventId: [
    // === 既存A8.net用（変更なし） ===
    'パラメータ(id2)', 'パラメータid2', 'パラメータ（id2）', 'パラメータ（ID2）', 'パラメータID2',
    'id2', 'eventid', 'event_id', 'イベントid', 'イベントＩＤ',

    // === Rentracks用を追加 ===
    'uix', '備考', 'remarks', 'note', 'memo'
  ],

  dealName: [
    // === 既存（変更なし） ===
    'プログラム名', '案件名', '商品名', '広告名', 'program', 'dealname', 'offer', 'サービス名', '広告主名',

    // === Rentracks用を追加 ===
    'プロダクト', 'product'
  ],

  status: [
    // === 既存（変更なし） ===
    'ステータス名', '承認状況', 'ステータス', '状態', 'status',

    // === Rentracks用を追加 ===
    '状況', 'situation', 'approval_status'
  ]
};

// =============== メニュー ===============
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('成果処理')
    .addItem('成果をクリックログに記録', 'recordConversionsToClickLog')
    .addToUi();
}

// =============== メイン処理 ===============
/**
 * 成果CSV_RAWをクリックログにマッチングして記録する
 *
 * 処理フロー:
 * 1. 成果CSV_RAWからデータ読み込み
 * 2. id1, id2, 案件名, ステータスを抽出
 * 3. クリックログから該当行を検索（B列=id1, E列=id2）
 * 4. 該当行のF列・G列を更新
 */
function recordConversionsToClickLog() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const rawSheet = ss.getSheetByName(SHEET_RAW);
  const clickLogSheet = ss.getSheetByName(SHEET_CLICKLOG);

  // シート存在チェック
  if (!rawSheet) {
    SpreadsheetApp.getUi().alert(`エラー: シート「${SHEET_RAW}」が見つかりません`);
    throw new Error(`シート「${SHEET_RAW}」が見つかりません`);
  }
  if (!clickLogSheet) {
    SpreadsheetApp.getUi().alert(`エラー: シート「${SHEET_CLICKLOG}」が見つかりません`);
    throw new Error(`シート「${SHEET_CLICKLOG}」が見つかりません`);
  }

  // 成果CSV_RAW読み込み
  const rawValues = rawSheet.getDataRange().getValues();
  if (rawValues.length <= 1) {
    SpreadsheetApp.getUi().alert('警告: 成果CSV_RAWにデータがありません');
    console.log('[warn] 成果CSV_RAWにデータがありません');
    return;
  }

  const header = normalizeHeader_(rawValues[0]);
  const col = {
    memberId: findColIdx_(header, HEADER_CANDIDATES.memberId),
    eventId: findColIdx_(header, HEADER_CANDIDATES.eventId),
    dealName: findColIdx_(header, HEADER_CANDIDATES.dealName),
    status: findColIdx_(header, HEADER_CANDIDATES.status)
  };

  // 必須カラムチェック
  if (col.memberId < 0) {
    SpreadsheetApp.getUi().alert('エラー: id1（会員ID）カラムが見つかりません\n\nヘッダー候補: パラメータ(id1), id1, memberid');
    throw new Error('id1カラムが見つかりません');
  }
  if (col.eventId < 0) {
    SpreadsheetApp.getUi().alert('エラー: id2（イベントID）カラムが見つかりません\n\nヘッダー候補: パラメータ(id2), id2, eventid');
    throw new Error('id2カラムが見つかりません');
  }

  console.log('[info] カラム検出:', col);

  // クリックログ読み込み
  const clickLogValues = clickLogSheet.getDataRange().getValues();
  if (clickLogValues.length <= 1) {
    SpreadsheetApp.getUi().alert('警告: クリックログにデータがありません');
    console.log('[warn] クリックログにデータがありません');
    return;
  }

  let matched = 0, notMatched = 0;
  const notMatchedList = [];

  // 成果CSV_RAWの各行について処理
  for (let i = 1; i < rawValues.length; i++) {
    const row = rawValues[i];
    if (isRowEmpty_(row)) continue;

    // === 既存処理: id1, id2, 案件名, ステータス抽出 ===
    let memberId = safeCell_(row[col.memberId]);
    let eventId = safeCell_(row[col.eventId]);
    const dealName = col.dealName >= 0 ? safeCell_(row[col.dealName]) : '';
    const status = col.status >= 0 ? safeCell_(row[col.status]) : '';

    // ===== ここから新規追加: uix パラメータ分割処理（Rentracks対応） =====
    // uix形式の場合（memberId-eventId）を分割
    // 例: "b91765a2-f57d-4c82-bd07-9e0436f560da-event-uuid-123" → 分割
    if (memberId.includes('-') && (!eventId || eventId === '')) {
      const parts = memberId.split('-');

      // UUID形式は5パーツ（xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx）
      // 最初の5パーツをmemberId、残りをeventIdとする
      if (parts.length > 5) {
        memberId = parts.slice(0, 5).join('-');  // 最初の5パーツをUUID v4として結合
        eventId = parts.slice(5).join('-');      // 残りをeventIdとして結合

        console.log(`[info] uix分割成功: memberId=${memberId}, eventId=${eventId}`);
      } else {
        // パーツが5個以下の場合は分割失敗（不正なフォーマット）
        console.log(`[warn] uix分割失敗（パーツ不足）: ${memberId}`);
      }
    }
    // ===== 新規追加ここまで =====

    // === 既存処理: 空チェック（以下変更なし） ===
    if (!memberId || !eventId) {
      console.log(`[warn] 行${i+1}: id1またはid2が空です`);
      continue;
    }

    // クリックログから該当行を検索（B列=memberId, E列=eventId）
    let matchedRowIndex = -1;
    for (let j = 1; j < clickLogValues.length; j++) {
      const clickRow = clickLogValues[j];
      const clickMemberId = safeCell_(clickRow[1]); // B列（0-indexed なので1）
      const clickEventId = safeCell_(clickRow[4]);  // E列（0-indexed なので4）

      if (clickMemberId === memberId && clickEventId === eventId) {
        matchedRowIndex = j;
        break;
      }
    }

    if (matchedRowIndex >= 0) {
      // F列（案件名）、G列（ステータス）を更新
      clickLogSheet.getRange(matchedRowIndex + 1, 6).setValue(dealName);  // F列（1-indexed）
      clickLogSheet.getRange(matchedRowIndex + 1, 7).setValue(status);    // G列（1-indexed）
      matched++;
      console.log(`[info] マッチング成功: id1=${memberId}, id2=${eventId} → 案件名=${dealName}, ステータス=${status}`);
    } else {
      console.log(`[warn] マッチング失敗: id1=${memberId}, id2=${eventId} に一致するクリックログが見つかりませんでした`);
      notMatchedList.push(`id1=${memberId}, id2=${eventId}`);
      notMatched++;
    }
  }

  // 処理完了メッセージ
  const summaryMessage = `成果マッチング処理完了\n\n成功: ${matched}件\n失敗: ${notMatched}件`;
  console.log(`[info] 処理完了: マッチング成功=${matched}, マッチング失敗=${notMatched}`);

  if (notMatched > 0 && notMatched <= 10) {
    // 失敗が10件以下なら詳細表示
    SpreadsheetApp.getUi().alert(summaryMessage + '\n\n【失敗した成果】\n' + notMatchedList.join('\n'));
  } else if (notMatched > 10) {
    // 失敗が多い場合は件数のみ
    SpreadsheetApp.getUi().alert(summaryMessage + '\n\n失敗詳細はログを確認してください');
  } else {
    // 全件成功
    SpreadsheetApp.getUi().alert(summaryMessage);
  }
}

// =============== Utils ===============
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

  // 完全一致検索
  for (let i = 0; i < normalizedHeaderArr.length; i++) {
    const h = normalizedHeaderArr[i];
    if (cands.includes(h)) return i;
  }

  // 部分一致検索
  for (let i = 0; i < normalizedHeaderArr.length; i++) {
    const h = normalizedHeaderArr[i];
    if (cands.some(c => h.includes(c))) return i;
  }

  return -1;
}

function safeCell_(v) {
  if (v === null || v === undefined) return '';
  const s = (typeof v === 'string') ? v : String(v);
  return s.trim();
}

function isRowEmpty_(arr) {
  return arr.every(v => !safeCell_(v));
}
