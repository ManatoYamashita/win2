"use client";

import { useState, type KeyboardEvent } from "react";
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
import { cn } from "@/lib/utils";

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

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

  const passwordValue = form.watch("password");
  const steps: Array<{ id: 1 | 2 | 3; label: string; description: string }> = [
    { id: 1, label: "基本情報", description: "お名前を入力" },
    { id: 2, label: "ログイン情報", description: "メール・パスワード" },
    { id: 3, label: "追加情報", description: "任意項目" },
  ];

  const stepFieldMap: Record<1 | 2 | 3, Array<keyof RegisterInput>> = {
    1: ["name"],
    2: ["email", "password", "passwordConfirm"],
    3: ["birthday", "postalCode", "phone"],
  };

  const handleNextStep = async () => {
    const fields = stepFieldMap[currentStep];
    const isValid = await form.trigger(fields, { shouldFocus: true });
    if (!isValid) return;
    setCurrentStep((prev) => (prev === 3 ? prev : ((prev + 1) as 2 | 3)));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev === 1 ? prev : ((prev - 1) as 1 | 2)));
  };

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
        variant: "success",
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

  const handleEnterKey = async (event: KeyboardEvent<HTMLFormElement>) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    if (currentStep < 3) {
      await handleNextStep();
    } else {
      await form.handleSubmit(onSubmit)();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-win2-surface-cream-50 via-white to-win2-surface-cream-100 py-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 lg:flex-row lg:items-stretch lg:px-6">
        <Card className="w-full max-w-2xl border-0 shadow-[0_25px_60px_rgba(15,23,42,0.08)] lg:max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-slate-900">会員登録</CardTitle>
            <CardDescription className="text-slate-600">
              必須項目を入力し、暮らしを変える最新情報を受け取る準備を整えましょう。
            </CardDescription>
            <div className="mt-6 flex items-center gap-4">
              {steps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold",
                      currentStep === step.id
                        ? "bg-win2-primary-orage text-white shadow-md shadow-win2-primary-orage/40"
                        : "bg-win2-surface-cream-200 text-slate-500"
                    )}
                  >
                    {step.id}
                  </div>
                  <div className="hidden text-xs text-slate-500 md:block">
                    <p className="font-semibold text-slate-700">{step.label}</p>
                    <p>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
          <CardContent className="border-t border-win2-surface-cream-200 bg-win2-surface-cream-50">
            <Form {...form}>
              <form
                onSubmit={(event) => event.preventDefault()}
                onKeyDown={handleEnterKey}
                className="space-y-6"
              >
                {currentStep === 1 && (
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
                )}

                {currentStep === 2 && (
                  <>
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

                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>パスワード *</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="8文字以上" {...field} />
                          </FormControl>
                          <FormDescription>8文字以上で入力してください</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {passwordValue && (
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
                    )}
                  </>
                )}

                {currentStep === 3 && (
                  <>
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
                  </>
                )}

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between gap-3">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full rounded-full border-win2-surface-cream-300 text-slate-600 hover:bg-white"
                        onClick={handlePrevStep}
                        disabled={isLoading}
                      >
                        戻る
                      </Button>
                    )}
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        className={cn(
                          "w-full rounded-full bg-gradient-to-r from-win2-accent-rose via-win2-primary-orage to-win2-accent-amber text-base font-semibold text-white shadow-lg shadow-win2-accent-rose/30 transition hover:opacity-90",
                          currentStep === 1 ? "ml-auto" : ""
                        )}
                        onClick={handleNextStep}
                      >
                        次へ
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="h-12 w-full rounded-full bg-gradient-to-r from-win2-accent-rose via-win2-primary-orage to-win2-accent-amber text-base font-semibold text-white shadow-lg shadow-win2-accent-rose/30 transition hover:opacity-90"
                        disabled={isLoading}
                        onClick={() => form.handleSubmit(onSubmit)()}
                      >
                        {isLoading ? "登録中..." : "登録してスタートする"}
                      </Button>
                    )}
                  </div>
                  <p className="text-center text-xs text-slate-500">
                    ログイン情報をお持ちの方は{" "}
                    <Link
                      href="/login"
                      className="font-semibold text-win2-primary-orage hover:underline"
                    >
                      こちら
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
