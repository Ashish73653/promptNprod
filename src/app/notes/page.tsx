"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  FileText, 
  Search, 
  Sparkles, 
  Download, 
  ExternalLink, 
  BookOpen, 
  Eye, 
  Layers, 
  CheckCircle2, 
  Heart,
  Loader2,
  Lock,
  PlusCircle,
  ThumbsUp,
  MessageSquarePlus,
  Clock
} from "lucide-react";
import { StudyNoteDb, NoteRequestDb } from "@/db";
import { PdfViewerModal } from "@/components/notes/PdfViewerModal";
import { RequestNoteModal } from "@/components/notes/RequestNoteModal";
import { NewsletterBox } from "@/components/common/NewsletterBox";

export default function NotesPage() {
  const [notes, setNotes] = useState<StudyNoteDb[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Community Note Requests
  const [requests, setRequests] = useState<NoteRequestDb[]>([]);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [upvotingId, setUpvotingId] = useState<number | null>(null);

  // Active PDF for in-page embedded reading
  const [activePdf, setActivePdf] = useState<{
    title: string;
    driveUrl: string;
    category: string;
  } | null>(null);

  const loadNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      if (data.success && Array.isArray(data.notes)) {
        setNotes(data.notes);
        if (data.categories) {
          setCategories(data.categories);
        }
      }
    } catch (err) {
      console.error("Failed to load study notes:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRequests = async () => {
    try {
      const res = await fetch("/api/note-requests?limit=10");
      const data = await res.json();
      if (data.success && Array.isArray(data.requests)) {
        setRequests(data.requests);
      }
    } catch (err) {
      console.error("Failed to load note requests:", err);
    }
  };

  useEffect(() => {
    loadNotes();
    loadRequests();
  }, []);

  const handleUpvote = async (requestId: number) => {
    setUpvotingId(requestId);
    try {
      const res = await fetch("/api/note-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upvote", id: requestId }),
      });
      const data = await res.json();
      if (data.success && data.request) {
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, upvotes: r.upvotes + 1 } : r))
        );
      }
    } catch (err) {
      console.error("Upvote error:", err);
    } finally {
      setUpvotingId(null);
    }
  };

  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesCategory =
        selectedCategory === "All" || note.category === selectedCategory;
      const matchesQuery =
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (note.tags && note.tags.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [notes, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Engineering Study Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            Visual Study Notes &amp; PDF Cheatsheets
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            Hand-curated revision notes, architectural flowcharts, and exam cheat sheets for AWS certifications, DBMS internals, SQL, and AI engineering. Read online or open in Google Drive.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Neon Cloud Synced</span>
              <span className="text-slate-400">•</span>
              <span className="font-mono text-cyan-500 font-bold">{notes.length} Notes Live</span>
            </div>

            {/* Request Note Action Button */}
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Request a Cheatsheet</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Dynamic Category Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search AWS, DBMS, SQL, AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Study Notes Card Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-3xl p-6 border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900/40 animate-pulse h-64"
              />
            ))}
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
              No notes found
            </h3>
            <p className="text-xs text-slate-400 mt-1 mb-4">
              Can&apos;t find what you&apos;re looking for? Submit a request and we&apos;ll create it!
            </p>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 hover:bg-cyan-600 transition-all"
            >
              Request this Topic Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="group rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0c121e] hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-6 sm:p-7">
                  {/* Category Badge, New badge & Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        {note.category}
                      </span>
                      {/* "New" badge: published within last 14 days */}
                      {note.createdAt &&
                        Date.now() - new Date(note.createdAt).getTime() < 14 * 24 * 60 * 60 * 1000 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse">
                          ✦ New
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      {note.pagesCount && <span>{note.pagesCount} pages</span>}
                      {note.fileSize && <span>• {note.fileSize}</span>}
                    </div>
                  </div>

                  {/* Title */}
                  <Link href={`/notes/${note.slug}`}>
                    <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors leading-snug line-clamp-2">
                      {note.title}
                    </h2>
                  </Link>

                  {/* Description */}
                  <p className="mt-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                    {note.description}
                  </p>

                  {/* Tags */}
                  {note.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {note.tags
                        .split(",")
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400"
                          >
                            #{tag.trim()}
                          </span>
                        ))}
                    </div>
                  )}
                </div>

                {/* Bottom Actions Bar */}
                <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/40 flex items-center justify-between gap-2">
                  {/* Read PDF Embedded */}
                  <button
                    onClick={() =>
                      setActivePdf({
                        title: note.title,
                        driveUrl: note.driveUrl,
                        category: note.category,
                      })
                    }
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold border border-cyan-500/20 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Read PDF</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {/* Open in Google Drive */}
                    <a
                      href={note.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      title="Open in Google Drive"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    {/* View Details / Discussions */}
                    <Link
                      href={`/notes/${note.slug}`}
                      className="p-2 rounded-xl text-slate-400 hover:text-cyan-500 hover:bg-cyan-500/10 transition-colors"
                      title="View Details & Comments"
                    >
                      <BookOpen className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Community Requested Notes Section */}
        <section className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <Sparkles className="w-3.5 h-3.5" /> Community Wishlist
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Requested Topics &amp; Cheatsheets
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Vote for what notes we should author next, or submit your own request.
              </p>
            </div>

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Ask for New Notes</span>
            </button>
          </div>

          {requests.length === 0 ? (
            <div className="p-8 rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-center">
              <p className="text-xs text-slate-500">
                No open community requests yet. Be the first to ask for a topic!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requests.map((req) => {
                const isFulfilled = req.status === "fulfilled";
                const isInProgress = req.status === "in_progress";

                return (
                  <div
                    key={req.id}
                    className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:border-cyan-500/30 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                          {req.category}
                        </span>

                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isFulfilled
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                              : isInProgress
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}
                        >
                          {isFulfilled ? "✓ Published" : isInProgress ? "⚡ In Progress" : "Queued"}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {req.topic}
                      </h3>

                      {req.details && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {req.details}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-400">
                        {req.userContact ? `By ${req.userContact}` : "Community request"}
                      </span>

                      <button
                        onClick={() => handleUpvote(req.id)}
                        disabled={upvotingId === req.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-cyan-500/10 hover:text-cyan-500 transition-colors font-semibold text-slate-700 dark:text-slate-300 cursor-pointer"
                        title="Upvote this request"
                      >
                        <ThumbsUp className="w-3 h-3 text-cyan-500" />
                        <span>{req.upvotes}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Newsletter Box */}
        <div className="mt-14">
          <NewsletterBox
            source="notes_vault"
            title="Get Notified When Requested Notes Are Published"
            subtitle="Never miss a revision cheatsheet. Enter your email to be the first to know when community-requested notes and architectural breakdowns go live."
          />
        </div>

        {/* In-Page Embedded PDF Modal */}
        {activePdf && (
          <PdfViewerModal
            isOpen={!!activePdf}
            onClose={() => setActivePdf(null)}
            title={activePdf.title}
            driveUrl={activePdf.driveUrl}
            category={activePdf.category}
          />
        )}

        {/* Request Note Modal */}
        <RequestNoteModal
          isOpen={isRequestModalOpen}
          onClose={() => setIsRequestModalOpen(false)}
          onRequestSubmitted={(newReq) => {
            setRequests((prev) => [newReq, ...prev]);
          }}
        />
      </div>
    </div>
  );
}

