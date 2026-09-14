"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  Loader2,
  Tag,
  Globe,
  DollarSign,
  RefreshCw,
} from "lucide-react";

interface Job {
  id: number;
  title: string;
  company: string;
  logo: string | null;
  location: string;
  category: string;
  tags: string[];
  salary: string | null;
  url: string;
  publishedAt: string;
  jobType: string;
}

const CATEGORIES = [
  "All",
  "Frontend",
  "Backend",
  "Full-Stack",
  "AI & ML",
  "DevOps",
  "Design",
  "Product",
];

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

const SAVED_KEY = "pnp_saved_jobs";

function getSavedIds(): Set<number> {
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    if (raw) return new Set(JSON.parse(raw));
  } catch {}
  return new Set();
}

function toggleSaved(id: number): boolean {
  const saved = getSavedIds();
  if (saved.has(id)) {
    saved.delete(id);
  } else {
    saved.add(id);
  }
  localStorage.setItem(SAVED_KEY, JSON.stringify([...saved]));
  return saved.has(id);
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [savedIds, setSavedIds] = useState<Set<number>>(new Set());
  const [showSavedOnly, setShowSavedOnly] = useState(false);
  const [total, setTotal] = useState(0);

  // Restore saved jobs from localStorage
  useEffect(() => {
    setSavedIds(getSavedIds());
  }, []);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, limit: "24" });
      if (debouncedSearch) params.set("search", debouncedSearch);
      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setTotal(data.total);
      }
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [category, debouncedSearch]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSave = (id: number) => {
    const isNowSaved = toggleSaved(id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (isNowSaved) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const displayedJobs = showSavedOnly
    ? jobs.filter((j) => savedIds.has(j.id))
    : jobs;

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4 shadow-sm">
            <Briefcase className="w-3.5 h-3.5" />
            Remote Tech Jobs — Live from Remotive
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Developer Job Board
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Curated remote-first tech roles for frontend, backend, AI/ML, and DevOps engineers. Updated every 30 minutes.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-cyan-500" /> Remote-first
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> {total > 0 ? `${total}+ roles` : "Live roles"}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" /> Auto-refreshed
            </span>
          </div>
        </div>

        {/* ── Search + Filters ── */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search bar */}
          <div className="relative max-w-xl mx-auto w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search role, company, or skill..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
            />
          </div>

          {/* Category tabs + saved toggle */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setShowSavedOnly(false); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    category === cat && !showSavedOnly
                      ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/25"
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowSavedOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                showSavedOnly
                  ? "bg-amber-500 text-white shadow-sm shadow-amber-500/25"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 hover:text-amber-500"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Saved</span>
              {savedIds.size > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20">
                  {savedIds.size}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── Job Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-6 space-y-3 animate-pulse"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                    <div className="h-2.5 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                <div className="flex gap-2 pt-1">
                  <div className="h-5 w-14 bg-slate-200 dark:bg-slate-800 rounded-full" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : displayedJobs.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">
              {showSavedOnly ? "No saved jobs yet" : "No jobs found"}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              {showSavedOnly
                ? "Bookmark jobs to save them here"
                : "Try a different category or search term"}
            </p>
            {showSavedOnly && (
              <button
                onClick={() => setShowSavedOnly(false)}
                className="mt-4 text-xs font-semibold text-cyan-500 hover:underline"
              >
                Browse all jobs →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedJobs.map((job) => {
              const isSaved = savedIds.has(job.id);
              return (
                <div
                  key={job.id}
                  className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  <div className="p-5">
                    {/* Company row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {job.logo ? (
                          <div className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                            <Image
                              src={job.logo}
                              alt={job.company}
                              fill
                              className="object-contain p-1"
                              sizes="40px"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = "none";
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                            <Briefcase className="w-5 h-5 text-cyan-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                            {job.company}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            {timeAgo(job.publishedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Save button */}
                      <button
                        onClick={() => handleSave(job.id)}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                          isSaved
                            ? "text-amber-500 bg-amber-500/10"
                            : "text-slate-400 hover:text-amber-500 hover:bg-amber-500/10"
                        }`}
                        title={isSaved ? "Remove from saved" : "Save job"}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Job title */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2 leading-snug mb-3">
                      {job.title}
                    </h3>

                    {/* Location + salary row */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3 text-cyan-500" />
                        {job.location}
                      </span>
                      {job.salary && (
                        <span className="flex items-center gap-1 truncate">
                          <DollarSign className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span className="truncate">{job.salary}</span>
                        </span>
                      )}
                    </div>

                    {/* Tags */}
                    {job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {job.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2">
                    <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 truncate">
                      {job.jobType}
                    </span>
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1.5 rounded-xl transition-colors shrink-0 shadow-sm shadow-cyan-500/20"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Bottom CTA ── */}
        {!loading && displayedJobs.length > 0 && (
          <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-indigo-500/5 to-purple-500/10 border border-cyan-500/20 text-center">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
              Level up before you apply
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Use our structured roadmaps and study notes to master the skills these roles require.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/roadmaps"
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]"
              >
                Explore Roadmaps →
              </Link>
              <Link
                href="/notes"
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-cyan-500/40 transition-all"
              >
                Study Notes & PDFs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
