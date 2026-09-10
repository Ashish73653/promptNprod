"use client";

import React, { useState, useEffect } from "react";
import { Heart, Sparkles, ThumbsUp } from "lucide-react";

interface ReactionButtonProps {
  targetId: string;
  targetType: "note" | "article" | "meme";
  initialCount?: number;
  label?: string;
  className?: string;
}

export function ReactionButton({
  targetId,
  targetType,
  initialCount = 0,
  label = "Helpful",
  className = "",
}: ReactionButtonProps) {
  const [count, setCount] = useState<number>(initialCount);
  const [hasReacted, setHasReacted] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);

  // Load reaction status from Neon DB
  useEffect(() => {
    let userId = "";
    try {
      userId = localStorage.getItem("pnp_anon_user_id") || "";
      if (!userId) {
        userId = "anon-" + Math.random().toString(36).substring(2, 11);
        localStorage.setItem("pnp_anon_user_id", userId);
      }
    } catch {
      // Ignore
    }

    async function checkStatus() {
      try {
        const res = await fetch(
          `/api/reactions?targetId=${encodeURIComponent(targetId)}&userIdentifier=${encodeURIComponent(userId)}`
        );
        const data = await res.json();
        if (data.success) {
          if (data.count !== undefined && data.count > 0) {
            setCount(data.count);
          }
          if (data.hasReacted) {
            setHasReacted(true);
          }
        }
      } catch (err) {
        console.error("Failed to load reaction:", err);
      }
    }

    checkStatus();
  }, [targetId]);

  const handleReact = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (hasReacted) return;

    // Optimistic UI update
    setCount((prev) => prev + 1);
    setHasReacted(true);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 700);

    let userId = "";
    try {
      userId = localStorage.getItem("pnp_anon_user_id") || "";
    } catch {
      // Ignore
    }

    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId,
          targetType,
          reactionType: "upvote",
          userIdentifier: userId,
        }),
      });
      const data = await res.json();
      if (data.success && data.count !== undefined) {
        setCount(data.count);
      }
    } catch (err) {
      console.error("Failed to submit reaction:", err);
    }
  };

  return (
    <button
      onClick={handleReact}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={hasReacted}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none ${
        hasReacted
          ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 cursor-default"
          : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-rose-500/30 active:scale-95"
      } ${animating ? "scale-105" : ""} ${className}`}
      title={hasReacted ? "You upvoted this note (Saved in Neon DB)" : "Upvote this note"}
    >
      <Heart
        className={`w-4 h-4 transition-transform duration-200 ${
          hasReacted
            ? "fill-rose-500 text-rose-500 scale-110"
            : isHovered
            ? "text-rose-500 scale-110"
            : "text-slate-400"
        } ${animating ? "animate-bounce" : ""}`}
      />
      <span>
        {hasReacted ? "Upvoted" : label}
      </span>
      <span
        className={`px-1.5 py-0.5 rounded-full text-[11px] font-mono font-bold ${
          hasReacted
            ? "bg-rose-500 text-white"
            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
