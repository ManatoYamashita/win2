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

interface VerificationEmailProps {
  email: string;
  verificationUrl: string;
}

/**
 * メール認証用Reactメールテンプレート
 *
 * 使用例:
 * ```tsx
 * import { VerificationEmail } from '@/emails/verification-email';
 *
 * <VerificationEmail
 *   email="user@example.com"
 *   verificationUrl="https://example.com/verify-email?token=xxx"
 * />
 * ```
 */
export function VerificationEmail({
  email,
  verificationUrl,
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>WIN×Ⅱ メールアドレスの認証を完了してください</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>メールアドレスの認証</Heading>

          <Text style={text}>
            {email} 様
          </Text>

          <Text style={text}>
            WIN×Ⅱへのご登録ありがとうございます。
          </Text>

          <Text style={text}>
            アカウントの登録を完了するには、下記のボタンをクリックしてメールアドレスの認証を完了してください。
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={verificationUrl}>
              メールアドレスを認証する
            </Button>
          </Section>

          <Text style={text}>
            このリンクは24時間有効です。期限切れの場合は、マイページから再送信をリクエストしてください。
          </Text>

          <Text style={textSmall}>
            ボタンが機能しない場合は、下記のURLをブラウザにコピー&ペーストしてください：
          </Text>

          <Text style={textLink}>{verificationUrl}</Text>

          <Text style={textSmall}>
            ※このメールに心当たりがない場合は、このメールを無視してください。
          </Text>

          <Text style={footer}>
            WIN×Ⅱ - アフィリエイトブログプラットフォーム
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

export default VerificationEmail;
