"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Send, User, Sparkles, Loader2, Clock } from "lucide-react";

interface CommentItem {
  id: number;
  authorName: string;
  authorRole: string;
  content: string;
  createdAt: string;
}

interface CommentsSectionProps {
  targetId: string;
  targetType?: "note" | "article" | "roadmap";
  title?: string;
}

export function CommentsSection({
  targetId,
  targetType = "note",
  title = "Community Discussion",
}: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>("");
  const [authorRole, setAuthorRole] = useState<string>("Developer");
  const [content, setContent] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Restore saved author from localStorage
  useEffect(() => {
    try {
      const savedName = localStorage.getItem("pnp_author_name");
      if (savedName) setAuthorName(savedName);
      const savedRole = localStorage.getItem("pnp_author_role");
      if (savedRole) setAuthorRole(savedRole);
    } catch {
      // Ignore
    }
  }, []);

  // Fetch comments from Neon DB
  useEffect(() => {
    async function loadComments() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/comments?targetId=${encodeURIComponent(targetId)}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.comments)) {
          setComments(data.comments);
        }
      } catch (err) {
        console.error("Failed to load comments:", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadComments();
  }, [targetId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !content.trim()) {
      setError("Please provide your name and a comment.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId,
          targetType,
          authorName: authorName.trim(),
          authorRole: authorRole.trim() || "Developer",
          content: content.trim(),
        }),
      });

      const data = await res.json();

      if (data.success && data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setContent("");

        // Remember user credentials in localStorage
        try {
          localStorage.setItem("pnp_author_name", authorName.trim());
          localStorage.setItem("pnp_author_role", authorRole.trim() || "Developer");
        } catch {
          // Ignore
        }
      } else {
        setError(data.message || "Could not save your comment.");
      }
    } catch (err) {
      console.error("Failed to post comment:", err);
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Persisted live to Neon Serverless PostgreSQL
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
          {comments.length} {comments.length === 1 ? "thought" : "thoughts"}
        </span>
      </div>

      {/* Comment Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-3"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Role / Title (Optional)
            </label>
            <input
              type="text"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="e.g. AI Engineer / Student"
              className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Share Your Insight or Question *
          </label>
          <textarea
            required
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What questions do you have about this architecture? Or share how you solved it..."
            className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-500 font-semibold">{error}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            Zero login required • Instant cloud sync
          </span>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Post Thought</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Existing Comments List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse bg-slate-100 dark:bg-slate-900/40 h-24"
            />
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No thoughts yet.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Be the first to share your perspective or ask a question on this note!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 animate-in fade-in"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                    {comment.authorName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {comment.authorName}
                    </h4>
                    <p className="text-[11px] text-cyan-600 dark:text-cyan-400 font-medium">
                      {comment.authorRole}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <Clock className="w-3 h-3" />
                  {new Date(comment.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-10 whitespace-pre-line">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
