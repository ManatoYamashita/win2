"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations/auth";
import { Lock, Loader2, AlertCircle } from "lucide-react";

/**
 * パスワードリセット実行ページ
 * /reset-password?token=xxx
 *
 * トークンを検証し、新しいパスワードを設定
 */
export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get("token");

    if (!tokenParam) {
      toast({
        variant: "destructive",
        title: "エラー",
        description: "無効なリンクです。トークンが見つかりません。",
      });
      return;
    }

    setToken(tokenParam);
    setValue("token", tokenParam);
  }, [searchParams, setValue, toast]);

  const onSubmit = async (data: ResetPasswordInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "成功",
          description: result.message,
        });

        // 2秒後にログインページへリダイレクト
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        toast({
          variant: "destructive",
          title: "エラー",
          description: result.error || "パスワードリセットに失敗しました",
        });
      }
    } catch (error) {
      console.error("Reset password error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "パスワードリセット中にエラーが発生しました",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-16 w-16 text-red-600" />
            </div>
            <CardTitle className="text-2xl">無効なリンク</CardTitle>
            <CardDescription>
              パスワードリセット用のトークンが見つかりません。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              パスワードリセットメールのリンクをクリックしてアクセスしてください。
            </p>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
              <Link href="/forgot-password">パスワードリセットを再リクエスト</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">ログインページへ戻る</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">新しいパスワードを設定</CardTitle>
          <CardDescription>
            新しいパスワードを入力してください（8文字以上）
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            {/* トークン（hidden） */}
            <input type="hidden" {...register("token")} />

            {/* 新しいパスワード */}
            <div className="space-y-2">
              <Label htmlFor="password">新しいパスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="8文字以上のパスワード"
                {...register("password")}
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* パスワード確認 */}
            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">パスワード確認</Label>
              <Input
                id="passwordConfirm"
                type="password"
                placeholder="パスワードを再入力"
                {...register("passwordConfirm")}
                disabled={isSubmitting}
              />
              {errors.passwordConfirm && (
                <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  リセット中...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  パスワードをリセット
                </>
              )}
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link href="/login">ログインページへ戻る</Link>
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
