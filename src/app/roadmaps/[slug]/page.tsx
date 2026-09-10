import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { roadmaps } from "@/data/roadmaps";
import { RoadmapMilestones } from "@/components/roadmaps/RoadmapMilestones";
import { ArrowLeft, Clock, Award, ChevronRight, Layers, Code2, Sparkles } from "lucide-react";
import { ShareButtons } from "@/components/common/ShareButtons";
import { NewsletterBox } from "@/components/common/NewsletterBox";

export function generateStaticParams() {
  return roadmaps.map((r) => ({
    slug: r.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const roadmap = roadmaps.find((r) => r.slug === slug);

  if (!roadmap) {
    return {
      title: "Roadmap Not Found | Prompt N Prod",
    };
  }

  const ogUrl = `/api/og?title=${encodeURIComponent(roadmap.title)}&category=${encodeURIComponent(`${roadmap.level} • ${roadmap.badge}`)}&type=Roadmap`;

  return {
    title: `${roadmap.title} - Career Roadmap & Projects | Prompt N Prod`,
    description: roadmap.description,
    openGraph: {
      title: `${roadmap.title} | Prompt N Prod Roadmap`,
      description: roadmap.description,
      images: [
        {
          url: ogUrl,
          width: 1200,
          height: 630,
          alt: roadmap.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${roadmap.title} | Prompt N Prod`,
      description: roadmap.description,
      images: [ogUrl],
    },
  };
}

export default async function RoadmapDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const roadmap = roadmaps.find((r) => r.slug === slug);

  if (!roadmap) {
    notFound();
  }

  const projectCount = roadmap.milestones.filter(m => m.projectBlueprint).length;

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb & Share */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <div className="flex items-center gap-2">
            <Link href="/roadmaps" className="hover:text-cyan-500 flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Roadmaps
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-cyan-600 dark:text-cyan-400 font-medium truncate max-w-[240px] sm:max-w-none">
              {roadmap.title}
            </span>
          </div>

          <ShareButtons title={roadmap.title} category={roadmap.level} />
        </div>

        {/* Roadmap Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {roadmap.level} Level
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {roadmap.badge}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> ~{roadmap.durationWeeks} Weeks
            </span>
            {projectCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Code2 className="w-3 h-3" /> {projectCount} Hands-On Projects
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {roadmap.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {roadmap.description}
          </p>

          {/* Prerequisites and Roles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-cyan-500" /> Prerequisites
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                {roadmap.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Award className="w-3.5 h-3.5 text-blue-500" /> Target Roles
              </span>
              <div className="flex flex-wrap gap-1.5">
                {roadmap.targetRoles.map((role, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* Interactive Milestones Tracker with Expandable Project Blueprints */}
        <section className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-500" />
              <span>Interactive Milestones &amp; Project Blueprints</span>
            </h2>
            <span className="text-xs text-slate-500">Auto-saves to browser</span>
          </div>
          <RoadmapMilestones roadmapId={roadmap.id} milestones={roadmap.milestones} />
        </section>

        {/* Newsletter Box */}
        <div className="mt-12">
          <NewsletterBox
            source={`roadmap_${roadmap.slug}`}
            title={`Get new engineering roadmaps & blueprints`}
            subtitle="Subscribe to receive fresh architectural roadmaps, real-world capstone blueprints, and system design diagrams."
          />
        </div>

        {/* Bottom CTA to Notion Study Notes */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-blue-950/40 border border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Looking for quick visual reference guides?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Browse our Notion-powered study notes with cheatsheets, architecture diagrams, and SQL guides.
            </p>
          </div>
          <Link
            href="/notes"
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shrink-0 shadow-lg shadow-cyan-500/20 transition-all"
          >
            Explore Study Notes →
          </Link>
        </div>
      </div>
    </div>
  );
}
