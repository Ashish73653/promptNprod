"use client";

import React from "react";
import { ScorecardRating } from "@/types";
import { Award, Zap, AlertTriangle, Flame, CheckCircle, TrendingUp, HelpCircle } from "lucide-react";

interface ScorecardProps {
  scorecard: ScorecardRating;
  title?: string;
  showDetails?: boolean;
}

export function ScorecardWidget({ scorecard, title, showDetails = true }: ScorecardProps) {
  const getVerdictStyle = (verdict: ScorecardRating["verdict"]) => {
    switch (verdict) {
      case "Must Learn":
        return "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/30";
      case "High Priority":
        return "bg-cyan-500/10 text-cyan-500 dark:text-cyan-400 border-cyan-500/30";
      case "Watch & Evaluate":
        return "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/30";
      case "Niche / Wait":
        return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/30";
    }
  };

  const getDifficultyBadge = (difficulty: ScorecardRating["difficulty"]) => {
    switch (difficulty) {
      case "Low":
        return "bg-green-500/10 text-green-500 dark:text-green-400 border-green-500/20";
      case "Medium":
        return "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20";
      case "High":
        return "bg-rose-500/10 text-rose-500 dark:text-rose-400 border-rose-500/20";
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Prompt N Prod Index
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Should I Learn This?
            </span>
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
            {title ? `${title} Evaluation` : "Technology Evaluation Matrix"}
          </h3>
        </div>

        {/* Verdict Badge */}
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-bold flex items-center gap-1.5 ${getVerdictStyle(scorecard.verdict)}`}>
            <CheckCircle className="w-4 h-4" />
            <span>{scorecard.verdict}</span>
          </div>
          <div className="flex flex-col items-center justify-center px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Index</span>
            <span className="text-base font-extrabold text-cyan-600 dark:text-cyan-400 leading-none">
              {scorecard.overallScore}<span className="text-[10px] text-slate-400">/100</span>
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-5">
        {/* Metric 1: Relevance */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-cyan-500" /> Relevance
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{scorecard.relevance}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${scorecard.relevance}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Market demand & utility</span>
        </div>

        {/* Metric 2: Impact */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Impact
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{scorecard.impact}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${scorecard.impact}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Productivity boost</span>
        </div>

        {/* Metric 3: Difficulty */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Curve
            </span>
          </div>
          <div className="my-auto">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold border inline-block ${getDifficultyBadge(scorecard.difficulty)}`}>
              {scorecard.difficulty} Difficulty
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Time to proficiency</span>
        </div>

        {/* Metric 4: Hype Index */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Hype vs Reality
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-200">{scorecard.hypeIndex}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div
              className="h-full bg-rose-500 rounded-full transition-all duration-500"
              style={{ width: `${scorecard.hypeIndex}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-400 block mt-1">Twitter hype ratio</span>
        </div>
      </div>

      {/* Summary Box */}
      {showDetails && (
        <div className="p-3.5 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2.5">
          <HelpCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold text-slate-900 dark:text-white mr-1">
              Editorial Takeaway:
            </strong>
            {scorecard.verdictSummary}
          </div>
        </div>
      )}
    </div>
  );
}
