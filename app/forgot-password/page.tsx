"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations/auth";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

/**
 * パスワードリセット要求ページ
 * /forgot-password
 *
 * メールアドレスを入力してパスワードリセットメールを送信
 */
export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

        if (result.success) {
          setIsSuccess(true);
          toast({
            variant: "success",
            title: "成功",
            description: result.message,
          });
        } else {
        toast({
          variant: "destructive",
          title: "エラー",
          description: result.error || "パスワードリセット要求に失敗しました",
        });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "パスワードリセット要求中にエラーが発生しました",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
            <CardTitle className="text-2xl">メールを送信しました</CardTitle>
            <CardDescription>
              パスワードリセット用のリンクをメールで送信しました。
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              メールに記載されたリンクをクリックして、新しいパスワードを設定してください。
            </p>
            <p className="text-sm text-gray-600">
              リンクの有効期限は1時間です。期限切れの場合は、再度パスワードリセットをリクエストしてください。
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full bg-orange-600 hover:bg-orange-700">
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
          <CardTitle className="text-2xl">パスワードをお忘れですか？</CardTitle>
          <CardDescription>
            登録時のメールアドレスを入力してください。
            パスワードリセット用のリンクをお送りします。
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
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
                  送信中...
                </>
              ) : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  リセットメールを送信
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
