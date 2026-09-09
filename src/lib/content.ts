import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { Article, TechCategory } from "@/types";
import { articles as defaultArticles } from "@/data/articles";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");

/**
 * Parses markdown file content into the structured Article interface.
 */
function parseMarkdownArticle(filePath: string): Article | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    if (!data.title || !data.slug) return null;

    // Split markdown content into sections
    const lines = content.split("\n");
    let summary = data.summary || "";
    const whyItMatters: string[] = [];
    const whoShouldCare: string[] = [];
    const takeaways: string[] = [];
    const contentSections: Article["content"] = [];

    let currentSectionTitle = "Overview";
    let currentParagraphs: string[] = [];
    let currentCodeSnippet: Article["content"][0]["codeSnippet"] | undefined = undefined;
    let inCodeBlock = false;
    let codeLanguage = "";
    let codeLines: string[] = [];

    let currentMode: "general" | "why" | "who" | "takeaways" | "summary" = "general";

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith("```")) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = trimmed.replace("```", "").trim() || "typescript";
          codeLines = [];
        } else {
          inCodeBlock = false;
          currentCodeSnippet = {
            language: codeLanguage,
            code: codeLines.join("\n"),
            caption: `${data.title} Example`,
          };
        }
        continue;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        continue;
      }

      if (trimmed.startsWith("## ")) {
        const header = trimmed.replace("## ", "").trim();
        if (header.toLowerCase().includes("executive summary") || header.toLowerCase().includes("summary")) {
          currentMode = "summary";
        } else if (header.toLowerCase().includes("why it matters")) {
          currentMode = "why";
        } else if (header.toLowerCase().includes("who should care")) {
          currentMode = "who";
        } else if (header.toLowerCase().includes("takeaway") || header.toLowerCase().includes("next step")) {
          currentMode = "takeaways";
        } else {
          currentMode = "general";
          if (currentParagraphs.length > 0 || currentCodeSnippet) {
            contentSections.push({
              sectionTitle: currentSectionTitle,
              paragraphs: currentParagraphs,
              codeSnippet: currentCodeSnippet,
            });
            currentParagraphs = [];
            currentCodeSnippet = undefined;
          }
          currentSectionTitle = header;
        }
        continue;
      }

      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const bulletText = trimmed.replace(/^[-*]\s+/, "");
        if (currentMode === "why") whyItMatters.push(bulletText);
        else if (currentMode === "who") whoShouldCare.push(bulletText);
        else if (currentMode === "takeaways") takeaways.push(bulletText);
        else currentParagraphs.push(`• ${bulletText}`);
        continue;
      }

      if (trimmed.length > 0) {
        if (currentMode === "summary" && !summary) {
          summary = trimmed;
        } else if (currentMode === "general") {
          currentParagraphs.push(trimmed);
        }
      }
    }

    if (currentParagraphs.length > 0 || currentCodeSnippet) {
      contentSections.push({
        sectionTitle: currentSectionTitle,
        paragraphs: currentParagraphs,
        codeSnippet: currentCodeSnippet,
      });
    }

    // Fallbacks
    if (whyItMatters.length === 0) {
      whyItMatters.push("Accelerates engineering velocity.", "Reduces operational infrastructure friction.");
    }
    if (whoShouldCare.length === 0) {
      whoShouldCare.push("Full-stack engineers", "System architects");
    }
    if (takeaways.length === 0) {
      takeaways.push("Benchmark in a staging environment before widespread production rollouts.");
    }

    return {
      id: data.id || `md-${data.slug}`,
      slug: data.slug,
      title: data.title,
      subtitle: data.subtitle || "",
      category: (data.category as TechCategory) || "Full-Stack",
      date: data.date || new Date().toISOString().split("T")[0],
      readTime: data.readTime || "5 min read",
      badge: data.badge,
      author: {
        name: data.authorName || (typeof data.author === "object" ? data.author.name : "Editorial Team"),
        avatar: data.authorAvatar || (typeof data.author === "object" ? data.author.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"),
        role: data.authorRole || (typeof data.author === "object" ? data.author.role : "Staff Engineer"),
      },
      summary: summary || data.subtitle || data.title,
      whyItMatters,
      whoShouldCare,
      takeaways,
      scorecard: {
        relevance: Number(data.relevance ?? 85),
        impact: Number(data.impact ?? 85),
        difficulty: data.difficulty || "Medium",
        hypeIndex: Number(data.hypeIndex ?? 50),
        overallScore: Number(data.overallScore ?? 85),
        verdict: data.verdict || "High Priority",
        verdictSummary: data.verdictSummary || summary,
      },
      content: contentSections.length > 0 ? contentSections : [
        {
          sectionTitle: "Overview",
          paragraphs: [content.trim() || summary],
        }
      ],
    };
  } catch (error) {
    console.error(`Error loading markdown article from ${filePath}:`, error);
    return null;
  }
}

/**
 * Returns all articles by dynamically combining Markdown files and core static files.
 */
export function getAllArticles(): Article[] {
  const markdownArticles: Article[] = [];

  if (fs.existsSync(CONTENT_DIR)) {
    const filenames = fs.readdirSync(CONTENT_DIR);
    for (const file of filenames) {
      if (file.endsWith(".md") || file.endsWith(".mdx")) {
        const parsed = parseMarkdownArticle(path.join(CONTENT_DIR, file));
        if (parsed) markdownArticles.push(parsed);
      }
    }
  }

  // Deduplicate by slug, with markdown articles taking precedence
  const slugMap = new Map<string, Article>();
  for (const article of markdownArticles) {
    slugMap.set(article.slug, article);
  }
  for (const article of defaultArticles) {
    if (!slugMap.has(article.slug)) {
      slugMap.set(article.slug, article);
    }
  }

  return Array.from(slugMap.values());
}

/**
 * Retrieves a single article by slug.
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}
