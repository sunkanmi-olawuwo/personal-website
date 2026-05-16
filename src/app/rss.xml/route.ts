import { getBlogName, getPosts } from "@/lib/requests";
import { siteProfile, siteUrl } from "@/lib/site-profile";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export async function GET() {
  const [blogName, posts] = await Promise.all([
    getBlogName(),
    getPosts({ first: 24 }),
  ]);

  const channelTitle = blogName.displayTitle || blogName.title || siteProfile.name;
  const channelDescription = siteProfile.newsletterSummary ?? siteProfile.heroSummary;
  const lastBuildDate = new Date().toUTCString();

  const items = posts
    .map(({ node }) => {
      const url = `${siteUrl}/${node.slug}`;
      const pubDate = node.publishedAt
        ? new Date(node.publishedAt).toUTCString()
        : lastBuildDate;
      const summary = node.subtitle || node.content.text || "";

      return `    <item>
      <title>${escapeXml(node.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(summary)}</description>
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(siteUrl)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>en</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${escapeXml(`${siteUrl}/rss.xml`)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
    },
  });
}
