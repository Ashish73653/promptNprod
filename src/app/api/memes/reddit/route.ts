import { NextRequest, NextResponse } from "next/server";
import { Meme } from "@/types";

export const dynamic = "force-dynamic";

interface MemeApiResponse {
  count: number;
  memes: Array<{
    postLink: string;
    subreddit: string;
    title: string;
    url: string;
    nsfw: boolean;
    spoiler: boolean;
    author: string;
    ups: number;
    preview?: string[];
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countParam = parseInt(searchParams.get("count") || "15", 10);
    const limit = Math.min(Math.max(countParam, 6), 50);

    // Fetch slightly more to account for non-image or spoiler posts
    const fetchCount = Math.min(limit + 10, 50);

    const response = await fetch(
      `https://meme-api.com/gimme/ProgrammerHumor/${fetchCount}`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 120 }, // cache briefly
      }
    );

    if (!response.ok) {
      throw new Error(`Meme service responded with status ${response.status}`);
    }

    const data = (await response.json()) as MemeApiResponse;
    const items = data.memes || [];

    const validMemes: Meme[] = [];

    for (const post of items) {
      if (!post || post.nsfw || post.spoiler) continue;

      const url = post.url;
      if (!url) continue;

      // Ensure URL is a direct image
      const isDirectImage =
        url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ||
        url.includes("i.redd.it") ||
        url.includes("i.imgur.com");

      if (!isDirectImage) continue;

      // Assign smart category based on title
      const titleLower = post.title.toLowerCase();
      let category: Meme["category"] = "Production";
      if (
        titleLower.includes("ai") ||
        titleLower.includes("chatgpt") ||
        titleLower.includes("llm") ||
        titleLower.includes("agent")
      ) {
        category = "AI Hype";
      } else if (
        titleLower.includes("css") ||
        titleLower.includes("frontend") ||
        titleLower.includes("html") ||
        titleLower.includes("react")
      ) {
        category = "Frontend/CSS";
      } else if (
        titleLower.includes("junior") ||
        titleLower.includes("senior") ||
        titleLower.includes("intern")
      ) {
        category = "Junior vs Senior";
      }

      // Extract deterministic ID from postLink (e.g., https://redd.it/1w767r8 -> reddit-1w767r8)
      const rawId = post.postLink
        ? post.postLink.split("/").filter(Boolean).pop()
        : url.split("/").filter(Boolean).pop()?.split(".")[0];
      const deterministicId = `reddit-${rawId || Math.random().toString(36).substring(2, 9)}`;

      validMemes.push({
        id: deterministicId,
        title: post.title,
        category,
        image: url,
        caption: `Trending on r/ProgrammerHumor • Posted by u/${post.author}`,
        upvotes: post.ups || Math.floor(Math.random() * 300) + 120,
        author: post.author || "reddit_dev",
        tags: ["Reddit", "ProgrammerHumor", "Community"],
      });

      if (validMemes.length >= limit) break;
    }

    return NextResponse.json({
      success: true,
      source: "r/ProgrammerHumor",
      count: validMemes.length,
      memes: validMemes,
    });
  } catch (error) {
    console.error("Reddit fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch live memes. Check your internet connection.",
      },
      { status: 500 }
    );
  }
}
