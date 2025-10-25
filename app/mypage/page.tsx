"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { MemberRow } from "@/lib/sheets";

/**
 * マイページ - 登録情報表示
 *
 * セッションからmemberIdを取得し、/api/members/meから会員情報を取得して表示
 */
export default function MypagePage() {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const [member, setMember] = useState<Omit<MemberRow, "passwordHash"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
      <Card>
        <CardContent className="p-12">
          <p className="text-center text-muted-foreground">読み込み中...</p>
        </CardContent>
      </Card>
    );
  }

  if (!member) {
    return (
      <Card>
        <CardContent className="p-12">
          <p className="text-center text-destructive">
            会員情報が見つかりません
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>登録情報</CardTitle>
        <CardDescription>
          現在登録されている会員情報を表示しています
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 会員ID */}
        <div className="space-y-2">
          <Label>会員ID</Label>
          <p className="text-sm font-mono bg-muted p-3 rounded-md">
            {member.memberId}
          </p>
        </div>

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
            {new Date(member.registeredAt).toLocaleString("ja-JP")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
