"use client";

import React, { useState } from "react";
import Image from "next/image";
import { InstagramIcon } from "../ui/Icons";
import { 
  ArrowUpRight, 
  Heart, 
  MessageCircle, 
  Play, 
  Layers, 
  Sparkles, 
  X, 
  ExternalLink,
  Flame
} from "lucide-react";

interface RealInstaPost {
  id: string;
  type: "reel" | "post";
  url: string;
  embedUrl: string;
  title: string;
  caption: string;
  tag: string;
  highlight?: string;
  fallbackImage: string;
}

const realInstaPosts: RealInstaPost[] = [
  {
    id: "DdCT_cnTXnL",
    type: "reel",
    url: "https://www.instagram.com/reel/DdCT_cnTXnL/",
    embedUrl: "https://www.instagram.com/reel/DdCT_cnTXnL/embed",
    title: "HOW DO AI AGENTS ACTUALLY WORK?",
    caption: "Finally finished the feature. git pull Git: CONFLICTS: 47 💀 I just wanted to go home bro 😭",
    tag: "AI Agents & Git",
    highlight: "Featured Reel",
    fallbackImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "DdCRSjyjXAj",
    type: "post",
    url: "https://www.instagram.com/p/DdCRSjyjXAj/",
    embedUrl: "https://www.instagram.com/p/DdCRSjyjXAj/embed",
    title: "RAG Architecture: It Was Free vs It Was NOT Free",
    caption: "It was free. It was NOT free. 💀 AWS: 📈 Me: 📉 Welcome to Prompt N Prod 🤖☁️",
    tag: "RAG & Cloud Costs",
    highlight: "Architecture Teardown",
    fallbackImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "DdCQl6wzMNb",
    type: "reel",
    url: "https://www.instagram.com/reel/DdCQl6wzMNb/",
    embedUrl: "https://www.instagram.com/reel/DdCQl6wzMNb/embed",
    title: "8 AI Concepts You Need to Know in 2026",
    caption: "asked AI to fix ONE bug. AI: “I have a better idea.” 💀 me: bro… I said ONE bug 😭 Welcome to Prompt N Prod 💀",
    tag: "AI Engineering",
    highlight: "Tech Breakdown",
    fallbackImage: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "DdEwTujz-LV",
    type: "reel",
    url: "https://www.instagram.com/reel/DdEwTujz-LV/",
    embedUrl: "https://www.instagram.com/reel/DdEwTujz-LV/embed",
    title: "Building. Breaking. Deploying.",
    caption: "POV: it worked in dev 💀 Follow for real-world production chaos.",
    tag: "Dev Reality",
    highlight: "Trending Reel",
    fallbackImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "DdEvoULz_5D",
    type: "reel",
    url: "https://www.instagram.com/reel/DdEvoULz_5D/",
    embedUrl: "https://www.instagram.com/reel/DdEvoULz_5D/embed",
    title: "From Prompt to Production 🚀",
    caption: "High-signal engineering meets everyday developer life. #devmemes #techchaos",
    tag: "Full-Stack Dev",
    fallbackImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "DdEn7p-zfrg",
    type: "reel",
    url: "https://www.instagram.com/reel/DdEn7p-zfrg/",
    embedUrl: "https://www.instagram.com/reel/DdEn7p-zfrg/embed",
    title: "Friday 5PM Production Deploy",
    caption: "Live on prod with 0 downtime 🤖☁️ When the docker container finally spins up smoothly.",
    tag: "DevOps & Cloud",
    fallbackImage: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80",
  },
];

export function InstagramSection() {
  const profileUrl = "https://www.instagram.com/promptnprod";
  const [activeEmbedPost, setActiveEmbedPost] = useState<RealInstaPost | null>(null);

  return (
    <section className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-500/10 via-rose-500/5 to-amber-500/10 border border-pink-500/20 backdrop-blur-xl mb-10 shadow-lg shadow-pink-500/5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Bio & Avatar */}
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600 shadow-md shrink-0">
                <div className="relative w-full h-full rounded-[14px] overflow-hidden bg-slate-950 flex items-center justify-center">
                  <Image
                    src="/Logo.png"
                    alt="Prompt N Prod Instagram"
                    fill
                    className="object-contain p-1.5"
                    sizes="64px"
                  />
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                    Prompt N Prod
                  </h3>
                  <a
                    href={profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-pink-500 hover:underline flex items-center gap-0.5"
                  >
                    @promptnprod
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-500/30">
                    Official Instagram
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium">
                  🤖 AI • ☁️ Cloud • 💻 Dev &nbsp;|&nbsp; POV: it worked in dev 💀 &nbsp;|&nbsp; Building. Breaking. Deploying.
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  👇 Follow for daily dev reels, architecture teardowns, and tech chaos
                </p>
              </div>
            </div>

            {/* Profile CTA */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] flex items-center gap-2"
              >
                <InstagramIcon className="w-4 h-4" />
                <span>Follow on Instagram</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-pink-500 flex items-center gap-1.5 mb-1">
              <Flame className="w-3.5 h-3.5 fill-current" /> Live From Our Instagram Feed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real Reels & Posts from @promptnprod
            </h2>
          </div>
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm font-semibold text-pink-500 hover:text-pink-600 transition-colors flex items-center gap-1 shrink-0"
          >
            <span>View All on Instagram</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        {/* Real Post Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {realInstaPosts.map((post) => (
            <div
              key={post.id}
              className="glass-card rounded-2xl overflow-hidden group flex flex-col justify-between hover:border-pink-500/40 transition-all duration-200"
            >
              {/* Media Thumbnail with Interactive Play Trigger */}
              <div 
                onClick={() => setActiveEmbedPost(post)}
                className="relative aspect-video w-full overflow-hidden bg-slate-900 cursor-pointer"
              >
                <Image
                  src={post.fallbackImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                    ) : (
                      <Layers className="w-3 h-3 text-white" />
                    )}
                  </span>
                </div>

                {/* Center Watch Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                  <span className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-pink-500/20 hover:scale-105 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Interactive Reel</span>
                  </span>
                </div>
              </div>

              {/* Caption Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  {post.highlight && (
                    <span className="text-[10px] font-bold text-pink-500 uppercase tracking-wider block mb-1">
                      {post.highlight}
                    </span>
                  )}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors line-clamp-1">
                    {post.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 italic leading-relaxed line-clamp-2">
                    &ldquo;{post.caption}&rdquo;
                  </p>
                </div>

                {/* Footer Action Row */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
                  <button
                    onClick={() => setActiveEmbedPost(post)}
                    className="text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-500 flex items-center gap-1 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current text-pink-500" />
                    <span>Watch Embed</span>
                  </button>

                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <span>Open in Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Instagram Embed Lightbox Modal */}
      {activeEmbedPost && (
        <div
          onClick={() => setActiveEmbedPost(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c121e] shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-pink-500" />
                <span className="font-bold text-sm text-slate-900 dark:text-white truncate max-w-[280px]">
                  {activeEmbedPost.title}
                </span>
              </div>
              <button
                onClick={() => setActiveEmbedPost(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Instagram Embed Frame */}
            <div className="relative w-full h-[520px] bg-black">
              <iframe
                src={activeEmbedPost.embedUrl}
                className="w-full h-full border-0"
                allowTransparency={true}
                allow="encrypted-media"
                title={activeEmbedPost.title}
              />
            </div>

            {/* Modal Bottom CTA */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Posted on @promptnprod
              </span>
              <a
                href={activeEmbedPost.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-pink-500/20"
              >
                <span>Open in App / Web</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
