import { MetadataRoute } from "next";
import { getBlogs, getCategories } from "@/lib/microcms";

/**
 * Sitemap generation for WIN×Ⅱ
 * Includes static pages, blog posts, and category pages
 *
 * Access: https://yourdomain.com/sitemap.xml
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static pages with their priority and update frequency
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/register`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/forgot-password`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];

  try {
    // Fetch all blog posts from microCMS
    // Note: microCMS API limit is max 100 per request
    const { contents: blogs, totalCount: blogCount } = await getBlogs({
      limit: 100,
    });

    console.log(`[Sitemap] Fetched ${blogs.length} blog posts (total: ${blogCount})`);

    // Generate sitemap entries for blog posts
    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.id}`,
      lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Fetch all categories from microCMS
    const { contents: categories, totalCount: categoryCount } = await getCategories({
      limit: 100,
    });

    console.log(`[Sitemap] Fetched ${categories.length} categories (total: ${categoryCount})`);

    // Generate sitemap entries for category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${category.id}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    console.log(`[Sitemap] Total URLs: ${staticPages.length + blogPages.length + categoryPages.length}`);

    // Combine all pages
    return [...staticPages, ...blogPages, ...categoryPages];
  } catch (error) {
    console.error("[Sitemap] Error generating sitemap:", error);
    // Return static pages only if microCMS fetch fails
    return staticPages;
  }
}
