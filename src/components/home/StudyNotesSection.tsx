"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, FileText, ArrowUpRight, Download, Eye } from "lucide-react";
import { StudyNoteDb } from "@/db";

export function StudyNotesSection() {
  const [featuredNotes, setFeaturedNotes] = useState<StudyNoteDb[]>([]);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        if (data.success && Array.isArray(data.notes)) {
          setFeaturedNotes(data.notes.slice(0, 3));
        }
      } catch (err) {
        console.error("Failed to fetch featured notes:", err);
      }
    }

    loadFeatured();
  }, []);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Curated PDF Study Vault
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Visual Study Notes &amp; Exam Cheatsheets
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              High-signal revision notes for AWS Certifications, DBMS internals, SQL, and AI systems. Read embedded or open in Google Drive.
            </p>
          </div>

          <Link
            href="/notes"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
          >
            <span>Explore All Study Notes ({featuredNotes.length > 0 ? "5+" : ""})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredNotes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                    {note.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <FileText className="w-3.5 h-3.5 text-cyan-500" />
                    <span>{note.pagesCount ? `${note.pagesCount}p` : "PDF"}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2">
                  {note.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                  {note.description}
                </p>

                {note.tags && (
                  <div className="flex flex-wrap gap-1 mt-3.5">
                    {note.tags
                      .split(",")
                      .slice(0, 2)
                      .map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        >
                          #{t.trim()}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read PDF Online</span>
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
