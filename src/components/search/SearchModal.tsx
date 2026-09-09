"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import { Search, X, BookOpen, Sparkles, Code2, Laugh, ArrowRight, CornerDownLeft } from "lucide-react";
import { useSearch } from "../providers/SearchContext";
import { articles } from "@/data/articles";
import { roadmaps } from "@/data/roadmaps";
import { projects } from "@/data/projects";
import { Meme } from "@/types";

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  type: "article" | "roadmap" | "project" | "meme";
  url: string;
  category?: string;
  badge?: string;
}

export function SearchModal() {
  const { isOpen, closeSearch } = useSearch();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const [dynamicMemes, setDynamicMemes] = useState<Meme[]>([]);

  useEffect(() => {
    if (isOpen) {
      try {
        const community = localStorage.getItem("pnp_community_memes");
        const reddit = localStorage.getItem("pnp_reddit_memes_cache");
        const cList: Meme[] = community ? JSON.parse(community) : [];
        const rList: Meme[] = reddit ? JSON.parse(reddit) : [];
        setDynamicMemes([...cList, ...rList]);
      } catch {
        // Fallback
      }
    }
  }, [isOpen]);

  // Compile search items
  const allItems: SearchItem[] = useMemo(() => {
    const articleItems: SearchItem[] = articles.map((a) => ({
      id: a.id,
      title: a.title,
      subtitle: a.subtitle,
      type: "article",
      url: `/feed/${a.slug}`,
      category: a.category,
      badge: "What's New",
    }));

    const roadmapItems: SearchItem[] = roadmaps.map((r) => ({
      id: r.id,
      title: r.title,
      subtitle: r.shortDesc,
      type: "roadmap",
      url: `/learn/${r.slug}`,
      category: r.level,
      badge: "Roadmap",
    }));

    const projectItems: SearchItem[] = projects.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: p.shortDesc,
      type: "project",
      url: `/build/${p.slug}`,
      category: p.level,
      badge: "Project Blueprint",
    }));

    const memeItems: SearchItem[] = dynamicMemes.map((m) => ({
      id: m.id,
      title: m.title,
      subtitle: m.caption,
      type: "meme",
      url: `/memes#${m.id}`,
      category: m.category,
      badge: "Dev Meme",
    }));

    return [...articleItems, ...roadmapItems, ...projectItems, ...memeItems];
  }, [dynamicMemes]);

  const fuse = useMemo(() => {
    return new Fuse(allItems, {
      keys: ["title", "subtitle", "category", "badge"],
      threshold: 0.35,
    });
  }, [allItems]);

  const results = useMemo(() => {
    if (!query.trim()) {
      // Default recommended items
      return allItems.slice(0, 7);
    }
    return fuse.search(query).map((res) => res.item).slice(0, 10);
  }, [query, fuse, allItems]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  const handleSelect = (url: string) => {
    closeSearch();
    router.push(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (results.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === "Enter" && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex].url);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search tech articles, roadmaps, blueprints, memes..."
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm sm:text-base outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={closeSearch}
            className="px-2 py-0.5 text-xs font-medium rounded border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 shrink-0"
          >
            ESC
          </button>
        </div>

        {/* Results list */}
        <div className="overflow-y-auto p-2 space-y-1">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
              No results found for &ldquo;<span className="font-semibold text-slate-700 dark:text-slate-300">{query}</span>&rdquo;
            </div>
          ) : (
            results.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.url)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left p-3 rounded-xl transition-all flex items-start justify-between gap-3 group ${
                    isSelected
                      ? "bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30"
                      : "hover:bg-slate-100/80 dark:hover:bg-slate-800/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                        item.type === "article"
                          ? "bg-blue-500/10 text-blue-500 dark:text-blue-400"
                          : item.type === "roadmap"
                          ? "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400"
                          : item.type === "project"
                          ? "bg-purple-500/10 text-purple-500 dark:text-purple-400"
                          : "bg-amber-500/10 text-amber-500 dark:text-amber-400"
                      }`}
                    >
                      {item.type === "article" && <Sparkles className="w-4 h-4" />}
                      {item.type === "roadmap" && <BookOpen className="w-4 h-4" />}
                      {item.type === "project" && <Code2 className="w-4 h-4" />}
                      {item.type === "meme" && <Laugh className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate">
                          {item.title}
                        </span>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 shrink-0">
                          {item.badge}
                        </span>
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                          {item.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-xs text-slate-400 group-hover:text-cyan-500 transition-colors">
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[11px] font-medium text-cyan-500 mr-1">
                        Select <CornerDownLeft className="w-3 h-3" />
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-950/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">↑↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">↵</kbd> Open
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">esc</kbd> Close
            </span>
          </div>
          <span className="hidden sm:inline font-medium text-cyan-600 dark:text-cyan-400">
            Prompt N Prod Intelligence
          </span>
        </div>
      </div>
    </div>
  );
}
