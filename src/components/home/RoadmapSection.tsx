"use client";

import React from "react";
import Link from "next/link";
import { Roadmap } from "@/types";
import { ArrowRight, BookOpen, Bot, Globe, Cpu, ShieldCheck, Clock, CheckCircle } from "lucide-react";

interface RoadmapSectionProps {
  roadmaps: Roadmap[];
}

export function RoadmapSection({ roadmaps }: RoadmapSectionProps) {
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
    <section className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" /> Structured Learning
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Curated Engineering Roadmaps
            </h2>
          </div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
          >
            <span>View All Roadmaps</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Roadmap Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {roadmaps.map((roadmap) => (
            <Link
              key={roadmap.id}
              href={`/learn/${roadmap.slug}`}
              className="glass-card rounded-2xl p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {getIcon(roadmap.iconName)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                      {roadmap.badge}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {roadmap.durationWeeks} weeks
                    </span>
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                  {roadmap.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                  {roadmap.shortDesc}
                </p>

                {/* Milestone pills preview */}
                <div className="mt-5 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Curriculum Highlights ({roadmap.milestones.length} Milestones)
                  </span>
                  <div className="space-y-1.5">
                    {roadmap.milestones.slice(0, 3).map((m, i) => (
                      <div key={m.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800 text-[10px] font-mono flex items-center justify-center text-slate-500 shrink-0">
                          {i + 1}
                        </span>
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Interactive Progress Checklist
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Start Roadmap <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
