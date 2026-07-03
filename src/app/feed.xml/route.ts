import { getAllArticles } from "@/lib/content";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function GET() {
  const articles = getAllArticles().slice(0, 30);
  const items = articles
    .map(
      (a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${absoluteUrl(`/guides/${a.slug}/`)}</link>
      <guid>${absoluteUrl(`/guides/${a.slug}/`)}</guid>
      <pubDate>${new Date(a.date + "T12:00:00Z").toUTCString()}</pubDate>
      <description>${esc(a.description)}</description>
    </item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${esc(siteConfig.name)}</title>
    <link>${absoluteUrl("/")}</link>
    <description>${esc(siteConfig.description)}</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
