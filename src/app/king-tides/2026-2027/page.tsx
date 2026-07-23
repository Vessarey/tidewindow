import Link from "next/link";
import type { Metadata } from "next";
import { getIndex, getStationData, fmtStamp } from "@/lib/windows";
import { WindowTable } from "@/components/window-bits";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import EmailSignup from "@/components/email-signup";

export const metadata: Metadata = {
  title: "King tide season 2026–27: the extreme daylight lows",
  description:
    "King tide season brings the year's most extreme tides. Here are the rare daylight extreme-low windows for the 2026–27 season at every Tidewindow station, computed from NOAA predictions.",
  alternates: { canonical: "./" },
};

export default function KingTides() {
  const { generatedAt, stations } = getIndex();
  const seasonStart = "2026-10-01";
  const seasonEnd = "2027-03-31";

  const perStation = stations.map((s) => {
    const data = getStationData(s.slug);
    const lows = data.windows
      .filter((w) => w.date >= seasonStart && w.date <= seasonEnd && w.daylightMin >= 30)
      .sort((a, b) => a.lowHeight - b.lowHeight)
      .slice(0, 4)
      .sort((a, b) => a.lowTime - b.lowTime);
    return { s, lows };
  });

  return (
    <div>
      <BreadcrumbJsonLd items={[{ name: "King tides 2026–27", path: "/king-tides/2026-2027/" }]} />
      <h1 className="text-3xl sm:text-4xl">King tide season 2026–27: the extreme daylight lows</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Around the winter&apos;s perigean spring tides — “king tides” — the ocean swings hardest in both directions.
        The dramatic flooded-seawall photos get the headlines; this page tracks the other half:{" "}
        <strong>the rare extreme lows that happen in daylight</strong>, when reefs surface that stay underwater the
        rest of the year.
      </p>

      <div className="answer-box">
        <span className="stamp">Computed {fmtStamp(generatedAt)} · October 2026 – March 2027 · NOAA CO-OPS</span>
        <p>
          Below: each station&apos;s four lowest daylight lows of the season. Winter lows on the Pacific coast tend to
          land in the afternoon — kinder hours than summer&apos;s dawn windows.
        </p>
      </div>

      {perStation.map(({ s, lows }) => (
        <section key={s.slug} className="mt-8">
          <h2 className="text-2xl">
            <Link href={`/beaches/${s.stateSlug}/${s.slug}/`} className="hover:text-anemone">
              {s.name} ({s.state}) →
            </Link>
          </h2>
          <div className="mt-2">
            <WindowTable windows={lows} />
          </div>
        </section>
      ))}

      <p className="mt-8 text-[0.85rem] text-ink-soft">
        Winter extreme lows come with winter ocean: storm swell can erase the calm-water advantage entirely. Check
        forecasts and local advisories before any winter reef walk. Predictions ≠ observations.
      </p>

      <EmailSignup
        source="king_tides"
        headline="Get a heads-up before each king-tide low"
        blurb="The Minus Tide Alert flags rare daylight extreme lows for your coast a week ahead. Sent every Thursday."
        cta="Join the list"
      />
    </div>
  );
}
