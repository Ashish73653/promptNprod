import { redirect } from "next/navigation";
import { roadmaps } from "@/data/roadmaps";

export function generateStaticParams() {
  return roadmaps.map((r) => ({
    slug: r.slug,
  }));
}

export default async function LearnSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/roadmaps/${slug}`);
}
