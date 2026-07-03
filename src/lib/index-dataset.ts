import { getIndex, getStationData } from "@/lib/windows";

export interface IndexRow {
  rank: number;
  station: string;
  state: string;
  slug: string;
  stateSlug: string;
  noaaId: string;
  totalDaylightHours: number;
  daylightMinusTides: number;
  deepestDaylightLow: number;
  bestMonth: string;
}

/** The Daylight Minus-Tide Index: 365-day totals per station, computed at build. */
export function computeIndexDataset(): { generatedAt: number; rows: IndexRow[] } {
  const { generatedAt, stations } = getIndex();
  const horizon = generatedAt + 365 * 86400_000;
  const rows = stations
    .map((s) => {
      const data = getStationData(s.slug);
      const ws = data.windows.filter((w) => w.lowTime > generatedAt && w.lowTime < horizon && w.daylightMin >= 30);
      const totalDaylightHours = Math.round(ws.reduce((acc, w) => acc + w.daylightMin, 0) / 60);
      const minus = ws.filter((w) => w.isMinusTide);
      const byMonth = new Map<string, number>();
      for (const w of ws) byMonth.set(w.date.slice(0, 7), (byMonth.get(w.date.slice(0, 7)) ?? 0) + w.daylightMin);
      const bestMonth = [...byMonth.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
      return {
        station: s.name,
        state: s.state,
        slug: s.slug,
        stateSlug: s.stateSlug,
        noaaId: s.noaaId,
        totalDaylightHours,
        daylightMinusTides: minus.length,
        deepestDaylightLow: Math.min(...ws.map((w) => w.lowHeight)),
        bestMonth,
      };
    })
    .sort((a, b) => b.totalDaylightHours - a.totalDaylightHours)
    .map((r, i) => ({ rank: i + 1, ...r }));
  return { generatedAt, rows };
}
