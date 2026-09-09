import React from "react";
import { Sparkles } from "lucide-react";
import { getAllArticles } from "@/lib/content";
import { FeedList } from "@/components/feed/FeedList";

export const metadata = {
  title: "Tech Radar & Engineering Feed | Prompt N Prod",
  description:
    "High-signal breakdowns of emerging frameworks, breakthrough AI models, and architectural patterns. Every release vetted with our editorial scorecard.",
};

export default function FeedPage() {
  const articles = getAllArticles();

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header banner */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> What&apos;s New
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Developer Tech Radar
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            High-signal breakdowns of emerging frameworks, breakthrough models, and architectural patterns. Each release is vetted with our editorial &ldquo;Should I Learn This?&rdquo; scorecard.
          </p>
        </div>

        {/* Dynamic client list with search & category filters */}
        <FeedList articles={articles} />
      </div>
    </div>
  );
}
