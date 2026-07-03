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
  const [data, setData] = useState<StationData | null>(slug ? cache.get(slug) ?? null : null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!slug) return;
    if (cache.has(slug)) {
      setData(cache.get(slug)!);
      return;
    }
    let alive = true;
    setLoading(true);
    fetch(assetUrl(`/data-json/stations/${slug}.json`))
      .then((r) => r.json())
      .then((d: StationData) => {
        cache.set(slug, d);
        if (alive) {
          setData(d);
          setLoading(false);
        }
      })
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [slug]);
  return { data: data && data.station.slug === slug ? data : null, loading };
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
    <label className="block">
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
