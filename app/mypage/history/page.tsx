"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn, formatJapaneseDateTime } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, FileText, ArrowLeft, Search, X, ChevronDown } from "lucide-react";

interface HistoryItem {
  timestamp: string;
  dealName: string;
  dealId: string;
  eventId: string;
  status: string | null;
  statusLabel: string | null;
  cashbackAmount?: number;
  originalReward?: number;
}

/**
 * ソートキー型定義
 */
type SortKey = "timestamp" | "cashbackAmount";

/**
 * ソート順序型定義
 */
type SortOrder = "desc" | "asc";

/**
 * ソートオプション型定義
 */
interface SortOption {
  value: string;
  label: string;
  sortKey: SortKey;
  sortOrder: SortOrder;
}

/**
 * ソートオプション一覧
 */
const SORT_OPTIONS: SortOption[] = [
  { value: "timestamp-desc", label: "新しい順", sortKey: "timestamp", sortOrder: "desc" },
  { value: "timestamp-asc", label: "古い順", sortKey: "timestamp", sortOrder: "asc" },
];

/**
 * ステータスフィルタ型定義
 */
interface StatusFilterOption {
  value: string;
  label: string;
}

/**
 * ステータスフィルタオプション一覧
 */
const STATUS_FILTER_OPTIONS: StatusFilterOption[] = [
  { value: "pending", label: "未確定" },
  { value: "approved", label: "確定" },
  { value: "cancelled", label: "否認" },
  { value: "none", label: "ステータスなし" },
];

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

            {/* イベントID */}
            <p className="text-xs text-win2-neutral-400">
              イベントID: {item.eventId}
            </p>

            {/* ステータス */}
            {item.status && item.statusLabel && (
              <div className="flex items-center gap-2">
                <StatusBadge status={item.status} label={item.statusLabel} />
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

  // ソート/フィルタ状態管理
  const [sortValue, setSortValue] = useState<string>("timestamp-desc");
  const [statusFilter, setStatusFilter] = useState<Set<string>>(
    () => new Set(["pending", "approved", "cancelled"])
  );
  const [searchQuery, setSearchQuery] = useState<string>("");

  // 開閉状態管理
  const [isStatusInfoOpen, setIsStatusInfoOpen] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(true);

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

  // フィルタリング処理（useMemoでメモ化）
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // 案件名検索フィルタ
      if (searchQuery && !item.dealName.includes(searchQuery)) {
        return false;
      }

      // ステータスフィルタ
      if (statusFilter.size > 0) {
        // ステータスがnullの場合は"none"として扱う
        const itemStatus = item.status || "none";
        if (!statusFilter.has(itemStatus)) {
          return false;
        }
      }

      return true;
    });
  }, [history, searchQuery, statusFilter]);

  // ソート処理（useMemoでメモ化）
  const sortedAndFilteredHistory = useMemo(() => {
    const sorted = [...filteredHistory];
    const selectedSort = SORT_OPTIONS.find(opt => opt.value === sortValue);

    if (!selectedSort) {
      return sorted;
    }

    sorted.sort((a, b) => {
      if (selectedSort.sortKey === "timestamp") {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return selectedSort.sortOrder === "desc" ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });

    return sorted;
  }, [filteredHistory, sortValue]);

  // フィルタクリア関数
  const handleClearFilters = () => {
    setSortValue("timestamp-desc");
    setStatusFilter(new Set());
    setSearchQuery("");
  };

  // ステータスフィルタトグル関数
  const handleStatusFilterToggle = (value: string) => {
    setStatusFilter((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };

  // ローディング状態
  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen">
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
    <div className="min-h-screen">
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
            これまでに申し込んだ案件の一覧です。
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
                  ブログから気になる案件を探して、サービスを申し込みましょう。
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
              <Card className="border-0 bg-win2-neutral-50 shadow-sm">
                <CardContent className="p-4">
                  {/* クリック可能なヘッダー */}
                  <button
                    onClick={() => setIsStatusInfoOpen(!isStatusInfoOpen)}
                    className="flex w-full items-start gap-3 text-left transition hover:opacity-80"
                    aria-expanded={isStatusInfoOpen}
                    aria-label="ステータス説明を開閉"
                  >
                    <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-win2-neutral-600" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-win2-neutral-900">
                        申し込みしたサービスの状態
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "mt-0.5 h-5 w-5 flex-shrink-0 text-win2-neutral-600 transition-transform duration-200",
                        isStatusInfoOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* コラプシブルコンテンツ */}
                  <AnimatePresence initial={false}>
                    {isStatusInfoOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="ml-8 mt-3 space-y-2 text-sm text-win2-neutral-900">
                          <div className="flex flex-wrap gap-2">
                            <StatusBadge status="pending" label="未確定" />
                            <span className="text-xs text-win2-neutral-600">
                              サービスの申し込みを確認中です。
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <StatusBadge status="approved" label="確定" />
                            <span className="text-xs text-win2-neutral-600">
                              サービスの申し込みが完了しました。
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <StatusBadge status="cancelled" label="否認" />
                            <span className="text-xs text-win2-neutral-600">
                              なし
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* ソート・フィルタUI */}
            <motion.div variants={fadeUpVariants}>
              <Card className="border-0 bg-gradient-to-br from-white to-win2-neutral-50 shadow-sm">
                <CardContent className="p-6">
                  {/* クリック可能なヘッダー */}
                  <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex w-full items-center justify-between text-left transition hover:opacity-80"
                    aria-expanded={isFilterOpen}
                    aria-label="並べ替え・検索・絞り込みを開閉"
                  >
                    <h2 className="text-base font-semibold text-win2-neutral-900">
                      並べ替え・検索・絞り込み
                    </h2>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 flex-shrink-0 text-win2-neutral-600 transition-transform duration-200",
                        isFilterOpen && "rotate-180"
                      )}
                    />
                  </button>

                  {/* コラプシブルコンテンツ */}
                  <AnimatePresence initial={false}>
                    {isFilterOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 space-y-4">
                          {/* ソート・検索 行 */}
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            {/* ソートセレクト */}
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-win2-neutral-700">
                                並べ替え:
                              </span>
                              <Select value={sortValue} onValueChange={setSortValue}>
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {SORT_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                      {option.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {/* 検索 */}
                            <div className="relative flex-1 sm:max-w-xs">
                              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-win2-neutral-400" />
                              <Input
                                type="text"
                                placeholder="案件名で検索..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 pr-9"
                              />
                              {searchQuery && (
                                <button
                                  onClick={() => setSearchQuery("")}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 text-win2-neutral-400 hover:text-win2-neutral-600"
                                  aria-label="検索をクリア"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* ステータスフィルタ行 */}
                          <div className="space-y-2">
                            <span className="text-sm font-medium text-win2-neutral-700">
                              ステータス絞り込み:
                            </span>
                            <div className="flex flex-wrap gap-3">
                              {STATUS_FILTER_OPTIONS.map((option) => (
                                <label
                                  key={option.value}
                                  className="flex cursor-pointer items-center gap-2 rounded-md border border-win2-neutral-200 bg-white px-3 py-2 text-sm transition hover:border-win2-primary-orage hover:bg-win2-primary-orage/5"
                                >
                                  <Checkbox
                                    checked={statusFilter.has(option.value)}
                                    onCheckedChange={() => handleStatusFilterToggle(option.value)}
                                  />
                                  <span className="text-win2-neutral-700">{option.label}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          {/* フィルタクリアボタン */}
                          {(sortValue !== "timestamp-desc" || statusFilter.size > 0 || searchQuery) && (
                            <div className="flex justify-end">
                              <button
                                onClick={handleClearFilters}
                                className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium text-win2-neutral-600 transition hover:bg-win2-neutral-100 hover:text-win2-neutral-900"
                              >
                                <X className="h-4 w-4" />
                                フィルタをクリア
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* 申込履歴リスト */}
            <motion.div variants={fadeUpVariants} className="space-y-4">
              <h2 className="text-lg font-semibold text-win2-neutral-950">
                全 {sortedAndFilteredHistory.length} 件の申込
                {sortedAndFilteredHistory.length !== history.length && (
                  <span className="ml-2 text-sm font-normal text-win2-neutral-500">
                    （{history.length}件中）
                  </span>
                )}
              </h2>
              <div className="space-y-4">
                {sortedAndFilteredHistory.map((item, index) => (
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
