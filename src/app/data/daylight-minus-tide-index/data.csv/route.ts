import { computeIndexDataset } from "@/lib/index-dataset";

export const dynamic = "force-static";

export async function GET() {
  const { generatedAt, rows } = computeIndexDataset();
  const header = "rank,station,state,noaa_station_id,daylight_window_hours_365d,daylight_minus_tides_365d,deepest_daylight_low_ft_mllw,best_month,computed_on";
  const lines = rows.map((r) =>
    [
      r.rank,
      `"${r.station}"`,
      r.state,
      r.noaaId,
      r.totalDaylightHours,
      r.daylightMinusTides,
      r.deepestDaylightLow.toFixed(2),
      r.bestMonth,
      new Date(generatedAt).toISOString().slice(0, 10),
    ].join(",")
  );
  return new Response([header, ...lines].join("\n") + "\n", {
    headers: { "Content-Type": "text/csv; charset=utf-8" },
  });
}
