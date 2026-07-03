"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StationSelect, useStationData, synthesis, type StationOption } from "@/components/tools-shared";
import { ScoreBadge } from "@/components/window-bits";
import TideCurve from "@/components/tide-curve";
import CalendarGate from "@/components/calendar-gate";
import { capture } from "@/components/analytics";
import { fmtDate, fmtStamp } from "@/lib/format";

type Depth = "any" | "minus" | "deep";

export default function Finder({ stations }: { stations: StationOption[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [depth, setDepth] = useState<Depth>("any");
  const { data, loading } = useStationData(slug);

  const results = data
    ? data.windows
        .filter((w) => w.lowTime > data.generatedAt && w.lowTime < data.generatedAt + 30 * 86400_000)
        .filter((w) => (depth === "minus" ? w.lowHeight < 0 : depth === "deep" ? w.lowHeight <= -1 : true))
        .sort((a, b) => b.score - a.score)
    : [];

  const bestScore = results[0]?.score;
  const bestTime = results[0]?.lowTime;
  useEffect(() => {
    if (!data || bestScore === undefined) return;
    capture("window_result_viewed", {
      station_id: data.station.slug,
      best_score: bestScore,
      days_to_best: Math.round((bestTime! - data.generatedAt) / 86400_000),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.station.slug, bestScore]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <StationSelect stations={stations} value={slug} onChange={setSlug} toolName="finder" />
        <label className="block">
          <span className="mb-1 block font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">Depth</span>
          <select
            className="rounded-md border border-ink/25 bg-white px-3 py-2.5 text-[0.95rem]"
            value={depth}
            onChange={(e) => setDepth(e.target.value as Depth)}
          >
            <option value="any">Any walkable low</option>
            <option value="minus">Minus tides only (&lt; 0 ft)</option>
            <option value="deep">−1.0 ft and lower</option>
          </select>
        </label>
      </div>

      {loading && <p className="mt-6 text-ink-soft">Loading NOAA data…</p>}

      {data && (
        <>
          <div className="answer-box">
            <span className="stamp">
              Next 30 days · computed {fmtStamp(data.generatedAt)} · NOAA {data.station.noaaId}
            </span>
            <p>{synthesis(data, 30)}</p>
          </div>

          {results[0] && <TideCurve window={results[0]} />}

          <div className="mt-4 grid gap-3">
            {results.slice(0, 12).map((w) => (
              <div key={w.lowTime} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/15 bg-white/60 px-4 py-3">
                <div>
                  <p className="font-semibold">
                    <time dateTime={w.date}>{fmtDate(w.date)}</time>{" "}
                    <span className={w.isWeekend || w.isHoliday ? "text-kelp-deep" : "text-ink-soft"}>({w.weekday}{w.isHoliday ? " ✳" : ""})</span>
                  </p>
                  <p className="num mt-0.5 text-[0.92rem]">
                    {w.lowHeight.toFixed(1)} ft at {w.lowTimeLocal} · walkable {w.windowStartLocal}–{w.windowEndLocal} · arrive {w.arriveByLocal}
                  </p>
                  <p className="text-[0.82rem] text-ink-soft">
                    {w.night ? "Night low — scores 0" : `${Math.floor(w.daylightMin / 60)}h ${w.daylightMin % 60}m daylight`}
                    {w.conditions ? ` · ${w.conditions.forecast}, ${w.conditions.tempF}°F` : ""}
                  </p>
                </div>
                <ScoreBadge w={w} />
              </div>
            ))}
          </div>
          {results.length === 0 && (
            <p className="mt-4 text-ink-soft">
              Nothing matches that depth filter in the next 30 days. Try “any walkable low,” or check the station&apos;s
              monthly calendars for the next qualifying dates.
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <CalendarGate stationSlug={data.station.slug} stationName={data.station.name} />
            <Link href={`/beaches/${data.station.stateSlug}/${data.station.slug}/`} className="btn btn-quiet">
              Full {data.station.name} guide →
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
