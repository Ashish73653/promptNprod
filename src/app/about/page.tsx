import React from "react";
import Link from "next/link";
import Image from "next/image";
import { roadmapCheckpoints } from "@/data/checkpoints";
import { 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Compass, 
  ArrowRight,
  Cpu,
  Flame,
  Terminal
} from "lucide-react";

export const metadata = {
  title: "About & Platform Roadmap",
  description:
    "Learn about Prompt N Prod's mission and explore our interactive 7-phase build roadmap from Core Foundation to Full AI Intelligence.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Mission Header */}
        <div className="space-y-6">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" /> Mission & Vision
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              Bridging the gap between prompt hype and shipping production code.
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              The generative AI explosion has created immense noise. Every day brings 50 new wrapper startups, synthetic benchmarks, and twitter threads. <strong>Prompt N Prod</strong> exists to deliver high-signal developer intelligence: what actually works in production, structured roadmaps to master modern systems, and real-world project blueprints.
            </p>
          </div>

          {/* Official Brand Banner */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900">
            <Image
              src="/Banner1.png"
              alt="Prompt N Prod Official Platform"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>

        {/* The 3 Core Tenets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              High-Performance Engineering
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We prioritize high-speed responsiveness with hardware-accelerated transforms (<code className="text-cyan-500 font-mono">transform</code> & <code className="text-cyan-500 font-mono">opacity</code>). Static pages serve at the edge in sub-50ms.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Structured Progression
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Instead of disjointed tutorials, our learning paths are chronological engineering roadmaps with verifiable milestones, resources, and hands-on projects.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Objective Evaluation
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Our &ldquo;Should I Learn This?&rdquo; rubric separates substance from sponsored hype, helping you make smart architectural choices before refactoring.
            </p>
          </div>
        </div>

        {/* Master 7-Phase Build Roadmap */}
        <section className="space-y-8">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Strategic Execution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              The 7-Phase Build Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Derived directly from our Master Technical Architecture Guide.
            </p>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 sm:ml-6 space-y-10 pl-6 sm:pl-8">
            {roadmapCheckpoints.map((cp) => {
              const isCompleted = cp.status === "Live";
              const isUpcoming = cp.status === "Upcoming";

              return (
                <div key={cp.checkpointNumber} className="relative group">
                  {/* Indicator Dot */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-transform group-hover:scale-110 ${
                      isCompleted
                        ? "bg-emerald-500 border-emerald-400 text-white shadow-md shadow-emerald-500/30"
                        : isUpcoming
                        ? "bg-cyan-500 border-cyan-400 text-white animate-pulse"
                        : "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-500"
                    }`}
                  >
                    {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  {/* Card */}
                  <div
                    className={`rounded-3xl p-6 sm:p-7 border transition-all ${
                      isCompleted
                        ? "bg-emerald-500/5 dark:bg-emerald-950/10 border-emerald-500/30"
                        : isUpcoming
                        ? "bg-cyan-500/5 dark:bg-cyan-950/10 border-cyan-500/30"
                        : "glass-card"
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          Checkpoint 0{cp.checkpointNumber}
                        </span>
                        <span className="text-slate-300 dark:text-slate-700">•</span>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {cp.phase}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${
                            isCompleted
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : isUpcoming
                              ? "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {cp.status}
                        </span>
                        <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {cp.duration}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {cp.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {cp.summary}
                    </p>

                    {/* Highlights */}
                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Deliverables & Architecture
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                        {cp.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-cyan-500 font-bold shrink-0">✓</span>
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Tech badges */}
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-mono"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="rounded-3xl p-8 bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            Ready to explore the platform?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            Browse our radar articles, start a learning track, or build an MCP research agent.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/feed"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              Explore What&apos;s New
            </Link>
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs sm:text-sm font-semibold hover:border-cyan-500 transition-colors"
            >
              Interactive Roadmaps
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
