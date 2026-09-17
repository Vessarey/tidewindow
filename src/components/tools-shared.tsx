"use client";

import { useEffect, useState } from "react";
import type { StationData } from "@/lib/format";
import { assetUrl } from "@/lib/site-config";
import { capture } from "@/components/analytics";

export interface StationOption {
  slug: string;
  name: string;
  state: string;
  stateSlug: string;
  noaaId: string;
  spots: string[];
}

const cache = new Map<string, StationData>();

export function useStationData(slug: string | null) {
  const [request, setRequest] = useState({ slug, attempt: 0 });
  const [result, setResult] = useState<{ request: typeof request; error: string | null } | null>(null);
  // Reset the request identity when selection changes, so an earlier failure
  // (or a response arriving out of order) cannot belong to the new selection.
  if (request.slug !== slug) setRequest({ slug, attempt: 0 });

  useEffect(() => {
    const selectedSlug = request.slug;
    if (!selectedSlug || cache.has(selectedSlug)) return;
    let alive = true;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);
    fetch(assetUrl(`/data-json/stations/${selectedSlug}.json`), { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw new Error(`Station request failed (${r.status})`);
        return r.json();
      })
      .then((d: StationData) => {
        if (d?.station?.slug !== selectedSlug || !Array.isArray(d.windows) || !Number.isFinite(d.generatedAt)) {
          throw new Error("Invalid station data");
        }
        if (!alive) return;
        cache.set(selectedSlug, d);
        setResult({ request, error: null });
      })
      .catch(() => {
        if (alive) setResult({ request, error: "We couldn’t load this station’s tide data. Try again or choose another station." });
      })
      .finally(() => clearTimeout(timeout));
    return () => {
      alive = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [request]);
  const data = slug ? cache.get(slug) ?? null : null;
  const error = result?.request === request ? result.error : null;
  return {
    data,
    error,
    loading: !!slug && !data && !error,
    retry: () => setRequest((current) => ({ ...current, attempt: current.attempt + 1 })),
  };
}

export function StationDataStatus({ loading, error, retry }: {
  loading: boolean;
  error: string | null;
  retry: () => void;
}) {
  if (loading) return <p className="mt-6 text-ink-soft" role="status">Loading NOAA data…</p>;
  if (!error) return null;
  return (
    <div className="mt-6" role="alert">
      <p className="text-anemone">{error}</p>
      <button type="button" className="btn btn-quiet mt-2" onClick={retry}>Try again</button>
    </div>
  );
}

export function StationSelect({
  stations,
  value,
  onChange,
  toolName,
}: {
  stations: StationOption[];
  value: string | null;
  onChange: (slug: string) => void;
  toolName: string;
}) {
  return (
    <label className="block min-w-0 max-w-full">
      <span className="mb-1 block font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">Beach / station</span>
      <select
        className="w-full max-w-md rounded-md border border-ink/25 bg-white px-3 py-2.5 text-[0.95rem]"
        value={value ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          capture("station_selected", { station_id: e.target.value, tool: toolName });
        }}
      >
        <option value="" disabled>
          Choose a beach…
        </option>
        {stations.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.state} — {s.name} ({s.spots[0]})
          </option>
        ))}
      </select>
    </label>
  );
}

export function PredictionCaveat() {
  return (
    <p className="mt-4 max-w-2xl text-[0.8rem] text-ink-soft">
      Windows are NOAA tide and daylight predictions: they say when the water is low, not whether a beach, trail, or
      stretch of shore is open or reachable. Access, seasonal closures, and how long a route takes are outside this
      data — check the land manager&apos;s current conditions before you go.
    </p>
  );
}

export function synthesis(data: StationData, days: number): string {
  const now = data.generatedAt;
  const horizon = now + days * 86400_000;
  const lows = data.windows.filter((w) => w.lowTime > now && w.lowTime < horizon);
  const minusDaylight = lows.filter((w) => w.isMinusTide && w.daylightMin >= 30);
  const best = [...lows].sort((a, b) => b.score - a.score)[0];
  if (!best) return `No lows below +1.0 ft in the next ${days} days at this station.`;
  const bestStr = `${best.weekday} ${best.date.slice(5).replace("-", "/")} at ${best.lowTimeLocal} (${best.lowHeight.toFixed(1)} ft, score ${best.score})`;
  if (minusDaylight.length === 0) {
    return `None of the next ${days} days' ${lows.length} qualifying lows is a daylight minus tide — the best available is ${bestStr}.`;
  }
  return `Only ${minusDaylight.length} of the next ${days} days' ${lows.length} qualifying lows ${minusDaylight.length === 1 ? "is a" : "are"} daylight minus tide${minusDaylight.length === 1 ? "" : "s"}; the best is ${bestStr}.`;
}
