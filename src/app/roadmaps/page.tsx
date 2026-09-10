"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { roadmaps } from "@/data/roadmaps";
import { 
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
  ArrowRight, 
  Filter, 
  Sparkles, 
  Layers, 
  Code2, 
  X,
  CheckCircle2,
  Compass
} from "lucide-react";

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("All");
  const [selectedDomain, setSelectedDomain] = useState<string>("All");

  const domains = [
    { id: "All", label: "All Disciplines" },
    { id: "ai", label: "AI & Agents", keywords: ["ai", "mcp", "agent", "llm", "rag", "eval", "vector"] },
    { id: "fullstack", label: "Full-Stack & Web", keywords: ["next.js", "react", "frontend", "full-stack", "ui", "performance"] },
    { id: "cloud", label: "Cloud & DevOps", keywords: ["aws", "cloud", "devops", "docker", "kubernetes", "terraform", "sre"] },
    { id: "backend", label: "Backend & Systems", keywords: ["backend", "distributed", "database", "sql", "kafka", "redis", "postgres"] },
    { id: "security", label: "AI Safety & Security", keywords: ["security", "red teaming", "guardrails", "injection", "safety"] },
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
    return roadmaps.filter((r) => {
      // 1. Level Filter
      if (selectedLevel !== "All" && r.level !== selectedLevel) {
        return false;
      }

      // 2. Domain Filter
      if (selectedDomain !== "All") {
        const domainObj = domains.find((d) => d.id === selectedDomain);
        if (domainObj && domainObj.keywords) {
          const combinedText = `${r.title} ${r.shortDesc} ${r.description} ${r.targetRoles.join(" ")} ${r.prerequisites.join(" ")}`.toLowerCase();
          const matchesKeyword = domainObj.keywords.some((kw) => combinedText.includes(kw));
          if (!matchesKeyword) return false;
        }
      }

      // 3. Search Query Filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const allTopics = r.milestones.flatMap((m) => m.topics).join(" ").toLowerCase();
        const allProjects = r.milestones.map((m) => m.recommendedProject + " " + (m.projectBlueprint?.title || "")).join(" ").toLowerCase();
        const combinedText = `${r.title} ${r.shortDesc} ${r.description} ${r.targetRoles.join(" ")} ${allTopics} ${allProjects}`.toLowerCase();
        if (!combinedText.includes(q)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedLevel, selectedDomain]);

  // Aggregate stats
  const totalMilestones = roadmaps.reduce((acc, r) => acc + r.milestones.length, 0);
  const totalProjects = roadmaps.reduce((acc, r) => acc + r.milestones.filter((m) => m.projectBlueprint).length, 0);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All");
    setSelectedDomain("All");
  };

  const isFiltered = searchQuery !== "" || selectedLevel !== "All" || selectedDomain !== "All";

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Engineering Tracks ({roadmaps.length} Comprehensive Tracks)</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Production Engineering Roadmaps
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            Battle-tested, opinionated curriculums for software engineers. Master modern AI systems, cloud architecture, high-throughput distributed systems, and modern web engineering.
          </p>

          {/* Quick Metrics Bar */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 px-6 py-3 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-cyan-500" />
              <strong>{roadmaps.length}</strong> Complete Roadmaps
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-500" />
              <strong>{totalMilestones}</strong> Milestones
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-500" />
              <strong>{totalProjects}+</strong> Interactive Blueprints
            </span>
          </div>
        </div>

        {/* Search & Filter Section */}
        <div className="mb-10 space-y-5 bg-white/60 dark:bg-slate-900/40 p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 backdrop-blur-md shadow-sm">
          {/* Main Search Input */}
          <div className="relative">
            <SearchIcon className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roadmaps by technology, keyword, or role (e.g. 'MCP', 'AWS', 'Postgres', 'Kafka', 'RAG', 'React 19')..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl text-sm sm:text-base border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
                title="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Domain Filter Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
              Discipline:
            </span>
            {domains.map((dom) => (
              <button
                key={dom.id}
                onClick={() => setSelectedDomain(dom.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  selectedDomain === dom.id
                    ? "bg-cyan-500 text-white shadow-md shadow-cyan-500/25"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {dom.label}
              </button>
            ))}
          </div>

          {/* Difficulty Level & Clear Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-800/80">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Level:
              </span>
              {["All", "Beginner", "Intermediate", "Advanced"].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setSelectedLevel(lvl)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedLevel === lvl
                      ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold"
                      : "bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            {/* Results Count & Reset */}
            <div className="flex items-center gap-3 text-xs">
              <span className="text-slate-500 font-medium">
                Showing <strong className="text-cyan-600 dark:text-cyan-400">{filteredRoadmaps.length}</strong> of {roadmaps.length} Tracks
              </span>
              {isFiltered && (
                <button
                  onClick={clearAllFilters}
                  className="px-2.5 py-1 rounded-md text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 font-semibold transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Zero Results State */}
        {filteredRoadmaps.length === 0 && (
          <div className="text-center py-20 p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
            <SearchIcon className="w-10 h-10 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No roadmaps found matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              Try adjusting your search terms or clearing your filters to explore all available engineering tracks.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 hover:bg-cyan-600 transition-all"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Roadmaps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {filteredRoadmaps.map((r) => {
            const projectCount = r.milestones.filter((m) => m.projectBlueprint).length;
            return (
              <div
                key={r.id}
                className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 group"
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/60 shadow-inner">
                        {getIcon(r.iconName)}
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {r.level}
                      </span>
                      <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {r.badge}
                      </span>
                    </div>

                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> ~{r.durationWeeks} weeks
                    </span>
                  </div>

                  {/* Title & Short Description */}
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors leading-snug">
                    {r.title}
                  </h2>

                  <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {r.shortDesc}
                  </p>

                  {/* Target Roles Pills */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {r.targetRoles.slice(0, 2).map((role, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                      >
                        {role}
                      </span>
                    ))}
                  </div>

                  {/* Highlights Bar */}
                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-500" />
                      <span>{r.milestones.length} Step Milestones</span>
                    </div>
                    {projectCount > 0 ? (
                      <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                        <Code2 className="w-3.5 h-3.5" />
                        <span>{projectCount} Interactive Blueprints</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Hands-On Capstones</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action CTA */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    Interactive Checklist &amp; Code
                  </span>
                  <Link
                    href={`/roadmaps/${r.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-cyan-500/20 group-hover:scale-[1.02] transition-all"
                  >
                    <span>Explore Track</span>
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
