import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { ArrowLeft, Clock, Code2, CheckCircle2, ChevronRight, Layers, Lightbulb, Terminal } from "lucide-react";

export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-8">
          <Link href="/build" className="hover:text-cyan-500 flex items-center gap-1 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Project Blueprints
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-cyan-600 dark:text-cyan-400 font-medium">{project.title}</span>
        </div>

        {/* Header */}
        <header className="space-y-4 mb-8">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {project.level} Level
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" /> Estimated Build Time: {project.timeToBuild}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Technology Stack
            </span>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-mono font-medium text-slate-700 dark:text-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* System Architecture Block */}
        <section className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 mb-8 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3">
            <Terminal className="w-4 h-4" /> System Architecture Flow
          </div>
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-300 overflow-x-auto leading-relaxed">
            {project.architectureOverview}
          </div>
        </section>

        {/* Prerequisites & Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-3">
              <Layers className="w-4 h-4 text-cyan-500" /> Prerequisites
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {project.prerequisites.map((req, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-cyan-500 font-bold">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/40">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Key Features Delivered
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              {project.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Guided Step-by-Step Implementation */}
        <section className="space-y-8 mb-12">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Guided Implementation Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Follow these sequential phases to construct and launch the application.
            </p>
          </div>

          <div className="space-y-6">
            {project.steps.map((step) => (
              <div
                key={step.stepNumber}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/60 p-6 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold flex items-center justify-center border border-cyan-500/20">
                    {step.stepNumber}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {step.title}
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  {step.description}
                </p>

                {step.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0c121e] my-3">
                    <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-b border-slate-800 text-xs text-slate-400 font-mono">
                      <span>{step.codeSnippet.filename}</span>
                      <span className="uppercase text-[10px] text-slate-500">{step.codeSnippet.language}</span>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm text-slate-200 overflow-x-auto leading-relaxed font-mono">
                      <code>{step.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}

                {step.proTip && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300">
                    <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong>Pro-tip:</strong> {step.proTip}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Completion Checklist */}
        <section className="p-6 rounded-3xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Ready to Deploy to Production?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-md mx-auto">
            Test locally with sample data, verify test assertions, and push to GitHub for automated deployment.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <Link
              href="/build"
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs transition-colors"
            >
              Back to Blueprints
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
