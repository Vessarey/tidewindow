"use client";

import { useState } from "react";
import { StationSelect, useStationData, type StationOption } from "@/components/tools-shared";
import { ScoreBadge } from "@/components/window-bits";
import { fmtDate, fmtStamp } from "@/lib/format";

function azimuthToCompass(az: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(az / 22.5) % 16];
}

export default function GoldenHour({ stations }: { stations: StationOption[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const { data, loading } = useStationData(slug);

  const results = data
    ? data.windows
        .filter((w) => w.lowTime > data.generatedAt)
        .filter((w) => w.minToSunEdge !== null && Math.abs(w.minToSunEdge) <= 90 && w.daylightMin >= 30)
        .slice(0, 20)
    : [];

  return (
    <div>
      <StationSelect stations={stations} value={slug} onChange={setSlug} toolName="golden_hour" />
      {loading && <p className="mt-6 text-ink-soft">Loading NOAA data…</p>}
      {data && (
        <>
          <div className="answer-box">
            <span className="stamp">
              Next {results.length} golden-hour lows · computed {fmtStamp(data.generatedAt)} · NOAA {data.station.noaaId}
            </span>
            <p>
              Lows within 90 minutes of sunrise or sunset at {data.station.name} — wet rock, long shadows, reflective
              sand. Sun bearing tells you where the light comes from.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Low</th>
                  <th>Height</th>
                  <th>Sun edge</th>
                  <th>Sun bearing at low</th>
                  <th>Score</th>
                </tr>
              </thead>
              <tbody>
                {results.map((w) => (
                  <tr key={w.lowTime}>
                    <td className="whitespace-nowrap">
                      {fmtDate(w.date)} <span className="text-ink-soft">{w.weekday}</span>
                    </td>
                    <td className="num">{w.lowTimeLocal}</td>
                    <td className="num">{w.lowHeight.toFixed(1)} ft</td>
                    <td className="num whitespace-nowrap">
                      {Math.abs(w.minToSunEdge!)} min {Math.abs(w.lowTime - (w.sunrise ?? 0)) < Math.abs(w.lowTime - (w.sunset ?? 0)) ? "after sunrise" : "before sunset"}
                    </td>
                    <td className="num whitespace-nowrap">
                      {w.sunAzAtLow}° ({azimuthToCompass(w.sunAzAtLow)}) · alt {w.sunAltAtLow}°
                    </td>
                    <td><ScoreBadge w={w} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {results.length === 0 && <p className="mt-4 text-ink-soft">No golden-hour overlaps in the prediction range.</p>}
        </>
      )}
    </div>
  );
}
