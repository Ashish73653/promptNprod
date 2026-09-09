"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Meme } from "@/types";
import { Laugh, ArrowRight, Heart } from "lucide-react";

interface MemeStripProps {
  initialMemes?: Meme[];
}

export function MemeStrip({ initialMemes = [] }: MemeStripProps) {
  const [liveMemes, setLiveMemes] = useState<Meme[]>(initialMemes);
  const [loading, setLoading] = useState(initialMemes.length === 0);

  useEffect(() => {
    // 1. Try restoring from localStorage cache first for zero-wait rendering
    try {
      const communitySaved = localStorage.getItem("pnp_community_memes");
      const redditSaved = localStorage.getItem("pnp_reddit_memes_cache");

      const community: Meme[] = communitySaved ? JSON.parse(communitySaved) : [];
      const reddit: Meme[] = redditSaved ? JSON.parse(redditSaved) : [];
      const cached = [...community, ...reddit];

      if (cached.length > 0) {
        setLiveMemes(cached.slice(0, 3));
        setLoading(false);
      }
    } catch {
      // Fallback
    }

    // 2. Fetch fresh live memes from Reddit
    const fetchLive = async () => {
      try {
        const res = await fetch("/api/memes/reddit?count=6");
        const data = await res.json();
        if (data.success && data.memes?.length > 0) {
          // Merge with any community memes
          let community: Meme[] = [];
          try {
            const saved = localStorage.getItem("pnp_community_memes");
            if (saved) community = JSON.parse(saved);
          } catch {}

          const combined = [...community, ...data.memes];
          setLiveMemes(combined.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch live memes on homepage:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLive();
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Laugh className="w-3.5 h-3.5" />
              <span>Dev Culture & Live Humor</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[10px] font-semibold lowercase">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                r/ProgrammerHumor
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Production Pain & AI Memes
            </h2>
          </div>
          <Link
            href="/memes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors group"
          >
            <span>Visit Live Meme Vault</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && liveMemes.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="glass-card rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between"
              >
                <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : liveMemes.length === 0 ? (
          <div className="text-center py-12 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No memes currently in feed.
            </p>
            <Link
              href="/memes"
              className="mt-3 inline-block text-xs font-semibold text-rose-500 hover:underline"
            >
              Open Meme Vault to sync fresh memes →
            </Link>
          </div>
        ) : (
          /* Memes 3-col preview */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {liveMemes.map((meme) => (
              <Link
                key={meme.id}
                href="/memes"
                className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <Image
                    src={meme.image}
                    alt={meme.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {meme.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-1">
                      {meme.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic line-clamp-2">
                      &ldquo;{meme.caption}&rdquo;
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span>@{meme.author}</span>
                    <span className="flex items-center gap-1 text-rose-500 font-bold">
                      <Heart className="w-3.5 h-3.5 fill-current" /> {meme.upvotes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
