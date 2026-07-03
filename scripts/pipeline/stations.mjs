/**
 * Launch station registry. `noaaId` is the NOAA CO-OPS station used for
 * predictions. `kind: "harmonic"` stations support hourly-interval
 * predictions; `kind: "subordinate"` stations only publish high/low events,
 * so window boundaries are computed with cosine interpolation (see
 * tide-math.mjs and /methodology/).
 *
 * The daily agent may append stations here; every field except `blurb` and
 * `spots` is factual and verified against the NOAA metadata API at pipeline
 * time (the run fails loudly on id/name mismatch).
 */
export const STATIONS = [
  {
    slug: "seattle-wa",
    noaaId: "9447130",
    name: "Seattle (Puget Sound)",
    state: "WA",
    region: "puget-sound",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Alki Beach", "Constellation Park", "Golden Gardens"],
    blurb:
      "Central Puget Sound reference station. Summer minus tides here expose broad gravel-and-boulder flats at Alki and Constellation Park.",
  },
  {
    slug: "port-townsend-wa",
    noaaId: "9444900",
    name: "Port Townsend",
    state: "WA",
    region: "puget-sound",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Fort Worden State Park", "North Beach", "Glass Beach"],
    blurb:
      "Northeast Olympic Peninsula station covering Fort Worden's rocky point and the long beachcombing stretch toward Glass Beach.",
  },
  {
    slug: "la-push-wa",
    noaaId: "9442396",
    name: "La Push (Olympic Coast)",
    state: "WA",
    region: "outer-coast-nw",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Rialto Beach / Hole-in-the-Wall", "Second Beach", "Third Beach"],
    blurb:
      "Outer Olympic coast station at the Quillayute River mouth. The Hole-in-the-Wall arch north of Rialto Beach is only comfortably reachable on a good low.",
  },
  {
    slug: "garibaldi-or",
    noaaId: "9437540",
    name: "Garibaldi (Tillamook Bay)",
    state: "OR",
    region: "outer-coast-nw",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Cannon Beach / Haystack Rock (35 min north)", "Oceanside", "Cape Meares"],
    blurb:
      "North Oregon coast reference station — the closest harmonic station to Haystack Rock's famous tidepool reef and the Three Capes beaches.",
  },
  {
    slug: "newport-or",
    noaaId: "9435380",
    name: "Newport (South Beach)",
    state: "OR",
    region: "outer-coast-nw",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Yaquina Head", "Otter Rock / Devils Punchbowl", "Seal Rock"],
    blurb:
      "Central Oregon coast station at Yaquina Bay, covering the basalt tidepool shelves at Yaquina Head and Otter Rock.",
  },
  {
    slug: "charleston-or",
    noaaId: "9432780",
    name: "Charleston (Coos Bay)",
    state: "OR",
    region: "outer-coast-nw",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Sunset Bay State Park", "Cape Arago", "Simpson Reef"],
    blurb:
      "South-central Oregon coast station beside Sunset Bay — some of the state's richest and most sheltered tidepools.",
  },
  {
    slug: "port-orford-or",
    noaaId: "9431647",
    name: "Port Orford",
    state: "OR",
    region: "outer-coast-nw",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Battle Rock Beach", "Rocky Point", "Agate Beach (Port Orford)"],
    blurb:
      "Southern Oregon coast station known for winter agate and sea-glass hunting when big swell rearranges the gravel beds.",
  },
  {
    slug: "monterey-ca",
    noaaId: "9413450",
    name: "Monterey",
    state: "CA",
    region: "central-ca",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Pacific Grove / Point Pinos", "Asilomar", "Lovers Point"],
    blurb:
      "Monterey Bay reference station. Point Pinos' granite shelves in Pacific Grove are among California's most-studied tidepools.",
  },
  {
    slug: "pillar-point-ca",
    noaaId: "9414131",
    name: "Pillar Point Harbor (Half Moon Bay)",
    state: "CA",
    region: "central-ca",
    tz: "America/Los_Angeles",
    kind: "subordinate",
    spots: ["Pillar Point Reef", "Fitzgerald Marine Reserve (Moss Beach)", "Maverick's Beach"],
    blurb:
      "Half Moon Bay station covering the Pillar Point reef flat and Fitzgerald Marine Reserve — the Bay Area's classic minus-tide destinations.",
  },
  {
    slug: "la-jolla-ca",
    noaaId: "9410230",
    name: "La Jolla (Scripps Pier)",
    state: "CA",
    region: "socal",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Shell Beach / La Jolla Cove", "Hospitals Reef", "False Point"],
    blurb:
      "San Diego's tidepool coast: reef shelves from La Jolla Cove south to False Point, best on winter afternoon minus tides.",
  },
  {
    slug: "san-diego-ca",
    noaaId: "9410170",
    name: "San Diego (Cabrillo)",
    state: "CA",
    region: "socal",
    tz: "America/Los_Angeles",
    kind: "harmonic",
    spots: ["Cabrillo National Monument tidepools", "Sunset Cliffs", "Ocean Beach"],
    blurb:
      "San Diego Bay reference station, the standard prediction source for the protected rocky intertidal zone at Cabrillo National Monument.",
  },
  {
    slug: "bar-harbor-me",
    noaaId: "8413320",
    name: "Bar Harbor (Acadia)",
    state: "ME",
    region: "new-england",
    tz: "America/New_York",
    kind: "harmonic",
    spots: ["Bar Island land bridge", "Ship Harbor", "Wonderland"],
    blurb:
      "Downeast Maine station with a 10-plus-foot range. Low tide opens the Bar Island gravel bar and Acadia's Ship Harbor pools.",
  },
];

export const STATES = {
  WA: "Washington",
  OR: "Oregon",
  CA: "California",
  ME: "Maine",
};

/**
 * Season comfort factor (0–10) by region and month (Jan=0). A fixed,
 * documented heuristic — combines typical daylight length and regional
 * shoulder-season comfort; published verbatim on /methodology/. Not a
 * forecast.
 */
export const SEASON_COMFORT = {
  "puget-sound":    [3, 3, 5, 6, 8, 9, 10, 10, 8, 6, 4, 3],
  "outer-coast-nw": [3, 3, 5, 6, 8, 9, 10, 10, 8, 6, 4, 3],
  "central-ca":     [5, 5, 6, 7, 8, 9, 9, 9, 9, 8, 6, 5],
  "socal":          [6, 6, 7, 7, 8, 9, 9, 9, 9, 8, 7, 6],
  "new-england":    [1, 1, 3, 5, 7, 9, 10, 10, 8, 6, 3, 1],
};
