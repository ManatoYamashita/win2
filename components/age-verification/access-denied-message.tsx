/**
 * アクセス拒否メッセージコンポーネント
 *
 * 年齢制限コンテンツへのアクセスが拒否された際に表示するメッセージと
 * 適切なアクション（ログイン、生年月日登録など）を提供します。
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import type { AccessDeniedError } from "@/lib/validations/age-verification";
import { AlertCircle } from "lucide-react";

interface AccessDeniedMessageProps {
  error: AccessDeniedError;
}

/**
 * アクセス拒否メッセージコンポーネント
 *
 * 3つの状態に応じたメッセージとアクションボタンを表示：
 * - not_authenticated: ログインが必要
 * - birthday_unknown: 生年月日の登録が必要
 * - minor: 20歳未満のためアクセス不可
 */
export default function AccessDeniedMessage({
  error,
}: AccessDeniedMessageProps) {
  const getActionButton = () => {
    switch (error.requiresAction) {
      case "login":
        return (
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/login">ログインする</Link>
          </Button>
        );

      case "update_birthday":
        return (
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/mypage/profile">生年月日を登録する</Link>
          </Button>
        );

      case "wait_until_adult":
        return (
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/blog">一般コンテンツを見る</Link>
          </Button>
        );
    }
  };

  const getDescription = () => {
    switch (error.reason) {
      case "not_authenticated":
        return "このコンテンツを閲覧するには、会員登録またはログインが必要です。";
      case "birthday_unknown":
        return "年齢確認のため、マイページで生年月日を登録してください。";
      case "minor":
        return "このコンテンツは法律により20歳以上の方のみご覧いただけます。";
      default:
        return "このコンテンツへのアクセスは制限されています。";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] px-4">
      <Card className="max-w-md w-full shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-2xl">アクセス制限</CardTitle>
          <CardDescription className="text-base">
            {getDescription()}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-700">{error.message}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {getActionButton()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
