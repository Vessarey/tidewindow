import fs from "fs";
import path from "path";
import type { StationData, StationSummary, TideWindow } from "./format";

export * from "./format";

const DATA_DIR = path.join(process.cwd(), "public", "data-json");

export function getIndex(): { generatedAt: number; stations: StationSummary[] } {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, "index.json"), "utf8"));
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
  return data.windows.filter((w) => w.lowTime > now && w.lowTime < now + days * 86400_000);
}

/** Months (yyyy-mm) that have at least one window, for calendar pages. */
export function monthsWithWindows(data: StationData): string[] {
  return [...new Set(data.windows.map((w) => w.date.slice(0, 7)))].sort();
}
