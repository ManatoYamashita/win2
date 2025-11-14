"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackDealClick } from "@/lib/gtm";

interface DealCTAButtonProps {
  dealId: string;
  dealName: string;
  ctaText?: string;
  className?: string;
}

/**
 * 案件申込CTAボタンコンポーネント
 * クリック時に /api/track-click を呼び出し、トラッキングURLにリダイレクト
 */
export function DealCTAButton({
  dealId,
  dealName,
  ctaText = "このサービスに進む",
  className,
}: DealCTAButtonProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dealId,
          dealName,
        }),
      });

      const data = await response.json();

      if (data.trackingUrl) {
        // デバッグ用: 生成されたトラッキングURLをコンソールに出力
        console.log('[DEBUG] Generated tracking URL:', data.trackingUrl);

        // GTM イベント送信
        trackDealClick({
          dealId: data.dealId,
          dealName: data.dealName,
          aspName: data.aspName,
          trackingId: data.trackingId,
          eventId: data.eventId,
          isMember: data.isMember,
          timestamp: data.timestamp,
        });

        // 別タブでアフィリエイトページを開く
        window.open(data.trackingUrl, '_blank');

        // 成功フィードバック
        toast({
          title: "アフィリエイトページを開きました",
          description: "新しいタブで案件ページが開きます",
        });

        setIsLoading(false);
      } else {
        toast({
          variant: "destructive",
          title: "エラー",
          description: data.error || "案件への申込に失敗しました",
        });
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Track click error:", error);
      toast({
        variant: "destructive",
        title: "エラー",
        description: "予期しないエラーが発生しました",
      });
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className={className}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          処理中...
        </>
      ) : (
        <>
          {ctaText}
          <ExternalLink className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
