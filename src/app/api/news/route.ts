import { NextRequest, NextResponse } from "next/server";
import { db, articles } from "@/db";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({
        success: true,
        source: "offline-fallback",
        categories: ["All"],
        articles: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 60);

    let allArticles = await db
      .select()
      .from(articles)
      .orderBy(desc(articles.createdAt))
      .limit(limit);

    // If table is empty, trigger a quick initial ingestion
    if (allArticles.length === 0) {
      try {
        const host = request.headers.get("host") || "localhost:3000";
        const protocol = host.includes("localhost") ? "http" : "https";
        await fetch(`${protocol}://${host}/api/cron/ingest-news`, {
          next: { revalidate: 0 },
        });
        allArticles = await db
          .select()
          .from(articles)
          .orderBy(desc(articles.createdAt))
          .limit(limit);
      } catch {
        // Fallback
      }
    }

    const distinctCategories = Array.from(
      new Set(allArticles.map((a) => a.category).filter(Boolean))
    );

    const filtered =
      category && category !== "All"
        ? allArticles.filter((a) => a.category === category)
        : allArticles;

    return NextResponse.json({
      success: true,
      count: filtered.length,
      categories: ["All", ...distinctCategories],
      articles: filtered,
    });
  } catch (error) {
    console.error("[News API] Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch tech news" },
      { status: 500 }
    );
  }
}
