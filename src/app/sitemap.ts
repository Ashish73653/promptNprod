import { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/content";
import { roadmaps } from "@/data/roadmaps";
import { studyNotes } from "@/data/notes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://promptnprod.dev";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/feed`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/roadmaps`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/memes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  const articles = getAllArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${baseUrl}/feed/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const noteRoutes: MetadataRoute.Sitemap = studyNotes.map((n) => ({
    url: `${baseUrl}/notes/${n.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const roadmapRoutes: MetadataRoute.Sitemap = roadmaps.map((r) => ({
    url: `${baseUrl}/roadmaps/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...noteRoutes, ...articleRoutes, ...roadmapRoutes];
}
