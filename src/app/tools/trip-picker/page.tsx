import type { Metadata } from "next";
import Link from "next/link";
import TripPicker from "./picker";
import { getStationOptions } from "@/lib/station-options";
import { WebApplicationJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Trip Picker — the best low tide during your vacation dates",
  description:
    "Enter your coast trip dates and get the single best low-tide hour — or an honest “skip it, here's the next good date.” Computed from NOAA predictions.",
  alternates: { canonical: "./" },
};

export default function Page() {
  return (
    <div>
      <WebApplicationJsonLd
        name="Trip Picker"
        description="Finds the best low-tide window within a date range at US beaches, from NOAA predictions."
        path="/tools/trip-picker/"
      />
      <h1 className="text-3xl sm:text-4xl">Trip Picker</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        You&apos;ve got the dates; the moon has opinions. Pick your beach and vacation week (up to 21 days) and get the
        one hour that&apos;s worth building the day around — or a straight answer that it isn&apos;t, plus the next
        date that is.
      </p>
      <div className="mt-6">
        <TripPicker stations={getStationOptions()} />
      </div>
      <section className="mt-12 max-w-2xl space-y-8">
        <div>
          <h2 className="text-xl">How it picks</h2>
          <p className="mt-2 text-ink-soft">
            The picker takes every modeled daylight low-tide window inside your range (capped at 21 days) and ranks
            it by the same 0&ndash;100 score used across this site &mdash; depth of the low, daylight overlap,
            weekend timing, and season, per the{" "}
            <Link href="/methodology/" className="underline decoration-kelp/50 hover:decoration-kelp">
              methodology
            </Link>{" "}
            page. You get the top window with its low time and height. If nothing in your range reaches Fair (a
            score of 40), it says so plainly and names the next Good-or-better window (60+) after your dates, so a
            weak week doesn&apos;t masquerade as a good one. Everything here is computed from NOAA&apos;s published
            tide predictions &mdash; predictions, not observations, and never a statement about beach access,
            parking, or conditions on the day.
          </p>
        </div>
        <div>
          <h2 className="text-xl">Where this works</h2>
          <p className="mt-2 text-ink-soft">
            The same 12 NOAA stations the rest of the site tracks, across{" "}
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
            . Pick the station nearest your beach; each state hub lists its stations with monthly low-tide
            calendars if you&apos;d rather browse the dates directly.
          </p>
        </div>
        <div>
          <h2 className="text-xl">Dates still flexible?</h2>
          <p className="mt-2 text-ink-soft">
            Then you have the better problem. The{" "}
            <Link href="/tools/tide-window-finder/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Tide Window Finder
            </Link>{" "}
            ranks the next 30 days at any station, and the{" "}
            <Link href="/tools/year-heatmap/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Year at a Glance
            </Link>{" "}
            heatmap shows which months are worth aiming a trip at in the first place. For the whole decision in
            order &mdash; season, then station, then day, then hour &mdash; see{" "}
            <Link
              href="/guides/how-to-plan-a-tidepooling-trip-around-minus-tides/"
              className="underline decoration-kelp/50 hover:decoration-kelp"
            >
              how to plan a tidepooling trip around minus tides
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
