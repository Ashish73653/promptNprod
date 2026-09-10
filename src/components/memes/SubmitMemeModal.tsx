"use client";

import React, { useState } from "react";
import { Meme } from "@/types";
import { X, Upload, Sparkles, AlertCircle, Loader2 } from "lucide-react";

interface SubmitMemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitMeme: (newMeme: Meme) => void;
}

export function SubmitMemeModal({ isOpen, onClose, onSubmitMeme }: SubmitMemeModalProps) {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<Meme["category"]>("Production");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim() || !caption.trim()) {
      setError("Please provide a title, caption, and a valid image URL.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Persist directly to Neon PostgreSQL database
      const response = await fetch("/api/memes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          imageUrl: imageUrl.trim(),
          author: author.trim() || "DevContributor",
          subreddit: category,
        }),
      });

      const data = await response.json();

      if (data.success && data.meme) {
        // Use live meme from Neon DB
        const liveMeme: Meme = {
          ...data.meme,
          caption: caption.trim(),
          category,
        };
        onSubmitMeme(liveMeme);
      } else {
        // Fallback optimistic
        const fallbackMeme: Meme = {
          id: `community-${Date.now()}`,
          title: title.trim(),
          caption: caption.trim(),
          image: imageUrl.trim(),
          category,
          author: author.trim() || "DevContributor",
          upvotes: 1,
          tags: ["Community", "Local"],
        };
        onSubmitMeme(fallbackMeme);
      }

      onClose();
    } catch (err) {
      console.error("Failed to post meme:", err);
      // Fallback
      const fallbackMeme: Meme = {
        id: `community-${Date.now()}`,
        title: title.trim(),
        caption: caption.trim(),
        image: imageUrl.trim(),
        category,
        author: author.trim() || "DevContributor",
        upvotes: 1,
        tags: ["Community", "Offline"],
      };
      onSubmitMeme(fallbackMeme);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-2xl p-6 sm:p-7 overflow-y-auto max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-500 mb-0.5">
              <Sparkles className="w-3.5 h-3.5" /> Neon Cloud Database
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Submit a Developer Meme
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Meme Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. When the unit tests pass on prod"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Caption / Punchline *
            </label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. 'I didn't even write tests for that endpoint...'"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Meme["category"])}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="Production">Production</option>
                <option value="AI Hype">AI Hype</option>
                <option value="Frontend/CSS">Frontend/CSS</option>
                <option value="Junior vs Senior">Junior vs Senior</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Your Handle (Optional)
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. CodeNinja"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              Image URL *
            </label>
            <input
              type="url"
              required
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://... (Direct image link from Imgur, Reddit, Unsplash)"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 transition-colors font-mono"
            />
          </div>

          {/* Real-time Image Preview */}
          {imageUrl && !previewError && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 p-2 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Live Image Preview
              </span>
              <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Meme preview"
                  onError={() => setPreviewError(true)}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}

          {previewError && (
            <p className="text-xs text-amber-500">
              Note: Could not preview image directly, but you can still submit.
            </p>
          )}

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-500/25 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Neon DB...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Publish to Neon DB</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
