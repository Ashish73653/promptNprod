"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Sparkles, ArrowRight, Zap, TrendingUp, AlertTriangle, Flame, CheckCircle, RotateCcw } from "lucide-react";
import { ScorecardRating } from "@/types";

const presets: { name: string; scorecard: ScorecardRating }[] = [
  {
    name: "Model Context Protocol (MCP)",
    scorecard: {
      relevance: 95,
      impact: 92,
      difficulty: "Medium",
      hypeIndex: 78,
      overallScore: 92,
      verdict: "Must Learn",
      verdictSummary: "MCP is rapidly becoming the standardized open protocol for LLM tool use and agents. High industry leverage.",
    },
  },
  {
    name: "DeepSeek Reasoning (R1)",
    scorecard: {
      relevance: 98,
      impact: 97,
      difficulty: "Low",
      hypeIndex: 85,
      overallScore: 96,
      verdict: "Must Learn",
      verdictSummary: "Open-weights reasoning unlocks cheap local inference and advanced thinking tokens for developer workflows.",
    },
  },
  {
    name: "WebAssembly AI (Wasm)",
    scorecard: {
      relevance: 62,
      impact: 74,
      difficulty: "High",
      hypeIndex: 55,
      overallScore: 68,
      verdict: "Watch & Evaluate",
      verdictSummary: "Promising for in-browser client inference and edge sandboxing, but tooling and memory limitations remain.",
    },
  },
];

export function InteractiveScorecardDemo() {
  const [activePreset, setActivePreset] = useState<string>(presets[0].name);
  const [relevance, setRelevance] = useState<number>(presets[0].scorecard.relevance);
  const [impact, setImpact] = useState<number>(presets[0].scorecard.impact);
  const [hype, setHype] = useState<number>(presets[0].scorecard.hypeIndex);
  const [difficulty, setDifficulty] = useState<"Low" | "Medium" | "High">(presets[0].scorecard.difficulty);

  const applyPreset = (presetName: string) => {
    const item = presets.find((p) => p.name === presetName);
    if (!item) return;
    setActivePreset(item.name);
    setRelevance(item.scorecard.relevance);
    setImpact(item.scorecard.impact);
    setHype(item.scorecard.hypeIndex);
    setDifficulty(item.scorecard.difficulty);
  };

  // Compute overall index dynamically
  const diffPenalty = difficulty === "High" ? 12 : difficulty === "Medium" ? 5 : 0;
  const hypePenalty = hype > 80 ? 5 : 0;
  const calculatedScore = Math.max(
    10,
    Math.min(99, Math.round(relevance * 0.45 + impact * 0.45 - diffPenalty - hypePenalty))
  );

  let verdict: ScorecardRating["verdict"] = "Watch & Evaluate";
  if (calculatedScore >= 90) verdict = "Must Learn";
  else if (calculatedScore >= 75) verdict = "High Priority";
  else if (calculatedScore >= 50) verdict = "Watch & Evaluate";
  else verdict = "Niche / Wait";

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Interactive Evaluation Tool
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            The &ldquo;Should I Learn This?&rdquo; Calculator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            Test drive our objective rating engine. Evaluate any emerging framework or AI tool against market relevance, utility, learning curve, and Twitter hype.
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-slate-400 font-semibold mr-1">Load Preset:</span>
          {presets.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p.name)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activePreset === p.name
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-cyan-500/40"
              }`}
            >
              {p.name}
            </button>
          ))}
          <button
            onClick={() => {
              setActivePreset("Custom");
              setRelevance(80);
              setImpact(80);
              setHype(50);
              setDifficulty("Medium");
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>

        {/* Main Calculator Box */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Slider 1: Relevance */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-cyan-500" /> Market Relevance & Utility
                  </span>
                  <span className="font-mono text-cyan-600 dark:text-cyan-400">{relevance}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={relevance}
                  onChange={(e) => {
                    setRelevance(Number(e.target.value));
                    setActivePreset("Custom");
                  }}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Slider 2: Impact */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-500" /> Real-World Impact & Leverage
                  </span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{impact}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={impact}
                  onChange={(e) => {
                    setImpact(Number(e.target.value));
                    setActivePreset("Custom");
                  }}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Slider 3: Hype */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-rose-500" /> Hype-to-Substance Ratio
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">{hype}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={hype}
                  onChange={(e) => {
                    setHype(Number(e.target.value));
                    setActivePreset("Custom");
                  }}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* Toggle: Difficulty */}
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" /> Learning Curve & Complexity
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(["Low", "Medium", "High"] as const).map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => {
                        setDifficulty(lvl);
                        setActivePreset("Custom");
                      }}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                        difficulty === lvl
                          ? "bg-amber-500/15 border-amber-500 text-amber-600 dark:text-amber-400"
                          : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Verdict Output (5 cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-800/80 dark:to-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-center flex flex-col justify-between items-center shadow-inner">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Calculated Rating
              </span>

              <div className="my-4">
                <div className="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight">
                  {calculatedScore}
                  <span className="text-lg text-slate-400 font-normal">/100</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                  <CheckCircle className="w-4 h-4" />
                  <span>Verdict: {verdict}</span>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                {verdict === "Must Learn"
                  ? "Immediate adoption candidate with transformative productivity and career upside."
                  : verdict === "High Priority"
                  ? "Strong foundational asset with proven real-world adoption patterns."
                  : verdict === "Watch & Evaluate"
                  ? "High potential, but evaluate whether it solves your specific bottleneck before refactoring."
                  : "Niche use-case or early prototype. Safe to wait for API stability."}
              </p>

              <Link
                href="/scorecard"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                <span>Open Full Evaluation Guide</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
