"use client";

import { useState } from "react";
import CalendarGate from "@/components/calendar-gate";

/**
 * Station-picker wrapper around CalendarGate for articles that profile several
 * stations. Keyed on the selected slug so the gate's reveal state resets when
 * the reader switches stations.
 */
export default function MultiStationGate({
  stations,
  source,
}: {
  stations: { slug: string; name: string }[];
  source: string;
}) {
  const [slug, setSlug] = useState(stations[0].slug);
  const current = stations.find((s) => s.slug === slug) ?? stations[0];

  return (
    <div>
      <label className="block max-w-md">
        <span className="mb-1 block font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">
          Beach / station
        </span>
        <select
          className="w-full rounded-md border border-ink/25 bg-white px-3 py-2.5 text-[0.95rem]"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
        >
          {stations.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <div className="mt-3">
        <CalendarGate key={slug} stationSlug={current.slug} stationName={current.name} source={source} />
      </div>
    </div>
  );
}
