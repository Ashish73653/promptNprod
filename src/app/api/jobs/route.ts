import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const REMOTIVE_BASE = "https://remotive.com/api/remote-jobs";

// Category mapping from our UI tabs to Remotive categories
const CATEGORY_MAP: Record<string, string> = {
  "All": "",
  "Frontend": "software-dev",
  "Backend": "software-dev",
  "AI & ML": "data",
  "DevOps": "devops-sysadmin",
  "Full-Stack": "software-dev",
  "Design": "design",
  "Product": "product",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "All";
  const search = searchParams.get("search") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);

  try {
    const remotiveCategory = CATEGORY_MAP[category] || "";
    const params = new URLSearchParams({ limit: "50" });
    if (remotiveCategory) params.set("category", remotiveCategory);
    if (search) params.set("search", search);

    const res = await fetch(`${REMOTIVE_BASE}?${params.toString()}`, {
      next: { revalidate: 1800 }, // Cache 30 minutes
      headers: { "Accept": "application/json" },
    });

    if (!res.ok) {
      throw new Error(`Remotive API error: ${res.status}`);
    }

    const data = await res.json();
    const jobs = (data.jobs || []) as RemotiveJob[];

    // Apply additional client-side filtering for Frontend/Backend/Full-Stack
    // since Remotive only has "software-dev" as one category
    let filtered = jobs;
    if (category === "Frontend") {
      filtered = jobs.filter((j) =>
        /frontend|react|vue|angular|next\.?js|css|ui engineer/i.test(
          `${j.title} ${j.tags?.join(" ") || ""}`
        )
      );
    } else if (category === "Backend") {
      filtered = jobs.filter((j) =>
        /backend|node|python|java|golang|rust|api|server|django|rails/i.test(
          `${j.title} ${j.tags?.join(" ") || ""}`
        )
      );
    } else if (category === "Full-Stack") {
      filtered = jobs.filter((j) =>
        /full.?stack|fullstack/i.test(
          `${j.title} ${j.tags?.join(" ") || ""}`
        )
      );
    } else if (category === "AI & ML") {
      filtered = jobs.filter((j) =>
        /ai|ml|machine learning|llm|data scientist|nlp|computer vision|deep learning/i.test(
          `${j.title} ${j.tags?.join(" ") || ""}`
        )
      );
    }

    const mapped = filtered.slice(0, limit).map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company_name,
      logo: j.company_logo || null,
      location: j.candidate_required_location || "Remote",
      category: j.category,
      tags: (j.tags || []).slice(0, 4),
      salary: j.salary || null,
      url: j.url,
      publishedAt: j.publication_date,
      jobType: j.job_type || "Full Time",
    }));

    return NextResponse.json({
      success: true,
      jobs: mapped,
      total: filtered.length,
    });
  } catch (err) {
    console.error("[Jobs API] Error:", err);
    return NextResponse.json(
      { success: false, jobs: [], total: 0 },
      { status: 500 }
    );
  }
}

interface RemotiveJob {
  id: number;
  title: string;
  company_name: string;
  company_logo: string;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  candidate_required_location: string;
  salary: string;
  url: string;
}
