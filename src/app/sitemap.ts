import type { MetadataRoute } from "next";
import { getAllArticles, getCategories } from "@/lib/content";
import { getIndex } from "@/lib/windows";
import { PUBLISHED_MONTHS } from "@/lib/rollout";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { generatedAt, stations } = getIndex();
  const daily = new Date(generatedAt);
  const articles = getAllArticles();

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: daily, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/tools/"), lastModified: daily, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/tools/tide-window-finder/"), lastModified: daily, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/tools/trip-picker/"), lastModified: daily, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/tools/year-heatmap/"), lastModified: daily, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/tools/golden-hour/"), lastModified: daily, changeFrequency: "daily", priority: 0.7 },
    { url: absoluteUrl("/calendars/"), lastModified: daily, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/beaches/"), lastModified: daily, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/guides/"), lastModified: daily, changeFrequency: "daily", priority: 0.8 },
    { url: absoluteUrl("/king-tides/2026-2027/"), lastModified: daily, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/data/"), lastModified: daily, changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/data/daylight-minus-tide-index/"), lastModified: daily, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/newsletter/"), lastModified: daily, changeFrequency: "weekly", priority: 0.6 },
    { url: absoluteUrl("/embed/"), lastModified: daily, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/methodology/"), lastModified: daily, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about/"), lastModified: daily, changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact/"), lastModified: daily, changeFrequency: "monthly", priority: 0.3 },
  ];

  const statePages: MetadataRoute.Sitemap = [...new Set(stations.map((s) => s.stateSlug))].map((state) => ({
    url: absoluteUrl(`/beaches/${state}/`),
    lastModified: daily,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const stationPages: MetadataRoute.Sitemap = stations.map((s) => ({
    url: absoluteUrl(`/beaches/${s.stateSlug}/${s.slug}/`),
    lastModified: daily,
    changeFrequency: "daily",
    priority: 0.9,
  }));

  // Past months are archival records: advertise their real end-of-month
  // lastModified instead of the daily refresh stamp.
  const monthLastModified = (m: string) => {
    const [y, mo] = m.split("-").map(Number);
    const monthEnd = new Date(Date.UTC(y, mo, 0, 23, 59, 59));
    return monthEnd < daily ? monthEnd : daily;
  };
  const monthPages: MetadataRoute.Sitemap = stations.flatMap((s) =>
    PUBLISHED_MONTHS.map((m) => ({
      url: absoluteUrl(`/beaches/${s.stateSlug}/${s.slug}/${m}/`),
      lastModified: monthLastModified(m),
      changeFrequency: monthLastModified(m) < daily ? ("yearly" as const) : ("weekly" as const),
      priority: 0.6,
    }))
  );

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/guides/${a.slug}/`),
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: absoluteUrl(`/guides/category/${c.category}/`),
    lastModified: daily,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...statePages, ...stationPages, ...monthPages, ...articlePages, ...categoryPages];
}
