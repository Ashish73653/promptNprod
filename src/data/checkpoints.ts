import { RoadmapCheckpoint } from "@/types";

export const roadmapCheckpoints: RoadmapCheckpoint[] = [
  {
    phase: "Phase 1 - Core Foundation",
    checkpointNumber: 1,
    title: "Core Platform Architecture",
    status: "Live",
    duration: "2-4 weeks",
    summary: "A high-performance static content platform with zero database overhead. Complete with Next.js 16, Tailwind CSS, Lucide icons, dark/light theme, client-side Fuse.js fuzzy search, and GPU-composited animations.",
    techStack: ["Next.js 16 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "Fuse.js", "next-themes"],
    keyDeliverable: "Public live site with interactive Roadmaps, Project Blueprints, 'Should I Learn This?' Scorecards, Dev Memes, and Global ⌘K Search.",
    highlights: [
      "Hardware-accelerated compositor animations with sub-50ms response times",
      "Interactive milestone checklist with localStorage memory",
      "Instant client-side fuzzy search across all content types",
      "Dynamic 'Should I Learn This?' evaluation matrix"
    ]
  },
  {
    phase: "Phase 2 - Content Management",
    checkpointNumber: 2,
    title: "Headless Content Management & Community Hub",
    status: "Live",
    duration: "1-2 weeks",
    summary: "Git-based Markdown parsing with gray-matter, visual authoring studio (/admin/editor), automated live Reddit developer meme synchronization, and community submission flows.",
    techStack: ["Git-based Markdown", "gray-matter", "Visual Article Studio", "Reddit Meme API Sync", "localStorage Persistence"],
    keyDeliverable: "Publish articles via Markdown files or the interactive Article Studio, submit memes via community modal, and sync live developer memes on demand.",
    highlights: [
      "File-based publishing: Drop any .md file into content/articles/ to instantly generate SSG pages",
      "Interactive Article Studio with live scorecard preview, syntax highlighting, and .md download",
      "Live Reddit sync pulling trending developer memes directly from r/ProgrammerHumor",
      "Community meme submission modal with live image preview"
    ]
  },
  {
    phase: "Phase 3 - Real Data Layer",
    checkpointNumber: 3,
    title: "Managed Postgres & API Layer",
    status: "Planned",
    duration: "2-3 weeks",
    summary: "Transition from static JSON/MDX into a managed Postgres database via Supabase or Neon, with Drizzle ORM and Next.js Route Handlers.",
    techStack: ["Postgres (Supabase / Neon)", "Drizzle ORM", "Next.js Route Handlers", "Zod Validation"],
    keyDeliverable: "Relational data model for Articles, Roadmaps, User Bookmarks, Upvotes, and Submission workflows.",
    highlights: [
      "ACID transactions and type-safe schemas",
      "Row-Level Security (RLS) policies",
      "Real-time live upvote sync across concurrent users"
    ]
  },
  {
    phase: "Phase 4 - Automated Feed",
    checkpointNumber: 4,
    title: "Automated Tech News Ingestion",
    status: "Planned",
    duration: "2-3 weeks",
    summary: "Scheduled serverless cron jobs pulling the latest releases from GitHub, RSS feeds (Hacker News, TechCrunch, ArXiv), and YouTube dev channels.",
    techStack: ["Vercel Cron / GitHub Actions", "RSS Parsers", "GitHub REST API", "Deduplication Engine"],
    keyDeliverable: "Fresh tech developments appear automatically in a 'Pending Review' queue without manual data entry.",
    highlights: [
      "Intelligent deduplication across multiple sources",
      "Automated release note extraction from GitHub tags",
      "Configurable scheduling rules"
    ]
  },
  {
    phase: "Phase 5 - AI Intelligence Layer",
    checkpointNumber: 5,
    title: "Automated AI Analysis & pgvector",
    status: "Planned",
    duration: "3-4 weeks",
    summary: "Call Anthropic Claude & DeepSeek to automatically synthesize TL;DRs, 'Why it matters', target audience breakdown, and generate semantic embeddings in pgvector.",
    techStack: ["Anthropic Claude API", "DeepSeek API", "pgvector (Supabase)", "Semantic Search / RAG"],
    keyDeliverable: "Every ingested news item automatically gets high-signal developer context, project ideas, and related roadmap mapping.",
    highlights: [
      "Automatic generation of 'Should I Learn This?' ratings",
      "Semantic vector search and RAG Q&A over all platform content",
      "Related tech recommendations based on cosine distance"
    ]
  },
  {
    phase: "Phase 6 - Personalization & Auth",
    checkpointNumber: 6,
    title: "User Accounts & Tailored Feeds",
    status: "Planned",
    duration: "3-5 weeks",
    summary: "Add authentication via Supabase Auth or Clerk. Enable users to save roadmaps, track completed milestones, bookmark blueprints, and customize their tech stack feed.",
    techStack: ["Supabase Auth / Clerk", "User Profiles", "Rule-based Recommendation Engine"],
    keyDeliverable: "Personalized developer intelligence dashboard showing content relevant to each user's chosen tech stack.",
    highlights: [
      "Cross-device progress synchronization",
      "Custom skill radar visualization",
      "Weekly personalized digest email based on saved preferences"
    ]
  },
  {
    phase: "Phase 7 - Production Hardening",
    checkpointNumber: 7,
    title: "Production Infrastructure & Sentry",
    status: "Planned",
    duration: "Ongoing",
    summary: "CI/CD via GitHub Actions, Sentry for real-time error tracking, Better Stack uptime monitoring, and staging environments.",
    techStack: ["GitHub Actions CI", "Vercel CD", "Sentry", "Better Stack", "Lighthouse CI"],
    keyDeliverable: "Rock-solid 99.99% uptime, zero regression deploys, and automated performance budgets.",
    highlights: [
      "Automated Lighthouse CI checks enforcing >90 performance score",
      "Instant Sentry crash alerting on Discord/Slack",
      "Preview deployment URLs for every pull request"
    ]
  }
];
