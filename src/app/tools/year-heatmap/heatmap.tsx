"use client";

import { useEffect, useState } from "react";
import { StationSelect, useStationData, type StationOption } from "@/components/tools-shared";
import CalendarGate from "@/components/calendar-gate";
import { capture } from "@/components/analytics";
import { fmtMonth, fmtStamp, type TideWindow } from "@/lib/format";

const bandColor: Record<string, string> = {
  Exceptional: "var(--color-gold)",
  Great: "var(--color-kelp)",
  Good: "#7fb8ae",
  Fair: "var(--color-sand)",
  Skip: "#d7dedb",
};

export default function YearHeatmap({ stations }: { stations: StationOption[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const { data, loading } = useStationData(slug);

  useEffect(() => {
    if (data) capture("heatmap_viewed", { station_id: data.station.slug });
  }, [data]);

  if (!data) {
    return (
      <div>
        <StationSelect stations={stations} value={slug} onChange={setSlug} toolName="heatmap" />
        {loading && <p className="mt-6 text-ink-soft">Loading NOAA data…</p>}
      </div>
    );
  }

  // group windows by month -> best window per day
  const months = new Map<string, Map<number, TideWindow>>();
  for (const w of data.windows) {
    if (w.lowTime < data.generatedAt - 86400_000) continue;
    const ym = w.date.slice(0, 7);
    if (!months.has(ym)) months.set(ym, new Map());
    const day = +w.date.slice(8, 10);
    const cur = months.get(ym)!.get(day);
    if (!cur || w.score > cur.score) months.get(ym)!.set(day, w);
  }
  const monthKeys = [...months.keys()].sort().slice(0, 13);

  return (
    <div>
      <div className="no-print">
        <StationSelect stations={stations} value={slug} onChange={setSlug} toolName="heatmap" />
      </div>
      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl">{data.station.name}: the next 13 months</h2>
        <span className="mono text-[0.78rem] text-ink-soft">
          computed {fmtStamp(data.generatedAt)} · NOAA {data.station.noaaId}
        </span>
      </div>
      <p className="mt-1 text-[0.85rem] text-ink-soft">
        Each day is colored by its best window: gold Exceptional · deep green Great · sea-green Good · sand Fair ·
        grey none/night. Hover any day for the numbers.
      </p>
      <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {monthKeys.map((ym) => {
          const [y, m] = ym.split("-").map(Number);
          const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
          const firstDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
          const byDay = months.get(ym)!;
          return (
            <div key={ym}>
              <p className="mb-1 font-mono text-[0.75rem] uppercase tracking-wider text-ink-soft">{fmtMonth(ym)}</p>
              <div className="grid grid-cols-7 gap-[3px]">
                {Array.from({ length: firstDow }).map((_, i) => (
                  <div key={`p${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const w = byDay.get(day);
                  const color = w && !w.night ? bandColor[w.band] : "#e7ece9";
                  return (
                    <div
                      key={day}
                      className="heatmap-cell"
                      style={{ background: color }}
                      title={
                        w
                          ? `${w.date}: ${w.lowHeight.toFixed(1)} ft at ${w.lowTimeLocal}, ${w.windowStartLocal}–${w.windowEndLocal} — score ${w.score} (${w.band})`
                          : `no window`
                      }
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div className="no-print mt-8 flex flex-wrap gap-3">
        <button className="btn btn-quiet" onClick={() => { capture("heatmap_printed", { station_id: data.station.slug }); window.print(); }}>
          Print this year view
        </button>
        <CalendarGate stationSlug={data.station.slug} stationName={data.station.name} />
      </div>
    </div>
  );
}
