import type { Metadata } from "next";
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
    </div>
  );
}
