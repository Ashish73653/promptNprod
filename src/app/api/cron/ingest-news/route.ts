import { NextRequest, NextResponse } from "next/server";
import { db, articles } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface HNItem {
  id: number;
  title: string;
  url?: string;
  by?: string;
  score?: number;
  time: number;
}

interface DevToItem {
  id: number;
  title: string;
  description: string;
  url: string;
  user?: { name: string };
  positive_reactions_count?: number;
  tag_list?: string[];
}

function categorizeTitle(title: string, tags: string[] = []): string {
  const text = (title + " " + tags.join(" ")).toLowerCase();
  if (
    text.includes("ai") ||
    text.includes("llm") ||
    text.includes("gpt") ||
    text.includes("agent") ||
    text.includes("deepseek") ||
    text.includes("claude") ||
    text.includes("model")
  ) {
    return "AI & Agents";
  }
  if (
    text.includes("database") ||
    text.includes("sql") ||
    text.includes("postgres") ||
    text.includes("redis") ||
    text.includes("vector")
  ) {
    return "Database";
  }
  if (
    text.includes("cloud") ||
    text.includes("aws") ||
    text.includes("docker") ||
    text.includes("kubernetes") ||
    text.includes("infra") ||
    text.includes("linux")
  ) {
    return "Cloud & Infra";
  }
  if (
    text.includes("react") ||
    text.includes("next.js") ||
    text.includes("frontend") ||
    text.includes("typescript") ||
    text.includes("web")
  ) {
    return "Full-Stack";
  }
  return "Dev Tools";
}

export async function GET(request: NextRequest) {
  if (!db) {
    return NextResponse.json(
      { success: false, message: "Database not connected" },
      { status: 503 }
    );
  }

  let ingestedCount = 0;

  try {
    // 1. INGEST FROM HACKER NEWS TOP STORIES
    const hnRes = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { next: { revalidate: 0 } }
    );
    const topIds: number[] = await hnRes.json();
    const targetIds = (topIds || []).slice(0, 20);

    const hnStories: HNItem[] = await Promise.all(
      targetIds.map(async (id) => {
        try {
          const res = await fetch(
            `https://hacker-news.firebaseio.com/v0/item/${id}.json`
          );
          return await res.json();
        } catch {
          return null;
        }
      })
    );

    for (const story of hnStories) {
      if (!story || !story.title || !story.url) continue;

      const slug = `hn-${story.id}`;
      const category = categorizeTitle(story.title);

      try {
        await db
          .insert(articles)
          .values({
            title: story.title.trim(),
            slug,
            summary: `Trending on Hacker News (${story.score || 50}+ points). Submitted by ${story.by || "engineer"}.`,
            source: "Hacker News",
            sourceUrl: story.url,
            category,
            author: story.by || "HN Community",
            score: story.score || 50,
          })
          .onConflictDoNothing();

        ingestedCount++;
      } catch {
        // Skip duplicate
      }
    }

    // 2. INGEST FROM DEV.TO TOP ENGINEERING POSTS
    try {
      const devRes = await fetch("https://dev.to/api/articles?top=2&per_page=12", {
        headers: { "User-Agent": "PromptNProd/2.0" },
      });
      const devArticles: DevToItem[] = await devRes.json();

      for (const item of devArticles) {
        if (!item || !item.title || !item.url) continue;

        const slug = `devto-${item.id}`;
        const category = categorizeTitle(item.title, item.tag_list || []);

        try {
          await db
            .insert(articles)
            .values({
              title: item.title.trim(),
              slug,
              summary:
                item.description?.trim() ||
                "Deep dive engineering tutorial and breakdown.",
              source: "Dev.to",
              sourceUrl: item.url,
              category,
              author: item.user?.name || "Dev Community",
              score: item.positive_reactions_count || 30,
            })
            .onConflictDoNothing();

          ingestedCount++;
        } catch {
          // Skip duplicate
        }
      }
    } catch (devErr) {
      console.warn("Dev.to fetch skipped:", devErr);
    }

    // 3. AUTO-CLEANUP: RETENTION PURGE OLDER THAN 14 DAYS
    await db.execute(
      sql`DELETE FROM articles WHERE created_at < NOW() - INTERVAL '14 days';`
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ingested fresh tech stories and purged articles older than 14 days.`,
      ingestedAttempted: ingestedCount,
    });
  } catch (error) {
    console.error("[Cron Ingest] Error:", error);
    return NextResponse.json(
      { success: false, message: "Ingestion failed" },
      { status: 500 }
    );
  }
}
