"use client";

import React from "react";
import Image from "next/image";
import { InstagramIcon } from "../ui/Icons";
import { 
  ArrowUpRight, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  ExternalLink,
  Flame,
  Layers,
  Database,
  Bot,
  Zap
} from "lucide-react";

export function InstagramSection() {
  const profileUrl = "https://www.instagram.com/promptnprod";
  const reelsUrl = "https://www.instagram.com/promptnprod/reels/";

  const contentPillars = [
    {
      icon: <Bot className="w-5 h-5 text-cyan-400" />,
      title: "AI Agents & MCP",
      desc: "ReAct loops, autonomous tool schemas, deterministic execution, and agent swarms in 60s.",
      tag: "Agentic Systems",
      color: "from-cyan-500/20 to-blue-500/10",
      border: "border-cyan-500/30",
    },
    {
      icon: <Zap className="w-5 h-5 text-pink-400" />,
      title: "Production RAG Realities",
      desc: "Why naive RAG breaks, vector DB pricing traps, HNSW indexing, and hybrid BM25 retrieval.",
      tag: "Cloud Costs",
      color: "from-pink-500/20 to-rose-500/10",
      border: "border-pink-500/30",
    },
    {
      icon: <Database className="w-5 h-5 text-amber-400" />,
      title: "Visual SQL Mental Models",
      desc: "Watch what actually happens to rows during INNER, LEFT, RIGHT, and ANTI joins.",
      tag: "Databases & SQL",
      color: "from-amber-500/20 to-orange-500/10",
      border: "border-amber-500/30",
    },
    {
      icon: <Layers className="w-5 h-5 text-indigo-400" />,
      title: "Full-Stack AI Roadmaps",
      desc: "Tech stack blueprints, system design flowcharts, and hands-on developer tutorials.",
      tag: "Career Roadmap",
      color: "from-indigo-500/20 to-purple-500/10",
      border: "border-indigo-500/30",
    },
  ];

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Creator Hub Card */}
        <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-gradient-to-b from-white via-slate-50 to-slate-100 dark:from-[#0d121f] dark:via-[#090d16] dark:to-[#06080e] shadow-2xl p-6 sm:p-10 lg:p-12">
          {/* Ambient decorative glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-slate-200 dark:border-slate-800/80">
            {/* Creator Profile Info */}
            <div className="flex items-center gap-5">
              {/* Instagram Gradient Ring Avatar */}
              <div className="relative p-1 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-lg shadow-pink-500/20 shrink-0">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-black flex items-center justify-center border-2 border-white dark:border-slate-950">
                  <Image
                    src="/Logo.png"
                    alt="@promptnprod"
                    fill
                    className="object-contain p-1.5"
                    sizes="80px"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    @promptnprod
                  </h3>
                  <span className="p-0.5 rounded-full bg-cyan-500 text-white" title="Verified Creator">
                    <CheckCircle2 className="w-4 h-4 fill-cyan-500 text-white" />
                  </span>
                  <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20">
                    Daily Reels &amp; Notes
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-lg leading-relaxed">
                  Visual Study Notes, AI Architecture &amp; Practical Developer Culture in 60 seconds.
                </p>

                <div className="flex items-center gap-3 mt-2.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span className="flex items-center gap-1 text-pink-500 font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-pink-500" /> Active Creator
                  </span>
                  <span>•</span>
                  <span>Instagram Reels &amp; Stories</span>
                </div>
              </div>
            </div>

            {/* Direct Links Action */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <a
                href={reelsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Latest Reels on Instagram</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs sm:text-sm border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <InstagramIcon className="w-4 h-4 text-pink-500" />
                <span>Follow @promptnprod</span>
              </a>
            </div>
          </div>

          {/* 4 Content Pillar Highlights */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                What We Break Down on Reels
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {contentPillars.map((pillar, idx) => (
                <a
                  key={idx}
                  href={reelsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group p-5 rounded-2xl bg-gradient-to-br ${pillar.color} border ${pillar.border} hover:scale-[1.02] transition-all duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 rounded-xl bg-black/40 backdrop-blur-sm border border-white/10">
                        {pillar.icon}
                      </div>
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-black/40 text-slate-300 border border-white/10">
                        {pillar.tag}
                      </span>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-pink-400 transition-colors">
                      {pillar.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-pink-500 group-hover:text-pink-400">
                    <span>Watch Breakdown</span>
                    <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
