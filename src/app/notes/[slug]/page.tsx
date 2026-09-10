import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { studyNotes } from "@/data/notes";
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Play, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Info,
  Sparkles,
  BookOpen
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/Icons";
import { ReactionButton } from "@/components/common/ReactionButton";
import { CommentsSection } from "@/components/common/CommentsSection";

export function generateStaticParams() {
  return studyNotes.map((note) => ({
    slug: note.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const note = studyNotes.find((n) => n.slug === slug);

  if (!note) {
    notFound();
  }

  return (
    <article className="min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Study Notes</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {note.category}
            </span>
          </div>
        </div>

        {/* Notion-Style Document Header */}
        <div className="mb-10">
          {/* Cover Art Banner if available */}
          {note.coverImage && (
            <div className="relative aspect-[21/9] sm:aspect-[24/9] w-full rounded-3xl overflow-hidden mb-6 bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
              <Image
                src={note.coverImage}
                alt={note.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover object-center"
              />
            </div>
          )}

          {/* Large Notion Page Icon */}
          <div className="text-4xl sm:text-5xl mb-4 leading-none inline-block p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {note.icon}
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {note.title}
          </h1>

          <p className="mt-4 text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {note.shortDesc}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>{note.updatedAt}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>{note.readTime}</span>
            </div>
            {note.linkedReelUrl && (
              <a
                href={note.linkedReelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-pink-500 font-semibold hover:underline"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>Watch Reel on Instagram</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            <div className="sm:ml-auto">
              <ReactionButton
                targetId={note.slug}
                targetType="note"
                label="Helpful"
              />
            </div>
          </div>
        </div>

        {/* Key Takeaways Box (Notion Callout) */}
        {note.keyTakeaways && note.keyTakeaways.length > 0 && (
          <div className="mb-10 p-6 rounded-2xl bg-cyan-500/5 dark:bg-cyan-500/10 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-cyan-500" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Key Architecture Takeaways
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {note.keyTakeaways.map((takeaway, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                  <span>{takeaway}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-8">
          {note.sections.map((section, idx) => {
            if (section.type === "callout") {
              const isWarning = section.calloutType === "warning";
              const isTip = section.calloutType === "tip";
              return (
                <div
                  key={idx}
                  className={`p-5 rounded-2xl border ${
                    isWarning
                      ? "bg-amber-500/5 border-amber-500/20 text-amber-900 dark:text-amber-200"
                      : isTip
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-900 dark:text-emerald-200"
                      : "bg-slate-100 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                    {isWarning ? (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    ) : isTip ? (
                      <Sparkles className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Info className="w-4 h-4 text-cyan-500" />
                    )}
                    <span>{section.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-95">
                    {Array.isArray(section.content) ? section.content.join("\n\n") : section.content}
                  </p>
                </div>
              );
            }

            if (section.type === "code" && section.codeSnippet) {
              return (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                  {section.codeSnippet.caption && (
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {section.codeSnippet.caption}
                    </p>
                  )}
                  <div className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0d1117]">
                    <div className="px-4 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                      <span>{section.codeSnippet.language}</span>
                      <span>UTF-8</span>
                    </div>
                    <pre className="p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed">
                      <code>{section.codeSnippet.code}</code>
                    </pre>
                  </div>
                </div>
              );
            }

            if (section.type === "diagram") {
              return (
                <div key={idx} className="space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                    {section.title}
                  </h3>
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs sm:text-sm text-cyan-400 overflow-x-auto whitespace-pre">
                    {section.content}
                  </div>
                </div>
              );
            }

            // Default Text Section
            return (
              <div key={idx} className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h3>
                {Array.isArray(section.content) ? (
                  section.content.map((p, pIdx) => (
                    <p key={pIdx} className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                      {p}
                    </p>
                  ))
                ) : (
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {section.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Feedback & Neon Cloud Upvote */}
        <div className="mt-12 p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Found this architecture note helpful?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Upvotes persist directly to Neon Postgres and highlight the most practical patterns.
            </p>
          </div>
          <ReactionButton
            targetId={note.slug}
            targetType="note"
            label="Upvote This Note"
          />
        </div>

        {/* Live Discussion Thread (Neon Postgres) */}
        <CommentsSection
          targetId={note.slug}
          targetType="note"
          title={`Community Discussion (${note.title})`}
        />

        {/* Footer Next Steps */}
        <div className="mt-14 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/notes"
            className="text-xs sm:text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5"
          >
            <BookOpen className="w-4 h-4" />
            <span>Explore More Study Notes</span>
          </Link>

          <Link
            href="/roadmaps"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs sm:text-sm shadow-md hover:opacity-95 transition-opacity"
          >
            Explore Interactive Roadmaps →
          </Link>
        </div>
      </div>
    </article>
  );
}
