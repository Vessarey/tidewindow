import type { Metadata } from "next";
import YearHeatmap from "./heatmap";
import { getStationOptions } from "@/lib/station-options";
import { WebApplicationJsonLd } from "@/components/json-ld";

export const metadata: Metadata = {
  title: "Year at a Glance — a 365-day low tide heatmap",
  description:
    "Your beach's whole year of low-tide window quality in one printable heatmap — every day colored by its best daylight window, computed from NOAA predictions.",
  alternates: { canonical: "./" },
};

export default function Page() {
  return (
    <div>
      <WebApplicationJsonLd
        name="Year at a Glance heatmap"
        description="365-day heatmap of daylight low-tide window quality for US beaches."
        path="/tools/year-heatmap/"
      />
      <h1 className="text-3xl sm:text-4xl">Year at a Glance</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        The season has a shape — summer dawn minus tides on the Pacific, winter afternoon lows in the south. This
        heatmap shows your beach&apos;s entire next 13 months so you can plan around the gold days. It prints nicely;
        fridges love it.
      </p>
      <div className="mt-6">
        <YearHeatmap stations={getStationOptions()} />
      </div>
    </div>
  );
}
