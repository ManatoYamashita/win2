import { appendValues } from '@velo/google-sheets-integration-backend';
import { getSecret } from 'wix-secrets-backend';
import { members } from 'wix-members-backend';

// 会員作成時に1行追記
export async function wixMembers_onMemberCreated(event) {
  const sheetId = await getSecret('G_SHEETS_ID');

  const memberId = event.entityId;
  const m = await members.getMember(memberId);

  const row = [
    new Date().toISOString(),
    memberId,
    m?.profile?.nickname || '',
    m?.loginEmail || ''
  ];

  // ★ appendValues は引数3つのみ
  await appendValues(sheetId, '会員リスト!A:D', [row]);
}
