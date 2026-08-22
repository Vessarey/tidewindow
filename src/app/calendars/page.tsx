import Link from "next/link";
import type { Metadata } from "next";
import { getIndex, getStationData, fmtStamp } from "@/lib/windows";
import CalendarGate from "@/components/calendar-gate";
import { BreadcrumbJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Tide calendar feeds — every good window, 12 months ahead",
  description:
    "Free tide calendar feeds for all 12 stations: every Good-or-better daylight low-tide window for the next 12 months, with arrive-by alarms. Computed from NOAA predictions, refreshed daily.",
  alternates: { canonical: "./" },
};

export default function CalendarsPage() {
  const { generatedAt, stations } = getIndex();
  const yearAhead = generatedAt + 365 * 86400_000;
  const states = [...new Set(stations.map((s) => s.stateSlug))];

  const feedCount = (slug: string) => {
    try {
      return getStationData(slug).windows.filter((w) => w.score >= 60 && w.windowStart <= yearAhead).length;
    } catch {
      return null;
    }
  };

  return (
    <div>
      <BreadcrumbJsonLd items={[{ name: "Calendar feeds", path: "/calendars/" }]} />
      <h1 className="text-3xl sm:text-4xl">Put the tide on your calendar</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Each feed below carries every Good-or-better daylight window at one station for the next 12 months — start and
        end times, the low&apos;s height, its score, and a 45-minute heads-up alarm. Subscribe once in Apple, Google, or
        any calendar app and the feed stays current on its own: the data behind it regenerates from NOAA predictions
        every day. <span className="mono text-[0.85rem]">Last computed {fmtStamp(generatedAt)}.</span>
      </p>
      <p className="mt-3 max-w-2xl text-[0.9rem] text-ink-soft">
        Getting a feed&apos;s URL asks for your email once — that also joins the weekly Minus Tide Alert (unsubscribe
        anytime). The on-screen tide tables across this site are never gated.
      </p>

      {states.map((stateSlug) => {
        const group = stations.filter((s) => s.stateSlug === stateSlug);
        return (
          <section key={stateSlug} className="mt-8">
            <h2 className="text-2xl">
              <Link href={`/beaches/${stateSlug}/`} className="hover:text-anemone">
                {group[0].stateName} →
              </Link>
            </h2>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {group.map((s) => {
                const n = feedCount(s.slug);
                return (
                  <div key={s.slug} className="rounded-lg border border-ink/15 bg-white/60 p-4">
                    <p className="font-semibold">
                      <Link href={`/beaches/${s.stateSlug}/${s.slug}/`} className="hover:text-anemone">
                        {s.name}
                      </Link>
                    </p>
                    <p className="mt-1 text-[0.85rem] text-ink-soft">{s.spots.join(" · ")}</p>
                    {n !== null && (
                      <p className="num mt-2 text-[0.9rem]">
                        {n} window{n === 1 ? "" : "s"} in the feed right now
                      </p>
                    )}
                    <div className="mt-3">
                      <CalendarGate stationSlug={s.slug} stationName={s.name} source="calendars_page" />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      <h2 className="mt-10 text-2xl">Subscribe or download?</h2>
      <p className="mt-2 max-w-2xl text-[0.95rem]">
        Subscribing (&quot;Add calendar → from URL&quot; in most apps) is the good option: your calendar re-fetches the
        feed on its own, so windows further out appear as the daily refresh computes them. Downloading the .ics file
        works too, but it&apos;s a snapshot — it won&apos;t update. Prefer paper? Every station page has printable{" "}
        <Link href="/beaches/" className="underline">monthly calendar pages</Link>, and the{" "}
        <Link href="/tools/year-heatmap/" className="underline">year heatmap</Link> prints the whole season on one
        sheet.
      </p>
      <p className="mt-4 max-w-2xl text-[0.85rem] text-ink-soft">
        Feed events are astronomical predictions, not observations — wind and pressure change actual water levels, so
        check conditions before you go. How windows and scores are computed is documented on the{" "}
        <Link href="/methodology/" className="underline">methodology page</Link>.
      </p>
    </div>
  );
}
