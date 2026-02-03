import { Clock, Calendar, User } from "lucide-react";
import { BlogPost } from "@/lib/blog/types";
import { formatDate } from "@/lib/blog/utils";
import { Sparkles } from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  "ai-writing": "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300",
  "grammar-tips": "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  "productivity": "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  "tutorials": "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
  "product-updates": "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
};

interface BlogHeaderProps {
  post: BlogPost;
}

export function BlogHeader({ post }: BlogHeaderProps) {
  const categoryColor = CATEGORY_COLORS[post.category] ?? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";

  return (
    <header className="mb-12">
      {/* Category + Featured badges */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${categoryColor}`}>
          {post.category.replace("-", " ")}
        </span>
        {post.featured && (
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            <Sparkles className="w-3 h-3" />
            Featured
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-6">
        {post.title}
      </h1>

      {/* Description */}
      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-3xl">
        {post.description}
      </p>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 dark:text-slate-400 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>{post.author}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <time dateTime={post.publishedAt}>
            {formatDate(post.publishedAt, post.locale)}
          </time>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          <span>{post.readingTime} min read</span>
        </div>
      </div>

      {/* Cover image */}
      {post.coverImage && (
        <div className="mt-8 aspect-[21/9] rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </header>
  );
}
