import type { Metadata } from "next";
import Link from "next/link";
import Finder from "./finder";
import { getStationOptions } from "@/lib/station-options";
import { WebApplicationJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Find the Next Low Tide Near You — Tide Window Finder",
  description:
    "When is the next low tide worth a trip? Pick a US beach and get its next 30 days of daylight low-tide and minus-tide windows, scored 0–100 from NOAA predictions.",
  alternates: { canonical: "./" },
};

export default function Page() {
  return (
    <div>
      <WebApplicationJsonLd
        name="Tide Window Finder"
        description="Ranked daylight low-tide windows for US beaches, computed from NOAA CO-OPS predictions."
        path="/tools/tide-window-finder/"
      />
      <h1 className="text-3xl sm:text-4xl">Find the next low tide near you</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Wondering when the next low tide — or better, the next{" "}
        <Link href="/guides/what-is-a-minus-tide/" className="underline decoration-kelp/50 hover:decoration-kelp">
          minus tide
        </Link>{" "}
        — is at your beach? Pick the nearest of 12 NOAA stations below and get the next 30 days of walkable
        windows, ranked. A window is any stretch when the predicted tide sits below +1.0 ft MLLW; the score folds
        in depth, daylight overlap, weekends, and season.
      </p>
      <div className="mt-6">
        <Finder stations={getStationOptions()} />
      </div>
      <section className="mt-12 max-w-2xl space-y-8">
        <div>
          <h2 className="text-xl">How low does the tide need to be?</h2>
          <p className="mt-2 text-ink-soft">
            A tide chart tells you when low tide is; it doesn&apos;t tell you whether that low is any good. Most
            beaches only open up meaningfully below about 0 ft MLLW, and the famous stuff tends to need a minus
            tide. If the scores above look stingy, that&apos;s the honest answer for the next month — see{" "}
            <Link
              href="/guides/how-low-does-the-tide-need-to-be-for-tide-pools/"
              className="underline decoration-kelp/50 hover:decoration-kelp"
            >
              how low the tide needs to be for tide pools
            </Link>{" "}
            for what unlocks at each depth, or{" "}
            <Link href="/guides/how-to-read-a-tide-table/" className="underline decoration-kelp/50 hover:decoration-kelp">
              how to read a tide table
            </Link>{" "}
            for the basics. The scoring math is on the{" "}
            <Link href="/methodology/" className="underline decoration-kelp/50 hover:decoration-kelp">
              methodology
            </Link>{" "}
            page.
          </p>
        </div>
        <div>
          <h2 className="text-xl">Where this works</h2>
          <p className="mt-2 text-ink-soft">
            The finder covers 12 NOAA tide stations across{" "}
            <Link href="/beaches/wa/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Washington
            </Link>
            ,{" "}
            <Link href="/beaches/or/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Oregon
            </Link>
            ,{" "}
            <Link href="/beaches/ca/" className="underline decoration-kelp/50 hover:decoration-kelp">
              California
            </Link>
            , and{" "}
            <Link href="/beaches/me/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Maine
            </Link>
            . Each state hub lists its stations with monthly low tide calendars. Tides shift by only minutes over
            tens of miles of open coast, so the nearest station is usually a fine stand-in — inside bays and
            sounds, pick the station on your side of the water.
          </p>
        </div>
        <div>
          <h2 className="text-xl">Planning around fixed dates instead?</h2>
          <p className="mt-2 text-ink-soft">
            If your question is &ldquo;I&apos;m there July 14–20, when do I go?&rdquo;, the{" "}
            <Link href="/tools/trip-picker/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Trip Picker
            </Link>{" "}
            answers it directly. For the long view — every window for the rest of the year in one graphic — try
            the{" "}
            <Link href="/tools/year-heatmap/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Year at a Glance
            </Link>{" "}
            heatmap.
          </p>
        </div>
      </section>
    </div>
  );
}
