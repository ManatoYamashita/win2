"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { registerSchema, RegisterInput } from "@/lib/validations/auth";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
      birthday: "",
      postalCode: "",
      phone: "",
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);

    try {
      // 会員登録API呼び出し
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast({
          variant: "destructive",
          title: "登録エラー",
          description: result.error || "会員登録に失敗しました",
        });
        setIsLoading(false);
        return;
      }

      // 登録成功 → 自動ログイン
      toast({
        title: "登録完了",
        description: "会員登録が完了しました。ログインしています...",
      });

      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (signInResult?.error) {
        toast({
          variant: "destructive",
          title: "ログインエラー",
          description: "自動ログインに失敗しました。ログインページから再度お試しください。",
        });
        router.push("/login");
        return;
      }

      // マイページにリダイレクト
      router.push("/mypage");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "予期しないエラーが発生しました",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-12 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>会員登録</CardTitle>
          <CardDescription>
            WIN×Ⅱの会員登録を行います。必須項目を入力してください。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 氏名 */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>氏名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="山田 太郎" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* メールアドレス */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>メールアドレス *</FormLabel>
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

              {/* パスワード */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="8文字以上" {...field} />
                    </FormControl>
                    <FormDescription>
                      8文字以上で入力してください
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* パスワード確認 */}
              <FormField
                control={form.control}
                name="passwordConfirm"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>パスワード（確認） *</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="確認用" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 生年月日 */}
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>生年月日（任意）</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 郵便番号 */}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号（任意）</FormLabel>
                    <FormControl>
                      <Input placeholder="000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* 電話番号 */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号（任意）</FormLabel>
                    <FormControl>
                      <Input placeholder="090-0000-0000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "登録中..." : "登録する"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            既にアカウントをお持ちの方は{" "}
            <Link href="/login" className="text-primary hover:underline">
              ログイン
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
