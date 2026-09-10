export type TechCategory = 
  | "All"
  | "AI & Agents"
  | "Full-Stack"
  | "Cloud & Infra"
  | "Dev Tools"
  | "Database";

export type DifficultyLevel = "Beginner" | "Intermediate" | "Advanced";

export interface ScorecardRating {
  relevance: number; // 0 - 100
  impact: number; // 0 - 100
  difficulty: "Low" | "Medium" | "High";
  hypeIndex: number; // 0 - 100
  overallScore: number; // 0 - 100
  verdict: "Must Learn" | "High Priority" | "Watch & Evaluate" | "Niche / Wait";
  verdictSummary: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: TechCategory;
  date: string;
  readTime: string;
  author: {
    name: string;
    avatar: string;
    role: string;
  };
  badge?: string;
  summary: string;
  whyItMatters: string[];
  whoShouldCare: string[];
  takeaways: string[];
  scorecard: ScorecardRating;
  content: {
    sectionTitle: string;
    paragraphs: string[];
    codeSnippet?: {
      language: string;
      code: string;
      caption?: string;
    };
  }[];
  relatedSlug?: string;
}

export interface MilestoneResource {
  title: string;
  url: string;
  type: "Docs" | "Video" | "Repo" | "Article";
}

export interface RoadmapMilestone {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  resources: MilestoneResource[];
  recommendedProject: string;
  projectBlueprint?: {
    title: string;
    objective: string;
    stack: string[];
    architecture: string;
    features: string[];
    starterSnippet?: {
      filename: string;
      language: string;
      code: string;
    };
  };
}

export interface Roadmap {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  description: string;
  level: DifficultyLevel;
  durationWeeks: number;
  badge: string;
  accentColor: string;
  iconName: string;
  prerequisites: string[];
  milestones: RoadmapMilestone[];
  targetRoles: string[];
}

export interface Meme {
  id: string;
  title: string;
  category: "Production" | "AI Hype" | "Frontend/CSS" | "Junior vs Senior";
  image: string;
  caption: string;
  upvotes: number;
  author: string;
  tags: string[];
}
