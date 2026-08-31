"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StationSelect, useStationData, synthesis, type StationOption } from "@/components/tools-shared";
import { ScoreBadge } from "@/components/window-bits";
import TideCurve from "@/components/tide-curve";
import CalendarGate from "@/components/calendar-gate";
import { capture } from "@/components/analytics";
import { fmtDate, fmtStamp } from "@/lib/format";
import { assetUrl } from "@/lib/site-config";

type Depth = "any" | "minus" | "deep";
type ZipMap = {
  vintage: string;
  stations: string[];
  zips: Record<string, [stationIndex: number, distanceMiles: number]>;
};

let zipMapPromise: Promise<ZipMap> | null = null;

function loadZipMap() {
  zipMapPromise ??= fetch(assetUrl("/zip-station-map.json")).then((response) => {
    if (!response.ok) throw new Error(`ZIP map request failed (${response.status})`);
    return response.json() as Promise<ZipMap>;
  });
  return zipMapPromise;
}

function distanceBand(miles: number) {
  if (miles <= 25) return "0-25";
  if (miles <= 75) return "26-75";
  if (miles <= 150) return "76-150";
  if (miles <= 250) return "151-250";
  return "250+";
}

export default function Finder({ stations }: { stations: StationOption[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [depth, setDepth] = useState<Depth>("any");
  const [zip, setZip] = useState("");
  const [zipStatus, setZipStatus] = useState<
    | { kind: "idle" | "loading" }
    | { kind: "match"; stationName: string; miles: number; far: boolean }
    | { kind: "error"; message: string }
  >({ kind: "idle" });
  const { data, loading } = useStationData(slug);

  async function findByZip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zip.replace(/\D/g, "");
    if (!/^\d{5}$/.test(normalized)) {
      setZipStatus({ kind: "error", message: "Enter a five-digit US ZIP code." });
      return;
    }
    setZipStatus({ kind: "loading" });
    try {
      const map = await loadZipMap();
      const match = map.zips[normalized];
      if (!match) {
        capture("zip_lookup_used", { tool: "finder", result: "not_found" });
        setZipStatus({ kind: "error", message: "That ZIP is not in the Census ZCTA map. Choose a station below." });
        return;
      }
      const stationSlug = map.stations[match[0]];
      const station = stations.find((option) => option.slug === stationSlug);
      if (!station) throw new Error("Mapped station is not available");
      const miles = match[1];
      setSlug(station.slug);
      capture("station_selected", {
        station_id: station.slug,
        tool: "finder",
        selection_method: "zip",
        distance_band: distanceBand(miles),
      });
      capture("zip_lookup_used", {
        tool: "finder",
        result: "matched",
        station_id: station.slug,
        distance_band: distanceBand(miles),
      });
      setZipStatus({ kind: "match", stationName: station.name, miles, far: miles > 250 });
    } catch {
      zipMapPromise = null;
      setZipStatus({ kind: "error", message: "The ZIP lookup could not load. Choose a station below." });
    }
  }

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
      <form onSubmit={findByZip} className="mb-5 rounded-lg border border-kelp/25 bg-foam-deep/60 p-4">
        <label htmlFor="finder-zip" className="font-semibold">Start with your ZIP</label>
        <p className="mt-1 text-[0.85rem] text-ink-soft">
          Matched locally against 2025 Census ZIP-area centers. Your ZIP never leaves this page and is not recorded.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <input
            id="finder-zip"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            pattern="[0-9]{5}"
            value={zip}
            onChange={(event) => setZip(event.target.value.replace(/\D/g, "").slice(0, 5))}
            className="w-36 rounded-md border border-ink/25 bg-white px-3 py-2.5 text-[0.95rem]"
            placeholder="e.g. 93950"
            aria-describedby="finder-zip-status"
          />
          <button className="btn btn-primary" type="submit" disabled={zipStatus.kind === "loading"}>
            {zipStatus.kind === "loading" ? "Finding…" : "Find my station"}
          </button>
        </div>
        <p id="finder-zip-status" className={`mt-2 text-[0.85rem] ${zipStatus.kind === "error" ? "text-anemone" : "text-ink-soft"}`} aria-live="polite">
          {zipStatus.kind === "match" && (
            zipStatus.far
              ? `Nearest covered station: ${zipStatus.stationName}, about ${zipStatus.miles.toLocaleString()} miles away. Tidewindow does not cover your coast yet; use the manual list if another station is more useful.`
              : `Nearest covered station: ${zipStatus.stationName}, about ${zipStatus.miles.toLocaleString()} straight-line miles away.`
          )}
          {zipStatus.kind === "error" && zipStatus.message}
        </p>
      </form>

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
