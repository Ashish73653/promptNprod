import React from "react";
import { memes } from "@/data/memes";
import { MemeGallery } from "@/components/memes/MemeGallery";
import { Laugh, Sparkles } from "lucide-react";

export const metadata = {
  title: "Developer Memes & Culture",
  description:
    "Production incidents, Friday deploys, AI hype, and CSS pain. The relatable developer culture vault.",
};

export default function MemesPage() {
  return (
    <div className="py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider mb-3 border border-rose-500/20">
            <Laugh className="w-3.5 h-3.5" /> Dev Culture & Humor
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Developer Memes & Friday Deploys
          </h1>
          <p className="mt-3 text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Software engineering is hard, but laughing at 2AM production outages and recursive agent loops makes it tolerable. Vote on your favorites and share with your team.
          </p>
        </div>

        {/* Interactive Gallery */}
        <MemeGallery initialMemes={memes} />
      </div>
    </div>
  );
}
