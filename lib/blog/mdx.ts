import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { BlogMeta, BlogPost, Locale } from "./types";
import { validateFrontmatter } from "./validation";
import { calculateReadingTime } from "./utils";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

export async function getPostBySlug(
  slug: string,
  locale: Locale
): Promise<BlogPost> {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);

  const meta = validateFrontmatter(data);

  return {
    ...meta,
    content,
    readingTime: calculateReadingTime(content),
  };
}

export async function getAllPosts(locale: Locale): Promise<BlogMeta[]> {
  const dir = path.join(CONTENT_DIR, locale);

  try {
    const files = await fs.readdir(dir);

    const posts = await Promise.all(
      files
        .filter((f) => f.endsWith(".mdx"))
        .map(async (file) => {
          const slug = file.replace(/\.mdx$/, "");
          const post = await getPostBySlug(slug, locale);
          const { content, ...meta } = post;
          return meta;
        })
    );

    return posts.sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  } catch (error) {
    return [];
  }
}

export async function getPostsByCategory(
  category: string,
  locale: Locale
): Promise<BlogMeta[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter((post) => post.category === category);
}

export async function getFeaturedPosts(locale: Locale): Promise<BlogMeta[]> {
  const allPosts = await getAllPosts(locale);
  return allPosts.filter((post) => post.featured);
}

export async function getRelatedPosts(
  slug: string,
  category: string,
  locale: Locale,
  limit = 2
): Promise<BlogMeta[]> {
  const allPosts = await getAllPosts(locale);

  const sameCategory = allPosts.filter(
    (post) => post.slug !== slug && post.category === category
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const otherPosts = allPosts.filter(
    (post) => post.slug !== slug && post.category !== category
  );

  return [...sameCategory, ...otherPosts].slice(0, limit);
}
