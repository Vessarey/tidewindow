import Link from "next/link";
import type { StationMeta, TideWindow } from "@/lib/format";
import { fmtDate } from "@/lib/format";

export function ScoreBadge({ w }: { w: Pick<TideWindow, "score" | "band"> }) {
  return <span className={`badge badge-${w.band.toLowerCase()}`}>{w.score} · {w.band}</span>;
}

export function StationChip({ noaaId }: { noaaId: string }) {
  return <span className="station-chip">NOAA {noaaId}</span>;
}

/**
 * Server-rendered window table — the primary AEO surface. Every number is in
 * plain HTML for crawlers that don't execute JavaScript.
 */
export function WindowTable({
  windows,
  showDaylight = true,
  caption,
}: {
  windows: TideWindow[];
  showDaylight?: boolean;
  caption?: string;
}) {
  if (!windows.length) {
    return <p className="text-ink-soft italic">No qualifying daylight windows in this range.</p>;
  }
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        {caption && <caption className="pb-2 text-left text-[0.85rem] text-ink-soft">{caption}</caption>}
        <thead>
          <tr>
            <th>Date</th>
            <th>Low</th>
            <th>Height</th>
            <th>Window</th>
            {showDaylight && <th>Daylight</th>}
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {windows.map((w) => (
            <tr key={`${w.date}-${w.lowTime}`}>
              <td className="whitespace-nowrap">
                <time dateTime={w.date}>{fmtDate(w.date)}</time>{" "}
                <span className={w.isWeekend || w.isHoliday ? "font-semibold text-kelp-deep" : "text-ink-soft"}>
                  {w.weekday}
                  {w.isHoliday ? " ✳" : ""}
                </span>
              </td>
              <td className="num whitespace-nowrap">{w.lowTimeLocal}</td>
              <td className={`num whitespace-nowrap ${w.isMinusTide ? "font-semibold" : ""}`}>
                {w.lowHeight.toFixed(1)} ft
              </td>
              <td className="num whitespace-nowrap">
                {w.windowStartLocal}–{w.windowEndLocal}
              </td>
              {showDaylight && (
                <td className="num whitespace-nowrap">{w.night ? "night" : `${Math.floor(w.daylightMin / 60)}h ${w.daylightMin % 60}m`}</td>
              )}
              <td>
                <ScoreBadge w={w} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Compact card for a single headline window. */
export function WindowCard({ w, station, href }: { w: TideWindow; station: StationMeta; href?: string }) {
  const inner = (
    <div className="rounded-lg border border-ink/15 bg-white/60 p-4 transition hover:border-kelp">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold">
          {station.name}
          <span className="ml-2 text-[0.8rem] font-normal text-ink-soft">{station.state}</span>
        </p>
        <ScoreBadge w={w} />
      </div>
      <p className="num mt-2 text-[1.05rem]">
        <time dateTime={w.date}>{fmtDate(w.date)}</time> ({w.weekday}) · {w.lowHeight.toFixed(1)} ft at {w.lowTimeLocal}
      </p>
      <p className="mt-1 text-[0.88rem] text-ink-soft">
        Walkable {w.windowStartLocal}–{w.windowEndLocal} · arrive by {w.arriveByLocal}
        {w.conditions ? ` · ${w.conditions.forecast}, ${w.conditions.tempF}°F` : ""}
      </p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
