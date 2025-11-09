import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * ISO8601形式の日付文字列を日本語フォーマットに変換
 *
 * @param dateString ISO8601形式の日付文字列
 * @returns "YYYY年MM月DD日" 形式の日付文字列
 *
 * @example
 * formatDate("2024-01-15T12:00:00.000Z") // => "2024年1月15日"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}年${month}月${day}日`;
}

/**
 * 日本時間の日時を「YYYY年MM月DD日 HH時MM分SS秒」形式に整形
 *
 * @param input DateインスタンスまたはISO8601文字列
 */
export function formatJapaneseDateTime(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const formatter = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const getPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  const year = getPart("year");
  const month = getPart("month");
  const day = getPart("day");
  const hour = getPart("hour");
  const minute = getPart("minute");
  const second = getPart("second");

  return `${year}年${month}月${day}日 ${hour}時${minute}分${second}秒`;
}
