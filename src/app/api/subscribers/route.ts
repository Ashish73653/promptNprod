import { NextRequest, NextResponse } from "next/server";
import { db, subscribers } from "@/db";
import { desc, eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// POST /api/subscribers - Subscribe to new notes & roadmaps alerts
export async function POST(request: NextRequest) {
  try {
    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database not connected" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const email = body.email ? String(body.email).trim().toLowerCase() : "";
    const source = body.source ? String(body.source).trim() : "website";

    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    try {
      await db
        .insert(subscribers)
        .values({
          email,
          source,
          status: "active",
        })
        .onConflictDoNothing();

      return NextResponse.json({
        success: true,
        message: "You're subscribed! We'll alert you when fresh notes & roadmaps drop.",
      });
    } catch {
      // Return success even on duplicate so no user info leak
      return NextResponse.json({
        success: true,
        message: "You're subscribed! We'll alert you when fresh notes & roadmaps drop.",
      });
    }
  } catch (error) {
    console.error("[Subscribers API] Error:", error);
    return NextResponse.json(
      { success: false, message: "Subscription failed. Please try again." },
      { status: 500 }
    );
  }
}

// GET /api/subscribers - View subscribers (Admin Only)
export async function GET(request: NextRequest) {
  try {
    const adminKey = request.headers.get("x-admin-key");
    const serverKey = process.env.ADMIN_SECRET_KEY || "pnp_admin_2026";

    if (!adminKey || adminKey !== serverKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    if (!db) {
      return NextResponse.json({ success: true, count: 0, subscribers: [] });
    }

    const allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt))
      .limit(100);

    return NextResponse.json({
      success: true,
      count: allSubscribers.length,
      subscribers: allSubscribers,
    });
  } catch (error) {
    console.error("[Subscribers API] GET error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscribers" },
      { status: 500 }
    );
  }
}
