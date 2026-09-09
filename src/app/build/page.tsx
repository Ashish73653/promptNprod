"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { Code2, Clock, CheckCircle2, ArrowRight, Filter, Layers } from "lucide-react";

export default function BuildPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    if (selectedLevel === "All") return projects;
    return projects.filter((p) => p.level === selectedLevel);
  }, [selectedLevel]);

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Code2 className="w-3.5 h-3.5" /> Project Blueprints
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Production Software Blueprints
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Move beyond hello-world tutorials. Each blueprint includes system architecture diagrams, prerequisite checklists, guided implementation steps, and copyable production code.
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-5 mb-8">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5" /> Difficulty:
          </span>
          {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedLevel === lvl
                  ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/20"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/build/${project.slug}`}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {project.level}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" /> {project.timeToBuild}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                  {project.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {project.shortDesc}
                </p>

                {/* Tech stack badges */}
                <div className="mt-5 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Tech Stack
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> {project.steps.length} Guided Steps
                </span>
                <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Blueprint <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
