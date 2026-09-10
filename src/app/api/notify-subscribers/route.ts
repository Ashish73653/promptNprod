import { NextRequest, NextResponse } from "next/server";
import { db, subscribers } from "@/db";
import { eq } from "drizzle-orm";
import { sendSubscriberNotification } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      adminKey, 
      title, 
      category = "General", 
      description = "", 
      url, 
      driveUrl, 
      type = "note" 
    } = body;

    const expectedKey = process.env.ADMIN_SECRET_KEY || "pnp_admin_2026";
    if (adminKey !== expectedKey) {
      return NextResponse.json(
        { success: false, message: "Unauthorized admin access" },
        { status: 401 }
      );
    }

    if (!title || !url) {
      return NextResponse.json(
        { success: false, message: "Title and URL are required to notify subscribers" },
        { status: 400 }
      );
    }

    if (!db) {
      return NextResponse.json(
        { success: false, message: "Database connection not available" },
        { status: 500 }
      );
    }

    // Fetch all active subscribers from Neon DB
    const activeSubscribers = await db
      .select({ email: subscribers.email })
      .from(subscribers)
      .where(eq(subscribers.status, "active"));

    const recipientEmails = activeSubscribers.map((s) => s.email).filter(Boolean);

    if (recipientEmails.length === 0) {
      return NextResponse.json({
        success: true,
        count: 0,
        message: "No active subscribers found in database to notify.",
      });
    }

    // Send email notifications
    const result = await sendSubscriberNotification({
      title,
      category,
      description,
      url,
      driveUrl,
      type,
      recipientEmails,
    });

    return NextResponse.json({
      success: result.success,
      count: result.count,
      simulated: result.simulated,
      error: result.error,
      message: result.simulated
        ? `[Simulation] Stored email broadcast simulated for ${result.count} subscribers (configure RESEND_API_KEY for live delivery).`
        : `Successfully sent email notifications to ${result.count} active subscribers!`,
    });
  } catch (err: any) {
    console.error("Error notifying subscribers:", err);
    return NextResponse.json(
      { success: false, message: err?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
