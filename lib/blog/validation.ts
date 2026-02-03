import { BlogMeta, BlogCategory, Locale } from "./types";

const VALID_CATEGORIES: BlogCategory[] = [
  "ai-writing",
  "grammar-tips",
  "productivity",
  "tutorials",
  "product-updates",
];

const MAX_TITLE_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 160;
const MAX_TAGS = 10;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateFrontmatter(data: Record<string, unknown>): BlogMeta {
  if (typeof data.title !== "string" || data.title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Invalid title: must be string, max ${MAX_TITLE_LENGTH} chars`);
  }

  if (typeof data.slug !== "string" || !SLUG_PATTERN.test(data.slug)) {
    throw new Error("Invalid slug: must be kebab-case alphanumeric");
  }

  if (
    typeof data.description !== "string" ||
    data.description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw new Error(
      `Invalid description: must be string, max ${MAX_DESCRIPTION_LENGTH} chars`
    );
  }

  if (!VALID_CATEGORIES.includes(data.category as BlogCategory)) {
    throw new Error(`Invalid category: ${data.category}`);
  }

  if (!Array.isArray(data.tags) || data.tags.length > MAX_TAGS) {
    throw new Error(`Invalid tags: must be array, max ${MAX_TAGS}`);
  }

  const sanitizedTags = data.tags.map((tag: unknown) => {
    if (typeof tag !== "string") throw new Error("Tag must be string");
    return tag.replace(/<[^>]*>/g, "").trim();
  });

  return {
    title: data.title,
    slug: data.slug,
    description: data.description,
    category: data.category as BlogCategory,
    tags: sanitizedTags,
    author: typeof data.author === "string" ? data.author : "Stylo Team",
    publishedAt: validateISODate(data.publishedAt),
    updatedAt: validateISODate(data.updatedAt),
    locale: validateLocale(data.locale),
    featured: data.featured === true,
    coverImage: validateImagePath(data.coverImage),
  };
}

function validateISODate(value: unknown): string {
  if (typeof value !== "string" || isNaN(Date.parse(value))) {
    throw new Error(`Invalid date: ${value}`);
  }
  return value;
}

function validateLocale(value: unknown): Locale {
  const validLocales = ["en", "sk", "cs", "de", "es"];
  if (typeof value !== "string" || !validLocales.includes(value)) {
    throw new Error(`Invalid locale: ${value}`);
  }
  return value as Locale;
}

function validateImagePath(value: unknown): string {
  if (typeof value !== "string") throw new Error("coverImage must be string");

  if (value.includes("..") || !value.startsWith("/blog/covers/")) {
    throw new Error("Invalid image path: must start with /blog/covers/");
  }

  const allowedExtensions = [".webp", ".jpg", ".jpeg", ".png", ".avif"];
  const ext = value.substring(value.lastIndexOf(".")).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    throw new Error(`Invalid image extension: ${ext}`);
  }

  return value;
}
