import { NextRequest, NextResponse } from "next/server";
import { db, comments } from "@/db";
import { eq, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({ success: true, comments: [] });
    }

    const { searchParams } = new URL(request.url);
    const targetId = searchParams.get("targetId");

    if (!targetId) {
      return NextResponse.json(
        { success: false, message: "targetId is required" },
        { status: 400 }
      );
    }

    const rows = await db
      .select()
      .from(comments)
      .where(eq(comments.targetId, targetId))
      .orderBy(desc(comments.createdAt))
      .limit(50);

    return NextResponse.json({
      success: true,
      comments: rows,
    });
  } catch (error) {
    console.error("[Comments API] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch comments" },
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
    const { targetId, targetType = "note", authorName, authorRole, content } = body;

    if (!targetId || !authorName || !content) {
      return NextResponse.json(
        {
          success: false,
          message: "targetId, authorName, and content are required",
        },
        { status: 400 }
      );
    }

    // Sanitize text inputs
    const cleanAuthor = authorName.trim().slice(0, 50);
    const cleanRole = (authorRole || "Developer").trim().slice(0, 50);
    const cleanContent = content.trim().slice(0, 1000);

    const [inserted] = await db
      .insert(comments)
      .values({
        targetId,
        targetType,
        authorName: cleanAuthor,
        authorRole: cleanRole,
        content: cleanContent,
      })
      .returning();

    return NextResponse.json({
      success: true,
      comment: inserted,
    });
  } catch (error) {
    console.error("[Comments API] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to post comment" },
      { status: 500 }
    );
  }
}
