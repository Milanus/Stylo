export type BlogCategory =
  | "ai-writing"
  | "grammar-tips"
  | "productivity"
  | "tutorials"
  | "product-updates";

export type Locale = "en" | "sk" | "cs" | "de" | "es";

export interface BlogMeta {
  title: string;
  slug: string;
  description: string;
  category: BlogCategory;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  locale: Locale;
  featured: boolean;
  coverImage: string;
}

export interface BlogPost extends BlogMeta {
  content: string;
  readingTime: number;
}
