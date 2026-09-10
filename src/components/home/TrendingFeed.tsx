"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Article } from "@/types";
import { ArticleDb } from "@/db";
import { 
  ArrowRight, 
  Sparkles, 
  ExternalLink, 
  Radio, 
  TrendingUp, 
  Clock 
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface TrendingFeedProps {
  articles: Article[];
}

export function TrendingFeed({ articles }: TrendingFeedProps) {
  const [liveStories, setLiveStories] = useState<
    Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      source: string;
      url: string;
      isExternal: boolean;
      score?: number;
      date: string | Date;
    }>
  >([]);

  useEffect(() => {
    async function loadLiveFeed() {
      try {
        const res = await fetch("/api/news?limit=6");
        const data = await res.json();
        if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
          const mapped = data.articles.map((item: ArticleDb) => ({
            id: `db-${item.id}`,
            title: item.title,
            subtitle: item.summary,
            category: item.category,
            source: item.source,
            url: item.sourceUrl,
            isExternal: true,
            score: item.score,
            date: item.createdAt,
          }));
          setLiveStories(mapped);
        }
      } catch (err) {
        console.error("Could not fetch live news:", err);
      }
    }
    loadLiveFeed();
  }, []);

  // Use live ingested news if available; otherwise use static editorial articles
  const displayedItems = liveStories.length > 0
    ? liveStories.slice(0, 3)
    : articles.slice(0, 3).map((art) => ({
        id: art.id,
        title: art.title,
        subtitle: art.subtitle,
        category: art.category,
        source: "Editorial Guide",
        url: `/feed/${art.slug}`,
        isExternal: false,
        score: art.scorecard.overallScore,
        date: art.date,
      }));

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Tech Radar &amp; Breaking Signal
              <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Auto-Ingested Daily
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Latest Engineering Discoveries
            </h2>
          </div>
          <Link
            href="/feed"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
          >
            <span>Explore All Radar Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedItems.map((item) => {
            const cardContent = (
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between h-full group hover:border-cyan-500/40 transition-all duration-200">
                <div>
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {item.category}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {item.source}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Bottom pill & date */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <TrendingUp className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{item.score ? `${item.score} pts` : "Trending"}</span>
                  </div>

                  <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    {item.isExternal ? (
                      <>
                        <span>Read Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>Read Breakdown</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );

            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={item.id} href={item.url} className="block h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

