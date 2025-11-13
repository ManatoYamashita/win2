import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        // WIN×II ブランドカラーパレット (カラーガイドライン準拠)
        win2: {
          // Primary & Accent Colors
          'primary-orage': '#c84812',      // ブランド基調色（コントラスト配慮）
          'accent-rose': '#c53a52',        // グラデーション左端（高コントラスト）
          'accent-rose-dark': '#b33249',   // ホバー時の濃色
          'accent-amber': '#bd5607',       // グラデーション右端（高彩度アンバー）
          'accent-gold': '#f5a623',        // キャッチコピー強調
          'accent-sun': '#fff44f',         // ハイライト
          // Surface / Background Colors
          'surface-cream-50': '#fffaf4',   // セクション背景（標準）
          'surface-cream-100': '#fef4ea',  // イントロ背景
          'surface-cream-150': '#ffeade',  // カード背景バリエーション
          'surface-cream-200': '#ffe1cc',  // ピル状バッジ背景
          'surface-cream-300': '#fff7f0',  // CTA背景
          'surface-cream-320': '#fff7f2',  // メリットカード背景
          'surface-rose-100': '#fff0f3',   // ピンク系薄背景
          'surface-stone-100': '#f5f1ed',  // フッター手前境界
          'surface-sky-50': '#f0f6fb',     // FAQ背景
          // Neutral Colors
          'neutral-950': '#1c1c1c',        // 見出し・本文ダーク
          'neutral-900': '#374151',        // 標準本文
          'neutral-600': '#6b7280',        // サブテキスト
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],
} satisfies Config;
