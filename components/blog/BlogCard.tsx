import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";
import { BlogMeta } from "@/lib/blog/types";
import { formatDate } from "@/lib/blog/utils";

const CATEGORY_COLORS: Record<string, string> = {
  "ai-writing": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  "grammar-tips": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "productivity": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "tutorials": "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "product-updates": "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

interface BlogCardProps {
  post: BlogMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  const categoryColor = CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover image */}
      <div className="aspect-[16/9] bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
            </div>
          </div>
        )}
        {post.featured && (
          <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/90 backdrop-blur-sm">
            <Sparkles className="w-3 h-3 text-white" />
            <span className="text-xs font-semibold text-white">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColor}`}>
            {post.category.replace("-", " ")}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-1">
          {post.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt, post.locale)}
            </time>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
            <span>{post.author}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
