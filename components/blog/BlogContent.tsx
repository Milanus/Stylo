import { MDXRemote } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";
import { BlogCTA } from "./BlogCTA";

const components = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1
      className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-slate-900 dark:text-white tracking-tight"
      {...props}
    />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="text-2xl md:text-3xl font-bold mt-12 mb-4 text-slate-900 dark:text-white tracking-tight scroll-mt-20"
      {...props}
    />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="text-xl md:text-2xl font-semibold mt-8 mb-3 text-slate-900 dark:text-white tracking-tight"
      {...props}
    />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="text-slate-700 dark:text-slate-300 mb-6 leading-relaxed text-[17px]" {...props} />
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (!href || href.startsWith("javascript:")) return <span>{children}</span>;

    const isExternal = href.startsWith("http");
    const isInternal = href.startsWith("/");

    if (isInternal) {
      return (
        <Link
          href={href}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4 hover:decoration-indigo-500 transition-colors"
          {...props}
        >
          {children}
        </Link>
      );
    }

    return (
      <a
        href={href}
        className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline decoration-indigo-300 dark:decoration-indigo-700 underline-offset-4 hover:decoration-indigo-500 transition-colors"
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-6 space-y-3 text-slate-700 dark:text-slate-300" {...props} />
  ),
  ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal mb-6 space-y-3 text-slate-700 dark:text-slate-300 pl-6" {...props} />
  ),
  li: (props: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="pl-2 text-[17px] leading-relaxed relative before:content-[''] before:absolute before:-left-4 before:top-[10px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-indigo-400 dark:before:bg-indigo-500 [ol_&]:before:hidden" {...props} />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="border-l-4 border-indigo-500 dark:border-indigo-400 pl-6 py-4 mb-6 bg-slate-50 dark:bg-slate-900 rounded-r-xl text-slate-700 dark:text-slate-300 italic"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-sm font-mono text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-700"
      {...props}
    />
  ),
  pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="bg-slate-900 dark:bg-slate-800 text-slate-100 p-6 rounded-2xl mb-6 overflow-x-auto border border-slate-800 dark:border-slate-700"
      {...props}
    />
  ),
  strong: (props: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
  ),
  hr: () => (
    <hr className="my-12 border-slate-200 dark:border-slate-800" />
  ),
  BlogCTA,
};

interface BlogContentProps {
  content: string;
}

export async function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="max-w-none mt-10">
      <MDXRemote source={content} components={components} />
    </div>
  );
}
