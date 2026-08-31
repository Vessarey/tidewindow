/**
 * Build the finder ZIP -> nearest covered NOAA station map.
 *
 * Source: 2025 U.S. Census Bureau ZCTA Gazetteer representative coordinates.
 * The generated browser asset stores only station index + rounded straight-line
 * distance. No visitor ZIP is transmitted or retained by Tidewindow.
 *
 * Run manually when the Census vintage or station list changes:
 *   node scripts/build-zip-station-map.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCE_URL = "https://www2.census.gov/geo/docs/maps-data/data/gazetteer/2025_Gazetteer/2025_Gaz_zcta_national.zip";
const OUT = path.join(ROOT, "public", "zip-station-map.json");

function haversineMiles(lat1, lng1, lat2, lng2) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const dLat = radians(lat2 - lat1);
  const dLng = radians(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLng / 2) ** 2;
  return 3958.7613 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function main() {
  const index = JSON.parse(fs.readFileSync(path.join(ROOT, "public", "data-json", "index.json"), "utf8"));
  const stations = index.stations.map((station) => ({
    slug: station.slug,
    lat: station.lat,
    lng: station.lng,
  }));
  if (!stations.length || stations.some((station) => !Number.isFinite(station.lat) || !Number.isFinite(station.lng))) {
    throw new Error("Station index is missing valid coordinates");
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "tidewindow-zcta-"));
  const archivePath = path.join(tempDir, "zcta.zip");
  try {
    const response = await fetch(SOURCE_URL, { headers: { "User-Agent": "tidewindow-map-builder (https://thetidewindow.com)" } });
    if (!response.ok) throw new Error(`Census download failed: HTTP ${response.status}`);
    fs.writeFileSync(archivePath, Buffer.from(await response.arrayBuffer()));
    const text = execFileSync("unzip", ["-p", archivePath], { encoding: "utf8", maxBuffer: 8 * 1024 * 1024 });
    const lines = text.trim().split(/\r?\n/);
    const header = lines.shift()?.split("|");
    if (!header || header[0] !== "GEOID" || header[6] !== "INTPTLAT" || header[7] !== "INTPTLONG") {
      throw new Error("Unexpected Census ZCTA Gazetteer columns");
    }

    const zips = {};
    for (const line of lines) {
      const columns = line.split("|");
      const zip = columns[0];
      const lat = Number(columns[6]);
      const lng = Number(columns[7]);
      if (!/^\d{5}$/.test(zip) || !Number.isFinite(lat) || !Number.isFinite(lng)) continue;
      let nearestIndex = 0;
      let nearestMiles = Infinity;
      stations.forEach((station, index) => {
        const miles = haversineMiles(lat, lng, station.lat, station.lng);
        if (miles < nearestMiles) {
          nearestIndex = index;
          nearestMiles = miles;
        }
      });
      zips[zip] = [nearestIndex, Math.round(nearestMiles)];
    }

    const output = {
      vintage: "2025",
      source: SOURCE_URL,
      distance: "great-circle miles from Census ZCTA representative point to NOAA station",
      stations: stations.map((station) => station.slug),
      zips,
    };
    fs.writeFileSync(OUT, JSON.stringify(output));

    for (const zip of ["04609", "92037", "93950", "98101"]) {
      if (!zips[zip]) throw new Error(`Expected validation ZIP ${zip} is missing`);
    }
    console.log(`zip map: ${Object.keys(zips).length} ZCTAs -> ${stations.length} stations (${fs.statSync(OUT).size} bytes)`);
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch((error) => {
  console.error("zip map FAILED:", error);
  process.exit(1);
});
