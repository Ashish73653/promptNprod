import { NextRequest, NextResponse } from "next/server";
import { db, jobs } from "@/db";
import { and, eq, ilike, or, gt, desc, SQL } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "All";
  const search   = searchParams.get("search")   || "";
  const jobType  = searchParams.get("jobType")  || "All";
  const limit    = Math.min(parseInt(searchParams.get("limit") || "24"), 50);
  const offset   = parseInt(searchParams.get("offset") || "0");

  // ── If DB is not configured, fall back to Remotive API ─────────────────────
  if (!db) {
    return await remotiveFallback(category, search, limit);
  }

  try {
    const filters: SQL[] = [
      // Only show non-expired jobs
      gt(jobs.expiresAt, new Date()),
    ];

    if (category !== "All") {
      filters.push(eq(jobs.category, category));
    }

    if (jobType !== "All") {
      filters.push(eq(jobs.jobType, jobType));
    }

    if (search.trim()) {
      filters.push(
        or(
          ilike(jobs.title, `%${search}%`),
          ilike(jobs.company, `%${search}%`),
          ilike(jobs.tags, `%${search}%`)
        )!
      );
    }

    const rows = await db
      .select()
      .from(jobs)
      .where(and(...filters))
      .orderBy(desc(jobs.postedAt))
      .limit(limit)
      .offset(offset);

    const mapped = rows.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      logo: j.companyLogo,
      location: j.location,
      category: j.category,
      tags: j.tags ? j.tags.split(",").filter(Boolean) : [],
      salary: j.salary,
      url: j.url,
      source: j.source,
      jobType: j.jobType,
      isRemote: j.isRemote,
      publishedAt: j.postedAt,
    }));

    return NextResponse.json({
      success: true,
      jobs: mapped,
      total: mapped.length,
      fromDb: true,
    });
  } catch (err) {
    console.error("[Jobs API] DB error:", err);
    return await remotiveFallback(category, search, limit);
  }
}

// ── Fallback: proxy Remotive directly if DB is unavailable ──────────────────
async function remotiveFallback(category: string, search: string, limit: number) {
  const CATEGORY_MAP: Record<string, string> = {
    "Frontend": "software-dev",
    "Backend": "software-dev",
    "AI & ML": "data",
    "DevOps": "devops-sysadmin",
    "Full-Stack": "software-dev",
    "Design": "design",
    "Product": "product",
  };

  const remotiveCategory = CATEGORY_MAP[category] || "";
  const params = new URLSearchParams({ limit: "50" });
  if (remotiveCategory) params.set("category", remotiveCategory);
  if (search) params.set("search", search);

  const res = await fetch(`https://remotive.com/api/remote-jobs?${params}`, {
    next: { revalidate: 1800 },
  });

  if (!res.ok) {
    return NextResponse.json({ success: false, jobs: [], total: 0 }, { status: 500 });
  }

  const data = await res.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapped = (data.jobs || []).slice(0, limit).map((j: any) => ({
    id: j.id,
    title: j.title,
    company: j.company_name,
    logo: j.company_logo,
    location: j.candidate_required_location || "Remote",
    category: category,
    tags: (j.tags || []).slice(0, 4),
    salary: j.salary || null,
    url: j.url,
    source: "Remotive",
    jobType: j.job_type || "Full Time",
    isRemote: true,
    publishedAt: j.publication_date,
  }));

  return NextResponse.json({ success: true, jobs: mapped, total: mapped.length, fromDb: false });
}
