"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Article, TechCategory } from "@/types";
import { ArticleDb } from "@/db";
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Filter, 
  ArrowRight, 
  ExternalLink, 
  RefreshCw, 
  Sparkles, 
  Flame,
  Radio
} from "lucide-react";
import { formatDate } from "@/lib/utils";

const categories: TechCategory[] = [
  "All",
  "AI & Agents",
  "Full-Stack",
  "Cloud & Infra",
  "Dev Tools",
  "Database",
];

interface FeedListProps {
  articles: Article[];
}

export function FeedList({ articles }: FeedListProps) {
  const [selectedCategory, setSelectedCategory] = useState<TechCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [liveDbArticles, setLiveDbArticles] = useState<ArticleDb[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Fetch live ingested articles from Neon DB
  const loadLiveNews = async () => {
    try {
      const res = await fetch("/api/news?limit=40");
      const data = await res.json();
      if (data.success && Array.isArray(data.articles)) {
        setLiveDbArticles(data.articles);
      }
    } catch (err) {
      console.error("Failed to load live news:", err);
    }
  };

  useEffect(() => {
    loadLiveNews();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/cron/ingest-news");
      const data = await res.json();
      if (data.success) {
        setSyncNotice("Auto-ingested fresh stories from Hacker News & Dev Trends!");
        await loadLiveNews();
      }
    } catch {
      setSyncNotice("Could not fetch news right now.");
    } finally {
      setIsRefreshing(false);
      setTimeout(() => setSyncNotice(null), 4000);
    }
  };

  // Combine editorial in-depth articles + live ingested automated news
  const allStories = useMemo(() => {
    const liveMapped = liveDbArticles.map((dbArt) => ({
      id: `db-${dbArt.id}`,
      slug: dbArt.slug,
      title: dbArt.title,
      subtitle: dbArt.summary,
      category: dbArt.category as TechCategory,
      source: dbArt.source,
      sourceUrl: dbArt.sourceUrl,
      author: dbArt.author,
      score: dbArt.score,
      date: dbArt.createdAt,
      isLiveExternal: true,
    }));

    const editorialMapped = articles.map((art) => ({
      id: art.id,
      slug: art.slug,
      title: art.title,
      subtitle: art.subtitle,
      category: art.category,
      source: "Editorial Breakdown",
      sourceUrl: `/feed/${art.slug}`,
      author: art.author.name,
      score: art.scorecard.overallScore,
      date: art.date,
      isLiveExternal: false,
    }));

    // Ingested live stories first, then editorial deep-dives
    return [...liveMapped, ...editorialMapped];
  }, [liveDbArticles, articles]);

  const filteredStories = useMemo(() => {
    return allStories.filter((story) => {
      const matchesCategory =
        selectedCategory === "All" || story.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.source.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [allStories, selectedCategory, searchQuery]);

  return (
    <div>
      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Box & Auto-Ingest Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tech radar..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Automated Ingestion Status & Refresh */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden sm:inline">Daily Cron Ingested</span>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh tech news feed now"
              className="p-1 hover:bg-emerald-500/20 rounded-md transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {syncNotice && (
        <div className="mb-6 p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Stories Grid */}
      {filteredStories.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No radar items found matching your filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="mt-3 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => {
            const isExternal = story.isLiveExternal;

            const cardContent = (
              <div className="glass-card rounded-2xl p-6 flex flex-col justify-between group h-full hover:border-cyan-500/40 transition-all duration-200">
                <div>
                  {/* Header tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {story.category}
                    </span>

                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      {story.source}
                    </span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2 leading-snug">
                    {story.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {story.subtitle}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">
                    By {story.author}
                  </span>

                  <span className="text-cyan-600 dark:text-cyan-400 font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    {isExternal ? (
                      <>
                        <span>Read Source</span>
                        <ExternalLink className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>Deep Dive</span>
                        <ArrowRight className="w-3 h-3" />
                      </>
                    )}
                  </span>
                </div>
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={story.id}
                  href={story.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={story.id} href={story.sourceUrl} className="block h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
