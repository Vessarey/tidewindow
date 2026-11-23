import fs from "fs";
import path from "path";
import { visitWindows } from "./access.mjs";
import type { StationData, StationSummary, TideWindow } from "./format";

export * from "./format";

const DATA_DIR = path.join(process.cwd(), "public", "data-json");

export function getIndex(): { generatedAt: number; stations: StationSummary[] } {
  const index: { generatedAt: number; stations: StationSummary[] } = JSON.parse(fs.readFileSync(path.join(DATA_DIR, "index.json"), "utf8"));
  // Recompute from the complete windows so a closed raw top-five cannot hide an open runner-up.
  index.stations = index.stations.map((s) => {
    if (s.slug !== "san-diego-ca") return s;
    const upcoming = upcomingWindows(getStationData(s.slug), 400);
    return { ...s, best30: upcoming.filter((w) => w.lowTime < index.generatedAt + 30 * 86400_000)
      .sort((a, b) => b.score - a.score).slice(0, 5), nextWindow: upcoming[0] ?? null };
  });
  return index;
}

export function getStationData(slug: string): StationData {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "stations", `${slug}.json`), "utf8"));
}

export function getStationSlugs(): string[] {
  return fs
    .readdirSync(path.join(DATA_DIR, "stations"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""));
}

export function upcomingWindows(data: StationData, days: number): TideWindow[] {
  const now = data.generatedAt;
  return visitWindows(data.station.slug, data.windows).filter((w) => w.lowTime > now && w.lowTime < now + days * 86400_000);
}

/** Months (yyyy-mm) that have at least one window, for calendar pages. */
export function monthsWithWindows(data: StationData): string[] {
  return [...new Set(data.windows.map((w) => w.date.slice(0, 7)))].sort();
}
