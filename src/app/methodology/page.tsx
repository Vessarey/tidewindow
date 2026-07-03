import type { Metadata } from "next";
import Link from "next/link";
import { getIndex, fmtStamp } from "@/lib/windows";

export const metadata: Metadata = {
  title: "Methodology — how every number is computed",
  description:
    "Exactly how Tidewindow computes walkable low-tide windows and 0–100 scores from NOAA CO-OPS predictions and solar geometry — including thresholds, formulas, interpolation methods, and honest limitations.",
  alternates: { canonical: "./" },
};

export default function Methodology() {
  const { generatedAt } = getIndex();
  return (
    <div className="prose">
      <h1 className="text-3xl sm:text-4xl">Methodology</h1>
      <p className="mono mt-3 text-[0.78rem] text-ink-soft">Data last computed {fmtStamp(generatedAt)}. This page describes the exact pipeline.</p>

      <h2>The window</h2>
      <p>
        A <strong>tide window</strong> is a contiguous interval when the predicted water height at a NOAA station sits
        below <strong>+1.0 ft MLLW</strong> — a threshold at which most Pacific tidepool shelves and low-tide beaches
        become comfortably walkable. Heights come from{" "}
        <a href="https://tidesandcurrents.noaa.gov/" rel="noopener">NOAA CO-OPS</a> harmonic tide predictions
        (datum MLLW, feet), fetched fresh every day for the next ~400 days.
      </p>
      <ul>
        <li>
          <strong>Harmonic stations:</strong> we fetch the hourly prediction series and linearly interpolate the exact
          crossing times of +1.0 ft, rounded to 5 minutes.
        </li>
        <li>
          <strong>Subordinate stations</strong> (high/low events only): we use standard cosine interpolation between
          consecutive extremes to estimate crossings. Where both methods can be compared at harmonic stations, they
          agree within about ±15 minutes.
        </li>
      </ul>
      <p>
        <strong>Arrive by</strong> is 60 minutes before the low — the classic advice for working out to the lowest
        zone as the water still falls.
      </p>

      <h2>The 0–100 score</h2>
      <ul>
        <li>
          <strong>Depth (0–50):</strong> linear from 0 points at +0.5 ft to 50 points at −2.0 ft (clamped). Lower
          tide, more exposed seafloor.
        </li>
        <li>
          <strong>Daylight (0–30):</strong> the window&apos;s overlap with computed sunrise–sunset, scaling linearly
          to 30 points at 3 hours. Windows with under 30 minutes of daylight score <strong>0 total</strong> and are
          labeled night tides. Sun times are computed with the open-source{" "}
          <a href="https://github.com/cosinekitty/astronomy" rel="noopener">astronomy-engine</a> library for the
          station&apos;s exact coordinates.
        </li>
        <li>
          <strong>Timing (0–10):</strong> Saturday, Sunday, or US federal holiday +10; Friday +5.
        </li>
        <li>
          <strong>Season comfort (0–10):</strong> a fixed, published table by region and month — a simple heuristic
          for daylight length and typical shoulder-season comfort. It is deliberately coarse and is <em>not</em> a
          weather forecast.
        </li>
      </ul>
      <p>Bands: 90–100 Exceptional · 75–89 Great · 60–74 Good · 40–59 Fair · under 40 Skip.</p>

      <h2>Enrichment data</h2>
      <ul>
        <li>
          <strong>Short-range conditions</strong> (windows within 7 days only): NWS point forecasts from
          api.weather.gov, stamped with their fetch date.
        </li>
        <li>
          <strong>“What&apos;s in the pools”</strong>: research-grade observation counts within 5 km over the last 60
          days from the <a href="https://www.inaturalist.org" rel="noopener">iNaturalist</a> open API (© contributors,
          CC BY-NC), filtered to molluscs, echinoderms, cnidarians, and arthropods.
        </li>
      </ul>

      <h2>Honest limitations</h2>
      <ul>
        <li>
          Predictions are astronomical. Wind, swell, and pressure routinely shift actual water levels by half a foot
          or more — check conditions before you go, and never turn your back on the ocean.
        </li>
        <li>
          A station&apos;s predictions apply exactly at the station. Nearby beaches can lag or lead by tens of
          minutes; we name the station on every page so you can judge the distance.
        </li>
        <li>The walkable threshold varies by beach profile; +1.0 ft is a defensible default, not a law of nature.</li>
      </ul>

      <h2>Automation disclosure</h2>
      <p>
        Tidewindow is an automated publication: the data pipeline recomputes every number daily, and the editorial
        content is produced by an AI system operating under strict rules — every tide statistic must come from the
        computed dataset (never from a language model&apos;s memory), factual claims must cite a source fetched at
        publish time, and safety guidance is only ever quoted from park services. Full details on the{" "}
        <Link href="/about/">about page</Link>. Found an error? <Link href="/contact/">Tell us</Link> — corrections
        ship within a day.
      </p>
    </div>
  );
}
