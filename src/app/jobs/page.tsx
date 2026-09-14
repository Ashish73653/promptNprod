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
  Globe,
  DollarSign,
  RefreshCw,
  X,
  Filter,
  Building2,
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
  source: string;
  jobType: string;
  isRemote: boolean;
  publishedAt: string;
}

const CATEGORIES = ["All", "Frontend", "Backend", "Full-Stack", "AI & ML", "DevOps", "Design", "Product"];
const JOB_TYPES  = ["All", "Full Time", "Contract", "Part Time"];

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
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) || "[]")); } catch { return new Set(); }
}
function persistSaved(ids: Set<number>) {
  localStorage.setItem(SAVED_KEY, JSON.stringify([...ids]));
}

export default function JobsPage() {
  const [jobs, setJobs]               = useState<Job[]>([]);
  const [loading, setLoading]         = useState(true);
  const [category, setCategory]       = useState("All");
  const [jobType, setJobType]         = useState("All");
  const [search, setSearch]           = useState("");
  const [debouncedSearch, setDebounced] = useState("");
  const [savedIds, setSavedIds]       = useState<Set<number>>(new Set());
  const [showSavedOnly, setShowSaved] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [total, setTotal]             = useState(0);
  const [fromDb, setFromDb]           = useState(false);

  useEffect(() => { setSavedIds(getSavedIds()); }, []);

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ category, jobType, limit: "24" });
      if (debouncedSearch) p.set("search", debouncedSearch);
      const res  = await fetch(`/api/jobs?${p}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setTotal(data.total);
        setFromDb(data.fromDb ?? false);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [category, jobType, debouncedSearch]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  const handleSave = (id: number) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      persistSaved(next);
      return next;
    });
  };

  const activeFilters =
    (category !== "All" ? 1 : 0) + (jobType !== "All" ? 1 : 0);

  const clearFilters = () => { setCategory("All"); setJobType("All"); setSearch(""); setDebounced(""); };

  const displayedJobs = showSavedOnly ? jobs.filter((j) => savedIds.has(j.id)) : jobs;

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            <Briefcase className="w-3.5 h-3.5" />
            Remote Tech Jobs — Stored in Neon, refreshed daily
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Developer Job Board
          </h1>
          <p className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
            Curated remote-first tech roles for frontend, backend, AI/ML, and DevOps engineers.
            Jobs older than 30 days are automatically removed.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-cyan-500" /> Remote-first</span>
            <span>•</span>
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              {total > 0 ? `${total} roles` : "Loading..."}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-500" />
              {fromDb ? "From DB" : "Live feed"}
            </span>
          </div>
        </div>

        {/* ── Search + Filter Row ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search role, company, or skill..."
              className="w-full pl-10 pr-9 py-2.5 rounded-xl text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors shadow-sm"
            />
            {search && (
              <button onClick={() => { setSearch(""); setDebounced(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter toggle button */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shrink-0 cursor-pointer ${
              showFilters || activeFilters > 0
                ? "bg-cyan-500 text-white border-cyan-500 shadow-md shadow-cyan-500/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-cyan-500/40"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="w-5 h-5 rounded-full bg-white/25 text-xs font-bold flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>

          {/* Saved toggle */}
          <button
            onClick={() => setShowSaved((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all shrink-0 cursor-pointer ${
              showSavedOnly
                ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-amber-500/40"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved
            {savedIds.size > 0 && (
              <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${showSavedOnly ? "bg-white/20 text-white" : "bg-amber-500/10 text-amber-600 dark:text-amber-400"}`}>
                {savedIds.size}
              </span>
            )}
          </button>
        </div>

        {/* ── Expandable Filter Panel ── */}
        {showFilters && (
          <div className="mb-6 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm space-y-4">
            {/* Category */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Category</p>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      category === cat
                        ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Type */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Job Type</p>
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setJobType(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      jobType === t
                        ? "bg-indigo-500 text-white shadow-sm shadow-indigo-500/25"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs font-semibold text-rose-500 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </div>
        )}

        {/* ── Quick category scroll (mobile) ── */}
        {!showFilters && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => { setCategory(cat); setShowSaved(false); }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  category === cat && !showSavedOnly
                    ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/25"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* ── Job Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-5 space-y-3 animate-pulse">
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
              {showSavedOnly ? "Bookmark jobs to save them here" : "Try a different category or run the cron to ingest fresh jobs"}
            </p>
            {showSavedOnly ? (
              <button onClick={() => setShowSaved(false)} className="mt-4 text-xs font-semibold text-cyan-500 hover:underline">Browse all jobs →</button>
            ) : (
              <button onClick={clearFilters} className="mt-4 text-xs font-semibold text-cyan-500 hover:underline">Clear filters</button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayedJobs.map((job) => {
              const isSaved = savedIds.has(job.id);
              return (
                <div key={job.id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden">
                  <div className="p-5">
                    {/* Company row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3 min-w-0">
                        {job.logo ? (
                          <div className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 dark:border-slate-700 shrink-0 overflow-hidden">
                            <Image src={job.logo} alt={job.company} fill className="object-contain p-1" sizes="40px"
                              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                            <Building2 className="w-5 h-5 text-cyan-500" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">{job.company}</p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" /> {timeAgo(job.publishedAt)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSave(job.id)}
                        className={`p-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${isSaved ? "text-amber-500 bg-amber-500/10" : "text-slate-400 hover:text-amber-500 hover:bg-amber-500/10"}`}
                        title={isSaved ? "Remove from saved" : "Save job"}
                      >
                        {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2 leading-snug mb-3">
                      {job.title}
                    </h3>

                    {/* Location + salary */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                      <span className="flex items-center gap-1 shrink-0">
                        <MapPin className="w-3 h-3 text-cyan-500" /> {job.location}
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
                          <span key={i} className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 truncate">
                        {job.jobType}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
                        {job.category}
                      </span>
                    </div>
                    <a href={job.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1.5 rounded-xl transition-colors shrink-0 shadow-sm shadow-cyan-500/20">
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
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">Level up before you apply</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">
              Use our structured roadmaps and study notes to master the skills these roles require.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link href="/roadmaps" className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-sm shadow-md shadow-cyan-500/20 transition-all hover:scale-[1.02]">
                Explore Roadmaps →
              </Link>
              <Link href="/notes" className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold text-sm hover:border-cyan-500/40 transition-all">
                Study Notes & PDFs
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
