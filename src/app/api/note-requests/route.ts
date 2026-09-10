import { NextRequest, NextResponse } from "next/server";
import { db, noteRequests } from "@/db";
import { desc, eq, sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET /api/note-requests - Retrieve community note requests
export async function GET(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json({
        success: true,
        requests: [],
        message: "Database in offline fallback mode",
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    let query = db.select().from(noteRequests);

    let allRequests;
    if (status && status !== "all") {
      allRequests = await db
        .select()
        .from(noteRequests)
        .where(eq(noteRequests.status, status))
        .orderBy(desc(noteRequests.upvotes), desc(noteRequests.createdAt))
        .limit(limit);
    } else {
      allRequests = await db
        .select()
        .from(noteRequests)
        .orderBy(desc(noteRequests.upvotes), desc(noteRequests.createdAt))
        .limit(limit);
    }

    return NextResponse.json({
      success: true,
      count: allRequests.length,
      requests: allRequests,
    });
  } catch (error) {
    console.error("[Note Requests API] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch note requests" },
      { status: 500 }
    );
  }
}

// POST /api/note-requests - Submit a new request OR upvote an existing one
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database not connected" },
        { status: 503 }
      );
    }

    const body = await request.json();

    // 1. Upvote Action
    if (body.action === "upvote" && body.id) {
      const updated = await db
        .update(noteRequests)
        .set({ upvotes: sql`${noteRequests.upvotes} + 1` })
        .where(eq(noteRequests.id, Number(body.id)))
        .returning();

      return NextResponse.json({
        success: true,
        message: "Upvoted note request",
        request: updated[0],
      });
    }

    // 2. New Request Submission
    const { topic, category, details, userContact } = body;

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { success: false, message: "Topic is required" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(noteRequests)
      .values({
        topic: topic.trim(),
        category: (category && typeof category === "string" ? category.trim() : "General"),
        details: details && typeof details === "string" ? details.trim() : null,
        userContact: userContact && typeof userContact === "string" ? userContact.trim() : null,
        upvotes: 1,
        status: "pending",
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "Note request submitted successfully!",
      request: inserted[0],
    });
  } catch (error) {
    console.error("[Note Requests API] POST error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit request" },
      { status: 500 }
    );
  }
}

// PATCH /api/note-requests - Update request status (Admin Only)
export async function PATCH(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const serverKey = process.env.ADMIN_SECRET_KEY || "pnp_admin_2026";

    if (!adminKey || adminKey !== serverKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database not connected" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, message: "Missing id or status" },
        { status: 400 }
      );
    }

    const updated = await db
      .update(noteRequests)
      .set({ status })
      .where(eq(noteRequests.id, Number(id)))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      request: updated[0],
    });
  } catch (error) {
    console.error("[Note Requests API] PATCH error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update note request" },
      { status: 500 }
    );
  }
}

// DELETE /api/note-requests - Delete a request (Admin Only)
export async function DELETE(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const serverKey = process.env.ADMIN_SECRET_KEY || "pnp_admin_2026";

    if (!adminKey || adminKey !== serverKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database not connected" },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing id parameter" },
        { status: 400 }
      );
    }

    await db.delete(noteRequests).where(eq(noteRequests.id, Number(id)));

    return NextResponse.json({
      success: true,
      message: "Note request deleted successfully",
    });
  } catch (error) {
    console.error("[Note Requests API] DELETE error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete request" },
      { status: 500 }
    );
  }
}
