"use client";

import React from "react";
import Image from "next/image";
import { InstagramIcon } from "../ui/Icons";
import { ArrowUpRight, Heart, MessageCircle, Play, Layers, Sparkles } from "lucide-react";

interface InstaPost {
  id: string;
  type: "reel" | "carousel" | "post";
  title: string;
  caption: string;
  image: string;
  likes: string;
  comments: string;
  tag: string;
}

const instaPosts: InstaPost[] = [
  {
    id: "insta-1",
    type: "reel",
    title: "5 Production Architecture Traps AI Startups Fall Into",
    caption: "Stop paying for 10 vector databases before you even benchmark BM25 hybrid search. Here's what we learned deploying to 50k users.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    likes: "2.8k",
    comments: "142",
    tag: "Architecture",
  },
  {
    id: "insta-2",
    type: "carousel",
    title: "How Model Context Protocol (MCP) Actually Works",
    caption: "Anthropic's open standard explained in 5 visual slides. From JSON-RPC 2.0 to SQLite and local filesystem tool calling.",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    likes: "3.4k",
    comments: "215",
    tag: "AI Agents",
  },
  {
    id: "insta-3",
    type: "reel",
    title: "When the 2AM Friday deploy actually passes all unit tests",
    caption: "Staring at the CI/CD pipeline green checkmark like it's a mirage in the desert. #DevLife #OnCall",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
    likes: "4.9k",
    comments: "380",
    tag: "Dev Humor",
  },
  {
    id: "insta-4",
    type: "post",
    title: "Full-Stack AI Engineer Roadmap for 2026",
    caption: "What to learn first: Prompt engineering vs RAG vs Local fine-tuning. The complete structured breakdown.",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
    likes: "2.1k",
    comments: "96",
    tag: "Roadmap",
  },
];

export function InstagramSection() {
  const profileUrl = "https://www.instagram.com/promptnprod";

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 via-rose-500/10 to-amber-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider mb-2 border border-rose-500/20">
              <InstagramIcon className="w-3.5 h-3.5 text-pink-500" />
              <span>@promptnprod on Instagram</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Visual Breakdowns & Daily Reels
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
              Bite-sized architecture carousels, local model demos, production teardowns, and relatable developer humor.
            </p>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] shrink-0"
          >
            <InstagramIcon className="w-4 h-4" />
            <span>Follow @promptnprod</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Instagram Post Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instaPosts.map((post) => (
            <a
              key={post.id}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-pink-500/40 transition-all hover:-translate-y-1 duration-200"
            >
              {/* Media Thumbnail with Badges */}
              <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Top Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-black/75 backdrop-blur-md text-white border border-white/20">
                    {post.tag}
                  </span>

                  <span className="p-1.5 rounded-full bg-black/75 backdrop-blur-md text-white border border-white/20">
                    {post.type === "reel" ? (
                      <Play className="w-3 h-3 fill-current text-white" />
                    ) : post.type === "carousel" ? (
                      <Layers className="w-3 h-3 text-white" />
                    ) : (
                      <Sparkles className="w-3 h-3 text-pink-400" />
                    )}
                  </span>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-bold text-xs flex items-center gap-1 border border-white/30">
                    <InstagramIcon className="w-3.5 h-3.5" />
                    <span>View on Instagram</span>
                  </span>
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                {/* Engagement Bar */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 text-rose-500 font-semibold">
                      <Heart className="w-3.5 h-3.5 fill-current" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
                    </span>
                  </div>

                  <span className="text-[11px] text-pink-500 font-sans font-bold flex items-center gap-0.5">
                    Open <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom Instagram Banner CTA */}
        <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-amber-500/10 border border-pink-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-pink-500/20 shrink-0">
              <InstagramIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                Follow @promptnprod for Daily Developer Intelligence
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                New reels & architecture breakdowns posted weekly. Tag us in your builds to get featured.
              </p>
            </div>
          </div>

          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 text-xs font-bold shrink-0 transition-colors flex items-center gap-1.5"
          >
            <span>Visit @promptnprod</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
