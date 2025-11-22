"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn, formatJapaneseDateTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { AlertCircle, FileText, ArrowLeft } from "lucide-react";

interface HistoryItem {
  timestamp: string;
  dealName: string;
  dealId: string;
  eventId: string;
  status: string;
  statusLabel: string;
  cashbackAmount?: number;
  originalReward?: number;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
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
 * ステータスバッジコンポーネント
 */
function StatusBadge({ status, label }: { status: string; label: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        status === "approved" && "bg-green-100 text-green-800",
        status === "pending" && "bg-amber-100 text-amber-800",
        status === "cancelled" && "bg-red-100 text-red-800",
        status === "applied" && "bg-gray-100 text-gray-800"
      )}
    >
      {label}
    </span>
  );
}

/**
 * 申込履歴カードコンポーネント
 */
function HistoryCard({ item }: { item: HistoryItem }) {
  return (
    <Card className="border-0 shadow-[0_8px_30px_rgba(15,23,42,0.06)] transition hover:shadow-[0_12px_40px_rgba(15,23,42,0.1)]">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            {/* 案件名 */}
            <h3 className="text-base font-semibold text-win2-neutral-950">
              {item.dealName}
            </h3>

            {/* 申込日時 */}
            <p className="text-sm text-win2-neutral-600">
              申込日時:{" "}
              {item.timestamp.includes("年")
                ? item.timestamp
                : formatJapaneseDateTime(item.timestamp)}
            </p>

            {/* ステータス */}
            <div className="flex items-center gap-2">
              <StatusBadge status={item.status} label={item.statusLabel} />
            </div>

            {/* キャッシュバック金額（成果確定の場合のみ） */}
            {item.status === "approved" && item.cashbackAmount !== undefined && (
              <div className="rounded-lg bg-gradient-to-r from-win2-accent-rose/10 to-win2-primary-orage/10 p-4">
                <p className="text-xs text-win2-neutral-600">キャッシュバック金額</p>
                <p className="mt-1 text-2xl font-bold text-win2-primary-orage">
                  ¥{item.cashbackAmount.toLocaleString()}
                </p>
              </div>
            )}

            {/* 報酬額（参考） */}
            {item.originalReward !== undefined && item.originalReward > 0 && (
              <p className="text-xs text-win2-neutral-600">
                報酬額（参考）: ¥{item.originalReward.toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 申込履歴ページ
 */
export default function HistoryPage() {
  const { status } = useSession();
  const { toast } = useToast();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history");

        if (!response.ok) {
          throw new Error("申込履歴の取得に失敗しました");
        }

        const data = await response.json();
        setHistory(data);
      } catch (error) {
        console.error("Fetch history error:", error);
        toast({
          variant: "destructive",
          title: "エラー",
          description: "申込履歴の取得に失敗しました",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchHistory();
    }
  }, [status, toast]);

  // ローディング状態
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-win2-surface-cream-50 via-white to-win2-surface-cream-100 px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <Card className="border-0 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
            <CardContent className="p-12 text-center text-muted-foreground">
              読み込み中です...
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-win2-surface-cream-50 via-white to-win2-surface-cream-100 px-4 py-8">
      <motion.div
        className="mx-auto flex w-full max-w-5xl flex-col gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* ヘッダー */}
        <motion.div
          variants={fadeUpVariants}
          className="rounded-3xl bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage p-8 text-white shadow-[0_30px_70px_rgba(242,111,54,0.35)]"
        >
          <div className="flex items-center gap-3">
            <Link
              href="/mypage"
              className="rounded-full p-2 transition hover:bg-white/20"
              aria-label="マイページに戻る"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
                APPLICATION HISTORY
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-4xl">申込履歴</h1>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/80 md:text-base">
            これまでに申し込んだ案件の一覧です。ステータスとキャッシュバック金額を確認できます。
          </p>
        </motion.div>

        {/* 空状態 */}
        {history.length === 0 ? (
          <motion.div variants={fadeUpVariants}>
            <Card className="border-0 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
              <CardContent className="p-12 text-center">
                <FileText className="mx-auto h-16 w-16 text-win2-neutral-600" />
                <h2 className="mt-6 text-xl font-semibold text-win2-neutral-950">
                  まだ申込がありません
                </h2>
                <p className="mt-2 text-sm text-win2-neutral-600">
                  ブログから気になる案件を探して、お得なキャッシュバックを受け取りましょう。
                </p>
                <div className="mt-6">
                  <Link
                    href="/blog"
                    className={cn(
                      buttonVariants({ size: "lg" }),
                      "rounded-full bg-gradient-to-r from-win2-accent-rose to-win2-primary-orage text-white shadow-md shadow-win2-accent-rose/25 hover:opacity-90"
                    )}
                  >
                    ブログで案件を探す
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <>
            {/* ステータス説明 */}
            <motion.div variants={fadeUpVariants}>
              <Card className="border-0 bg-blue-50 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="space-y-2 text-sm text-blue-900">
                      <p className="font-semibold">ステータスについて</p>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status="applied" label="申込済み" />
                        <span className="text-xs text-blue-700">
                          案件に申し込みました。成果が発生するまでお待ちください。
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status="pending" label="未確定" />
                        <span className="text-xs text-blue-700">
                          成果が発生しました。承認されるとキャッシュバックが確定します。
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status="approved" label="成果確定" />
                        <span className="text-xs text-blue-700">
                          キャッシュバックが確定しました。おめでとうございます！
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status="cancelled" label="否認" />
                        <span className="text-xs text-blue-700">
                          成果が否認されました。条件を満たしていない可能性があります。
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* 申込履歴リスト */}
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <h2 className="text-lg font-semibold text-win2-neutral-950">
                全 {history.length} 件の申込
              </h2>
              <div className="space-y-4">
                {history.map((item, index) => (
                  <motion.div
                    key={`${item.eventId}-${index}`}
                    variants={fadeUpVariants}
                  >
                    <HistoryCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
