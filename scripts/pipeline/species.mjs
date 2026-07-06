/**
 * iNaturalist species enrichment for the tide-pool station pages.
 *
 * Pulls the most-observed research-grade marine invertebrates within 5 km of a
 * station in the last 60 days. The `iconic_taxa` filter (Mollusca, Echinodermata,
 * Cnidaria, Arthropoda) is deliberately broad — it keeps the marine animals we
 * want but also lets terrestrial strays through, because those phyla each contain
 * large land clades (land snails and slugs in Mollusca; insects, spiders,
 * millipedes and woodlice in Arthropoda). A 5 km radius around a coastal station
 * covers plenty of dry land, so a Garden Snail or banana slug logged in someone's
 * backyard can outrank a real tide-pool find.
 *
 * We drop those strays by ancestry: any taxon whose lineage passes through a known
 * terrestrial clade is excluded before ranking, so the published table stays true
 * to what is actually in the pools.
 */

const USER_AGENT = "tidewindow-pipeline (https://thetidewindow.com; hello@thetidewindow.com)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const ymd = (date) => date.toISOString().slice(0, 10);

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

/**
 * iNaturalist taxon ids for the land clades that contaminate our four marine
 * iconic taxa. A species is terrestrial if any of these appears in its
 * `ancestor_ids` (or is the taxon itself). Ids verified against the iNat taxa API.
 */
const TERRESTRIAL_CLADE_IDS = new Set([
  47485,  // Stylommatophora — land snails & slugs (Garden Snail, banana slugs) [Mollusca]
  47158,  // Insecta — insects [Arthropoda]
  47119,  // Arachnida — spiders, mites, ticks, harvestmen [Arthropoda]
  144128, // Myriapoda — millipedes & centipedes [Arthropoda]
  243773, // Entognatha — springtails, proturans, diplurans [Arthropoda]
  49470,  // Collembola — springtails (also under Entognatha; kept for safety) [Arthropoda]
  84718,  // Oniscidea — woodlice / terrestrial isopods: land Crustacea that read as marine [Arthropoda]
]);

/** True when the taxon's lineage passes through a known terrestrial clade. */
export function isTerrestrialTaxon(taxon) {
  if (!taxon) return false;
  const ids = taxon.ancestor_ids ?? [];
  if (typeof taxon.id === "number" && TERRESTRIAL_CLADE_IDS.has(taxon.id)) return true;
  return ids.some((id) => TERRESTRIAL_CLADE_IDS.has(id));
}

/**
 * Top marine invertebrate species near a station, terrestrial strays removed.
 * Over-fetches so the table still fills after filtering. Returns null on any
 * failure — species are enrichment and must never fail the build.
 */
export async function fetchSpecies(lat, lng, { limit = 10 } = {}) {
  try {
    const d1 = ymd(new Date(Date.now() - 60 * 86400_000));
    const url =
      `https://api.inaturalist.org/v1/observations/species_counts?lat=${lat}&lng=${lng}&radius=5` +
      `&d1=${d1}&quality_grade=research&per_page=30` +
      `&iconic_taxa=Mollusca,Echinodermata,Cnidaria,Arthropoda`;
    const data = await fetchJson(url);
    await sleep(1100); // iNat rate limit: stay well under 60 req/min
    return (data.results ?? [])
      .filter((r) => !isTerrestrialTaxon(r.taxon))
      .slice(0, limit)
      .map((r) => ({
        commonName: r.taxon?.preferred_common_name ?? null,
        scientificName: r.taxon?.name ?? "unknown",
        count: r.count,
      }));
  } catch {
    return null;
  }
}
