"use client";

import React from "react";
import Link from "next/link";
import { Article } from "@/types";
import { ArrowRight, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TrendingFeedProps {
  articles: Article[];
}

export function TrendingFeed({ articles }: TrendingFeedProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> What&apos;s New
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Tech Radar & Breaking Signal
            </h2>
          </div>
          <Link
            href="/feed"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
          >
            <span>View All Radar Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.slice(0, 3).map((article) => {
            const isMustLearn = article.scorecard.verdict === "Must Learn";
            return (
              <Link
                key={article.id}
                href={`/feed/${article.slug}`}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between group"
              >
                <div>
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {article.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {article.subtitle}
                  </p>
                </div>

                {/* Bottom scorecard verdict pill & date */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <span
                      className={`px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                        isMustLearn
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {article.scorecard.verdict}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {article.scorecard.overallScore}/100
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400">
                    {formatDate(article.date)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
