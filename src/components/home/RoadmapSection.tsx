"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Roadmap } from "@/types";
import { 
  ArrowRight, 
  BookOpen, 
  Bot, 
  Globe, 
  Cpu, 
  ShieldCheck, 
  Server, 
  Cloud, 
  Database, 
  Search as SearchIcon, 
  Lock, 
  Clock, 
  CheckCircle,
  Code2,
  X
} from "lucide-react";

interface RoadmapSectionProps {
  roadmaps: Roadmap[];
}

export function RoadmapSection({ roadmaps }: RoadmapSectionProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<string>("All");

  const tabs = [
    { id: "All", label: "All Roadmaps" },
    { id: "ai", label: "AI & Agents", filter: ["ai", "mcp", "agent", "llm", "rag", "eval", "vector"] },
    { id: "cloud", label: "Cloud & DevOps", filter: ["aws", "cloud", "devops", "docker", "kubernetes", "terraform"] },
    { id: "backend", label: "Backend & DBs", filter: ["backend", "distributed", "database", "sql", "kafka", "redis"] },
    { id: "web", label: "Full-Stack & UI", filter: ["next.js", "react", "frontend", "full-stack", "ui"] },
  ];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Bot":
        return <Bot className="w-5 h-5 text-cyan-500" />;
      case "Globe":
        return <Globe className="w-5 h-5 text-indigo-500" />;
      case "Cpu":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case "Server":
        return <Server className="w-5 h-5 text-blue-500" />;
      case "Cloud":
        return <Cloud className="w-5 h-5 text-orange-500" />;
      case "Database":
        return <Database className="w-5 h-5 text-teal-500" />;
      case "Search":
        return <SearchIcon className="w-5 h-5 text-pink-500" />;
      case "Lock":
        return <Lock className="w-5 h-5 text-rose-500" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
    }
  };

  const filteredRoadmaps = useMemo(() => {
    return roadmaps.filter((roadmap) => {
      // Tab filter
      if (activeTab !== "All") {
        const tab = tabs.find((t) => t.id === activeTab);
        if (tab && tab.filter) {
          const text = `${roadmap.title} ${roadmap.shortDesc} ${roadmap.description}`.toLowerCase();
          const matches = tab.filter.some((k) => text.includes(k));
          if (!matches) return false;
        }
      }

      // Query filter
      if (query.trim() !== "") {
        const q = query.toLowerCase().trim();
        const text = `${roadmap.title} ${roadmap.shortDesc} ${roadmap.description} ${roadmap.targetRoles.join(" ")}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [roadmaps, activeTab, query]);

  return (
    <section className="py-12 sm:py-16 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
              <BookOpen className="w-3.5 h-3.5" /> Structured Learning &amp; Projects
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Interactive Roadmaps &amp; Projects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Curated tracks pairing in-depth theory with production-grade capstone blueprints.
            </p>
          </div>
          <Link
            href="/roadmaps"
            className="inline-flex items-center gap-1 text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 transition-colors"
          >
            <span>Explore All {roadmaps.length} Roadmaps</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-cyan-500 text-white shadow-sm shadow-cyan-500/25"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <SearchIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search roadmap tracks..."
              className="w-full pl-9 pr-8 py-1.5 rounded-xl text-xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {/* Roadmap Cards Grid */}
        {filteredRoadmaps.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-sm text-slate-500">No roadmaps matched your filter.</p>
            <button
              onClick={() => {
                setActiveTab("All");
                setQuery("");
              }}
              className="mt-2 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredRoadmaps.map((roadmap) => {
              const projectCount = roadmap.milestones.filter((m) => m.projectBlueprint).length;
              return (
                <Link
                  key={roadmap.id}
                  href={`/roadmaps/${roadmap.slug}`}
                  className="glass-card rounded-2xl p-6 flex flex-col justify-between group hover:border-cyan-500/40 transition-all"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        {getIcon(roadmap.iconName)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {roadmap.badge}
                        </span>
                        {projectCount > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <Code2 className="w-3 h-3" /> {projectCount} Blueprints
                          </span>
                        )}
                        <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3.5 h-3.5" /> {roadmap.durationWeeks}w
                        </span>
                      </div>
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors">
                      {roadmap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed line-clamp-2">
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

                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Interactive Progress Checklist
                    </span>
                    <span className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Start Roadmap <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
