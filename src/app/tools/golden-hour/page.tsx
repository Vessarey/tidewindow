import type { Metadata } from "next";
import Link from "next/link";
import GoldenHour from "./golden";
import { getStationOptions } from "@/lib/station-options";
import { WebApplicationJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Golden Hour × Low Tide — a photographer's tide calendar",
  description:
    "The rare windows when a real low tide overlaps golden-hour light, with sun bearing at the moment of the low — computed from NOAA predictions and solar geometry.",
  alternates: { canonical: "./" },
};

export default function Page() {
  return (
    <div>
      <WebApplicationJsonLd
        name="Golden Hour × Low Tide"
        description="Finds low tides that coincide with golden-hour light at US beaches, with sun bearing."
        path="/tools/golden-hour/"
      />
      <h1 className="text-3xl sm:text-4xl">Golden Hour × Low Tide</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Twice a day the light gets good; a few times a month the tide gets low. This tool finds the days they overlap
        — lows within ±90 minutes of sunrise or sunset — and tells you which way the sun will be pointing.
      </p>
      <div className="mt-6">
        <GoldenHour stations={getStationOptions()} />
      </div>
      <section className="mt-12 max-w-2xl space-y-8">
        <div>
          <h2 className="text-xl">What counts as an overlap</h2>
          <p className="mt-2 text-ink-soft">
            A window makes this list when its low falls within 90 minutes of sunrise or sunset and the window
            itself has at least 30 minutes of daylight. The low itself can fall before sunrise or after sunset;
            daylight overlap somewhere in the window does not put the low in daylight. The table shows the
            nearest sun edge, the low&apos;s offset from it, and the sun&apos;s computed compass bearing and altitude
            at the low. Those are geometric positions, not a guarantee of visible sunlight or an unobstructed
            view. The tide times come from NOAA&apos;s published predictions and the sun&apos;s position from
            standard solar geometry; the scoring is on the{" "}
            <Link href="/methodology/" className="underline decoration-kelp/50 hover:decoration-kelp">
              methodology
            </Link>{" "}
            page. None of it is a weather forecast: a fog bank keeps its own schedule.
          </p>
        </div>
        <div>
          <h2 className="text-xl">Why the list can run short</h2>
          <p className="mt-2 text-ink-soft">
            A window has to meet both conditions above. Depending on the station and dates, that can leave
            few or no results in the prediction range; the table shows at most 20 matches. The{" "}
            <Link href="/tools/tide-window-finder/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Tide Window Finder
            </Link>{" "}
            ranks qualifying low-tide windows over the next 30 days, including nighttime lows, and{" "}
            <Link
              href="/guides/why-summer-lowest-tides-happen-at-dawn-pacific/"
              className="underline decoration-kelp/50 hover:decoration-kelp"
            >
              why summer&apos;s lowest tides happen at dawn
            </Link>{" "}
            explains the timing pattern behind it on the Pacific coast.
          </p>
        </div>
        <div>
          <h2 className="text-xl">Planning the shot</h2>
          <p className="mt-2 text-ink-soft">
            The companion guide,{" "}
            <Link
              href="/guides/golden-hour-low-tide-photography-calendar-2026/"
              className="underline decoration-kelp/50 hover:decoration-kelp"
            >
              Golden Hour at Low Tide
            </Link>
            , walks through reading the azimuth and offset numbers and discusses selected 2026 overlaps. If
            your travel dates are already fixed, the{" "}
            <Link href="/tools/trip-picker/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Trip Picker
            </Link>{" "}
            finds the best low in your range &mdash; light or no light.
          </p>
        </div>
      </section>
    </div>
  );
}
