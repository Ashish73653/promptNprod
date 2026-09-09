"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Meme } from "@/types";
import { Laugh, ArrowRight, Heart } from "lucide-react";

interface MemeStripProps {
  memes: Meme[];
}

export function MemeStrip({ memes }: MemeStripProps) {
  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Laugh className="w-3.5 h-3.5" /> Dev Culture
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Production Pain & AI Memes
            </h2>
          </div>
          <Link
            href="/memes"
            className="inline-flex items-center gap-1 text-sm font-semibold text-rose-500 hover:text-rose-600 transition-colors"
          >
            <span>Visit Meme Vault</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Memes 3-col preview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {memes.slice(0, 3).map((meme) => (
            <Link
              key={meme.id}
              href="/memes"
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
                <Image
                  src={meme.image}
                  alt={meme.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/70 backdrop-blur-md text-white border border-white/20">
                  {meme.category}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                    {meme.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 italic line-clamp-2">
                    &ldquo;{meme.caption}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span>@{meme.author}</span>
                  <span className="flex items-center gap-1 text-rose-500 font-bold">
                    <Heart className="w-3.5 h-3.5 fill-current" /> {meme.upvotes}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
