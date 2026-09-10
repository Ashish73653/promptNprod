"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { studyNotes } from "@/data/notes";
import { Sparkles, ArrowRight, Clock, BookOpen, ArrowUpRight } from "lucide-react";

export function StudyNotesSection() {
  const featuredNotes = studyNotes.slice(0, 3);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 fill-current" /> Notion-Powered Study Vault
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Visual Study Notes &amp; Patterns
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
              Architecture flowcharts, SQL mental models, and AI concepts directly from our engineering notebook.
            </p>
          </div>

          <Link
            href="/notes"
            className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline shrink-0"
          >
            <span>View All Study Notes</span>
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
              <div>
                {/* Cover image if available */}
                {note.coverImage ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <Image
                      src={note.coverImage}
                      alt={note.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                      {note.category}
                    </div>
                  </div>
                ) : (
                  <div className="h-3 bg-gradient-to-r from-cyan-500 to-blue-600" />
                )}

                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span className="text-xl p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 leading-none">
                      {note.icon}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {note.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {note.shortDesc}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>Read Note</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
