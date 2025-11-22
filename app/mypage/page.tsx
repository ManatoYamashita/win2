"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MemberRow } from "@/lib/sheets";
import { AlertCircle, Mail, Loader2 } from "lucide-react";
import { cn, formatJapaneseDateTime } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.05,
    },
  },
};

const fadeUpVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * マイページ - 登録情報表示
 *
 * セッションからmemberIdを取得し、/api/members/meから会員情報を取得して表示
 */
export default function MypagePage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [member, setMember] = useState<Omit<MemberRow, "passwordHash"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isResending, setIsResending] = useState(false);

  // Phase 2: メール認証再送信ハンドラー
  const handleResendVerification = async () => {
    setIsResending(true);
    try {
      const response = await fetch("/api/resend-verification", {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast({
          variant: "success",
          title: "成功",
          description: data.message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "エラー",
          description: data.error,
        });
      }
    } catch (error) {
      console.error("Resend verification error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "メール再送信中にエラーが発生しました",
      });
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetch("/api/members/me");

        if (!response.ok) {
          throw new Error("会員情報の取得に失敗しました");
        }

        const data = await response.json();
        setMember(data);
      } catch (error) {
        console.error("Fetch member info error:", error);
        toast({
          variant: "destructive",
          title: "エラー",
          description: "会員情報の取得に失敗しました",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchMemberInfo();
    }
  }, [status, toast]);

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen px-4 py-16">
        <Card className="mx-auto max-w-md border-0 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <CardContent className="p-12 text-center text-muted-foreground">
            読み込み中です...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-win2-surface-cream-50 via-white to-win2-surface-cream-100 px-4">
        <Card className="mx-auto max-w-md border-0 shadow-[0_20px_50px_rgba(244,63,94,0.15)]">
          <CardContent className="p-12 text-center text-destructive">
            会員情報が見つかりませんでした
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          variants={fadeUpVariants}
          className="rounded-3xl bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage p-8 text-white shadow-[0_30px_70px_rgba(242,111,54,0.35)]"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
            WIN×Ⅱ MEMBER DASHBOARD
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            こんにちは、{member.name} さん
          </h1>
          <p className="mt-3 text-sm text-white/80 md:text-base">
            登録情報の確認とメール認証のステータスはいつでもこちらでチェックできます。最新のキャンペーンはブログにて公開中です。
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/mypage/history"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-white px-8 text-win2-primary-orage shadow-lg shadow-white/30 hover:bg-white/90"
              )}
            >
              申込履歴を見る
            </Link>
            <Link
              href="/blog"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full border-2 border-white bg-transparent px-8 text-white shadow-lg hover:bg-white/10"
              )}
            >
              ブログで最新情報を見る
            </Link>
          </div>
        </motion.div>
        <motion.div variants={fadeUpVariants}>
          <Card className="border-0 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
          <CardHeader>
            <CardTitle>登録情報</CardTitle>
            <CardDescription>現在登録されている会員情報を表示しています</CardDescription>
          </CardHeader>

          {/* Phase 2: メール未認証の警告バナー */}
          {member.emailVerified === false && (
            <div className="mx-6 mb-4 rounded-md border-l-4 border-yellow-500 bg-yellow-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium text-yellow-800">
                    メールアドレスが未認証です
                  </p>
                  <p className="text-sm text-yellow-700">
                    登録時に送信した認証メールのリンクをクリックして、メールアドレスの認証を完了してください。
                  </p>
                  <Button
                    onClick={handleResendVerification}
                    disabled={isResending}
                    size="sm"
                    variant="outline"
                    className="mt-2"
                  >
                    {isResending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        送信中...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 h-4 w-4" />
                        認証メールを再送信
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <CardContent className="space-y-6">
        {/* 会員ID */}
        {/* <div className="space-y-2">
          <Label>会員ID</Label>
          <p className="text-sm font-mono bg-muted p-3 rounded-md">
            {member.memberId}
          </p>
        </div> */}

        {/* 氏名 */}
        <div className="space-y-2">
          <Label>氏名</Label>
          <p className="text-sm p-3 border rounded-md">{member.name}</p>
        </div>

        {/* メールアドレス */}
        <div className="space-y-2">
          <Label>メールアドレス</Label>
          <p className="text-sm p-3 border rounded-md">{member.email}</p>
        </div>

        {/* 生年月日 */}
        {member.birthday && (
          <div className="space-y-2">
            <Label>生年月日</Label>
            <p className="text-sm p-3 border rounded-md">{member.birthday}</p>
          </div>
        )}

        {/* 郵便番号 */}
        {member.postalCode && (
          <div className="space-y-2">
            <Label>郵便番号</Label>
            <p className="text-sm p-3 border rounded-md">{member.postalCode}</p>
          </div>
        )}

        {/* 電話番号 */}
        {member.phone && (
          <div className="space-y-2">
            <Label>電話番号</Label>
            <p className="text-sm p-3 border rounded-md">{member.phone}</p>
          </div>
        )}

        {/* 登録日時 */}
        <div className="space-y-2">
          <Label>登録日時</Label>
          <p className="text-sm p-3 border rounded-md">
            {member.registeredAt.includes("年")
              ? member.registeredAt
              : formatJapaneseDateTime(member.registeredAt)}
          </p>
        </div>
          </CardContent>
        </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
