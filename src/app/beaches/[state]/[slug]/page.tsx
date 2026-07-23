import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getIndex, getStationData, upcomingWindows, fmtDate, fmtMonth, fmtStamp } from "@/lib/windows";
import { PUBLISHED_MONTHS } from "@/lib/rollout";
import { WindowTable, ScoreBadge, StationChip } from "@/components/window-bits";
import TideCurve from "@/components/tide-curve";
import CalendarGate from "@/components/calendar-gate";
import EmailSignup from "@/components/email-signup";
import { BreadcrumbJsonLd, FaqJsonLd, StationDatasetJsonLd } from "@/components/json-ld";

export function generateStaticParams() {
  const { stations } = getIndex();
  return stations.map((s) => ({ state: s.stateSlug, slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string; slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { stations } = getIndex();
  const s = stations.find((x) => x.slug === slug);
  if (!s) return {};
  const best = s.best30[0];
  return {
    title: `${s.name} low tide chart — tide pool days & times (NOAA ${s.noaaId})`,
    description: `${best ? `Next good low tide at ${s.name}: ${fmtDate(best.date)}, ${best.lowHeight.toFixed(1)} ft at ${best.lowTimeLocal}. ` : ""}Low tide chart & tide pool windows for ${s.spots[0]} — scored and ranked from NOAA station ${s.noaaId} predictions, updated daily.`,
    alternates: { canonical: "./" },
  };
}

export default async function StationPage({ params }: { params: Promise<{ state: string; slug: string }> }) {
  const { state, slug } = await params;
  let data;
  try {
    data = getStationData(slug);
  } catch {
    notFound();
  }
  const s = data.station;
  if (s.stateSlug !== state) notFound();

  const next30 = upcomingWindows(data, 30);
  const next90 = upcomingWindows(data, 90);
  const best = [...next30].sort((a, b) => b.score - a.score)[0] ?? [...next90].sort((a, b) => b.score - a.score)[0];
  const months = PUBLISHED_MONTHS;
  const minusCount = next30.filter((w) => w.isMinusTide).length;
  const daylightMinus = next30.filter((w) => w.isMinusTide && w.daylightMin >= 30).length;

  const faq = [
    {
      q: `When is the next good low tide at ${s.name}?`,
      a: best
        ? `${fmtDate(best.date)} (${best.weekday}): a ${best.lowHeight.toFixed(1)} ft low at ${best.lowTimeLocal}, walkable from ${best.windowStartLocal} to ${best.windowEndLocal} — score ${best.score}/100. Computed from NOAA station ${s.noaaId} predictions.`
        : `No qualifying daylight window in the next 90 days of NOAA station ${s.noaaId} predictions — check the monthly calendars for the next dates.`,
    },
    {
      q: `How low does the tide need to be at ${s.name}?`,
      a: `Tidewindow counts a window whenever the predicted height falls below +1.0 ft MLLW, and scores depth from +0.5 ft (0 points) to −2.0 ft (50 points). The lower the tide, the more of the intertidal zone is exposed — minus tides (below 0 ft) are when ${s.spots[0]} is at its best.`,
    },
    {
      q: `How many daylight minus tides does ${s.name} get in the next 30 days?`,
      a: `${daylightMinus} of the next 30 days' ${minusCount} minus tides overlap daylight by at least 30 minutes, as of ${fmtStamp(data.generatedAt)}. The full list is in the table above.`,
    },
  ];

  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Beaches", path: "/beaches/" },
          { name: s.stateName, path: `/beaches/${s.stateSlug}/` },
          { name: s.name, path: `/beaches/${s.stateSlug}/${s.slug}/` },
        ]}
      />
      <StationDatasetJsonLd station={s} generatedAt={data.generatedAt} />
      <FaqJsonLd faq={faq} />

      <nav className="text-[0.85rem] text-ink-soft">
        <Link href="/beaches/" className="hover:text-anemone">Beaches</Link> /{" "}
        <Link href={`/beaches/${s.stateSlug}/`} className="hover:text-anemone">{s.stateName}</Link> / {s.name}
      </nav>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <h1 className="text-3xl sm:text-4xl">{s.name} tide windows</h1>
        <StationChip noaaId={s.noaaId} />
      </div>
      <p className="mt-2 max-w-2xl text-ink-soft">{s.blurb}</p>
      <p className="mt-1 text-[0.9rem] text-ink-soft">
        Covers: {s.spots.join(" · ")}
      </p>

      <div className="answer-box">
        <span className="stamp">Next best window · computed {fmtStamp(data.generatedAt)}</span>
        {best ? (
          <p className="text-lg">
            <strong>
              {fmtDate(best.date)} ({best.weekday})
            </strong>
            : the tide bottoms at <strong className="num">{best.lowHeight.toFixed(1)} ft</strong> at{" "}
            <strong className="num">{best.lowTimeLocal}</strong> — walkable {best.windowStartLocal}–
            {best.windowEndLocal}, arrive by <span className="num">{best.arriveByLocal}</span>.{" "}
            <ScoreBadge w={best} />
            {best.conditions && (
              <span className="mt-1 block text-[0.9rem] text-ink-soft">
                Forecast near the low: {best.conditions.forecast}, {best.conditions.tempF}°F (as of{" "}
                {fmtStamp(best.conditions.asOf)} — predictions aren&apos;t observations; check conditions before you
                go).
              </span>
            )}
          </p>
        ) : (
          <p>No qualifying daylight windows in the next 90 days — see the monthly calendars below for the next dates.</p>
        )}
      </div>

      {best && <TideCurve window={best} />}

      <h2 className="mt-10 text-2xl">Every daylight window, next 30 days</h2>
      <p className="mb-3 mt-1 text-[0.9rem] text-ink-soft">
        Heights in feet MLLW from NOAA station {s.noaaId} ({s.officialName}) predictions
        {s.kind === "subordinate" ? ", window bounds cosine-interpolated" : ""}. ✳ = federal holiday.
      </p>
      <WindowTable windows={next30} />

      <div className="mt-6">
        <CalendarGate stationSlug={s.slug} stationName={s.name} />
      </div>

      <h2 className="mt-10 text-2xl">Monthly calendars</h2>
      <p className="mt-1 flex flex-wrap gap-2">
        {months.map((m) => (
          <Link key={m} href={`/beaches/${s.stateSlug}/${s.slug}/${m}/`} className="btn btn-quiet !px-3 !py-1.5 text-[0.85rem]">
            {fmtMonth(m)}
          </Link>
        ))}
      </p>

      {data.species && data.species.length > 0 && (
        <>
          <h2 className="mt-10 text-2xl">What&apos;s in the pools right now</h2>
          <p className="mt-1 text-[0.9rem] text-ink-soft">
            Research-grade observations within 5 km in the last 60 days, via{" "}
            <a className="underline" href="https://www.inaturalist.org" rel="noopener">iNaturalist</a> (data ©
            contributors, CC BY-NC).
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="data-table max-w-xl">
              <thead>
                <tr><th>Species</th><th>Scientific name</th><th>Observations</th></tr>
              </thead>
              <tbody>
                {data.species.map((sp) => (
                  <tr key={sp.scientificName}>
                    <td>{sp.commonName ?? "—"}</td>
                    <td className="italic">{sp.scientificName}</td>
                    <td className="num">{sp.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <hr className="waterline" />

      <section className="prose">
        <h2>Quick answers</h2>
        {faq.map((f) => (
          <div key={f.q}>
            <h3>{f.q}</h3>
            <p>{f.a}</p>
          </div>
        ))}
        <p className="text-[0.85rem] text-ink-soft">
          Safety: tide predictions are astronomical forecasts, not observations — wind and swell change actual water
          levels. Follow posted rules at protected areas, and never turn your back on the ocean. See{" "}
          <Link href="/methodology/">our methodology</Link> for exactly how windows and scores are computed.
        </p>
      </section>

      <EmailSignup
        source="station"
        headline={`Never miss a ${s.name} window`}
        blurb="One email a week with your coast's ranked windows — computed from NOAA data, never padded. Sent every Thursday."
        cta="Join the list"
      />
    </div>
  );
}
