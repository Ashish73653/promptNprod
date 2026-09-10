import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Code2, 
  Flame, 
  Layers, 
  Compass, 
  CheckCircle2, 
  ExternalLink 
} from "lucide-react";
import { InstagramIcon, GithubIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "About Prompt N Prod",
  description:
    "Learn about Prompt N Prod: high-signal visual study notes, interactive developer roadmaps, real projects, and developer culture.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Mission Header */}
        <div className="space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" /> About Prompt N Prod
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            From Prompt to Production: Visual Clarity Over Text Noise.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The developer ecosystem is overflowing with AI hype, 50-tweet threads, and complex documentation that leaves you more confused than when you started. <strong>Prompt N Prod</strong> exists to fix that by turning complex engineering concepts into **visual study notes, mental models, interactive roadmaps, and real code**.
          </p>

          {/* Official Brand Banner */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 mt-6">
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

        {/* The 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Visual Study Notes
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Notion-powered architecture flowcharts, SQL mental models, and AI cheatsheets designed for fast, high-retention learning.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Roadmaps with Real Projects
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Curated career tracks where every milestone directly includes a hands-on project blueprint to build and ship.
            </p>
          </div>

          <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Flame className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Reels &amp; Developer Culture
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Short-form video breakdowns from @promptnprod paired with trending developer humor synced live from Reddit.
            </p>
          </div>
        </div>

        {/* Community & Social Cards */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-cyan-500/10 border border-pink-500/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-500 block mb-1">
                Official Creator Hub
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Follow Prompt N Prod on Instagram
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Daily reels on AI engineering, architecture diagrams, dev life realities, and cheatsheets.
              </p>
            </div>

            <a
              href="https://www.instagram.com/promptnprod"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-500/20 hover:opacity-95 transition-all hover:scale-[1.02] flex items-center gap-2 shrink-0"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>@promptnprod</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="pt-6 border-t border-pink-500/20 flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Version 2.0 Live</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Notion Headless Sync Enabled</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Sub-50ms Edge Performance</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <Link href="/notes" className="hover:text-cyan-500 transition-colors">
            Explore Study Notes →
          </Link>
          <span>•</span>
          <Link href="/roadmaps" className="hover:text-cyan-500 transition-colors">
            Interactive Roadmaps →
          </Link>
          <span>•</span>
          <Link href="/feed" className="hover:text-cyan-500 transition-colors">
            Tech News Radar →
          </Link>
          <span>•</span>
          <Link href="/memes" className="hover:text-cyan-500 transition-colors">
            Daily Memes →
          </Link>
        </div>
      </div>
    </div>
  );
}
