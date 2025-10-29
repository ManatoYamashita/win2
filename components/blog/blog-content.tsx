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
            この案件に申し込む
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
        この案件に申し込む
        <svg class="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
        </svg>
      `;

      alert("エラーが発生しました。もう一度お試しください。");
    }
  };

  const proseClasses = `prose prose-lg max-w-none mb-12
    prose-headings:text-gray-900
    prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-orange-200 prose-h2:pb-2
    prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3
    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
    prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline
    prose-strong:text-gray-900 prose-strong:font-semibold
    prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4
    prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4
    prose-li:text-gray-700 prose-li:mb-2
    prose-img:rounded-lg prose-img:shadow-md
    prose-blockquote:border-l-4 prose-blockquote:border-orange-400 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
    prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto`;

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
