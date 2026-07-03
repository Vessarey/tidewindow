"use client";

import { useEffect, useState } from "react";
import { StationSelect, useStationData, type StationOption } from "@/components/tools-shared";
import { ScoreBadge } from "@/components/window-bits";
import TideCurve from "@/components/tide-curve";
import CalendarGate from "@/components/calendar-gate";
import { capture } from "@/components/analytics";
import { fmtDate, fmtStamp, type TideWindow } from "@/lib/format";

export default function TripPicker({ stations }: { stations: StationOption[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const { data, loading } = useStationData(slug);

  let ranked: TideWindow[] = [];
  let clampedNote = "";
  if (data && from && to && from <= to) {
    let end = to;
    const maxEnd = new Date(new Date(from + "T00:00:00Z").getTime() + 20 * 86400_000).toISOString().slice(0, 10);
    if (to > maxEnd) {
      end = maxEnd;
      clampedNote = "Range capped at 21 days.";
    }
    ranked = data.windows.filter((w) => w.date >= from && w.date <= end).sort((a, b) => b.score - a.score);
  }
  const best = ranked[0];
  const nextGreat = data && best && best.score < 40
    ? data.windows.find((w) => w.date > to && w.score >= 60)
    : null;

  useEffect(() => {
    if (!data || !best) return;
    capture("trip_picker_run", {
      station_id: data.station.slug,
      range_days: Math.round((Date.parse(to) - Date.parse(from)) / 86400_000) + 1,
      best_score: best.score,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.station.slug, from, to, best?.score]);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-4">
        <StationSelect stations={stations} value={slug} onChange={setSlug} toolName="trip_picker" />
        <label className="block">
          <span className="mb-1 block font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">From</span>
          <input type="date" className="rounded-md border border-ink/25 bg-white px-3 py-2 text-[0.95rem]" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label className="block">
          <span className="mb-1 block font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">To</span>
          <input type="date" className="rounded-md border border-ink/25 bg-white px-3 py-2 text-[0.95rem]" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
      </div>

      {loading && <p className="mt-6 text-ink-soft">Loading NOAA data…</p>}

      {data && from && to && (
        <>
          {best ? (
            <>
              <div className="answer-box">
                <span className="stamp">
                  Your trip&apos;s best hour · computed {fmtStamp(data.generatedAt)} · NOAA {data.station.noaaId}
                </span>
                {best.score >= 40 ? (
                  <p className="text-lg">
                    <strong>{fmtDate(best.date)} ({best.weekday})</strong>: be on the beach by{" "}
                    <strong className="num">{best.arriveByLocal}</strong> — the tide bottoms at{" "}
                    <strong className="num">{best.lowHeight.toFixed(1)} ft</strong> at{" "}
                    <strong className="num">{best.lowTimeLocal}</strong>, walkable until {best.windowEndLocal}.{" "}
                    <ScoreBadge w={best} />
                  </p>
                ) : (
                  <p className="text-lg">
                    Honestly? <strong>Not a great stretch.</strong> The best your dates offer is {fmtDate(best.date)} at{" "}
                    <span className="num">{best.lowTimeLocal}</span> ({best.lowHeight.toFixed(1)} ft, score {best.score}
                    ).{" "}
                    {nextGreat && (
                      <>
                        The next genuinely good window at {data.station.name} is{" "}
                        <strong>{fmtDate(nextGreat.date)}</strong> ({nextGreat.lowHeight.toFixed(1)} ft at{" "}
                        {nextGreat.lowTimeLocal}, score {nextGreat.score}).
                      </>
                    )}
                  </p>
                )}
                {clampedNote && <p className="mt-1 text-[0.8rem] text-ink-soft">{clampedNote}</p>}
              </div>
              <TideCurve window={best} />
              {ranked.length > 1 && (
                <>
                  <h2 className="mt-6 text-xl">Runners-up</h2>
                  <div className="mt-3 grid gap-2">
                    {ranked.slice(1, 4).map((w) => (
                      <div key={w.lowTime} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-ink/15 bg-white/60 px-4 py-2.5">
                        <p className="num text-[0.95rem]">
                          {fmtDate(w.date)} ({w.weekday}) · {w.lowHeight.toFixed(1)} ft at {w.lowTimeLocal} · {w.windowStartLocal}–{w.windowEndLocal}
                        </p>
                        <ScoreBadge w={w} />
                      </div>
                    ))}
                  </div>
                </>
              )}
              <div className="mt-6">
                <CalendarGate stationSlug={data.station.slug} stationName={data.station.name} />
              </div>
            </>
          ) : (
            <p className="mt-6 text-ink-soft">
              No lows below +1.0 ft during those dates (or they&apos;re beyond the 400-day prediction range). Try
              different dates.
            </p>
          )}
        </>
      )}
    </div>
  );
}
