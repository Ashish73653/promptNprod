import { NextRequest, NextResponse } from "next/server";
import { db, studyNotes } from "@/db";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({
        success: true,
        source: "offline-fallback",
        categories: ["All"],
        notes: [],
      });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    let query = db.select().from(studyNotes).orderBy(desc(studyNotes.createdAt));
    const allNotes = await query;

    // Dynamically extract unique categories from DB
    const distinctCategories = Array.from(
      new Set(allNotes.map((n) => n.category).filter(Boolean))
    );

    const filteredNotes =
      category && category !== "All"
        ? allNotes.filter((n) => n.category === category)
        : allNotes;

    return NextResponse.json({
      success: true,
      count: filteredNotes.length,
      categories: ["All", ...distinctCategories],
      notes: filteredNotes,
    });
  } catch (error) {
    console.error("[Study Notes API] Fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch study notes from database" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check Admin Secret Key Header
    const adminKey = request.headers.get("x-admin-key");
    const configuredKey = process.env.ADMIN_SECRET_KEY;

    if (!configuredKey || adminKey !== configuredKey) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized: Valid admin secret key required to publish notes.",
        },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection not initialized" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { title, category, driveUrl, description, tags, fileSize, pagesCount } = body;

    if (!title || !category || !driveUrl || !description) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, Category, Google Drive Link, and Description are required",
        },
        { status: 400 }
      );
    }

    // Generate clean slug
    const baseSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    const [inserted] = await db
      .insert(studyNotes)
      .values({
        title: title.trim(),
        slug,
        category: category.trim(),
        description: description.trim(),
        driveUrl: driveUrl.trim(),
        fileSize: fileSize ? fileSize.trim() : "PDF",
        pagesCount: pagesCount ? Number(pagesCount) : null,
        tags: tags ? tags.trim() : "",
        upvotes: 0,
      })
      .returning();

    return NextResponse.json({
      success: true,
      note: inserted,
    });
  } catch (error) {
    console.error("[Study Notes API] Insert error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to publish study note" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Check Admin Secret Key Header
    const adminKey = request.headers.get("x-admin-key");
    const configuredKey = process.env.ADMIN_SECRET_KEY;

    if (!configuredKey || adminKey !== configuredKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin key required." },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json({ success: false, message: "Database not connected" }, { status: 503 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "id is required" }, { status: 400 });
    }

    await db.delete(studyNotes).where(eq(studyNotes.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: `Note ${id} successfully deleted.`,
    });
  } catch (error) {
    console.error("[Study Notes API] Delete error:", error);
    return NextResponse.json({ success: false, message: "Failed to delete note" }, { status: 500 });
  }
}
