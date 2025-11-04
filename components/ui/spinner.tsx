"use client";

import { cn } from "@/lib/utils";

type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
};

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-6 w-6 border-2",
  md: "h-10 w-10 border-[3px]",
  lg: "h-14 w-14 border-4",
};

export function Spinner({ size = "md", label = "読み込み中…", className }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-3" role="status" aria-live="polite">
      <span
        className={cn(
          "inline-block animate-spin rounded-full border-current border-t-transparent text-win2-primary-orage",
          sizeMap[size],
          className
        )}
      />
      {label ? (
        <span className="text-sm font-medium text-slate-600" aria-hidden="false">
          {label}
        </span>
      ) : null}
    </div>
  );
}
