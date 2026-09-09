import React from "react";
import { Hero } from "@/components/home/Hero";
import { TrendingFeed } from "@/components/home/TrendingFeed";
import { RoadmapSection } from "@/components/home/RoadmapSection";
import { ProjectSection } from "@/components/home/ProjectSection";
import { InteractiveScorecardDemo } from "@/components/home/InteractiveScorecardDemo";
import { MemeStrip } from "@/components/home/MemeStrip";
import { InstagramSection } from "@/components/home/InstagramSection";
import { articles } from "@/data/articles";
import { roadmaps } from "@/data/roadmaps";
import { projects } from "@/data/projects";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-6 sm:space-y-12">
      {/* Hero Section */}
      <Hero />

      {/* Breaking Tech Radar Feed */}
      <TrendingFeed articles={articles} />

      {/* Interactive Scorecard Tool Teaser */}
      <InteractiveScorecardDemo />

      {/* Curated Roadmaps Track */}
      <RoadmapSection roadmaps={roadmaps} />

      {/* Production Blueprints */}
      <ProjectSection projects={projects} />

      {/* Developer Culture & Live Memes Strip */}
      <MemeStrip />

      {/* Instagram Community & Reels Showcase */}
      <InstagramSection />

      {/* Evolution Roadmap Banner */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-8 sm:p-12 relative overflow-hidden bg-gradient-to-r from-cyan-950/60 via-slate-900 to-indigo-950/60 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" /> Prompt N Prod 7-Phase Architecture
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Built with precision. Track our journey to a full AI platform.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
                We are following the exact 7-phase build roadmap from our master blueprint: from Core Foundation to Git-based CMS, Supabase Postgres, Automated News Ingestion, Anthropic Claude Summaries, and Personalized AI Radar.
              </p>
              <div className="mt-6">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02]"
                >
                  <Compass className="w-4 h-4" />
                  <span>Inspect Full Platform Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            {/* Background glow circle */}
            <div className="absolute right-0 top-0 translate-x-1/3 -translate-y-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>
    </div>
  );
}
