import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open datasets",
  description:
    "Original, downloadable datasets computed by Tidewindow from NOAA predictions — free to cite and reuse under CC BY 4.0.",
  alternates: { canonical: "./" },
};

export default function DataIndex() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Open datasets</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Everything here is computed, documented, and free to reuse with attribution (“Tidewindow, computed from NOAA
        CO-OPS predictions”, CC BY 4.0). One new dataset ships every quarter.
      </p>
      <div className="mt-6 grid gap-4">
        <Link href="/data/daylight-minus-tide-index/" className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
          <h2 className="text-xl">The Daylight Minus-Tide Index, 2026–27</h2>
          <p className="mt-2 text-[0.93rem] text-ink-soft">
            US coastal sites ranked by their total explorable hours — how much daylight minus-tide time each beach
            actually gets over the next 12 months. Launch edition: 12 stations; expanding continuously.
          </p>
        </Link>
        <Link href="/beaches/" className="rounded-lg border border-ink/15 bg-white/60 p-5 transition hover:border-kelp">
          <h2 className="text-xl">Per-station window data (JSON + iCal)</h2>
          <p className="mt-2 text-[0.93rem] text-ink-soft">
            Every station page links its complete computed window dataset — 400 days of windows, scores, and sun
            times as JSON, plus a subscribable calendar feed.
          </p>
        </Link>
      </div>
    </div>
  );
}
