import React from "react";
import { Hero } from "@/components/home/Hero";
import { StudyNotesSection } from "@/components/home/StudyNotesSection";
import { InstagramSection } from "@/components/home/InstagramSection";
import { RoadmapSection } from "@/components/home/RoadmapSection";
import { TrendingFeed } from "@/components/home/TrendingFeed";
import { MemeStrip } from "@/components/home/MemeStrip";
import { NewsletterBox } from "@/components/common/NewsletterBox";
import { articles } from "@/data/articles";
import { roadmaps } from "@/data/roadmaps";

export default function HomePage() {
  return (
    <div className="space-y-4 sm:space-y-8">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Notion-Powered Visual Study Notes & Cheatsheets */}
      <StudyNotesSection />

      {/* 3. Real Reels & Posts from @promptnprod with Interactive Embeds */}
      <InstagramSection />

      {/* 4. Curated Engineering Roadmaps with Hands-On Projects */}
      <RoadmapSection roadmaps={roadmaps} />

      {/* 5. High-Signal Tech News & Release Radar */}
      <TrendingFeed articles={articles} />

      {/* 6. Developer Culture & Daily Dev Memes (Live Reddit Sync) */}
      <MemeStrip />

      {/* 7. Lightweight Email Signup Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <NewsletterBox
          source="homepage"
          title="Get Notified When New Notes & Roadmaps Drop"
          subtitle="Join developers learning system architecture, cloud engineering, and modern web stacks with zero fluff."
        />
      </section>
    </div>
  );
}
