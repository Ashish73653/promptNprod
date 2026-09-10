"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { roadmaps } from "@/data/roadmaps";
import { Bot, Globe, Cpu, ShieldCheck, Clock, ArrowRight, Filter, Sparkles, Layers, Code2 } from "lucide-react";

export default function RoadmapsPage() {
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
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Engineering Curricula</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Interactive Roadmaps &amp; Projects
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Opinionated engineering tracks where each milestone pairs foundational concepts with a real, hands-on production project to build.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Level:
          </span>
          {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedLevel === lvl
                  ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredRoadmaps.map((r) => {
            const projectCount = r.milestones.filter(m => m.projectBlueprint).length;
            return (
              <div
                key={r.id}
                className="glass-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60">
                        {getIcon(r.iconName)}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {r.level}
                      </span>
                    </div>

                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> ~{r.durationWeeks} weeks
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {r.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {r.shortDesc}
                  </p>

                  {/* Highlights Bar */}
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{r.milestones.length} Milestones</span>
                    </div>
                    {projectCount > 0 && (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{projectCount} Interactive Projects</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Interactive Checklist &amp; Blueprints</span>
                  <Link
                    href={`/roadmaps/${r.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold shadow-sm group-hover:shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                  >
                    <span>View Roadmap</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
