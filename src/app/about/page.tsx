import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Sparkles,
  BookOpen,
  Code2,
  Flame,
  Compass,
  ExternalLink,
  Zap,
  Globe,
  Database,
  Mail,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";

export const metadata = {
  title: "About | Prompt N Prod",
  description:
    "Learn about Prompt N Prod — a high-signal developer platform with visual study notes, interactive roadmaps, curated tech news, and developer culture.",
};

export default function AboutPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* ── Header ── */}
        <div className="space-y-6 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" /> About Prompt N Prod
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            From Prompt to Production —<br className="hidden sm:block" />
            <span className="text-gradient">Developer clarity, not noise.</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            The developer ecosystem is full of AI hype, shallow tutorials, and documentation that leaves you more confused than when you started.{" "}
            <strong>Prompt N Prod</strong> cuts through that. We turn complex engineering concepts into visual study notes, structured roadmaps, and real code blueprints — so you can actually learn and ship.
          </p>

          {/* Banner */}
          <div className="relative w-full aspect-[21/9] sm:aspect-[2.4/1] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-slate-900 mt-6">
            <Image
              src="/Banner1.png"
              alt="Prompt N Prod Platform"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>

        {/* ── Core Pillars ── */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">What you&apos;ll find here</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Visual Study Notes</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Architecture flowcharts, SQL mental models, AI cheatsheets — curated PDFs you can read in-app or download to keep.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
                <Code2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Roadmaps with Real Projects</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Structured career tracks where every milestone includes a hands-on project blueprint you can actually build and ship.
              </p>
            </div>

            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reels &amp; Dev Culture</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Short-form video breakdowns from @promptnprod on Instagram, paired with trending developer memes from the community.
              </p>
            </div>
          </div>
        </div>

        {/* ── Tech Stack ── */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 block mb-2">Under the hood</span>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">How this platform is built</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              Prompt N Prod is a real production app, not a template. Every feature you use is backed by a proper stack.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: <Globe className="w-4 h-4" />, label: "Next.js 16", sub: "App Router + Edge", color: "text-slate-600 dark:text-slate-300" },
              { icon: <Database className="w-4 h-4" />, label: "Neon PostgreSQL", sub: "Serverless DB", color: "text-cyan-600 dark:text-cyan-400" },
              { icon: <Zap className="w-4 h-4" />, label: "Vercel Edge", sub: "<50ms TTFB globally", color: "text-blue-600 dark:text-blue-400" },
              { icon: <Mail className="w-4 h-4" />, label: "Resend", sub: "Email notifications", color: "text-pink-600 dark:text-pink-400" },
            ].map(({ icon, label, sub, color }) => (
              <div key={label} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 space-y-1.5">
                <div className={`${color} flex items-center gap-1.5 font-semibold text-sm`}>
                  {icon} {label}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Instagram CTA ── */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-cyan-500/10 border border-pink-500/20 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-500 block mb-1">
                Follow the creator
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                @promptnprod on Instagram
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Daily reels on AI engineering, system design diagrams, and real developer life.
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
        </div>

        {/* ── Quick Links ── */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
          <Link href="/notes" className="hover:text-cyan-500 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Study Notes
          </Link>
          <span>•</span>
          <Link href="/roadmaps" className="hover:text-cyan-500 transition-colors">
            Roadmaps →
          </Link>
          <span>•</span>
          <Link href="/feed" className="hover:text-cyan-500 transition-colors">
            Tech News →
          </Link>
          <span>•</span>
          <Link href="/memes" className="hover:text-cyan-500 transition-colors">
            Dev Memes →
          </Link>
        </div>

      </div>
    </div>
  );
}
