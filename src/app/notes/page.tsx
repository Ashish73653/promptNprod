"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { studyNotes } from "@/data/notes";
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Tag, 
  ArrowUpRight, 
  Clock, 
  Layers, 
  CheckCircle2,
  Database,
  Bot,
  ExternalLink
} from "lucide-react";

const categories = ["All", "AI & Agents", "Databases & SQL", "System Design"];

export default function NotesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = useMemo(() => {
    return studyNotes.filter((note) => {
      const matchesCategory = selectedCategory === "All" || note.category === selectedCategory;
      const matchesQuery = 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Banner */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Notion-Powered Engineering Vault</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Visual Study Notes &amp; Patterns
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            High-signal architecture flowcharts, system design breakdowns, and SQL patterns directly from our engineering notebook.
          </p>

          {/* Notion Sync Badge */}
          <div className="mt-5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Synced with Notion Workspace</span>
            <span className="text-slate-400">•</span>
            <span className="font-mono text-cyan-500 font-bold">{studyNotes.length} Notes Live</span>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 overflow-x-auto max-w-full">
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
              placeholder="Search concepts, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-sm bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        {/* Study Notes Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredNotes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="group glass-card rounded-2xl overflow-hidden flex flex-col justify-between hover:border-cyan-500/40 transition-all duration-200 hover:-translate-y-1"
            >
              <div>
                {/* Visual Cover Preview if available */}
                {note.coverImage ? (
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <Image
                      src={note.coverImage}
                      alt={note.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/80 backdrop-blur-md text-white border border-white/20">
                      {note.category}
                    </div>
                  </div>
                ) : (
                  <div className="h-3 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500" />
                )}

                <div className="p-5 sm:p-6">
                  {/* Note Icon & Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-2xl p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 leading-none">
                      {note.icon}
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{note.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {note.title}
                  </h3>

                  {/* Short Description */}
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {note.shortDesc}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {note.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action */}
              <div className="px-5 sm:px-6 py-3.5 bg-slate-50/50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                <span>Read Study Note</span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {filteredNotes.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No notes found</h3>
            <p className="text-sm text-slate-500 mt-1">Try clearing your search query or picking another category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
