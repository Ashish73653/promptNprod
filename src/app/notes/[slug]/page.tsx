import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db, studyNotes as studyNotesTable } from "@/db";
import { eq } from "drizzle-orm";
import { 
  ArrowLeft, 
  ExternalLink, 
  Download, 
  Sparkles, 
  Calendar, 
  BookOpen, 
  Share2,
  FileText
} from "lucide-react";
import { getGoogleDriveEmbedUrl, getGoogleDriveDownloadUrl } from "@/lib/drive";
import { ReactionButton } from "@/components/common/ReactionButton";
import { CommentsSection } from "@/components/common/CommentsSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function NoteDetailPage({ params }: PageProps) {
  const { slug } = await params;

  let note = null;

  if (db) {
    try {
      const rows = await db
        .select()
        .from(studyNotesTable)
        .where(eq(studyNotesTable.slug, slug))
        .limit(1);

      if (rows.length > 0) {
        note = rows[0];
      }
    } catch (err) {
      console.error("Error fetching note by slug:", err);
    }
  }

  if (!note) {
    notFound();
  }

  const embedUrl = getGoogleDriveEmbedUrl(note.driveUrl);
  const downloadUrl = getGoogleDriveDownloadUrl(note.driveUrl);

  return (
    <article className="min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/notes"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-cyan-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Study Notes</span>
          </Link>

          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
            {note.category}
          </span>
        </div>

        {/* Note Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
            {note.title}
          </h1>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {note.description}
          </p>

          {/* Metadata & Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
              {note.pagesCount && <span>{note.pagesCount} Pages</span>}
              {note.fileSize && <span>• {note.fileSize}</span>}
              <span>
                • Added {new Date(note.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Direct Download Button */}
              <a
                href={downloadUrl || note.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs sm:text-sm font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>

              {/* Open in Google Drive */}
              <a
                href={note.driveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs sm:text-sm font-semibold border border-slate-200 dark:border-slate-700 transition-colors"
              >
                <span>Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Upvote Button (Neon Postgres) */}
              <ReactionButton
                targetId={note.slug}
                targetType="note"
                label="Helpful"
              />
            </div>
          </div>
        </div>

        {/* Embedded Google Drive PDF Viewer Container */}
        <div className="my-8 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-[#0c121e] shadow-2xl">
          <div className="px-5 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interactive In-App PDF Document Viewer</span>
            </span>
            <a
              href={note.driveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>Pop-out in Google Drive</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative w-full h-[650px] sm:h-[800px] bg-slate-950">
            <iframe
              src={embedUrl}
              title={note.title}
              className="w-full h-full border-0"
              allow="autoplay"
            />
          </div>
        </div>

        {/* Tags if provided */}
        {note.tags && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-1">
              Topics:
            </span>
            {note.tags
              .split(",")
              .filter(Boolean)
              .map((tag: string, idx: number) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60"
                >
                  #{tag.trim()}
                </span>
              ))}
          </div>
        )}

        {/* Feedback & Neon Cloud Upvote */}
        <div className="mt-10 p-6 sm:p-7 rounded-3xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Found this study note helpful for your preparation?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your upvote helps surface high-signal revision notes to the developer community.
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
          title={`Discussion & Questions (${note.title})`}
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
