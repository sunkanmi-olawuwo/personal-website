import type { MetadataRoute } from "next";

import { getPosts } from "@/lib/requests";
import { siteUrl } from "@/lib/site-profile";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts({ first: 50 });
  const now = new Date();

  return [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/archive`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/now`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    ...posts.map(({ node }) => ({
      url: `${siteUrl}/${node.slug}`,
      lastModified: node.publishedAt ? new Date(node.publishedAt) : now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
