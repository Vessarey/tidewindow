/**
 * Targeted refresh of the iNaturalist species table on every station, using the
 * terrestrial-stray filter in species.mjs. Reads each station's stored lat/lng
 * from its existing data-json file, re-fetches species, and rewrites ONLY the
 * `species` field — windows, curves and generatedAt are left untouched so the
 * diff stays limited to the brand-integrity fix (the daily cron owns the rest).
 *
 * Run: node scripts/pipeline/refresh-species.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fetchSpecies } from "./species.mjs";

const ROOT = path.join(import.meta.dirname, "..", "..");
const STATIONS_DIR = path.join(ROOT, "public", "data-json", "stations");

async function main() {
  const files = fs.readdirSync(STATIONS_DIR).filter((f) => f.endsWith(".json"));
  let changed = 0;
  for (const file of files) {
    const full = path.join(STATIONS_DIR, file);
    const data = JSON.parse(fs.readFileSync(full, "utf8"));
    const { lat, lng, slug } = data.station;
    process.stdout.write(`species: ${slug} ... `);
    const species = await fetchSpecies(lat, lng);
    if (species === null) {
      console.log("fetch failed — kept existing");
      continue;
    }
    const before = JSON.stringify(data.species);
    data.species = species;
    if (JSON.stringify(data.species) !== before) changed++;
    fs.writeFileSync(full, JSON.stringify(data));
    console.log(`${species.length} species`);
  }
  console.log(`species: done — ${files.length} stations, ${changed} changed`);
}

main().catch((err) => {
  console.error("refresh-species FAILED:", err);
  process.exit(1);
});
