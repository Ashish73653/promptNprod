import { NextRequest, NextResponse } from "next/server";
import { db, memes } from "@/db";
import { desc } from "drizzle-orm";
import { Meme } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({
        success: true,
        source: "offline-fallback",
        memes: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "30", 10), 60);

    const rows = await db
      .select()
      .from(memes)
      .orderBy(desc(memes.createdAt))
      .limit(limit);

    const formattedMemes: Meme[] = rows.map((m) => ({
      id: `neon-${m.id}`,
      title: m.title,
      category: "Production",
      image: m.imageUrl,
      caption: `Posted by ${m.author} • Saved to Neon Cloud DB`,
      upvotes: m.upvotes,
      author: m.author,
      tags: [m.source === "reddit" ? "Reddit" : "Community", "Live Neon DB"],
    }));

    return NextResponse.json({
      success: true,
      source: "neon-postgres",
      count: formattedMemes.length,
      memes: formattedMemes,
    });
  } catch (error) {
    console.error("[Neon Memes API] Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch memes from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection not initialized" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, imageUrl, author, subreddit } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { success: false, message: "Title and Image URL are required" },
        { status: 400 }
      );
    }

    const [inserted] = await db
      .insert(memes)
      .values({
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        source: "community",
        author: author ? author.trim() : "Community Dev",
        subreddit: subreddit || "promptnprod",
        upvotes: 1,
      })
      .returning();

    const formattedMeme: Meme = {
      id: `neon-${inserted.id}`,
      title: inserted.title,
      category: "Production",
      image: inserted.imageUrl,
      caption: `Community submission by ${inserted.author} • Live in Neon DB`,
      upvotes: inserted.upvotes,
      author: inserted.author,
      tags: ["Community", "Neon DB", "Fresh"],
    };

    return NextResponse.json({
      success: true,
      meme: formattedMeme,
    });
  } catch (error) {
    console.error("[Neon Memes API] Create error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to persist meme in database" },
      { status: 500 }
    );
  }
}
