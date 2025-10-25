"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

/**
 * メール認証ページ
 * /verify-email?token=xxx
 *
 * ユーザーが認証メールのリンクをクリックした際に表示される
 * トークンを検証してメール認証を完了する
 */
export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [alreadyVerified, setAlreadyVerified] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");

    // トークンがない場合
    if (!token) {
      setStatus("error");
      setMessage("無効なリンクです。認証トークンが見つかりません。");
      return;
    }

    // メール認証APIを呼び出し
    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/verify-email?token=${encodeURIComponent(token)}`, {
          method: "GET",
        });

        const data = await response.json();

        if (data.success) {
          setStatus("success");
          setMessage(data.message || "メールアドレスの認証が完了しました");
          setAlreadyVerified(data.alreadyVerified || false);
        } else {
          setStatus("error");
          setMessage(data.error || "メール認証に失敗しました");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        setStatus("error");
        setMessage("メール認証中にエラーが発生しました。しばらくしてから再度お試しください。");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && <Loader2 className="h-16 w-16 text-orange-600 animate-spin" />}
            {status === "success" && <CheckCircle2 className="h-16 w-16 text-green-600" />}
            {status === "error" && <XCircle className="h-16 w-16 text-red-600" />}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "認証処理中..."}
            {status === "success" && "認証完了"}
            {status === "error" && "認証失敗"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          {status === "success" && !alreadyVerified && (
            <p className="text-sm text-gray-600">
              これでWIN×Ⅱの全機能をご利用いただけます。ログインして案件申込を開始しましょう。
            </p>
          )}

          {status === "success" && alreadyVerified && (
            <p className="text-sm text-gray-600">
              既に認証済みのアカウントです。ログインしてご利用ください。
            </p>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                認証リンクの有効期限が切れているか、無効なトークンです。
              </p>
              <p className="text-sm text-gray-600">
                ログイン後、マイページから認証メールを再送信してください。
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {status === "success" && (
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <Link href="/login">ログインする</Link>
            </Button>
          )}

          {status === "error" && (
            <>
              <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
                <Link href="/login">ログインする</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/register">新規登録する</Link>
              </Button>
            </>
          )}

          {status === "loading" && (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              処理中...
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
