/**
 * Tidewindow data pipeline.
 *
 * Fetches NOAA CO-OPS tide predictions (keyless, public) for every station
 * in stations.mjs, computes daylight low-tide windows and scores, attaches
 * 7-day NWS conditions and iNaturalist species counts, and writes:
 *   public/data-json/stations/{slug}.json   full window data, next ~400 days
 *   public/data-json/index.json             condensed cross-station summary
 *   public/ics/{slug}.ics                   calendar feed of Good+ windows
 *
 * Run: node scripts/pipeline/run.mjs            (skips if data <20h old)
 *      PIPELINE_REFRESH=1 node scripts/pipeline/run.mjs   (force)
 */
import fs from "node:fs";
import path from "node:path";
import * as Astronomy from "astronomy-engine";
import { STATIONS, SEASON_COMFORT, STATES } from "./stations.mjs";
import { holidaySetForRange } from "./holidays.mjs";
import { windowFromHourly, windowFromExtremes, overlapMinutes, scoreWindow, band, WALKABLE_FT, makeHeightAt, sampleCurve } from "./tide-math.mjs";

const ROOT = path.join(import.meta.dirname, "..", "..");
const OUT_DATA = path.join(ROOT, "public", "data-json");
const OUT_ICS = path.join(ROOT, "public", "ics");
const OUT_BADGE = path.join(ROOT, "public", "embed-badge");
const SITE_URL = "https://vessarey.github.io/tidewindow";
const DAYS_AHEAD = 400;
const USER_AGENT = "tidewindow-pipeline (https://vessarey.github.io/tidewindow; hello@tidewindow.example)";

// ---------- generic helpers ----------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url, { headers = {}, tries = 3 } = {}) {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": USER_AGENT, ...headers } });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      if (attempt === tries) throw err;
      await sleep(1500 * attempt);
    }
  }
}

function ymd(date) {
  return date.toISOString().slice(0, 10);
}
function ymdCompact(date) {
  return ymd(date).replace(/-/g, "");
}

/** Offset (ms) of `tz` from UTC at the given UTC instant. */
function tzOffsetMs(tz, utcMs) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const parts = Object.fromEntries(dtf.formatToParts(new Date(utcMs)).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(+parts.year, +parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - utcMs;
}

function localDateStr(tz, utcMs) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date(utcMs));
}
function localTimeStr(tz, utcMs) {
  return new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" }).format(new Date(utcMs));
}
function localWeekday(tz, utcMs) {
  // 0=Sun..6=Sat, computed in station-local time
  const name = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(new Date(utcMs));
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(name);
}

// ---------- NOAA ----------

const COOPS = "https://api.tidesandcurrents.noaa.gov/api/prod/datagetter";

async function fetchStationMeta(noaaId) {
  const data = await fetchJson(`https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/${noaaId}.json`);
  const s = data.stations?.[0];
  if (!s) throw new Error(`NOAA station ${noaaId} not found`);
  return { officialName: s.name, lat: s.lat, lng: s.lng, noaaState: s.state };
}

async function fetchPredictions(noaaId, interval, beginDate, endDate) {
  // interval: "hilo" or "h". Chunk requests to stay within API limits.
  const chunkDays = interval === "hilo" ? 180 : 90;
  const out = [];
  let cursor = new Date(beginDate);
  while (cursor < endDate) {
    const chunkEnd = new Date(Math.min(endDate.getTime(), cursor.getTime() + chunkDays * 86400_000));
    const url = `${COOPS}?product=predictions&application=tidewindow&begin_date=${ymdCompact(cursor)}&end_date=${ymdCompact(chunkEnd)}&datum=MLLW&station=${noaaId}&time_zone=gmt&units=english&interval=${interval}&format=json`;
    // NOAA intermittently returns a 200 whose JSON body is {error: "No Predictions
    // data was found..."} for a perfectly valid station/datum. fetchJson can't retry
    // it (the HTTP request succeeded), so retry the soft error here — otherwise a
    // momentary upstream blip fails the whole build and blocks the deploy.
    let data;
    for (let attempt = 1; ; attempt++) {
      data = await fetchJson(url);
      if (!data.error) break;
      if (attempt >= 4) throw new Error(`NOAA error for ${noaaId} ${interval}: ${data.error.message}`);
      await sleep(2000 * attempt);
    }
    for (const p of data.predictions ?? []) {
      out.push({
        t: Date.parse(p.t.replace(" ", "T") + "Z"),
        v: parseFloat(p.v),
        ...(p.type ? { type: p.type } : {}),
      });
    }
    cursor = new Date(chunkEnd.getTime() + 86400_000);
    await sleep(250);
  }
  // de-dup on timestamp (chunk boundaries overlap by design of date params)
  const seen = new Set();
  return out.filter((p) => (seen.has(p.t) ? false : (seen.add(p.t), true))).sort((a, b) => a.t - b.t);
}

// ---------- sun ----------

function sunTimesForLocalDay(observer, tz, dateStr) {
  // search from local 00:05 of dateStr
  const [y, m, d] = dateStr.split("-").map(Number);
  let guess = Date.UTC(y, m - 1, d, 0, 5);
  guess -= tzOffsetMs(tz, guess); // convert local wall-clock to UTC instant (1 iteration is fine for coastal US)
  const start = new Astronomy.AstroTime(new Date(guess));
  const rise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, start, 1.2);
  const set = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, start, 1.2);
  return {
    sunrise: rise ? rise.date.getTime() : null,
    sunset: set ? set.date.getTime() : null,
  };
}

function sunPosition(observer, utcMs) {
  const time = new Astronomy.AstroTime(new Date(utcMs));
  const eq = Astronomy.Equator(Astronomy.Body.Sun, time, observer, true, true);
  const hor = Astronomy.Horizon(time, observer, eq.ra, eq.dec, "normal");
  return { altitude: hor.altitude, azimuth: hor.azimuth };
}

// ---------- NWS conditions ----------

async function fetchNwsPeriods(lat, lng) {
  try {
    const point = await fetchJson(`https://api.weather.gov/points/${lat.toFixed(4)},${lng.toFixed(4)}`);
    const forecastUrl = point.properties?.forecast;
    if (!forecastUrl) return null;
    const fc = await fetchJson(forecastUrl);
    return (fc.properties?.periods ?? []).map((p) => ({
      start: Date.parse(p.startTime),
      end: Date.parse(p.endTime),
      name: p.name,
      tempF: p.temperature,
      forecast: p.shortForecast,
    }));
  } catch {
    return null; // conditions are enrichment — never fail the build over them
  }
}

// ---------- iNaturalist ----------

async function fetchSpecies(lat, lng) {
  try {
    const d1 = ymd(new Date(Date.now() - 60 * 86400_000));
    const url =
      `https://api.inaturalist.org/v1/observations/species_counts?lat=${lat}&lng=${lng}&radius=5` +
      `&d1=${d1}&quality_grade=research&per_page=10` +
      `&iconic_taxa=Mollusca,Echinodermata,Cnidaria,Arthropoda`;
    const data = await fetchJson(url);
    await sleep(1100); // iNat rate limit: stay well under 60 req/min
    return (data.results ?? []).map((r) => ({
      commonName: r.taxon?.preferred_common_name ?? null,
      scientificName: r.taxon?.name ?? "unknown",
      count: r.count,
    }));
  } catch {
    return null;
  }
}

// ---------- ICS ----------

function icsEscape(s) {
  return s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,");
}
function icsDate(ms) {
  return new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildIcs(station, windows, generatedAt) {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tidewindow//EN",
    `X-WR-CALNAME:Tidewindow — ${icsEscape(station.name)}`,
    "X-WR-TIMEZONE:UTC",
  ];
  const yearAhead = generatedAt + 365 * 86400_000;
  for (const w of windows) {
    if (w.score < 60 || w.windowStart > yearAhead) continue;
    lines.push(
      "BEGIN:VEVENT",
      `UID:${station.slug}-${w.date.replace(/-/g, "")}-${icsDate(w.lowTime).slice(9, 13)}@tidewindow`,
      `DTSTAMP:${icsDate(generatedAt)}`,
      `DTSTART:${icsDate(w.windowStart)}`,
      `DTEND:${icsDate(w.windowEnd)}`,
      `SUMMARY:${icsEscape(`${w.band} low tide: ${w.lowHeight.toFixed(1)} ft at ${w.lowTimeLocal} (${station.name})`)}`,
      `DESCRIPTION:${icsEscape(
        `Score ${w.score}/100. Arrive by ${w.arriveByLocal}. Low of ${w.lowHeight.toFixed(1)} ft MLLW at ${w.lowTimeLocal}. ` +
          `Computed from NOAA station ${station.noaaId} predictions. Predictions are not observations — check conditions. ` +
          `https://vessarey.github.io/tidewindow/beaches/${station.stateSlug}/${station.slug}/`
      )}`,
      "BEGIN:VALARM",
      "ACTION:DISPLAY",
      "DESCRIPTION:Tide window opens soon",
      "TRIGGER:-PT45M",
      "END:VALARM",
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

// ---------- embed badge ----------

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildBadgeHtml(station, best) {
  const line = best
    ? `Next great low tide: <strong>${best.weekday} ${best.date.slice(5).replace("-", "/")}</strong>, ${best.lowHeight.toFixed(1)} ft at ${best.lowTimeLocal} <span style="opacity:.7">(score ${best.score})</span>`
    : "No standout low-tide window in the next 30 days";
  const url = `${SITE_URL}/beaches/${station.stateSlug}/${station.slug}/?utm_source=embed&utm_medium=badge`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex">
<title>Tidewindow badge — ${esc(station.name)}</title>
<style>
body{margin:0;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;background:#0F3038;color:#EFF7F3;font-size:13px}
a{color:inherit;text-decoration:none;display:flex;flex-direction:column;gap:4px;padding:10px 14px}
.n{font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.75}
.c{color:#E0A93E;font-size:11px}
strong{color:#fff}
</style></head>
<body><a href="${url}" target="_blank" rel="noopener">
<span class="n">${esc(station.name)} · tide window</span>
<span>${line}</span>
<span class="c">Computed by Tidewindow ↗</span>
</a>${posthogKey ? `
<script>fetch("https://us.i.posthog.com/i/v0/e/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({api_key:"${posthogKey}",event:"embed_badge_loaded",distinct_id:"badge-${station.slug}",properties:{station_id:"${station.slug}",host_domain:document.referrer?new URL(document.referrer).hostname:"unknown"}})}).catch(function(){});</script>` : ""}
</body></html>`;
}

/** Publishable PostHog key, read from site-config.ts so it lives in one place. */
const posthogKey = (() => {
  try {
    const cfg = fs.readFileSync(path.join(ROOT, "src", "lib", "site-config.ts"), "utf8");
    const m = cfg.match(/posthogKey:\s*"([^"]*)"/);
    return m?.[1] ?? "";
  } catch {
    return "";
  }
})();

// ---------- main ----------

async function processStation(station, holidays, generatedAt) {
  const meta = await fetchStationMeta(station.noaaId);
  const observer = new Astronomy.Observer(meta.lat, meta.lng, 0);
  const begin = new Date(generatedAt - 86400_000);
  const end = new Date(generatedAt + DAYS_AHEAD * 86400_000);

  const extremes = await fetchPredictions(station.noaaId, "hilo", begin, end);
  if (extremes.length < 100) throw new Error(`${station.slug}: suspiciously few extremes (${extremes.length})`);

  let hourly = null;
  if (station.kind === "harmonic") {
    hourly = await fetchPredictions(station.noaaId, "h", begin, end);
    if (hourly.length < 1000) throw new Error(`${station.slug}: suspiciously few hourly points (${hourly.length})`);
  }

  const sunCache = new Map();
  const sunForDay = (dateStr) => {
    if (!sunCache.has(dateStr)) sunCache.set(dateStr, sunTimesForLocalDay(observer, station.tz, dateStr));
    return sunCache.get(dateStr);
  };

  const seasonTable = SEASON_COMFORT[station.region];
  const heightAt = makeHeightAt(hourly, extremes);
  const windows = [];
  let cosineDiffStats = null;

  for (let i = 0; i < extremes.length; i++) {
    const ext = extremes[i];
    if (ext.type !== "L" || ext.v >= WALKABLE_FT) continue;
    if (ext.t < generatedAt - 12 * 3600_000) continue;

    const bounds = hourly ? windowFromHourly(hourly, ext.t) : windowFromExtremes(extremes, i);
    if (!bounds) continue;

    // self-test: compare interpolation methods where both are available
    if (hourly && cosineDiffStats === null) {
      const alt = windowFromExtremes(extremes, i);
      if (alt) {
        cosineDiffStats = {
          startDiffMin: Math.round(Math.abs(alt.start - bounds.start) / 60000),
          endDiffMin: Math.round(Math.abs(alt.end - bounds.end) / 60000),
        };
      }
    }

    const dateStr = localDateStr(station.tz, ext.t);
    const startDay = localDateStr(station.tz, bounds.start);
    const endDay = localDateStr(station.tz, bounds.end);
    let daylight = 0;
    for (const d of new Set([startDay, endDay])) {
      const sun = sunForDay(d);
      if (sun.sunrise && sun.sunset) {
        daylight += overlapMinutes(bounds.start, bounds.end, sun.sunrise, sun.sunset);
      }
    }
    const dow = localWeekday(station.tz, ext.t);
    const month = +dateStr.slice(5, 7) - 1;
    const s = scoreWindow({
      lowHeight: ext.v,
      daylightMin: daylight,
      dayOfWeek: dow,
      isHoliday: holidays.has(dateStr),
      seasonComfort: seasonTable[month],
    });

    const sun = sunForDay(dateStr);
    const sunPos = sunPosition(observer, ext.t);
    const minToSunEdge =
      sun.sunrise && sun.sunset
        ? Math.min(Math.abs(ext.t - sun.sunrise), Math.abs(ext.t - sun.sunset)) / 60000 * (sunPos.altitude >= 0 ? 1 : -1)
        : null;

    windows.push({
      date: dateStr,
      weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dow],
      lowTime: ext.t,
      lowTimeLocal: localTimeStr(station.tz, ext.t),
      lowHeight: ext.v,
      isMinusTide: ext.v < 0,
      windowStart: bounds.start,
      windowEnd: bounds.end,
      windowStartLocal: localTimeStr(station.tz, bounds.start),
      windowEndLocal: localTimeStr(station.tz, bounds.end),
      arriveBy: ext.t - 3600_000,
      arriveByLocal: localTimeStr(station.tz, ext.t - 3600_000),
      daylightMin: daylight,
      sunrise: sun.sunrise,
      sunset: sun.sunset,
      sunriseLocal: sun.sunrise ? localTimeStr(station.tz, sun.sunrise) : null,
      sunsetLocal: sun.sunset ? localTimeStr(station.tz, sun.sunset) : null,
      sunAltAtLow: Math.round(sunPos.altitude * 10) / 10,
      sunAzAtLow: Math.round(sunPos.azimuth),
      minToSunEdge: minToSunEdge === null ? null : Math.round(minToSunEdge),
      isWeekend: dow === 0 || dow === 6,
      isHoliday: holidays.has(dateStr),
      score: s.score,
      band: band(s.score),
      night: s.night,
      scoreParts: { depth: s.depth, daylight: s.daylight, timing: s.timing, season: s.season },
      curve: sampleCurve(heightAt, bounds.start - 2.5 * 3600_000, bounds.end + 2.5 * 3600_000),
    });
  }

  const nws = await fetchNwsPeriods(meta.lat, meta.lng);
  if (nws) {
    const horizon = generatedAt + 7 * 86400_000;
    for (const w of windows) {
      if (w.lowTime > horizon) break;
      const period = nws.find((p) => w.lowTime >= p.start && w.lowTime < p.end);
      if (period) w.conditions = { tempF: period.tempF, forecast: period.forecast, asOf: generatedAt };
    }
  }

  const species = await fetchSpecies(meta.lat, meta.lng);

  return {
    station: {
      ...station,
      stateSlug: station.state.toLowerCase(),
      stateName: STATES[station.state],
      officialName: meta.officialName,
      lat: meta.lat,
      lng: meta.lng,
    },
    generatedAt,
    method: station.kind === "harmonic" ? "hourly-interpolation" : "cosine-interpolation",
    cosineSelfTest: cosineDiffStats,
    species,
    windows,
  };
}

async function main() {
  const stampFile = path.join(OUT_DATA, ".pipeline-stamp");
  if (!process.env.PIPELINE_REFRESH && fs.existsSync(stampFile)) {
    const age = Date.now() - +fs.readFileSync(stampFile, "utf8");
    if (age < 20 * 3600_000) {
      console.log(`pipeline: data is ${Math.round(age / 3600_000)}h old, skipping (PIPELINE_REFRESH=1 to force)`);
      return;
    }
  }

  const generatedAt = Date.now();
  const year = new Date(generatedAt).getUTCFullYear();
  const holidays = holidaySetForRange(year, year + 2);

  fs.mkdirSync(path.join(OUT_DATA, "stations"), { recursive: true });
  fs.mkdirSync(OUT_ICS, { recursive: true });
  fs.mkdirSync(OUT_BADGE, { recursive: true });

  const summaries = [];
  for (const station of STATIONS) {
    process.stdout.write(`pipeline: ${station.slug} (${station.noaaId}) ... `);
    const result = await processStation(station, holidays, generatedAt);
    fs.writeFileSync(path.join(OUT_DATA, "stations", `${station.slug}.json`), JSON.stringify(result));
    fs.writeFileSync(path.join(OUT_ICS, `${station.slug}.ics`), buildIcs(result.station, result.windows, generatedAt));

    const upcoming = result.windows.filter((w) => w.lowTime > generatedAt);
    const next30 = upcoming.filter((w) => w.lowTime < generatedAt + 30 * 86400_000);
    const bestForBadge = [...next30].sort((a, b) => b.score - a.score)[0] ?? null;
    fs.writeFileSync(path.join(OUT_BADGE, `${station.slug}.html`), buildBadgeHtml(result.station, bestForBadge));
    summaries.push({
      ...result.station,
      windowCount: result.windows.length,
      speciesCount: result.species?.length ?? 0,
      best30: [...next30].sort((a, b) => b.score - a.score).slice(0, 5),
      nextWindow: upcoming[0] ?? null,
    });
    console.log(
      `${result.windows.length} windows, best-30d score ${summaries.at(-1).best30[0]?.score ?? "n/a"}` +
        (result.cosineSelfTest ? `, cosine self-test ±${Math.max(result.cosineSelfTest.startDiffMin, result.cosineSelfTest.endDiffMin)}min` : "")
    );
  }

  fs.writeFileSync(
    path.join(OUT_DATA, "index.json"),
    JSON.stringify({ generatedAt, stations: summaries })
  );
  fs.writeFileSync(stampFile, String(generatedAt));
  console.log(`pipeline: done — ${summaries.length} stations`);
}

main().catch((err) => {
  console.error("pipeline FAILED:", err);
  process.exit(1);
});
