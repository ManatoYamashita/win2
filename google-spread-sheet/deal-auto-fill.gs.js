/**
 * 案件マスタ - 自動入力補助スクリプト
 * -------------------------------------------------------------------
 * 機能:
 *  - アフィリエイトURL (A列) が編集されたときに自動実行
 *  - 案件名: URLからページタイトルを自動取得（取得失敗時は「不明なタイトル」）
 *  - ASP名: URLから自動判定（A8.net, AFB, もしも, バリューコマース）
 *  - 報酬額, 有効/無効: デフォルト値を自動入力
 *
 * 列構成:
 *  A: アフィリエイトURL (編集検知対象)
 *  B: 案件ID
 *  C: 案件名
 *  D: ASP名
 *  E: 報酬額
 *  F: （未使用）
 *  G: 有効/無効
 */

function onEdit(e) {
  const sheet = e.source.getActiveSheet();

  // 「案件マスタ」シートのみで動作
  if (sheet.getName() !== '案件マスタ') return;

  const row = e.range.getRow();
  if (row === 1) return; // ヘッダー行は無視

  const editedColumn = e.range.getColumn();

  // A列（アフィリエイトURL）が編集されたら、自動処理を実行
  if (editedColumn === 1) {
    const affiliateUrl = sheet.getRange(row, 1).getValue();

    if (affiliateUrl) {
      // 1. 案件名を自動取得（URLからページタイトルを取得）
      const dealName = fetchPageTitle(affiliateUrl);
      const finalDealName = dealName || '不明なタイトル';

      // C列（案件名）が空の場合のみ自動入力
      if (!sheet.getRange(row, 3).getValue()) {
        sheet.getRange(row, 3).setValue(finalDealName);
      }

      // 2. ASP名を自動判定
      const aspName = detectASP(affiliateUrl);

      // D列（ASP名）が空の場合のみ自動入力
      if (aspName && !sheet.getRange(row, 4).getValue()) {
        sheet.getRange(row, 4).setValue(aspName);
      }
    }
  }

  // デフォルト値の自動入力
  autoFillDefaults(sheet, row);
}

/**
 * URLからページタイトルを取得
 */
function fetchPageTitle(url) {
  try {
    // URLにアクセスしてHTMLを取得
    const response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      followRedirects: true,
    });

    if (response.getResponseCode() !== 200) {
      console.log('Failed to fetch URL: ' + url);
      return '';
    }

    const html = response.getContentText();

    // <title>タグからタイトルを抽出
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      let title = titleMatch[1].trim();

      // 不要な文字列を除去（例: " | サービス名", " - サイト名"）
      title = title.replace(/[\|｜\-—–]\s*.+$/, '').trim();

      // HTMLエンティティをデコード
      title = decodeHTMLEntities(title);

      return title;
    }

    return '';
  } catch (error) {
    console.log('Error fetching title: ' + error.message);
    return '';
  }
}

/**
 * HTMLエンティティをデコード
 */
function decodeHTMLEntities(text) {
  const entities = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  return text.replace(/&[a-z]+;|&#\d+;/gi, function(match) {
    return entities[match] || match;
  });
}

/**
 * URLからASP名を自動判定
 */
function detectASP(url) {
  if (!url) return '';
  if (url.includes('a8.net')) return 'A8.net';
  if (url.includes('afi-b.com') || url.includes('afb.com')) return 'AFB';
  if (url.includes('moshimo.com')) return 'もしも';
  if (url.includes('valuecommerce.com')) return 'バリューコマース';
  return '';
}

/**
 * デフォルト値を自動入力
 */
function autoFillDefaults(sheet, row) {
  // E列（rewardAmount）が空ならデフォルト値 0
  if (!sheet.getRange(row, 5).getValue()) {
    sheet.getRange(row, 5).setValue(0);
  }

  // F列は未使用のため自動入力なし

  // G列（isActive）が空ならTRUE
  if (!sheet.getRange(row, 7).getValue()) {
    sheet.getRange(row, 7).setValue('TRUE');
  }
}
