import { redirect } from "next/navigation";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export default function BuildSlugPage() {
  redirect("/roadmaps");
}
