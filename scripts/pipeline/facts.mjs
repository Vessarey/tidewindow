/**
 * Generates compact "fact sheets" from the computed window data for the
 * content system. Writers may ONLY use tide numbers that appear here.
 * Output: docs-internal/facts/*.json
 * Run: node scripts/pipeline/facts.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..", "..");
const DATA = path.join(ROOT, "public", "data-json");
const OUT = path.join(ROOT, "docs-internal", "facts");
fs.mkdirSync(OUT, { recursive: true });

const index = JSON.parse(fs.readFileSync(path.join(DATA, "index.json"), "utf8"));
const stations = {};
for (const s of index.stations) {
  stations[s.slug] = JSON.parse(fs.readFileSync(path.join(DATA, "stations", `${s.slug}.json`), "utf8"));
}

const brief = (w) => ({
  date: w.date,
  weekday: w.weekday,
  low_ft: w.lowHeight,
  low_time_local: w.lowTimeLocal,
  window_local: `${w.windowStartLocal}–${w.windowEndLocal}`,
  arrive_by_local: w.arriveByLocal,
  daylight_min: w.daylightMin,
  score: w.score,
  band: w.band,
  weekend_or_holiday: w.isWeekend || w.isHoliday,
});

function stationFacts(slug) {
  const d = stations[slug];
  const now = d.generatedAt;
  const up = d.windows.filter((w) => w.lowTime > now);
  const y2026 = d.windows.filter((w) => w.date.startsWith("2026") && w.lowTime > now);
  const daylight = (ws) => ws.filter((w) => w.daylightMin >= 30);

  const months2026 = {};
  for (let m = 7; m <= 12; m++) {
    const mm = `2026-${String(m).padStart(2, "0")}`;
    const inMonth = y2026.filter((w) => w.date.startsWith(mm));
    const dl = daylight(inMonth);
    const minusDl = dl.filter((w) => w.isMinusTide);
    const best = [...dl].sort((a, b) => b.score - a.score)[0];
    months2026[mm] = {
      lows_below_1ft: inMonth.length,
      daylight_windows: dl.length,
      daylight_minus_tides: minusDl.length,
      best_window: best ? brief(best) : null,
    };
  }

  return {
    generated_on: new Date(now).toISOString().slice(0, 10),
    source: `NOAA CO-OPS station ${d.station.noaaId} (${d.station.officialName}) predictions, MLLW, computed by Tidewindow pipeline`,
    station: {
      slug,
      name: d.station.name,
      noaa_id: d.station.noaaId,
      state: d.station.state,
      lat: d.station.lat,
      lng: d.station.lng,
      spots: d.station.spots,
      method: d.method,
    },
    next_60d_best_8: daylight(up.filter((w) => w.lowTime < now + 60 * 86400_000))
      .sort((a, b) => b.score - a.score)
      .slice(0, 8)
      .map(brief),
    months_2026: months2026,
    deepest_2026_daylight_lows_top8: daylight(y2026)
      .sort((a, b) => a.lowHeight - b.lowHeight)
      .slice(0, 8)
      .map(brief),
    king_season_oct26_mar27_lowest5_daylight: daylight(
      d.windows.filter((w) => w.date >= "2026-10-01" && w.date <= "2027-03-31")
    )
      .sort((a, b) => a.lowHeight - b.lowHeight)
      .slice(0, 5)
      .map(brief),
    golden_hour_overlaps_next120d_top6: up
      .filter((w) => w.lowTime < now + 120 * 86400_000 && w.minToSunEdge !== null && Math.abs(w.minToSunEdge) <= 90 && w.daylightMin >= 30)
      .slice(0, 6)
      .map((w) => ({ ...brief(w), sun_azimuth_at_low: w.sunAzAtLow, min_to_sun_edge: w.minToSunEdge })),
    species_last60d_5km: d.species ?? [],
  };
}

for (const slug of Object.keys(stations)) {
  fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(stationFacts(slug), null, 1));
}

// ---- global/coast-level facts ----
const coastOf = (s) => (s.state === "ME" ? "east" : "west");
const global = { generated_on: new Date(index.generatedAt).toISOString().slice(0, 10), coasts: {}, hour_histogram_2026_daylight_minus: {} };
for (const coast of ["west", "east"]) {
  const slugs = index.stations.filter((s) => coastOf(s) === coast).map((s) => s.slug);
  let minus = 0, minusDaylight = 0;
  const hourHist = {};
  for (const slug of slugs) {
    const d = stations[slug];
    for (const w of d.windows.filter((w) => w.date.startsWith("2026"))) {
      if (!w.isMinusTide) continue;
      minus++;
      if (w.daylightMin >= 30) {
        minusDaylight++;
        const hr = w.lowTimeLocal.replace(/:\d+ /, " ");
        hourHist[hr] = (hourHist[hr] ?? 0) + 1;
      }
    }
  }
  global.coasts[coast] = {
    stations: slugs,
    minus_tides_2026: minus,
    daylight_minus_tides_2026: minusDaylight,
    daylight_share_pct: Math.round((minusDaylight / Math.max(1, minus)) * 100),
  };
  global.hour_histogram_2026_daylight_minus[coast] = hourHist;
}
fs.writeFileSync(path.join(OUT, "global.json"), JSON.stringify(global, null, 1));

// ---- regional rollups ----
function regionFacts(name, slugs) {
  return {
    generated_on: global.generated_on,
    region: name,
    stations: slugs.map((slug) => ({
      slug,
      name: stations[slug].station.name,
      noaa_id: stations[slug].station.noaaId,
      months_2026: stationFacts(slug).months_2026,
      deepest: stationFacts(slug).deepest_2026_daylight_lows_top8.slice(0, 4),
    })),
  };
}
fs.writeFileSync(path.join(OUT, "region-oregon.json"), JSON.stringify(regionFacts("Oregon coast", ["garibaldi-or", "newport-or", "charleston-or", "port-orford-or"]), null, 1));
fs.writeFileSync(path.join(OUT, "region-puget.json"), JSON.stringify(regionFacts("Puget Sound / Salish Sea", ["seattle-wa", "port-townsend-wa"]), null, 1));
fs.writeFileSync(path.join(OUT, "region-california.json"), JSON.stringify(regionFacts("California", ["pillar-point-ca", "monterey-ca", "la-jolla-ca", "san-diego-ca"]), null, 1));

console.log("facts written to docs-internal/facts/:", fs.readdirSync(OUT).join(", "));
