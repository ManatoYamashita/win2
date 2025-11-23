// Google Sheets データ型定義

/**
 * 案件マスタ（Google Sheetsで管理）
 *
 * シート名: 案件マスタ
 * 列構成:
 * A: 整形済みアフィリエイトURL
 * B: 案件ID
 * C: 案件名
 * D: 会社名
 * E: ROW URL
 */
export interface Deal {
  dealId: string;                // 案件ID（一意、例: "a8-rakuten-card"）
  dealName: string;              // 案件名（例: "楽天カード"）
  affiliateUrl: string;          // 整形済みURL（?id1={trackingId}&id2={eventId}&eventId={eventId} 付与前）
  aspName?: string;              // ASP名（A8.net, AFB等）
  companyName?: string;          // 表示用
  rawAffiliateUrl?: string;      // ROW URL
}

/**
 * 会員情報（Google Sheetsで管理）
 *
 * シート名: 会員リスト
 * 列構成:
 * A: memberId (UUID)
 * B: 氏名
 * C: メールアドレス
 * D: パスワード (bcrypt hash)
 * E: 生年月日 (YYYY-MM-DD)
 * F: 郵便番号
 * G: 電話番号
 * H: 登録日時 (YYYY年MM月DD日 HH時MM分SS秒 JST)
 */
export interface Member {
  memberId: string;
  name: string;
  email: string;
  password: string;              // bcrypt hash
  birthDate: string;             // YYYY-MM-DD
  postalCode: string;
  phoneNumber: string;
  registeredAt: string;          // JSTフォーマット済み文字列
  emailVerified?: boolean;       // メール認証済みフラグ（オプション）
}

/**
 * クリックログ（Google Sheetsで管理）
 *
 * シート名: クリックログ
 * 列構成:
 * A: 日時 (YYYY年MM月DD日 HH時MM分SS秒 JST)
 * B: 会員ID (memberId or guest:UUID)
 * C: 案件名 (dealName)
 * D: 案件ID (dealId)
 * E: イベントID (eventId) - UUID v4
 */
export interface ClickLog {
  timestamp: string;             // JSTフォーマット済み文字列
  memberId: string;              // memberId or guest:UUID
  dealName: string;
  dealId: string;
  eventId: string;               // UUID v4 for unique click tracking
}

/**
 * 成果データ（GASで自動生成）
 *
 * シート名: 成果データ
 * 列構成:
 * A: 氏名
 * B: 案件名
 * C: 承認状況
 * D: 参考報酬額
 * E: memberId(参考)
 * F: イベントID(参考) - UUID v4
 * G: 原始報酬額(参考)
 * H: メモ
 */
export interface Result {
  name: string;
  dealName: string;
  status: string;                // 承認状況
  referenceReward: number;       // 参考報酬額
  memberId: string;              // 参考
  eventId: string;               // UUID v4 for tracking click-to-result linkage
  originalReward: number;        // 原始報酬額（参考）
  memo?: string;
}

/**
 * 成果CSV_RAW（ASPからの手動貼付）
 *
 * シート名: 成果CSV_RAW
 * 列構成:
 * A: id1 (trackingId = memberId or guest:UUID)
 * B: eventId (UUID v4)
 * C: dealName
 * D: reward
 * E: status
 */
export interface RawResult {
  id1: string;                   // trackingId (memberId or guest:UUID)
  eventId: string;               // UUID v4 from click tracking
  dealName: string;
  reward: number;
  status: string;
}
