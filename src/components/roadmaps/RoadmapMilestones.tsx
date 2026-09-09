"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import { RoadmapMilestone } from "@/types";
import { CheckCircle2, Circle, Clock, Sparkles, ExternalLink, Code2, BookOpen } from "lucide-react";

interface RoadmapMilestonesProps {
  roadmapId: string;
  milestones: RoadmapMilestone[];
}

export function RoadmapMilestones({ roadmapId, milestones }: RoadmapMilestonesProps) {
  const storageKey = `pnp_roadmap_${roadmapId}_completed`;
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setCompletedIds(JSON.parse(saved));
      }
    } catch {
      // LocalStorage fallback
    }
  }, [storageKey]);

  const toggleMilestone = (id: string) => {
    const isCompleted = completedIds.includes(id);
    let next: string[];
    if (isCompleted) {
      next = completedIds.filter((mId) => mId !== id);
    } else {
      next = [...completedIds, id];
      // Trigger celebratory micro-confetti
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.8 },
      });
    }
    setCompletedIds(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Ignore
    }
  };

  const progressPercent = Math.round((completedIds.length / (milestones.length || 1)) * 100);

  if (!mounted) {
    return <div className="animate-pulse h-64 bg-slate-100 dark:bg-slate-900 rounded-2xl" />;
  }

  return (
    <div className="space-y-6">
      {/* Progress tracker bar */}
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 backdrop-blur-md shadow-sm">
        <div className="flex items-center justify-between gap-4 mb-2">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Your Learning Progress
            </span>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
              {completedIds.length} of {milestones.length} Milestones Completed
            </h4>
          </div>
          <div className="text-right">
            <span className="text-2xl font-extrabold text-cyan-600 dark:text-cyan-400">
              {progressPercent}%
            </span>
          </div>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {progressPercent === 100 && (
          <div className="mt-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Incredible! You have completed all milestones for this roadmap track!</span>
          </div>
        )}
      </div>

      {/* Step by step timeline list */}
      <div className="space-y-4">
        {milestones.map((milestone, idx) => {
          const isDone = completedIds.includes(milestone.id);
          return (
            <div
              key={milestone.id}
              className={`rounded-2xl border p-5 sm:p-6 transition-all ${
                isDone
                  ? "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-950/10"
                  : "border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  {/* Interactive toggle button */}
                  <button
                    onClick={() => toggleMilestone(milestone.id)}
                    className="mt-0.5 text-slate-400 hover:text-cyan-500 transition-colors shrink-0"
                    aria-label={`Mark milestone ${milestone.title} as completed`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 dark:text-slate-600 hover:text-cyan-500" />
                    )}
                  </button>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                        Step 0{idx + 1}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {milestone.duration}
                      </span>
                    </div>

                    <h3
                      className={`text-base sm:text-lg font-bold ${
                        isDone
                          ? "text-emerald-700 dark:text-emerald-300 line-through decoration-emerald-500/40"
                          : "text-slate-900 dark:text-white"
                      }`}
                    >
                      {milestone.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleMilestone(milestone.id)}
                  className={`hidden sm:inline-flex px-3 py-1 rounded-lg text-xs font-semibold shrink-0 border transition-all ${
                    isDone
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-cyan-500"
                  }`}
                >
                  {isDone ? "Completed" : "Mark as Done"}
                </button>
              </div>

              {/* Topics breakdown */}
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Key Concepts To Master
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {milestone.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 text-xs font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommended Project Blueprint */}
              {milestone.recommendedProject && (
                <div className="mt-4 p-3 rounded-xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/15 flex items-start gap-2 text-xs">
                  <Code2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-cyan-600 dark:text-cyan-400 mr-1">
                      Recommended Practical Milestone:
                    </strong>
                    <span className="text-slate-600 dark:text-slate-300">
                      {milestone.recommendedProject}
                    </span>
                  </div>
                </div>
              )}

              {/* Curated Resources */}
              {milestone.resources.length > 0 && (
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" /> Resources:
                  </span>
                  {milestone.resources.map((res) => (
                    <a
                      key={res.title}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-cyan-600 dark:text-cyan-400 hover:underline px-2 py-0.5 rounded bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60"
                    >
                      <span>{res.title}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
