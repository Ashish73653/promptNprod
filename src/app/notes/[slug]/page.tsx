import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db, studyNotes as studyNotesTable } from "@/db";
import { eq } from "drizzle-orm";
import { 
  ArrowLeft, 
  ExternalLink, 
  BookOpen, 
  FileText,
  Sparkles
} from "lucide-react";
import { getGoogleDriveEmbedUrl, getGoogleDriveDownloadUrl } from "@/lib/drive";
import { ReactionButton } from "@/components/common/ReactionButton";
import { CommentsSection } from "@/components/common/CommentsSection";
import { ShareButtons } from "@/components/common/ShareButtons";
import { NewsletterBox } from "@/components/common/NewsletterBox";
import { NoteDownloadButton } from "@/components/notes/NoteDownloadButton";
import { ReadingProgress } from "@/components/ui/ReadingProgress";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!db) {
    return {
      title: "Study Note | Prompt N Prod",
    };
  }

  try {
    const rows = await db
      .select()
      .from(studyNotesTable)
      .where(eq(studyNotesTable.slug, slug))
      .limit(1);

    if (rows.length > 0) {
      const note = rows[0];
      const ogUrl = `/api/og?title=${encodeURIComponent(note.title)}&category=${encodeURIComponent(note.category)}&type=Study%20Note`;
      return {
        title: `${note.title} - Free Developer Study Notes | Prompt N Prod`,
        description: note.description,
        openGraph: {
          title: `${note.title} | Prompt N Prod Study Notes`,
          description: note.description,
          images: [
            {
              url: ogUrl,
              width: 1200,
              height: 630,
              alt: note.title,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: `${note.title} | Prompt N Prod`,
          description: note.description,
          images: [ogUrl],
        },
      };
    }
  } catch (err) {
    console.error("Error generating note metadata:", err);
  }

  return {
    title: "Study Note | Prompt N Prod",
  };
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
  const downloadUrl = getGoogleDriveDownloadUrl(note.driveUrl) || note.driveUrl;

  // "New" badge: published within last 14 days
  const isNew = note.createdAt
    ? (Date.now() - new Date(note.createdAt).getTime()) < 14 * 24 * 60 * 60 * 1000
    : false;

  return (
    <article className="min-h-screen py-10 sm:py-16">
      {/* Reading progress bar */}
      <ReadingProgress />
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

          <div className="flex items-center gap-2">
            {isNew && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                <Sparkles className="w-3 h-3" /> New
              </span>
            )}
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
              {note.category}
            </span>
          </div>
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

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Direct Download Button with Vercel Analytics tracking */}
              <NoteDownloadButton
                slug={note.slug}
                title={note.title}
                downloadUrl={downloadUrl}
              />

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

              {/* Social Share Component */}
              <ShareButtons
                title={note.title}
                category={note.category}
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

        {/* Newsletter Signup Box for New Notes */}
        <div className="mt-12">
          <NewsletterBox
            source={`note_${note.slug}`}
            title={`Get notified when new ${note.category} notes drop`}
            subtitle="Subscribe to get fresh revision cheatsheets, interview questions, and architecture blueprints directly in your inbox."
          />
        </div>

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
