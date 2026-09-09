import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { roadmaps } from "@/data/roadmaps";
import { RoadmapMilestones } from "@/components/roadmaps/RoadmapMilestones";
import { ArrowLeft, Clock, Award, CheckCircle2, ChevronRight, BookOpen, Layers } from "lucide-react";

export function generateStaticParams() {
  return roadmaps.map((r) => ({
    slug: r.slug,
  }));
}

export default async function RoadmapDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const roadmap = roadmaps.find((r) => r.slug === slug);

  if (!roadmap) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/learn" className="hover:text-indigo-500 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Roadmaps
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-indigo-600 dark:text-indigo-400 font-medium">{roadmap.title}</span>
        </div>

        {/* Roadmap Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
              {roadmap.level} Level
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {roadmap.badge}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> ~{roadmap.durationWeeks} Weeks to Complete
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {roadmap.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {roadmap.description}
          </p>

          {/* Prerequisites and Roles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Layers className="w-3.5 h-3.5 text-indigo-500" /> Prerequisites
              </span>
              <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                {roadmap.prerequisites.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Award className="w-3.5 h-3.5 text-cyan-500" /> Target Roles
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

        {/* Interactive Milestones Tracker */}
        <section className="mt-10">
          <RoadmapMilestones roadmapId={roadmap.id} milestones={roadmap.milestones} />
        </section>

        {/* Bottom CTA to Hands-on projects */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-cyan-950/40 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white">
              Want to cement these skills with hands-on code?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Check out our complete production blueprints with step-by-step guidance and copyable code.
            </p>
          </div>
          <Link
            href="/build"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs sm:text-sm shrink-0 shadow-lg shadow-indigo-600/25 transition-all"
          >
            Explore Project Blueprints →
          </Link>
        </div>
      </div>
    </div>
  );
}
