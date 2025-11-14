import { MetadataRoute } from "next";
import { getBlogs, getCategories } from "@/lib/microcms";
import type { BlogResponse, CategoryResponse } from "@/types/microcms";

/**
 * Fetch all blogs with pagination to handle more than 100 items
 */
async function getAllBlogs() {
  let allBlogs: BlogResponse[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const { contents, totalCount } = await getBlogs({ limit, offset });
    allBlogs = [...allBlogs, ...contents];
    offset += limit;
    hasMore = allBlogs.length < totalCount;
  }

  return allBlogs;
}

/**
 * Fetch all categories with pagination to handle more than 100 items
 */
async function getAllCategories() {
  let allCategories: CategoryResponse[] = [];
  let offset = 0;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const { contents, totalCount } = await getCategories({ limit, offset });
    allCategories = [...allCategories, ...contents];
    offset += limit;
    hasMore = allCategories.length < totalCount;
  }

  return allCategories;
}

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
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
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
    // Fetch all blog posts from microCMS with pagination
    const blogs = await getAllBlogs();

    console.log(`[Sitemap] Fetched ${blogs.length} blog posts (all)`);

    // Generate sitemap entries for blog posts
    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${baseUrl}/blog/${blog.id}`,
      lastModified: new Date(blog.updatedAt || blog.publishedAt || blog.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

    // Fetch all categories from microCMS with pagination
    const categories = await getAllCategories();

    console.log(`[Sitemap] Fetched ${categories.length} categories (all)`);

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
