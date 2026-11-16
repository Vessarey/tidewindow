import type { MetadataRoute } from "next";
import { getAllArticles, getCategories } from "@/lib/content";
import { getIndex } from "@/lib/windows";
import { PUBLISHED_MONTHS } from "@/lib/rollout";
import { absoluteUrl } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * `lastModified` is only emitted where it is true. Google discounts a sitemap
 * whose lastmod is unreliable, and until 2026-09-02 64 of 121 URLs here carried
 * the daily refresh timestamp whether or not anything on the page had changed
 * (the GSC audit found 50 sitemap URLs "Discovered – currently not indexed",
 * never fetched). Rules:
 *   - pages whose rendered numbers roll forward every refresh (home, hubs,
 *     station pages) keep the refresh stamp — that is a real change;
 *   - articles use their frontmatter date/updated; the guides index and the
 *     category pages take the newest article they list;
 *   - finished months keep their real end-of-month date;
 *   - tool pages carry the date of their last real copy change (hand-maintained
 *     TOOL_UPDATED below; added 2026-11-16 as a crawl signal for the three
 *     never-fetched tool URLs — see that day's JOURNAL entry);
 *   - static shells, and current/future month pages whose NOAA predictions do
 *     not change from one day to the next, omit lastmod rather than fake one.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const { generatedAt, stations } = getIndex();
  const daily = new Date(generatedAt);
  const articles = getAllArticles();
  const newestOf = (list: typeof articles): Date | undefined => {
    const stamps = list.map((a) => a.updated ?? a.date).sort();
    return stamps.length ? new Date(stamps[stamps.length - 1]) : undefined;
  };

  // Dates of the last real, user-visible copy change to each tool page (from
  // git history of src/app/tools/<slug>/). Update by hand when a tool's
  // rendered copy actually changes; never stamp these with the daily refresh.
  const TOOL_UPDATED = {
    "tide-window-finder": new Date("2026-10-08"),
    "trip-picker": new Date("2026-11-04"),
    "year-heatmap": new Date("2026-09-17"),
    "golden-hour": new Date("2026-11-02"),
  };

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: daily, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/tools/"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/tools/tide-window-finder/"), lastModified: TOOL_UPDATED["tide-window-finder"], changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/tools/trip-picker/"), lastModified: TOOL_UPDATED["trip-picker"], changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/tools/year-heatmap/"), lastModified: TOOL_UPDATED["year-heatmap"], changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/tools/golden-hour/"), lastModified: TOOL_UPDATED["golden-hour"], changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/calendars/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/beaches/"), lastModified: daily, changeFrequency: "daily", priority: 0.9 },
    { url: absoluteUrl("/guides/"), lastModified: newestOf(articles), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/data/"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/data/daylight-minus-tide-index/"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/newsletter/"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/embed/"), changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/methodology/"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about/"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact/"), changeFrequency: "monthly", priority: 0.3 },
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

  // Past months are archival records with a real end-of-month lastmod. Current
  // and future months render fixed harmonic predictions; they get no lastmod.
  const monthEnd = (m: string) => {
    const [y, mo] = m.split("-").map(Number);
    return new Date(Date.UTC(y, mo, 0, 23, 59, 59));
  };
  const monthPages: MetadataRoute.Sitemap = stations.flatMap((s) =>
    PUBLISHED_MONTHS.map((m) => {
      const url = absoluteUrl(`/beaches/${s.stateSlug}/${s.slug}/${m}/`);
      return monthEnd(m) < daily
        ? { url, lastModified: monthEnd(m), changeFrequency: "yearly" as const, priority: 0.6 }
        : { url, changeFrequency: "monthly" as const, priority: 0.6 };
    })
  );

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: absoluteUrl(`/guides/${a.slug}/`),
    lastModified: new Date(a.updated ?? a.date),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryPages: MetadataRoute.Sitemap = getCategories().map((c) => ({
    url: absoluteUrl(`/guides/category/${c.category}/`),
    lastModified: newestOf(articles.filter((a) => a.category === c.category)),
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticPages, ...statePages, ...stationPages, ...monthPages, ...articlePages, ...categoryPages];
}
