"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, BookOpen, Code2, Zap, Search, ShieldCheck } from "lucide-react";
import { useSearch } from "../providers/SearchContext";

export function Hero() {
  const { openSearch } = useSearch();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-28">
      {/* Background glowing radial accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-indigo-500/15 to-purple-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 dark:bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 text-xs font-semibold mb-6 shadow-sm shadow-cyan-500/10">
          <Sparkles className="w-3.5 h-3.5 text-cyan-500 animate-pulse" />
          <span>Developer Intelligence Hub — High Signal, Production Ready</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1]">
          From <span className="text-gradient">Prompt</span> to{" "}
          <span className="text-gradient">Production</span>.
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          The high-velocity developer discovery platform. Cut through AI noise with editorial signal, master structured engineering roadmaps, and ship production software.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <Link
            href="/notes"
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white font-semibold text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Visual Study Notes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/roadmaps"
            className="px-6 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] backdrop-blur-md"
          >
            <BookOpen className="w-4 h-4 text-cyan-500" />
            <span>Interactive Roadmaps</span>
          </Link>

          <button
            type="button"
            onClick={openSearch}
            className="px-4 py-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 hover:border-cyan-500/40 text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Quick Search</span>
            <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">⌘K</kbd>
          </button>
        </div>

        {/* Platform Stat Bar */}
        <div className="mt-14 sm:mt-18 pt-10 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              60<span className="text-cyan-500">fps</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" /> GPU Transform Only
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              4 <span className="text-cyan-500">Tracks</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-blue-500" /> Curated Roadmaps
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              100<span className="text-cyan-500">%</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <Code2 className="w-3.5 h-3.5 text-purple-500" /> Production Blueprints
            </p>
          </div>

          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              &lt;50<span className="text-emerald-500">ms</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Global Edge TTFB
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
