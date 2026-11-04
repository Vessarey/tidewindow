import type { Metadata } from "next";
import Link from "next/link";
import TripPicker from "./picker";
import { getStationOptions } from "@/lib/station-options";
import { WebApplicationJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Trip Picker — the best low tide during your vacation dates",
  description:
    "Compare NOAA low-tide windows for a trip of up to 21 days. Ranked by depth, daylight overlap, timing and season; predictions do not establish beach access.",
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
        Pick a station and your trip dates (up to 21 days) to find the highest-scoring modeled low-tide window.
        The low can fall at night. If your best window scores below Fair, a later Good-or-better window after
        your selected end date is shown only if one exists in the current predictions.
      </p>
      <div className="mt-6">
        <TripPicker stations={getStationOptions()} />
      </div>
      <section className="mt-12 max-w-2xl space-y-8">
        <div>
          <h2 className="text-xl">How it picks</h2>
          <p className="mt-2 text-ink-soft">
            The picker ranks modeled low-tide windows inside your range (capped at 21 days)
            by the same 0&ndash;100 score used across this site &mdash; depth of the low, daylight overlap,
            weekend timing, and season, per the{" "}
            <Link href="/methodology/" className="underline decoration-kelp/50 hover:decoration-kelp">
              methodology
            </Link>{" "}
            page. You get the top window with its low time and height. Nighttime lows can appear; check the
            displayed time and score. If the best window scores below Fair (40), the picker says so and shows
            the next Good-or-better window (60+) after your selected end date, if one is available in the current
            predictions. If there are no qualifying lows in your range, it reports that instead.
            Everything here is computed from NOAA&apos;s published
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
