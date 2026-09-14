import { NextResponse } from "next/server";
import { db, jobs } from "@/db";
import { lt } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";

// Maps our UI categories to Remotive API categories
const SEARCHES = [
  { category: "Frontend",   remotiveCat: "software-dev",     keywords: ["frontend", "react", "vue", "angular", "next.js", "ui engineer"] },
  { category: "Backend",    remotiveCat: "software-dev",     keywords: ["backend", "node", "python", "golang", "java", "api", "django"] },
  { category: "Full-Stack", remotiveCat: "software-dev",     keywords: ["full-stack", "fullstack"] },
  { category: "AI & ML",    remotiveCat: "data",             keywords: ["machine learning", "ai engineer", "llm", "nlp", "data scientist"] },
  { category: "DevOps",     remotiveCat: "devops-sysadmin",  keywords: [] },
  { category: "Design",     remotiveCat: "design",           keywords: [] },
];

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  description: string;
}

function classifyCategory(title: string, tags: string[], keywords: string[]): boolean {
  if (keywords.length === 0) return true; // no filtering needed (DevOps, Design)
  const text = `${title} ${tags.join(" ")}`.toLowerCase();
  return keywords.some((kw) => text.includes(kw));
}

export async function GET() {
  if (!db) {
    return NextResponse.json({ error: "DB not configured" }, { status: 503 });
  }

  let totalIngested = 0;
  let totalDeleted = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  try {
    // ── Step 1: Delete expired jobs (older than 30 days) ──────────────────────
    const deleted = await db
      .delete(jobs)
      .where(lt(jobs.expiresAt, new Date()))
      .returning({ id: jobs.id });

    totalDeleted = deleted.length;

    // ── Step 2: Fetch fresh jobs from Remotive ────────────────────────────────
    for (const search of SEARCHES) {
      try {
        const params = new URLSearchParams({
          category: search.remotiveCat,
          limit: "20",
        });

        const res = await fetch(`${REMOTIVE_BASE}?${params.toString()}`, {
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(15000),
        });

        if (!res.ok) {
          errors.push(`Remotive ${search.category}: HTTP ${res.status}`);
          continue;
        }

        const data = await res.json();
        const remotiveJobs: RemotiveJob[] = data.jobs || [];

        // Filter to only matching keywords for this category
        const matched = remotiveJobs.filter((j) =>
          classifyCategory(j.title, j.tags || [], search.keywords)
        );

        for (const j of matched.slice(0, 15)) {
          try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

            await db
              .insert(jobs)
              .values({
                title: j.title,
                company: j.company_name,
                companyLogo: j.company_logo || null,
                location: j.candidate_required_location || "Remote",
                category: search.category,
                tags: (j.tags || []).slice(0, 5).join(","),
                salary: j.salary || null,
                description: j.description ? j.description.slice(0, 500) : null,
                url: j.url,
                source: "Remotive",
                jobType: j.job_type || "Full Time",
                isRemote: true,
                postedAt: new Date(j.publication_date),
                expiresAt,
              })
              .onConflictDoNothing(); // skip duplicates (url is UNIQUE)

            totalIngested++;
          } catch {
            totalSkipped++;
          }
        }
      } catch (err) {
        errors.push(`Fetch error for ${search.category}: ${String(err)}`);
      }
    }

    return NextResponse.json({
      success: true,
      ingested: totalIngested,
      deleted: totalDeleted,
      skipped: totalSkipped,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[Cron ingest-jobs] Fatal error:", err);
    return NextResponse.json(
      { success: false, error: String(err) },
      { status: 500 }
    );
  }
}
