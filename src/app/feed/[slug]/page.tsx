import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { ScorecardWidget } from "@/components/ui/ScorecardWidget";
import { formatDate } from "@/lib/utils";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  Users, 
  Share2, 
  Bookmark,
  ChevronRight,
  Code
} from "lucide-react";

export function generateStaticParams() {
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/feed" className="hover:text-cyan-500 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to What&apos;s New
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{article.category}</span>
        </div>

        {/* Header Content */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {article.category}
            </span>
            {article.badge && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {article.badge}
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> {article.readTime}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {formatDate(article.date)}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {article.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {article.subtitle}
          </p>

          {/* Author bar */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-200 text-sm">
                {article.author.name[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  {article.author.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {article.author.role}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Executive Summary Card */}
        <section className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 mb-8 backdrop-blur-md">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Executive TL;DR
          </span>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
            {article.summary}
          </p>
        </section>

        {/* Interactive "Should I Learn This?" Scorecard Widget */}
        <section className="mb-10">
          <ScorecardWidget scorecard={article.scorecard} title={article.title} />
        </section>

        {/* Why It Matters & Who Should Care (Two Columns) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Why It Matters */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Why It Matters
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {article.whyItMatters.map((point, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Who Should Care */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-cyan-500" /> Who Should Care
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {article.whoShouldCare.map((target, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold shrink-0">•</span>
                  <span>{target}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Deep Dive Content Sections */}
        <div className="space-y-8 mb-12">
          {article.content.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {section.sectionTitle}
              </h2>
              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                  {p}
                </p>
              ))}

              {section.codeSnippet && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0d121d] my-4 shadow-xl">
                  {section.codeSnippet.caption && (
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400 font-mono">
                      <span className="flex items-center gap-1.5">
                        <Code className="w-3.5 h-3.5 text-cyan-400" />
                        {section.codeSnippet.caption}
                      </span>
                      <span className="uppercase text-[10px] text-slate-500">{section.codeSnippet.language}</span>
                    </div>
                  )}
                  <pre className="p-4 text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed">
                    <code>{section.codeSnippet.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actionable Takeaways */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-slate-50 to-indigo-500/10 dark:from-cyan-950/40 dark:via-slate-900 dark:to-indigo-950/40 border border-cyan-500/20 mb-12">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
            Actionable Next Steps
          </h3>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
            {article.takeaways.map((takeaway, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Bottom CTA to roadmaps */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md gap-4">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-base">
              Ready to master this in depth?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Explore step-by-step milestones in our interactive learning tracks.
            </p>
          </div>
          <Link
            href="/learn"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs sm:text-sm shrink-0 shadow-md shadow-cyan-500/20 transition-all"
          >
            Explore Roadmaps →
          </Link>
        </div>
      </div>
    </article>
  );
}
