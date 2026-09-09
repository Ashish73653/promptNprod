"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  PenTool, 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Eye, 
  SlidersHorizontal, 
  ArrowLeft, 
  Code, 
  CheckCircle2, 
  Layers
} from "lucide-react";
import { TechCategory, ScorecardRating } from "@/types";
import { ScorecardWidget } from "@/components/ui/ScorecardWidget";

export default function ArticleEditorPage() {
  const [title, setTitle] = useState("Turbopack 2.0: Single-Threaded Bundlers are Dead");
  const [slug, setSlug] = useState("turbopack-2-bundler-revolution");
  const [subtitle, setSubtitle] = useState("Why Rust-powered incremental build engines are transforming web development in 2026.");
  const [category, setCategory] = useState<TechCategory>("Full-Stack");
  const [authorName, setAuthorName] = useState("Alex Vance");
  const [authorRole, setAuthorRole] = useState("Staff Frontend Architect");
  const [readTime, setReadTime] = useState("5 min read");
  const [relevance, setRelevance] = useState(92);
  const [impact, setImpact] = useState(88);
  const [difficulty, setDifficulty] = useState<"Low" | "Medium" | "High">("Low");
  const [hypeIndex, setHypeIndex] = useState(50);
  const [contentMarkdown, setContentMarkdown] = useState(`## Executive Summary
Turbopack 2.0 has completed its multi-year migration to replace Webpack across production Next.js deployments. With sub-10ms local hot module reloading and memory footprint reductions exceeding 70%, developers spend less time waiting for compilers and more time writing code.

## Why It Matters
- Up to 10x faster cold starts on large monorepos.
- Incremental AST caching that persists across dev server restarts.
- Full parity with standard Next.js dynamic routing and font optimization.

## Who Should Care
- Frontend teams frustrated by multi-second HMR delays.
- Monorepo maintainers managing hundreds of components.

## Performance Benchmarks
Cold compilation times for 5,000 components reduced from 14.8 seconds down to 1.9 seconds.

\`\`\`bash
# Enable Turbopack on dev
next dev --turbo

# Production build with Turbopack
next build
\`\`\`

## Actionable Takeaways
- Upgrade to Next.js 16 to get Turbopack enabled by default.
- Audit your Babel plugins to ensure they are compatible with SWC/Turbopack native transformers.`);

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Dynamic scorecard calculation
  const diffPenalty = difficulty === "High" ? 12 : difficulty === "Medium" ? 5 : 0;
  const hypePenalty = hypeIndex > 80 ? 6 : 0;
  const overallScore = Math.max(
    10,
    Math.min(99, Math.round(relevance * 0.45 + impact * 0.45 - diffPenalty - hypePenalty))
  );

  let verdict: ScorecardRating["verdict"] = "Watch & Evaluate";
  if (overallScore >= 90) verdict = "Must Learn";
  else if (overallScore >= 75) verdict = "High Priority";
  else if (overallScore >= 50) verdict = "Watch & Evaluate";
  else verdict = "Niche / Wait";

  const generatedMarkdown = `---
title: "${title}"
slug: "${slug}"
subtitle: "${subtitle}"
category: "${category}"
date: "${new Date().toISOString().split("T")[0]}"
readTime: "${readTime}"
badge: "Curated"
authorName: "${authorName}"
authorRole: "${authorRole}"
authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
relevance: ${relevance}
impact: ${impact}
difficulty: "${difficulty}"
hypeIndex: ${hypeIndex}
overallScore: ${overallScore}
verdict: "${verdict}"
verdictSummary: "${subtitle}"
---

${contentMarkdown}
`;

  const handleDownload = () => {
    const blob = new Blob([generatedMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug || "new-article"}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedMarkdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const previewScorecard: ScorecardRating = {
    relevance,
    impact,
    difficulty,
    hypeIndex,
    overallScore,
    verdict,
    verdictSummary: subtitle,
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-500 mb-1">
              <Link href="/feed" className="hover:underline flex items-center gap-1 text-slate-400">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Feed
              </Link>
              <span>•</span>
              <span className="flex items-center gap-1">
                <PenTool className="w-3.5 h-3.5" /> Checkpoint 2 Content Studio
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Visual Article & Markdown Studio
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Draft technical articles, score them with the decision rubric, and export pure Markdown files directly into <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">content/articles/</code>.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 hover:border-cyan-500 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? "Copied!" : "Copy Markdown"}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold shadow-md shadow-cyan-500/25 flex items-center gap-1.5 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download .md File</span>
            </button>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "edit"
                ? "bg-cyan-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Editor & Metrics
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "preview"
                ? "bg-cyan-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
            }`}
          >
            Live Layout Preview
          </button>
        </div>

        {activeTab === "edit" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Inputs (7 cols) */}
            <div className="lg:col-span-7 space-y-5 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PenTool className="w-4 h-4 text-cyan-500" /> Article Metadata
              </h2>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Article Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (!slug || slug === title.toLowerCase().replace(/[^a-z0-9]+/g, "-")) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
                    }
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as TechCategory)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
                  >
                    <option value="AI & Agents">AI & Agents</option>
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Cloud & Infra">Cloud & Infra</option>
                    <option value="Dev Tools">Dev Tools</option>
                    <option value="Database">Database</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Subtitle / Hook
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Author Name
                  </label>
                  <input
                    type="text"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Author Role
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Read Time
                  </label>
                  <input
                    type="text"
                    value={readTime}
                    onChange={(e) => setReadTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Markdown Body */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                  Markdown Content (Supports ## Headers, - Bullets, and ``` Code Blocks)
                </label>
                <textarea
                  rows={14}
                  value={contentMarkdown}
                  onChange={(e) => setContentMarkdown(e.target.value)}
                  className="w-full p-4 rounded-2xl text-xs sm:text-sm border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] text-slate-800 dark:text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Right Metrics & Scorecard (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-5">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-cyan-500" /> &ldquo;Should I Learn This?&rdquo; Ratings
                </h3>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Relevance:</span>
                    <span className="text-cyan-500 font-mono">{relevance}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={relevance}
                    onChange={(e) => setRelevance(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Impact:</span>
                    <span className="text-emerald-500 font-mono">{impact}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={impact}
                    onChange={(e) => setImpact(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    <span>Hype Index:</span>
                    <span className="text-rose-500 font-mono">{hypeIndex}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hypeIndex}
                    onChange={(e) => setHypeIndex(Number(e.target.value))}
                    className="w-full accent-rose-500"
                  />
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    Difficulty:
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Low", "Medium", "High"] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setDifficulty(lvl)}
                        className={`py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          difficulty === lvl
                            ? "bg-cyan-500 text-white border-cyan-500"
                            : "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Calculated Score:</span>
                  <div className="flex items-center gap-2 font-bold text-sm">
                    <span className="text-cyan-500 font-mono">{overallScore}/100</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500 text-xs">
                      {verdict}
                    </span>
                  </div>
                </div>
              </div>

              {/* Live Scorecard Preview */}
              <ScorecardWidget scorecard={previewScorecard} title={title} />
            </div>
          </div>
        ) : (
          /* Live Article Layout Preview */
          <div className="p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                {category}
              </span>
              <span className="text-xs text-slate-400">• {readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              {title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
              {subtitle}
            </p>

            <div className="pt-2">
              <ScorecardWidget scorecard={previewScorecard} title={title} />
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line font-mono">
              {contentMarkdown}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
