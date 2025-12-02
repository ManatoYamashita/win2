import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  email: string;
  resetUrl: string;
}

/**
 * パスワードリセット用Reactメールテンプレート
 *
 * 使用例:
 * ```tsx
 * import { PasswordResetEmail } from '@/emails/password-reset-email';
 *
 * <PasswordResetEmail
 *   email="user@example.com"
 *   resetUrl="https://example.com/reset-password?token=xxx"
 * />
 * ```
 */
export function PasswordResetEmail({
  email,
  resetUrl,
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>WIN×Ⅱ パスワードリセットのリクエスト</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>パスワードのリセット</Heading>

          <Text style={text}>
            {email} 様
          </Text>

          <Text style={text}>
            パスワードリセットのリクエストを受け付けました。
          </Text>

          <Text style={text}>
            下記のボタンをクリックして、新しいパスワードを設定してください。
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={resetUrl}>
              パスワードをリセット
            </Button>
          </Section>

          <Text style={textWarning}>
            ⚠️ このリンクは1時間のみ有効です。期限切れの場合は、再度パスワードリセットをリクエストしてください。
          </Text>

          <Text style={textSmall}>
            ボタンが機能しない場合は、下記のURLをブラウザにコピー&ペーストしてください：
          </Text>

          <Text style={textLink}>{resetUrl}</Text>

          <Text style={textWarning}>
            ※このリクエストに心当たりがない場合は、アカウントのセキュリティが侵害されている可能性があります。
            このメールを無視し、直ちにパスワードを変更することをお勧めします。
          </Text>

          <Text style={footer}>
            WIN×Ⅱ - 会員制アフィリエイトブログプラットフォーム
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// メールスタイル定義
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#ea580c", // Orange-600
  fontSize: "32px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  textAlign: "center" as const,
};

const text = {
  color: "#374151", // Gray-700
  fontSize: "16px",
  lineHeight: "26px",
  margin: "16px 32px",
};

const textSmall = {
  color: "#6b7280", // Gray-500
  fontSize: "14px",
  lineHeight: "22px",
  margin: "16px 32px",
};

const textWarning = {
  color: "#dc2626", // Red-600
  fontSize: "14px",
  lineHeight: "22px",
  margin: "16px 32px",
  padding: "12px",
  backgroundColor: "#fef2f2", // Red-50
  borderLeft: "4px solid #dc2626",
  borderRadius: "4px",
};

const textLink = {
  color: "#ea580c", // Orange-600
  fontSize: "14px",
  lineHeight: "22px",
  margin: "8px 32px",
  wordBreak: "break-all" as const,
};

const buttonContainer = {
  margin: "32px auto",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#ea580c", // Orange-600
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 40px",
  margin: "0 auto",
};

const footer = {
  color: "#9ca3af", // Gray-400
  fontSize: "12px",
  lineHeight: "16px",
  margin: "32px 32px 0",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
  paddingTop: "16px",
};

export default PasswordResetEmail;
