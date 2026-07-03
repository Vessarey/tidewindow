import type { Metadata } from "next";
import EmbedGenerator from "./embed-gen";
import { getStationOptions } from "@/lib/station-options";

export const metadata: Metadata = {
  title: "Embed a live tide badge",
  description:
    "Put a “next great low tide” badge on your site — auto-updating daily from NOAA predictions, free, one copy-paste iframe.",
  alternates: { canonical: "./" },
};

export default function EmbedPage() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Embed a live tide badge</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Run a surf shop, aquarium, park friends-group, or coastal blog? Drop this badge on your site and it shows your
        beach&apos;s next great low-tide window, refreshed every day from NOAA predictions. Free forever; the small
        “Computed by Tidewindow” credit is the only ask.
      </p>
      <div className="mt-6">
        <EmbedGenerator stations={getStationOptions()} />
      </div>
    </div>
  );
}
