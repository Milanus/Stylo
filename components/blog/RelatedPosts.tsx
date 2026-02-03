import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { BlogMeta } from "@/lib/blog/types";
import { formatDate } from "@/lib/blog/utils";

interface RelatedPostsProps {
  posts: BlogMeta[];
}

export function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
        Related Posts
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-slate-50 dark:bg-slate-900 hover:shadow-lg hover:shadow-indigo-500/5 transition-all"
          >
            <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 mb-2">
              {post.category.replace("-", " ")}
            </span>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
              {post.description}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-xs text-slate-500" dateTime={post.publishedAt}>
                {formatDate(post.publishedAt, post.locale)}
              </time>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
