/**
 * 年齢制限バッジコンポーネント
 *
 * 20歳以上限定のコンテンツに表示するバッジ
 */

import { Badge } from "@/components/ui/badge";
import { ShieldAlert } from "lucide-react";

/**
 * RestrictedBadge
 *
 * ブログカードや記事詳細ページで、
 * 年齢制限コンテンツであることを示すバッジを表示します。
 */
export default function RestrictedBadge() {
  return (
    <Badge
      variant="destructive"
      className="gap-1 font-semibold text-xs px-2 py-1"
    >
      <ShieldAlert className="h-3 w-3" />
      20歳以上限定
    </Badge>
  );
}
