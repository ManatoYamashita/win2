import { Resend } from "resend";
import { render } from "@react-email/components";
import { VerificationEmail } from "@/emails/verification-email";
import { PasswordResetEmail } from "@/emails/password-reset-email";

/**
 * Resend SDK初期化
 * API Keyは環境変数から取得
 * RESEND_VALID=true の場合のみ有効化
 */
const resendApiKey = process.env.RESEND_API_KEY;
const resendValid = process.env.RESEND_VALID === "true"; // デフォルト: false
export const isResendValid = resendValid && Boolean(resendApiKey);

const resend = isResendValid ? new Resend(resendApiKey) : null;

/**
 * 送信元メールアドレス
 * Resendで検証済みのドメインまたはメールアドレスを使用
 */
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "noreply@example.com";

/**
 * アプリケーションのベースURL
 */
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

/**
 * メール送信結果の型定義
 */
export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * メール認証用メールを送信
 * @param email 送信先メールアドレス
 * @param token 認証トークン
 * @returns 送信結果
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<EmailSendResult> {
  try {
    if (!isResendValid || !resend) {
      console.warn("Resend is disabled or not configured. Verification email will not be sent.");
      return {
        success: false,
        error: "メール送信機能は現在無効です",
      };
    }

    const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

    const emailHtml = await render(
      VerificationEmail({
        email,
        verificationUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from: `WIN×Ⅱ <${FROM_EMAIL}>`,
      to: email,
      subject: "【WIN×Ⅱ】メールアドレスの認証を完了してください",
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        error: error.message || "Failed to send verification email",
      };
    }

    console.log(`Verification email sent to ${email}, message ID: ${data?.id}`);

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Error sending verification email:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * パスワードリセット用メールを送信
 * @param email 送信先メールアドレス
 * @param token リセットトークン
 * @returns 送信結果
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<EmailSendResult> {
  try {
    if (!isResendValid || !resend) {
      console.warn("Resend is disabled or not configured. Password reset email will not be sent.");
      return {
        success: false,
        error: "メール送信機能は現在無効です",
      };
    }

    const resetUrl = `${APP_URL}/reset-password?token=${token}`;

    const emailHtml = await render(
      PasswordResetEmail({
        email,
        resetUrl,
      })
    );

    const { data, error } = await resend.emails.send({
      from: `WIN×Ⅱ <${FROM_EMAIL}>`,
      to: email,
      subject: "【WIN×Ⅱ】パスワードリセットのリクエスト",
      html: emailHtml,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        error: error.message || "Failed to send password reset email",
      };
    }

    console.log(`Password reset email sent to ${email}, message ID: ${data?.id}`);

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Error sending password reset email:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * パスワードリセット完了通知メールを送信（セキュリティ通知）
 * @param email 送信先メールアドレス
 * @returns 送信結果
 */
export async function sendPasswordResetNotification(
  email: string
): Promise<EmailSendResult> {
  try {
    if (!isResendValid || !resend) {
      console.warn("Resend is disabled or not configured. Password reset notification will not be sent.");
      return {
        success: false,
        error: "メール送信機能は現在無効です",
      };
    }

    const { data, error } = await resend.emails.send({
      from: `WIN×Ⅱ <${FROM_EMAIL}>`,
      to: email,
      subject: "【WIN×Ⅱ】パスワードが変更されました",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #ea580c; text-align: center;">パスワードが変更されました</h1>

          <p style="color: #374151; font-size: 16px;">
            ${email} 様
          </p>

          <p style="color: #374151; font-size: 16px;">
            アカウントのパスワードが変更されました。
          </p>

          <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 12px; margin: 20px 0;">
            <p style="color: #dc2626; font-size: 14px; margin: 0;">
              ⚠️ この変更に心当たりがない場合は、アカウントが不正アクセスされている可能性があります。
              直ちにサポートまでご連絡ください。
            </p>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            ※このメールは自動送信されています。返信はできません。
          </p>

          <p style="color: #9ca3af; font-size: 12px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 16px; margin-top: 32px;">
            WIN×Ⅱ - アフィリエイトブログプラットフォーム
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend API error:", error);
      return {
        success: false,
        error: error.message || "Failed to send password reset notification",
      };
    }

    console.log(`Password reset notification sent to ${email}, message ID: ${data?.id}`);

    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error) {
    console.error("Error sending password reset notification:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
