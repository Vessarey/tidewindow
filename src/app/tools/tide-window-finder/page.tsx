import type { Metadata } from "next";
import Finder from "./finder";
import { getStationOptions } from "@/lib/station-options";
import { WebApplicationJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Tide Window Finder — when is low tide worth it?",
  description:
    "Pick a US beach and see its next 30 days of walkable low-tide windows, scored 0–100 and ranked — computed from NOAA predictions with arrive-by times.",
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
      <h1 className="text-3xl sm:text-4xl">Tide Window Finder</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        The next 30 days at your beach, ranked. A window is any stretch when the predicted tide sits below +1.0 ft
        MLLW; the score folds in depth, daylight overlap, weekends, and season.{" "}
      </p>
      <div className="mt-6">
        <Finder stations={getStationOptions()} />
      </div>
    </div>
  );
}
