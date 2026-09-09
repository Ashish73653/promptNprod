"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  SlidersHorizontal, 
  Award, 
  Zap, 
  TrendingUp, 
  AlertTriangle, 
  Flame, 
  CheckCircle, 
  RotateCcw, 
  Copy, 
  Check, 
  BookOpen, 
  Sparkles,
  ArrowRight
} from "lucide-react";
import { ScorecardRating } from "@/types";
import { ScorecardWidget } from "@/components/ui/ScorecardWidget";
import { articles } from "@/data/articles";

export default function ScorecardPage() {
  const [techName, setTechName] = useState("My Tech Choice");
  const [relevance, setRelevance] = useState(85);
  const [impact, setImpact] = useState(80);
  const [hype, setHype] = useState(50);
  const [difficulty, setDifficulty] = useState<"Low" | "Medium" | "High">("Medium");
  const [copied, setCopied] = useState(false);

  // Compute overall score dynamically
  const diffPenalty = difficulty === "High" ? 12 : difficulty === "Medium" ? 5 : 0;
  const hypePenalty = hype > 80 ? 6 : 0;
  const overallScore = Math.max(
    10,
    Math.min(99, Math.round(relevance * 0.45 + impact * 0.45 - diffPenalty - hypePenalty))
  );

  let verdict: ScorecardRating["verdict"] = "Watch & Evaluate";
  let summary = "";

  if (overallScore >= 90) {
    verdict = "Must Learn";
    summary = "Immediate high leverage. High architectural utility and market momentum make this an essential investment.";
  } else if (overallScore >= 75) {
    verdict = "High Priority";
    summary = "Proven real-world benefits. Strong addition to your technical toolbox for production systems.";
  } else if (overallScore >= 50) {
    verdict = "Watch & Evaluate";
    summary = "Shows high promise, but consider whether it solves your explicit operational bottlenecks before committing.";
  } else {
    verdict = "Niche / Wait";
    summary = "High hype or specialized niche. Waiting for ecosystem maturity or standard APIs is the pragmatic choice.";
  }

  const generatedScorecard: ScorecardRating = {
    relevance,
    impact,
    difficulty,
    hypeIndex: hype,
    overallScore,
    verdict,
    verdictSummary: summary,
  };

  const handleCopySummary = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(
        `Prompt N Prod Index for ${techName}:\nVerdict: ${verdict} (${overallScore}/100)\nRelevance: ${relevance}%, Impact: ${impact}%, Difficulty: ${difficulty}, Hype: ${hype}%\n${summary}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" /> Decision Intelligence
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            &ldquo;Should I Learn This?&rdquo; Scorecard
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Developer time is your most precious asset. Use our multi-dimensional evaluation rubric to decide whether to learn, adopt, or ignore any new framework, library, or AI model.
          </p>
        </div>

        {/* Two-Column Interactive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
          {/* Controls Column (6 cols) */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Evaluate Any Technology
            </h2>

            {/* Tech Name Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Technology / Library Name
              </label>
              <input
                type="text"
                value={techName}
                onChange={(e) => setTechName(e.target.value)}
                placeholder="e.g. Bun, LangGraph, WebAssembly..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-semibold focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Slider 1: Relevance */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-500" /> Market Relevance (0-100)
                </span>
                <span className="font-mono text-cyan-500">{relevance}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={relevance}
                onChange={(e) => setRelevance(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Is the industry adopting this in real production workloads?
              </p>
            </div>

            {/* Slider 2: Impact */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-500" /> Engineering Impact (0-100)
                </span>
                <span className="font-mono text-emerald-500">{impact}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={impact}
                onChange={(e) => setImpact(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Does it dramatically increase velocity, reduce bugs, or unlock new capabilities?
              </p>
            </div>

            {/* Slider 3: Hype */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-rose-500" /> Hype vs Reality Index (0-100)
                </span>
                <span className="font-mono text-rose-500">{hype}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={hype}
                onChange={(e) => setHype(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Higher scores penalize technologies driven solely by influencer threads without benchmarks.
              </p>
            </div>

            {/* Difficulty Toggle */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Learning Curve & Friction
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Low", "Medium", "High"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDifficulty(lvl)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
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

            {/* Reset */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setTechName("My Tech Choice");
                  setRelevance(85);
                  setImpact(80);
                  setHype(50);
                  setDifficulty("Medium");
                }}
                className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset all metrics
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:border-cyan-500 transition-colors border border-slate-200 dark:border-slate-700"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Summary
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Realtime Result Scorecard (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            <ScorecardWidget scorecard={generatedScorecard} title={techName} />

            {/* Editorial Matrix Explainer */}
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/40">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
                How Prompt N Prod Computes the Score
              </h3>
              <div className="space-y-3 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <p>
                  <strong>Score Formula:</strong> <code className="font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">0.45 × Relevance + 0.45 × Impact - Difficulty Penalty - Hype Penalty</code>
                </p>
                <p>
                  <strong>Must Learn (90+):</strong> Critical shift. Early adoption creates outsized career and product advantages.
                </p>
                <p>
                  <strong>High Priority (75-89):</strong> Solid architectural investment. Incorporate into your next project or sprint.
                </p>
                <p>
                  <strong>Watch & Evaluate (50-74):</strong> High potential, but wait for stable ecosystem tooling and clear benchmarks.
                </p>
                <p>
                  <strong>Niche / Wait (&lt;50):</strong> Experimental or hyper-specific. High probability of breaking changes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Existing Vetted Technologies */}
        <section className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Recently Evaluated Technologies
              </h3>
              <p className="text-xs text-slate-500">
                Editorial scorecards published with our Tech Radar reports.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <Link
                key={a.id}
                href={`/feed/${a.slug}`}
                className="glass-card rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                      {a.category}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-500">
                      {a.scorecard.overallScore}/100
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                    {a.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {a.scorecard.verdictSummary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-cyan-600 dark:text-cyan-400 font-semibold">
                  <span>Verdict: {a.scorecard.verdict}</span>
                  <span className="flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                    Read Report <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
