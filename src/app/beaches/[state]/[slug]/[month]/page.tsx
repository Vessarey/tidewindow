import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndex, getStationData, fmtMonth, fmtStamp, fmtDate } from "@/lib/windows";
import { PUBLISHED_MONTHS } from "@/lib/rollout";
import { WindowTable, StationChip, ScoreBadge } from "@/components/window-bits";
import CalendarGate from "@/components/calendar-gate";
import { BreadcrumbJsonLd, StationDatasetJsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  const { stations } = getIndex();
  return stations.flatMap((s) => PUBLISHED_MONTHS.map((month) => ({ state: s.stateSlug, slug: s.slug, month })));
}

const bandColor: Record<string, string> = {
  Exceptional: "var(--color-gold)",
  Great: "var(--color-kelp)",
  Good: "#7fb8ae",
  Fair: "var(--color-sand)",
  Skip: "#d7dedb",
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string; month: string }> }): Promise<Metadata> {
  const { slug, month } = await params;
  const { stations } = getIndex();
  const s = stations.find((x) => x.slug === slug);
  if (!s || !PUBLISHED_MONTHS.includes(month)) return {};
  let description = `Every daylight low-tide window at ${s.name} in ${fmtMonth(month)}, scored and ranked — computed from NOAA station ${s.noaaId} predictions. Printable.`;
  try {
    const monthWindows = getStationData(slug).windows.filter((w) => w.date.startsWith(month));
    const lowest = [...monthWindows].sort((a, b) => a.lowHeight - b.lowHeight)[0];
    const daylightMinus = monthWindows.filter((w) => w.isMinusTide && w.daylightMin >= 30).length;
    if (lowest) {
      description = `${fmtMonth(month)} low tide chart for ${s.name}, NOAA station ${s.noaaId}: lowest tide ${lowest.lowHeight.toFixed(1)} ft on ${fmtDate(lowest.date)} at ${lowest.lowTimeLocal}, ${daylightMinus} daylight minus tide${daylightMinus === 1 ? "" : "s"} — every window scored and ranked. Printable.`;
    }
  } catch {
    // fall back to the generic description if station data is unavailable
  }
  return {
    title: `${s.name} low tide chart & calendar, ${fmtMonth(month)} — best days to go`,
    description,
    alternates: { canonical: "./" },
  };
}

export default async function MonthPage({ params }: { params: Promise<{ state: string; slug: string; month: string }> }) {
  const { state, slug, month } = await params;
  if (!PUBLISHED_MONTHS.includes(month)) notFound();
  let data;
  try {
    data = getStationData(slug);
  } catch {
    notFound();
  }
  const s = data.station;
  if (s.stateSlug !== state) notFound();

  const monthWindows = data.windows.filter((w) => w.date.startsWith(month));
  const daylight = monthWindows.filter((w) => !w.night && w.daylightMin >= 30);
  const minus = monthWindows.filter((w) => w.isMinusTide);
  const daylightMinus = minus.filter((w) => w.daylightMin >= 30);
  const best = [...daylight].sort((a, b) => b.score - a.score)[0];

  // month grid
  const [y, m] = month.split("-").map(Number);
  const daysInMonth = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const firstDow = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const byDay = new Map<number, (typeof monthWindows)[number]>();
  for (const w of monthWindows) {
    const day = +w.date.slice(8, 10);
    const cur = byDay.get(day);
    if (!cur || w.score > cur.score) byDay.set(day, w);
  }

  const idx = PUBLISHED_MONTHS.indexOf(month);
  const prev = idx > 0 ? PUBLISHED_MONTHS[idx - 1] : null;
  const next = idx < PUBLISHED_MONTHS.length - 1 ? PUBLISHED_MONTHS[idx + 1] : null;

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Beaches", path: "/beaches/" },
          { name: s.stateName, path: `/beaches/${s.stateSlug}/` },
          { name: s.name, path: `/beaches/${s.stateSlug}/${s.slug}/` },
          { name: fmtMonth(month), path: `/beaches/${s.stateSlug}/${s.slug}/${month}/` },
        ]}
      />
      <StationDatasetJsonLd station={s} generatedAt={data.generatedAt} />

      <nav className="text-[0.85rem] text-ink-soft no-print">
        <Link href="/beaches/" className="hover:text-anemone">Beaches</Link> /{" "}
        <Link href={`/beaches/${s.stateSlug}/`} className="hover:text-anemone">{s.stateName}</Link> /{" "}
        <Link href={`/beaches/${s.stateSlug}/${s.slug}/`} className="hover:text-anemone">{s.name}</Link> / {fmtMonth(month)}
      </nav>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-4xl">
          {s.name}: {fmtMonth(month)} low tide calendar
        </h1>
        <StationChip noaaId={s.noaaId} />
      </div>

      <div className="answer-box">
        <span className="stamp">Computed {fmtStamp(data.generatedAt)} · NOAA station {s.noaaId}</span>
        <p>
          {fmtMonth(month)} gives {s.name} <strong className="num">{monthWindows.length}</strong> low tides under +1.0
          ft, of which <strong className="num">{daylightMinus.length}</strong>{" "}
          {daylightMinus.length === 1 ? "is a" : "are"} daylight minus tide{daylightMinus.length === 1 ? "" : "s"}.
          {best && (
            <>
              {" "}The month&apos;s best window is <strong>{fmtDate(best.date)} ({best.weekday})</strong> — a{" "}
              <strong className="num">{best.lowHeight.toFixed(1)} ft</strong> low at{" "}
              <strong className="num">{best.lowTimeLocal}</strong>, walkable {best.windowStartLocal}–{best.windowEndLocal}.{" "}
              <ScoreBadge w={best} />
            </>
          )}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-7 gap-1" role="img" aria-label={`Calendar heatmap of window quality for ${fmtMonth(month)}`}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-center font-mono text-[0.7rem] text-ink-soft">{d}</div>
        ))}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`pad-${i}`} />
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
              title={w ? `${w.date}: ${w.lowHeight.toFixed(1)} ft at ${w.lowTimeLocal} — score ${w.score} (${w.band})` : `${month}-${String(day).padStart(2, "0")}: no window below +1.0 ft`}
            >
              <span className={w && (w.band === "Great" || w.band === "Exceptional") ? "font-bold" : ""}>{day}</span>
            </div>
          );
        })}
      </div>
      <p className="mt-1 text-[0.78rem] text-ink-soft">
        Day color = best window that day: gold Exceptional · deep green Great · sea-green Good · sand Fair · grey none/night.
      </p>

      <h2 className="mt-8 text-2xl">Every window in {fmtMonth(month)}</h2>
      <p className="mb-3 mt-1 text-[0.9rem] text-ink-soft">Heights in feet MLLW. ✳ = federal holiday. Night lows score 0.</p>
      <WindowTable windows={monthWindows} />

      <div className="no-print mt-6 flex flex-wrap items-center gap-3">
        <CalendarGate stationSlug={s.slug} stationName={s.name} />
        {prev && (
          <Link className="btn btn-quiet" href={`/beaches/${s.stateSlug}/${s.slug}/${prev}/`}>
            ← {fmtMonth(prev)}
          </Link>
        )}
        {next && (
          <Link className="btn btn-quiet" href={`/beaches/${s.stateSlug}/${s.slug}/${next}/`}>
            {fmtMonth(next)} →
          </Link>
        )}
      </div>

      <p className="mt-8 text-[0.85rem] text-ink-soft">
        Predictions are astronomical forecasts, not observations — wind and pressure change actual water levels.
        Method: {data.method === "hourly-interpolation" ? "hourly NOAA series, linear-interpolated crossings" : "cosine interpolation between NOAA high/low events"}, rounded to 5 minutes. Full details on the{" "}
        <Link href="/methodology/" className="underline">methodology page</Link>.
      </p>
    </div>
  );
}
