import { z } from "zod";

/**
 * クリック追跡リクエストのバリデーションスキーマ
 *
 * POST /api/track-click
 *
 * リクエストボディ:
 * {
 *   dealId: string  // microCMSの案件ID
 * }
 */
export const trackClickSchema = z.object({
  dealId: z.string().min(1, "案件IDは必須です"),
});

export type TrackClickRequest = z.infer<typeof trackClickSchema>;
