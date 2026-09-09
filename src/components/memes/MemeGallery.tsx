"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Meme } from "@/types";
import { Heart, Share2, Check, X, Sparkles, Filter, Upload, RefreshCw, Radio } from "lucide-react";
import { SubmitMemeModal } from "./SubmitMemeModal";

interface MemeGalleryProps {
  initialMemes: Meme[];
}

export function MemeGallery({ initialMemes }: MemeGalleryProps) {
  const [allMemes, setAllMemes] = useState<Meme[]>(initialMemes);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeMeme, setActiveMeme] = useState<Meme | null>(null);
  const [upvoteMap, setUpvoteMap] = useState<Record<string, number>>({});
  const [userVoted, setUserVoted] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isSyncingReddit, setIsSyncingReddit] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  useEffect(() => {
    // Load community memes from localStorage
    let combined = [...initialMemes];
    try {
      const communitySaved = localStorage.getItem("pnp_community_memes");
      if (communitySaved) {
        const communityList: Meme[] = JSON.parse(communitySaved);
        combined = [...communityList, ...combined];
      }
    } catch {
      // Fallback
    }

    setAllMemes(combined);

    // Initialize upvotes
    const map: Record<string, number> = {};
    combined.forEach((m) => {
      map[m.id] = m.upvotes;
    });

    try {
      const savedVotes = localStorage.getItem("pnp_user_meme_votes");
      if (savedVotes) {
        setUserVoted(JSON.parse(savedVotes));
      }
      const savedCounts = localStorage.getItem("pnp_meme_counts");
      if (savedCounts) {
        setUpvoteMap({ ...map, ...JSON.parse(savedCounts) });
      } else {
        setUpvoteMap(map);
      }
    } catch {
      setUpvoteMap(map);
    }
  }, [initialMemes]);

  const handleUpvote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const hasVoted = userVoted[id];
    const currentCount = upvoteMap[id] || 0;
    const newCount = hasVoted ? currentCount - 1 : currentCount + 1;
    const newVoted = { ...userVoted, [id]: !hasVoted };

    const updatedCounts = { ...upvoteMap, [id]: newCount };
    setUpvoteMap(updatedCounts);
    setUserVoted(newVoted);

    try {
      localStorage.setItem("pnp_user_meme_votes", JSON.stringify(newVoted));
      localStorage.setItem("pnp_meme_counts", JSON.stringify(updatedCounts));
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
    setUpvoteMap((prev) => ({ ...prev, [newMeme.id]: 1 }));
    setUserVoted((prev) => ({ ...prev, [newMeme.id]: true }));

    try {
      const saved = localStorage.getItem("pnp_community_memes");
      const list: Meme[] = saved ? JSON.parse(saved) : [];
      localStorage.setItem("pnp_community_memes", JSON.stringify([newMeme, ...list]));
    } catch {
      // Ignore
    }

    setSyncNotice("Your meme was submitted and is now visible in the community feed!");
    setTimeout(() => setSyncNotice(null), 4000);
  };

  const handleSyncReddit = async () => {
    setIsSyncingReddit(true);
    setSyncNotice(null);
    try {
      const res = await fetch("/api/memes/reddit");
      const data = await res.json();
      if (data.success && data.memes?.length > 0) {
        // Deduplicate against existing memes
        const existingIds = new Set(allMemes.map((m) => m.id));
        const fresh = (data.memes as Meme[]).filter((m) => !existingIds.has(m.id));

        if (fresh.length > 0) {
          const merged = [...fresh, ...allMemes];
          setAllMemes(merged);
          setSyncNotice(`Synced ${fresh.length} fresh developer memes from r/ProgrammerHumor!`);
        } else {
          setSyncNotice("You already have the latest trending memes from Reddit!");
        }
      } else {
        setSyncNotice("Reddit feed returned no new items. Try again shortly.");
      }
    } catch {
      setSyncNotice("Could not reach Reddit feed right now.");
    } finally {
      setIsSyncingReddit(false);
      setTimeout(() => setSyncNotice(null), 5000);
    }
  };

  const categories = ["All", "Production", "AI Hype", "Frontend/CSS", "Junior vs Senior"];

  const filteredMemes = selectedCategory === "All"
    ? allMemes
    : allMemes.filter((m) => m.category === selectedCategory);

  return (
    <div className="space-y-8">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
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

        {/* Action Buttons: Submit & Reddit Sync */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleSyncReddit}
            disabled={isSyncingReddit}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:border-orange-500/50 hover:text-orange-500 flex items-center gap-1.5 transition-all disabled:opacity-50"
            title="Auto-pull fresh memes from r/ProgrammerHumor"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-orange-500 ${isSyncingReddit ? "animate-spin" : ""}`} />
            <span>{isSyncingReddit ? "Syncing..." : "Sync Reddit"}</span>
          </button>

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
