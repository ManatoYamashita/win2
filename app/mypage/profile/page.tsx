"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Calendar, Save, X } from "lucide-react";

import { updateProfileSchema, type UpdateProfileInput } from "@/lib/validations/profile";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MemberData {
  memberId: string;
  name: string;
  email: string;
  birthday?: string;
  postalCode?: string;
  phone?: string;
  registeredAt: string;
  emailVerified: boolean;
}

/**
 * プロフィール編集ページ（/mypage/profile）
 *
 * 生年月日の登録・編集が可能
 * 将来的に他フィールド（郵便番号、電話番号など）の編集にも対応可能
 */
export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [currentBirthday, setCurrentBirthday] = useState<string | null>(null);

  const form = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      birthday: "",
      postalCode: "",
      phone: "",
    },
  });

  // 初回データ取得
  useEffect(() => {
    async function fetchMemberData() {
      try {
        const res = await fetch("/api/members/me");

        if (!res.ok) {
          throw new Error("Failed to fetch member data");
        }

        const data: MemberData = await res.json();
        setCurrentBirthday(data.birthday || null);

        // フォームに既存値をセット
        if (data.birthday) {
          form.setValue("birthday", data.birthday);
        }
        if (data.postalCode) {
          form.setValue("postalCode", data.postalCode);
        }
        if (data.phone) {
          form.setValue("phone", data.phone);
        }
      } catch (error) {
        console.error("Fetch member data error:", error);
        toast({
          variant: "destructive",
          title: "データ取得エラー",
          description: "会員情報の取得に失敗しました。",
        });
      } finally {
        setIsFetching(false);
      }
    }

    fetchMemberData();
  }, [form, toast]);

  // 送信処理
  async function onSubmit(data: UpdateProfileInput) {
    setIsLoading(true);

    try {
      const res = await fetch("/api/members/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Update failed");
      }

      const updatedData: MemberData = await res.json();
      setCurrentBirthday(updatedData.birthday || null);

      toast({
        title: "保存完了",
        description: "生年月日を更新しました。",
      });

      // 少し遅延してからマイページに戻る
      setTimeout(() => {
        router.push("/mypage");
      }, 1500);
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        variant: "destructive",
        title: "保存エラー",
        description: error instanceof Error ? error.message : "更新に失敗しました。",
      });
    } finally {
      setIsLoading(false);
    }
  }

  // キャンセル処理
  function handleCancel() {
    router.push("/mypage");
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-win2-surface-cream-50 via-white to-win2-surface-cream-100 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto px-4"
      >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            プロフィール編集
          </CardTitle>
          {currentBirthday && (
            <p className="text-sm text-gray-600 mt-2">
              現在の生年月日: {currentBirthday}
            </p>
          )}
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="birthday"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>生年月日 *</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      ※ 年齢制限コンテンツの閲覧に必要です
                    </p>
                  </FormItem>
                )}
              />

              {/* Postal Code Field */}
              <FormField
                control={form.control}
                name="postalCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>郵便番号（任意）</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="123-4567"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      ※ 7桁の数字または000-0000形式で入力してください
                    </p>
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>電話番号（任意）</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="090-1234-5678"
                        {...field}
                        disabled={isLoading}
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                    <p className="text-xs text-gray-500 mt-1">
                      ※ 10〜11桁の数字または000-0000-0000形式で入力してください
                    </p>
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 rounded-full bg-gradient-to-r from-win2-accent-rose via-win2-primary-orage to-win2-accent-amber hover:opacity-90 text-white shadow-lg shadow-win2-accent-rose/30"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      保存
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 rounded-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  キャンセル
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      </motion.div>
    </div>
  );
}
