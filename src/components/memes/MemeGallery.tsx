"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Meme } from "@/types";
import { 
  Heart, 
  Share2, 
  Check, 
  X, 
  Sparkles, 
  Filter, 
  Upload, 
  RefreshCw, 
  Radio, 
  Loader2,
  ChevronDown
} from "lucide-react";
import { SubmitMemeModal } from "./SubmitMemeModal";

interface MemeGalleryProps {
  initialMemes?: Meme[];
}

export function MemeGallery({ initialMemes = [] }: MemeGalleryProps) {
  const [allMemes, setAllMemes] = useState<Meme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMeme, setActiveMeme] = useState<Meme | null>(null);
  const [upvoteMap, setUpvoteMap] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  // Helper to fetch Neon DB memes
  const fetchNeonMemes = useCallback(async () => {
    try {
      const res = await fetch("/api/memes?limit=30");
      const data = await res.json();
      if (data.success && Array.isArray(data.memes)) {
        return data.memes as Meme[];
      }
    } catch (err) {
      console.error("Neon fetch error:", err);
    }
    return [];
  }, []);

  // Helper to sync from Reddit
  const fetchRedditMemes = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsLoadingMore(true);
    } else {
      setIsSyncing(true);
    }

    try {
      const res = await fetch(`/api/memes/reddit?count=${isLoadMore ? 18 : 15}`);
      const data = await res.json();

      if (data.success && data.memes?.length > 0) {
        const incoming: Meme[] = data.memes;

        setAllMemes((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const uniqueIncoming = incoming.filter((m) => !existingIds.has(m.id));

          if (isLoadMore && uniqueIncoming.length === 0) {
            setSyncNotice("All caught up! Showing latest developer memes.");
            return prev;
          }

          const combined = isLoadMore ? [...prev, ...uniqueIncoming] : [...uniqueIncoming, ...prev.filter(m => m.id.startsWith("neon-") || m.id.startsWith("community-"))];

          if (isLoadMore) {
            setSyncNotice(`Loaded ${uniqueIncoming.length} more trending memes!`);
          } else {
            setSyncNotice(`Auto-synced ${uniqueIncoming.length} fresh memes from r/ProgrammerHumor!`);
          }

          return combined;
        });
      }
    } catch (err) {
      console.error("Auto-sync error:", err);
      if (isLoadMore) {
        setSyncNotice("Could not load more memes right now.");
      }
    } finally {
      setIsSyncing(false);
      setIsLoadingMore(false);
      setInitialLoading(false);
      setTimeout(() => setSyncNotice(null), 4500);
    }
  }, []);

  // Initial load: fetch from Neon DB and Reddit
  useEffect(() => {
    const initLoad = async () => {
      // 1. Restore local votes & counts
      try {
        const savedVotes = localStorage.getItem("pnp_user_meme_votes");
        if (savedVotes) setUserVoted(JSON.parse(savedVotes));

        const savedCounts = localStorage.getItem("pnp_meme_counts");
        if (savedCounts) setUpvoteMap(JSON.parse(savedCounts));
      } catch {
        // Fallback
      }

      // 2. Fetch live memes from Neon Cloud DB
      const neonMemes = await fetchNeonMemes();

      // 3. Fetch fresh Reddit memes
      try {
        const res = await fetch("/api/memes/reddit?count=15");
        const data = await res.json();
        const redditMemes: Meme[] = (data.success && data.memes) || [];

        // Combine: Neon community memes at top, then Reddit
        const combined = [...neonMemes, ...redditMemes];
        if (combined.length > 0) {
          setAllMemes(combined);
        }
      } catch (err) {
        if (neonMemes.length > 0) {
          setAllMemes(neonMemes);
        }
      } finally {
        setInitialLoading(false);
      }
    };

    initLoad();
  }, [fetchNeonMemes]);

  // Synchronize upvotes map when allMemes changes
  useEffect(() => {
    setUpvoteMap((prev) => {
      const next = { ...prev };
      allMemes.forEach((m) => {
        if (next[m.id] === undefined) {
          next[m.id] = m.upvotes;
        }
      });
      return next;
    });
  }, [allMemes]);

  const handleUpvote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const hasVoted = userVoted[id];
    const currentCount = upvoteMap[id] || 0;
    const newCount = hasVoted ? Math.max(0, currentCount - 1) : currentCount + 1;
    const newVoted = { ...userVoted, [id]: !hasVoted };

    const updatedCounts = { ...upvoteMap, [id]: newCount };
    setUpvoteMap(updatedCounts);
    setUserVoted(newVoted);

    try {
      localStorage.setItem("pnp_user_meme_votes", JSON.stringify(newVoted));
      localStorage.setItem("pnp_meme_counts", JSON.stringify(updatedCounts));

      let userId = localStorage.getItem("pnp_anon_user_id");
      if (!userId) {
        userId = "anon-" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("pnp_anon_user_id", userId);
      }

      // Persist to Neon database
      if (!hasVoted) {
        await fetch("/api/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            targetId: id,
            targetType: "meme",
            reactionType: "upvote",
            userIdentifier: userId,
          }),
        });
      }
    } catch {
      // Ignore
    }
  };

  const handleShare = (meme: Meme, e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${window.location.origin}/memes#${meme.id}`);
      setCopiedId(meme.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleMemeSubmitted = (newMeme: Meme) => {
    const updated = [newMeme, ...allMemes];
    setAllMemes(updated);
    setUpvoteMap((prev) => ({ ...prev, [newMeme.id]: newMeme.upvotes || 1 }));
    setUserVoted((prev) => ({ ...prev, [newMeme.id]: true }));

    setSyncNotice("Your meme was saved to Neon Cloud DB and is live in the feed!");
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const categories = ["All", "Production", "AI Hype", "Frontend/CSS", "Junior vs Senior"];

  const filteredMemes = selectedCategory === "All"
    ? allMemes
    : allMemes.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live Auto-Sync Status & Community Submit */}
        <div className="flex items-center gap-2.5">
          {/* Neon Postgres DB indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Neon DB Live</span>
          </div>

          {/* Live Sync Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>r/ProgrammerHumor</span>
            <button
              onClick={() => fetchRedditMemes(false)}
              disabled={isSyncing}
              title="Refresh live Reddit feed"
              className="p-1 hover:bg-orange-500/20 rounded-md transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
            </button>
          </div>

          <button
            onClick={() => setIsSubmitOpen(true)}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold shadow-md shadow-rose-500/20 flex items-center gap-1.5 transition-all hover:scale-[1.02]"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit a Meme</span>
          </button>
        </div>
      </div>

      {/* Sync / Submission Notification Notice */}
      {syncNotice && (
        <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-150">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{syncNotice}</span>
        </div>
      )}

      {/* Initial Loading Skeletons */}
      {initialLoading && allMemes.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="glass-card rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between"
            >
              <div className="aspect-video w-full bg-slate-200 dark:bg-slate-800" />
              <div className="p-5 space-y-3">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-16" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-12" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filteredMemes.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            No memes found in this category.
          </p>
          <button
            onClick={() => setSelectedCategory("All")}
            className="mt-3 text-xs font-semibold text-rose-500 hover:underline"
          >
            Show All Categories
          </button>
        </div>
      ) : (
        <>
          {/* Memes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMemes.map((meme) => {
              const isVoted = userVoted[meme.id];
              const count = upvoteMap[meme.id] ?? meme.upvotes;
              const isCommunity = meme.id.startsWith("community-");
              const isReddit = meme.id.startsWith("reddit-");

              return (
                <div
                  key={meme.id}
                  id={meme.id}
                  onClick={() => setActiveMeme(meme)}
                  className="glass-card rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between"
                >
                  {/* Image preview */}
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                    <Image
                      src={meme.image}
                      alt={meme.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/75 backdrop-blur-md text-white border border-white/20">
                        {meme.category}
                      </span>
                      {isCommunity && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-500/80 backdrop-blur-md text-white">
                          Community
                        </span>
                      )}
                      {isReddit && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-orange-600/80 backdrop-blur-md text-white">
                          Reddit
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                        {meme.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 italic leading-relaxed">
                        &ldquo;{meme.caption}&rdquo;
                      </p>
                    </div>

                    {/* Footer bar */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        by @{meme.author}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Share button */}
                        <button
                          onClick={(e) => handleShare(meme, e)}
                          title="Copy link to meme"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          {copiedId === meme.id ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Share2 className="w-4 h-4" />
                          )}
                        </button>

                        {/* Upvote button */}
                        <button
                          onClick={(e) => handleUpvote(meme.id, e)}
                          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${
                            isVoted
                              ? "bg-rose-500/10 text-rose-500 border-rose-500/30"
                              : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-rose-500/40 hover:text-rose-500"
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isVoted ? "fill-current" : ""}`} />
                          <span>{count}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Load More Button */}
          <div className="flex justify-center pt-8 pb-4">
            <button
              onClick={() => fetchRedditMemes(true)}
              disabled={isLoadingMore || isSyncing}
              className="px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:border-rose-500/50 hover:text-rose-500 shadow-md hover:shadow-rose-500/10 transition-all flex items-center gap-2.5 disabled:opacity-50"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 text-rose-500 animate-spin" />
                  <span>Fetching More Dev Memes...</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-rose-500" />
                  <span>Load More Memes</span>
                </>
              )}
            </button>
          </div>
        </>
      )}

      {/* Lightbox Modal */}
      {activeMeme && (
        <div
          onClick={() => setActiveMeme(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d121d] shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-500">
                  {activeMeme.category}
                </span>
                <h3 className="font-bold text-slate-900 dark:text-white text-base truncate max-w-md">
                  {activeMeme.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveMeme(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <Image
                src={activeMeme.image}
                alt={activeMeme.title}
                fill
                className="object-contain"
              />
            </div>

            <div className="p-5 space-y-3">
              <p className="text-base text-slate-800 dark:text-slate-200 italic font-medium">
                &ldquo;{activeMeme.caption}&rdquo;
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex flex-wrap gap-1.5">
                  {activeMeme.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">by @{activeMeme.author}</span>
                  <button
                    onClick={(e) => handleUpvote(activeMeme.id, e)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{upvoteMap[activeMeme.id] ?? activeMeme.upvotes} Upvotes</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Community Meme Submission Modal */}
      <SubmitMemeModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitMeme={handleMemeSubmitted}
      />
    </div>
  );
}
