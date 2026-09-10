import { NextRequest, NextResponse } from "next/server";
import { db, reactions, memes } from "@/db";
import { eq, and, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ success: true, count: 0, userReacted: false });
    }

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("targetId");
    const userIdentifier = searchParams.get("userIdentifier");

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "targetId is required" },
        { status: 400 }
      );
    }

    // Count all reactions for target
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(reactions)
      .where(eq(reactions.targetId, targetId));

    const totalCount = Number(countResult[0]?.count || 0);

    // Check if current user already reacted
    let hasReacted = false;
    if (userIdentifier) {
      const existing = await db
        .select({ id: reactions.id })
        .from(reactions)
        .where(
          and(
            eq(reactions.targetId, targetId),
            eq(reactions.userIdentifier, userIdentifier)
          )
        )
        .limit(1);

      hasReacted = existing.length > 0;
    }

    return NextResponse.json({
      success: true,
      count: totalCount,
      hasReacted,
    });
  } catch (error) {
    console.error("[Reactions API] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to query reactions" },
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
    const { targetId, targetType, reactionType = "upvote", userIdentifier } = body;

    if (!targetId || !targetType) {
      return NextResponse.json(
        { success: false, message: "targetId and targetType are required" },
        { status: 400 }
      );
    }

    // Prevent duplicate spam from same user identifier if provided
    if (userIdentifier) {
      const existing = await db
        .select({ id: reactions.id })
        .from(reactions)
        .where(
          and(
            eq(reactions.targetId, targetId),
            eq(reactions.userIdentifier, userIdentifier)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        // User already reacted - return current count
        const countRes = await db
          .select({ count: sql<number>`count(*)` })
          .from(reactions)
          .where(eq(reactions.targetId, targetId));

        return NextResponse.json({
          success: true,
          alreadyReacted: true,
          count: Number(countRes[0]?.count || 1),
        });
      }
    }

    // Insert new reaction
    await db.insert(reactions).values({
      targetId,
      targetType,
      reactionType,
      userIdentifier: userIdentifier || null,
    });

    // If target is a Neon meme, increment upvotes column directly
    if (targetType === "meme" && targetId.startsWith("neon-")) {
      const numericId = parseInt(targetId.replace("neon-", ""), 10);
      if (!isNaN(numericId)) {
        await db
          .update(memes)
          .set({ upvotes: sql`${memes.upvotes} + 1` })
          .where(eq(memes.id, numericId));
      }
    }

    // Return new total count
    const totalRes = await db
      .select({ count: sql<number>`count(*)` })
      .from(reactions)
      .where(eq(reactions.targetId, targetId));

    return NextResponse.json({
      success: true,
      count: Number(totalRes[0]?.count || 1),
      hasReacted: true,
    });
  } catch (error) {
    console.error("[Reactions API] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to record reaction" },
      { status: 500 }
    );
  }
}
