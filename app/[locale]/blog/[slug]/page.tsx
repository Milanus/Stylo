import { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog/mdx";
import { Locale } from "@/lib/blog/types";
import { BlogHeader } from "@/components/blog/BlogHeader";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogCTA } from "@/components/blog/BlogCTA";
import { BlogJsonLd } from "@/components/blog/BlogJsonLd";
import { Link } from "@/i18n/navigation";
import { BlogNav } from "@/components/blog/BlogNav";
import { RelatedPosts } from "@/components/blog/RelatedPosts";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import Footer from "@/components/landing/Footer";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const locales: Locale[] = ["en", "sk", "cs", "de", "es"];
  const params: { locale: string; slug: string }[] = [];

  for (const locale of locales) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;

  const baseUrl = "https://stylo.app";

  try {
    const post = await getPostBySlug(slug, locale as Locale);
    const ogImage = `${baseUrl}${post.coverImage}`;

    return {
      title: `${post.title} | Stylo Blog`,
      description: post.description,
      keywords: post.tags,
      authors: [{ name: post.author }],
      openGraph: {
        title: post.title,
        description: post.description,
        type: "article",
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        locale: post.locale,
        images: [{ url: ogImage, width: 1200, height: 630 }],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.description,
        images: [ogImage],
      },
      alternates: {
        canonical: `${baseUrl}/${post.locale}/blog/${post.slug}`,
        languages: {
          en: `${baseUrl}/en/blog/${post.slug}`,
          sk: `${baseUrl}/sk/blog/${post.slug}`,
          cs: `${baseUrl}/cs/blog/${post.slug}`,
          de: `${baseUrl}/de/blog/${post.slug}`,
          es: `${baseUrl}/es/blog/${post.slug}`,
        },
      },
    };
  } catch {
    return {
      title: "Post Not Found | Stylo Blog",
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let post;

  try {
    post = await getPostBySlug(slug, locale as Locale);
  } catch {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category, locale as Locale);

  return (
    <>
      <BlogJsonLd post={post} />
      <div className="min-h-screen bg-white dark:bg-slate-950">
        <BlogNav />
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Breadcrumbs for SEO */}
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: post.title, href: `/blog/${post.slug}` },
            ]}
          />

          {/* Back link */}
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors mb-10"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <BlogHeader post={post} />
          <BlogContent content={post.content} />

          {/* Bottom CTA */}
          <BlogCTA />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 text-xs font-medium rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {relatedPosts.length > 0 && <RelatedPosts posts={relatedPosts} />}
        </article>

        <Footer />
      </div>
    </>
  );
}
