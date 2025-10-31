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
