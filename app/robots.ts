import { MetadataRoute } from "next";

/**
 * Robots.txt configuration for WIN×Ⅱ
 * Controls search engine crawling behavior
 *
 * Access: https://yourdomain.com/robots.txt
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/mypage",      // Member-only dashboard
          "/api",         // API endpoints
          "/verify-email", // Email verification pages
          "/reset-password", // Password reset pages
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
