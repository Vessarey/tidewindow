import type { Metadata } from "next";
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
    </div>
  );
}
