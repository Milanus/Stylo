import { Link } from "@/i18n/navigation";
import { ArrowRight, Sparkles } from "lucide-react";

export function BlogCTA() {
  return (
    <div className="relative my-12 rounded-2xl overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-700 dark:to-indigo-950" />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative px-8 py-12 sm:px-12 sm:py-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
          <Sparkles className="w-4 h-4 text-indigo-200" />
          <span className="text-sm font-medium text-indigo-100">AI-Powered Writing</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-white">
          Ready to improve your writing?
        </h3>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto text-lg">
          Try Stylo for free and experience AI-powered writing assistance that adapts to your style.
        </p>
        <Link
          href="/dashboard"
          className="group inline-flex items-center gap-2 bg-white hover:bg-indigo-50 text-indigo-700 font-semibold px-8 py-4 rounded-xl transition-all shadow-lg shadow-indigo-900/30 hover:shadow-xl"
        >
          Try Stylo Free
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
