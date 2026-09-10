import { NextResponse } from "next/server";
import { studyNotes } from "@/data/notes";

export async function GET() {
  const notionApiKey = process.env.NOTION_API_KEY;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  // Check if Notion credentials are provided in .env.local
  if (!notionApiKey || !notionDatabaseId) {
    return NextResponse.json({
      status: "mock_seeded",
      message: "Notion credentials not set in .env.local. Serving local high-signal study notes.",
      setupInstructions: "Set NOTION_API_KEY and NOTION_DATABASE_ID in .env.local to enable live database synchronization.",
      totalNotes: studyNotes.length,
      notes: studyNotes
    });
  }

  try {
    // Query the official Notion REST API directly with native fetch
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDatabaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${notionApiKey}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        filter: {
          property: "Status",
          status: {
            equals: "Published"
          }
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Notion API responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      status: "synced",
      message: "Successfully queried live Notion database.",
      rawPagesCount: data.results?.length || 0,
      fallbackNotes: studyNotes
    });
  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Notion API: " + errMessage,
        fallbackNotes: studyNotes
      },
      { status: 500 }
    );
  }
}
