// ページコード（案件一覧ページ）
import { currentMember } from 'wix-members-frontend';
import wixLocation from 'wix-location';
import { logClick, buildClickUrl } from 'backend/gSheetsLogger';

$w.onReady(async () => {
  const m = await currentMember.getMember();
  if (!m) {
    wixLocation.to('/_members/login');
    return;
  }
  const memberId = m._id;

  $w('#dealsRepeater').onItemReady(($item, item) => {
    const baseLink = item.baseLink || '';
    const dealName = item.title || item.title_fld || 'タイトル不明の案件';
    const url = buildClickUrl(baseLink, memberId);

    const $btn = $item('#applyButton');
    $btn.onClick(async () => {
      if (!url) return;        // baseLink 未設定の案件は遷移しない
      if ($btn.enabled === false) return; // 二重押下防止
      $btn.disable();
      try {
        console.log('[click]', { memberId, dealName, itemId: item?._id, url });
        await logClick({ memberId, dealName }); // 失敗しても finally で遷移
      } catch (e) {
        console.error('logClick failed:', e?.message || e);
      } finally {
        wixLocation.to(url);
      }
    });
  });
});
