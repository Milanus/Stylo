import { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog/mdx";
import { Locale } from "@/lib/blog/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://stylo.app";
  const locales: Locale[] = ["en", "sk", "cs", "de", "es"];

  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/${locale}/dashboard`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },
  ]);

  const blogPosts: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      blogPosts.push({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "weekly" as const,
        priority: post.featured ? 0.9 : 0.7,
      });
    }
  }

  return [...staticPages, ...blogPosts];
}
