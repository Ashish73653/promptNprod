"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { roadmaps } from "@/data/roadmaps";
import { DifficultyLevel } from "@/types";
import { BookOpen, Bot, Globe, Cpu, ShieldCheck, Clock, CheckCircle, ArrowRight, Filter } from "lucide-react";

export default function LearnPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  const filteredRoadmaps = useMemo(() => {
    if (selectedLevel === "All") return roadmaps;
    return roadmaps.filter((r) => r.level === selectedLevel);
  }, [selectedLevel]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return <Bot className="w-5 h-5 text-cyan-500" />;
      case "Globe":
        return <Globe className="w-5 h-5 text-indigo-500" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" /> Structured Learning
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Developer Learning Roadmaps
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Opinionated, battle-tested curricula designed to take you from foundational concepts to shipping complex AI systems in production. Complete with interactive milestone progress tracking.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Experience Level:
          </span>
          {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRoadmaps.map((roadmap) => (
            <Link
              key={roadmap.id}
              href={`/learn/${roadmap.slug}`}
              className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                    {getIcon(roadmap.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {roadmap.badge}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {roadmap.durationWeeks} weeks
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  {roadmap.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {roadmap.shortDesc}
                </p>

                {/* Target roles */}
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] text-slate-400 mr-1">Target Roles:</span>
                  {roadmap.targetRoles.map((role) => (
                    <span
                      key={role}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 text-xs"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Milestone Summary */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                    Curriculum ({roadmap.milestones.length} Milestones)
                  </span>
                  <div className="space-y-1.5">
                    {roadmap.milestones.map((m, idx) => (
                      <div key={m.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono flex items-center justify-center text-slate-500 shrink-0">
                          {idx + 1}
                        </span>
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" /> Interactive Checkpoints
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1.5 transition-transform text-sm font-bold">
                  Open Interactive Roadmap <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
