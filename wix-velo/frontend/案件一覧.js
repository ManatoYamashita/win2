// ページコード（案件一覧）  ※全文差替え
import { currentMember } from 'wix-members-frontend';
import wixLocation from 'wix-location';
import { local as storage } from 'wix-storage'; // ゲスト用IDを保存
import { logClick } from 'backend/gSheetsLogger';

// UUID簡易生成（衝突十分低い）
function uuid() {
  // 16進ランダム 32桁
  const s = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;
}

/** ゲストIDを取得/作成（1年保持） */
function getOrCreateGuestId() {
  const KEY = 'win2.guestId';
  let gid = storage.getItem(KEY);
  if (!gid) {
    gid = `guest:${uuid()}`;
    storage.setItem(KEY, gid); // localStorage 相当（永続）
  }
  return gid;
}

$w.onReady(async () => {
  // 会員なら memberId、未ログインなら guestId を使う
  let idForTracking = '';
  try {
    const m = await currentMember.getMember();
    idForTracking = m?._id || '';
  } catch (e) {
    idForTracking = '';
  }
  if (!idForTracking) {
    idForTracking = getOrCreateGuestId(); // 例: "guest:xxxxxxxx-...."
  }

  $w('#dealsRepeater').onItemReady(($item, item) => {
    const base = item.baseLink || '';
    const dealName = item.title || item.title_fld || 'タイトル不明の案件';

    const url = base
      ? (base.includes('?') ? `${base}&id1=${encodeURIComponent(idForTracking)}` 
                            : `${base}?id1=${encodeURIComponent(idForTracking)}`)
      : '';

    $item('#applyButton').onClick(async () => {
      if (!url) return;
      try {
        console.log('[click]', { idForTracking, dealName, itemData: item });
        await logClick({ memberId: idForTracking, dealName });
      } catch (e) {
        console.error('logClick failed:', e?.message || e);
      } finally {
        wixLocation.to(url);
      }
    });
  });
});
