import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "From Prompt to Production";
    const category = searchParams.get("category") || "Developer Platform";
    const type = searchParams.get("type") || "Platform";
    const subtitle =
      searchParams.get("subtitle") ||
      "Interactive Engineering Roadmaps, Study Cheatsheets & Production Blueprints";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#080c14",
            padding: "60px 70px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            position: "relative",
          }}
        >
          {/* Subtle Ambient Glows */}
          <div
            style={{
              position: "absolute",
              top: "-100px",
              right: "-100px",
              width: "450px",
              height: "450px",
              background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-100px",
              left: "-100px",
              width: "450px",
              height: "450px",
              background: "radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />

          {/* Top Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              zIndex: 10,
            }}
          >
            {/* Brand Logo & Name */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "26px",
                  fontWeight: 900,
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
                }}
              >
                P
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "28px", fontWeight: 900, color: "#ffffff", letterSpacing: "-0.5px" }}>
                  Prompt<span style={{ color: "#06b6d4" }}>N</span>Prod
                </span>
                <span style={{ fontSize: "12px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>
                  Engineering Intelligence
                </span>
              </div>
            </div>

            {/* Type & Category Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(6, 182, 212, 0.15)",
                  border: "1px solid rgba(6, 182, 212, 0.4)",
                  color: "#22d3ee",
                  fontSize: "14px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {type}
              </div>
              <div
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  color: "#e2e8f0",
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {category}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", zIndex: 10, maxWidth: "1000px" }}>
            <h1
              style={{
                fontSize: title.length > 50 ? "46px" : "56px",
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.15,
                letterSpacing: "-1px",
                margin: 0,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "20px",
                color: "#94a3b8",
                lineHeight: 1.4,
                margin: 0,
                maxHeight: "60px",
                overflow: "hidden",
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Footer Bar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
              paddingTop: "24px",
              zIndex: 10,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: "#10b981" }} />
              <span style={{ fontSize: "14px", color: "#cbd5e1", fontWeight: 600 }}>
                Interactive Blueprints &amp; Cheatsheets
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px", color: "#06b6d4", fontSize: "15px", fontWeight: 700 }}>
              <span>promptnprod.dev</span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.error("OG generation error:", e);
    return new Response("Failed to generate OG Image", { status: 500 });
  }
}
