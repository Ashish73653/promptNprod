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
    } catch {}

    const fetchLive = async () => {
      try {
        const res = await fetch("/api/memes/reddit?count=6");
        const data = await res.json();
        if (data.success && data.memes?.length > 0) {
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
    <section className="py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 min-w-0">
            <Laugh className="w-4 h-4 text-rose-500 shrink-0" />
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
              Dev Memes
            </h2>
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[10px] font-semibold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              r/ProgrammerHumor
            </span>
          </div>
          <Link
            href="/memes"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors shrink-0 group"
          >
            <span className="hidden sm:inline">Visit Meme Vault</span>
            <span className="sm:hidden">See All</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading Skeletons */}
        {loading && liveMemes.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl overflow-hidden animate-pulse flex flex-col ${i === 3 ? "hidden md:flex" : ""}`}
              >
                <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : liveMemes.length === 0 ? (
          <div className="text-center py-10 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500 dark:text-slate-400">No memes currently in feed.</p>
            <Link href="/memes" className="mt-2 inline-block text-xs font-semibold text-rose-500 hover:underline">
              Open Meme Vault →
            </Link>
          </div>
        ) : (
          /* Mobile: 2-col grid showing only 2 memes. Desktop: 3-col showing all 3 */
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
            {liveMemes.map((meme, idx) => (
              <Link
                key={meme.id}
                href="/memes"
                className={`glass-card rounded-xl sm:rounded-2xl overflow-hidden flex flex-col group ${idx === 2 ? "hidden md:flex" : ""}`}
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                  <Image
                    src={meme.image}
                    alt={meme.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {meme.category}
                  </span>
                </div>

                <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs sm:text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors line-clamp-2">
                    {meme.title}
                  </h3>
                  <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate text-[10px] sm:text-xs">@{meme.author}</span>
                    <span className="flex items-center gap-1 text-rose-500 font-bold shrink-0">
                      <Heart className="w-3 h-3 fill-current" /> {meme.upvotes}
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
