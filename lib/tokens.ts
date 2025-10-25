import jwt from "jsonwebtoken";

/**
 * JWT Secret（環境変数から取得）
 * 設定されていない場合はエラー
 */
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET environment variable is not set");
}

const JWT_SECRET: string = jwtSecret;

/**
 * JWTトークンのpayload型定義
 */
export interface TokenPayload {
  email: string;
  type: "email-verification" | "password-reset";
  iat?: number; // Issued At
  exp?: number; // Expiration Time
}

/**
 * トークン検証結果の型定義
 */
export interface TokenVerificationResult {
  valid: boolean;
  payload?: TokenPayload;
  error?: string;
}

/**
 * メール認証用JWTトークンを生成
 * @param email メールアドレス
 * @returns JWTトークン（有効期限24時間）
 */
export function generateVerificationToken(email: string): string {
  const payload: TokenPayload = {
    email,
    type: "email-verification",
  };

  // 24時間有効なトークンを生成
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "24h",
  });
}

/**
 * パスワードリセット用JWTトークンを生成
 * @param email メールアドレス
 * @returns JWTトークン（有効期限1時間）
 */
export function generatePasswordResetToken(email: string): string {
  const payload: TokenPayload = {
    email,
    type: "password-reset",
  };

  // 1時間有効なトークンを生成
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

/**
 * JWTトークンを検証し、payloadを取得
 * @param token JWTトークン
 * @returns 検証結果（valid, payload, error）
 */
export function verifyToken(token: string): TokenVerificationResult {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // payloadの型チェック
    if (!decoded.email || !decoded.type) {
      return {
        valid: false,
        error: "Invalid token payload",
      };
    }

    return {
      valid: true,
      payload: decoded,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        valid: false,
        error: "Token has expired",
      };
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return {
        valid: false,
        error: "Invalid token signature",
      };
    }

    return {
      valid: false,
      error: "Token verification failed",
    };
  }
}

/**
 * トークンの有効期限をチェック（期限切れかどうか）
 * @param token JWTトークン
 * @returns true: 期限切れ, false: 有効
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as TokenPayload;

    if (!decoded || !decoded.exp) {
      return true;
    }

    // 現在時刻がexp（秒単位のUNIX時刻）を超えていれば期限切れ
    return Date.now() / 1000 > decoded.exp;
  } catch {
    return true;
  }
}
