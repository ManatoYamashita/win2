"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface BlogContentProps {
  content: string;
}

/**
 * ブログコンテンツ表示コンポーネント
 *
 * [CTA:dealId] ショートコードを検出してCTAボタンに変換
 *
 * ショートコード例: [CTA:a8-rakuten-card]
 * 変換後: クリック可能なCTAボタン
 *
 * フロー:
 * 1. microCMSから取得したコンテンツを受け取る（HTMLまたはMarkdown）
 * 2. contentがMarkdownの場合はHTMLに変換
 * 3. ショートコードパターン /\[CTA:([\w-]+)\]/g を検出
 * 4. ショートコードをCTAボタンHTMLに変換
 * 5. 変換後のHTMLをstateに保存してレンダリング
 * 6. ボタンクリック時に /api/track-click を呼び出し
 * 7. 返却されたtrackingUrlへリダイレクト
 */
export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [processedContent, setProcessedContent] = useState<string>(content);
  const [isMarkdown, setIsMarkdown] = useState<boolean>(false);

  // contentがMarkdownかHTMLかを判定
  useEffect(() => {
    // 簡易的な判定: HTMLタグが含まれていればHTML、そうでなければMarkdown
    const hasHtmlTags = /<[^>]+>/.test(content);
    const hasMarkdownSyntax = /^#+\s|^\*\s|\[.+\]\(.+\)|```/.test(content);

    if (!hasHtmlTags && hasMarkdownSyntax) {
      console.log("[BlogContent] Content detected as Markdown");
      setIsMarkdown(true);
    } else {
      console.log("[BlogContent] Content detected as HTML");
      setIsMarkdown(false);
    }
  }, [content]);

  // contentが変更されたら、ショートコードを変換
  useEffect(() => {
    const shortcodePattern = /\[CTA:([\w-]+)\]/g;
    const matches = [...content.matchAll(shortcodePattern)];

    if (matches.length === 0) {
      setProcessedContent(content);
      return;
    }

    console.log(`[BlogContent] Found ${matches.length} CTA shortcodes:`, matches.map(m => m[1]));

    // ショートコードをボタンHTMLに置換
    let newHtml = content;
    matches.forEach((match) => {
      const dealId = match[1];
      const buttonHtml = `
        <div class="cta-button-wrapper my-8 text-center">
          <button
            class="cta-button bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            data-deal-id="${dealId}"
          >
            このサービスに進む
            <svg class="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
        </div>
      `;
      newHtml = newHtml.replace(match[0], buttonHtml);
    });

    setProcessedContent(newHtml);
  }, [content]);

  // ボタンにクリックイベントを設定（DOMマウント後）
  useEffect(() => {
    if (!contentRef.current) return;

    const buttons = contentRef.current.querySelectorAll<HTMLButtonElement>(".cta-button");

    if (buttons.length > 0) {
      console.log(`[BlogContent] Attaching click handlers to ${buttons.length} buttons`);
    }

    buttons.forEach((button) => {
      button.addEventListener("click", handleCTAClick);
    });

    // クリーンアップ関数
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", handleCTAClick);
      });
    };
  }, [processedContent]);

  /**
   * CTAボタンクリックハンドラー
   */
  const handleCTAClick = async (event: MouseEvent) => {
    const button = event.currentTarget as HTMLButtonElement;
    const dealId = button.dataset.dealId;

    if (!dealId) {
      console.error("Deal ID not found");
      return;
    }

    // ボタンを無効化してローディング状態に
    button.disabled = true;
    button.innerHTML = `
      処理中...
      <svg class="inline-block ml-2 w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    `;

    try {
      // /api/track-click を呼び出し
      const response = await fetch("/api/track-click", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dealId }),
      });

      if (!response.ok) {
        throw new Error("Failed to track click");
      }

      const data = await response.json();

      if (!data.trackingUrl) {
        throw new Error("Tracking URL not found");
      }

      // trackingUrlへリダイレクト
      window.location.href = data.trackingUrl;
    } catch (error) {
      console.error("CTA click error:", error);

      // エラー時はボタンを元に戻す
      button.disabled = false;
      button.innerHTML = `
        このサービスに進む
        <svg class="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      `;

      alert("エラーが発生しました。もう一度お試しください。");
    }
  };

  // Prose classes with @tailwindcss/typography plugin
  // Customized for orange brand theme and optimal readability
  const proseClasses = `
    prose prose-lg max-w-none mb-12
    prose-headings:text-gray-900 prose-headings:font-bold
    prose-h1:text-4xl prose-h1:mt-0 prose-h1:mb-6
    prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b-2 prose-h2:border-orange-200 prose-h2:pb-3
    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
    prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-2
    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6
    prose-a:text-orange-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline hover:prose-a:text-orange-700 prose-a:transition-colors
    prose-strong:text-gray-900 prose-strong:font-bold
    prose-em:text-gray-800 prose-em:italic
    prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
    prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
    prose-li:text-gray-700 prose-li:my-2 prose-li:leading-relaxed
    prose-img:rounded-xl prose-img:shadow-lg prose-img:my-8
    prose-figure:my-8
    prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:text-gray-600 prose-figcaption:mt-2
    prose-blockquote:border-l-4 prose-blockquote:border-orange-500 prose-blockquote:pl-6 prose-blockquote:my-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-orange-50 prose-blockquote:py-4 prose-blockquote:rounded-r-lg
    prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-[''] prose-code:after:content-['']
    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:my-6 prose-pre:shadow-lg
    prose-pre:code:bg-transparent prose-pre:code:text-gray-100 prose-pre:code:p-0
    prose-table:my-6 prose-table:border-collapse
    prose-thead:border-b-2 prose-thead:border-gray-300
    prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
    prose-td:px-4 prose-td:py-3 prose-td:border-b prose-td:border-gray-200
    prose-hr:my-8 prose-hr:border-gray-300
  `.trim();

  // Markdownの場合はReactMarkdownでレンダリング
  if (isMarkdown) {
    return (
      <div ref={contentRef} className={proseClasses}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
        >
          {processedContent}
        </ReactMarkdown>
      </div>
    );
  }

  // HTMLの場合はdangerouslySetInnerHTMLでレンダリング
  return (
    <div
      ref={contentRef}
      className={proseClasses}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}
