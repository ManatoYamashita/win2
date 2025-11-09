"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { loginSchema, LoginInput } from "@/lib/validations/auth";

function LoginPageContent() {
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/mypage";

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast({
          variant: "destructive",
          title: "ログインエラー",
          description: "メールアドレスまたはパスワードが正しくありません",
        });
        setIsLoading(false);
        return;
      }

      toast({
        variant: "success",
        title: "ログイン成功",
        description: "マイページにリダイレクトしています...",
      });

      // Cookie設定完了を待機してからリダイレクト（本番環境でのタイミング問題対応）
      await new Promise(resolve => setTimeout(resolve, 300));
      window.location.href = callbackUrl;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "予期しないエラーが発生しました",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-win2-surface-stone-50 via-white to-win2-surface-cream-100 py-16">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 lg:flex-row lg:px-6">
        <Card className="w-full max-w-xl border-0 shadow-[0_25px_60px_rgba(15,23,42,0.08)] lg:max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">ログイン</CardTitle>
            <CardDescription className="text-slate-600">
              メールアドレスとパスワードを入力してマイページにアクセスします。
            </CardDescription>
          </CardHeader>
          <CardContent className="border-t border-win2-surface-cream-200 bg-win2-surface-cream-50">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>パスワード</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-sm text-orange-600 hover:underline"
                      >
                        パスワードをお忘れですか？
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="パスワード" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-win2-accent-rose via-win2-primary-orage to-win2-accent-amber text-base font-semibold text-white shadow-lg shadow-win2-accent-rose/30 transition hover:opacity-90"
                disabled={isLoading}
              >
                {isLoading ? "ログイン中..." : "ログイン"}
              </Button>
            </form>
          </Form>
        </CardContent>
          <div className="px-6 pb-6 text-center text-sm text-slate-500">
            アカウントをお持ちでない方は{" "}
            <Link href="/register" className="font-semibold text-win2-primary-orage hover:underline">
              会員登録
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="text-muted-foreground">読み込み中...</span>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
