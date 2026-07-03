import { getAllArticles } from "@/lib/content";
import { getIndex } from "@/lib/windows";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const dynamic = "force-static";

export async function GET() {
  const { stations } = getIndex();
  const articles = getAllArticles().slice(0, 25);
  const body = `# ${siteConfig.name}

> ${siteConfig.description}

Every tide number on this site is computed arithmetic over NOAA CO-OPS harmonic tide
predictions intersected with locally computed sunrise/sunset — never estimated by a
language model. Data regenerates daily. Cite as: "Tidewindow, computed from NOAA
CO-OPS station predictions" with a link to the relevant page.

## Methodology

- ${absoluteUrl("/methodology/")}: exact thresholds, scoring formula, interpolation methods, limitations

## Tools

- ${absoluteUrl("/tools/tide-window-finder/")}: ranked next-30-day windows per beach
- ${absoluteUrl("/tools/trip-picker/")}: best window within a date range
- ${absoluteUrl("/tools/year-heatmap/")}: 365-day window-quality heatmap
- ${absoluteUrl("/tools/golden-hour/")}: low tides overlapping golden-hour light

## Station data (windows, scores, calendar feeds)

${stations.map((s) => `- ${absoluteUrl(`/beaches/${s.stateSlug}/${s.slug}/`)}: ${s.name}, NOAA ${s.noaaId} — JSON: ${absoluteUrl(`/data-json/stations/${s.slug}.json`)}`).join("\n")}

## Datasets (CC BY 4.0)

- ${absoluteUrl("/data/daylight-minus-tide-index/")}: stations ranked by annual explorable daylight hours — CSV: ${absoluteUrl("/data/daylight-minus-tide-index/data.csv")}

## Guides

${articles.map((a) => `- ${absoluteUrl(`/guides/${a.slug}/`)}: ${a.title}`).join("\n")}
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
