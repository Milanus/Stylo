import { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Sparkles } from "lucide-react";
import { getAllPosts } from "@/lib/blog/mdx";
import { Locale } from "@/lib/blog/types";
import { BlogList } from "@/components/blog/BlogList";
import { BlogNav } from "@/components/blog/BlogNav";
import Footer from "@/components/landing/Footer";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = "https://stylo.app";

  return {
    title: "Blog | Stylo",
    description: "Tips, guides, and insights about writing, grammar, and AI-powered tools.",
    openGraph: {
      title: "Blog | Stylo",
      description: "Tips, guides, and insights about writing, grammar, and AI-powered tools.",
      type: "website",
      locale,
    },
    alternates: {
      canonical: `${baseUrl}/${locale}/blog`,
      languages: {
        en: `${baseUrl}/en/blog`,
        sk: `${baseUrl}/sk/blog`,
        cs: `${baseUrl}/cs/blog`,
        de: `${baseUrl}/de/blog`,
        es: `${baseUrl}/es/blog`,
      },
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = await getAllPosts(locale as Locale);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <BlogNav />
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-[15%] w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-800 mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
                Stylo Blog
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
              Insights &{" "}
              <span className="text-indigo-600 dark:text-indigo-400">Guides</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Tips, guides, and insights about writing, grammar, and AI-powered tools to help you write better.
            </p>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <BlogList posts={posts} />
      </section>

      <Footer />
    </div>
  );
}
