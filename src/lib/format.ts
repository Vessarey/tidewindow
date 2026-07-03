/** Client-safe types and formatters — no Node imports here. */

export interface TideWindow {
  date: string; // yyyy-mm-dd station-local
  weekday: string;
  lowTime: number;
  lowTimeLocal: string;
  lowHeight: number;
  isMinusTide: boolean;
  windowStart: number;
  windowEnd: number;
  windowStartLocal: string;
  windowEndLocal: string;
  arriveBy: number;
  arriveByLocal: string;
  daylightMin: number;
  sunrise: number | null;
  sunset: number | null;
  sunriseLocal: string | null;
  sunsetLocal: string | null;
  sunAltAtLow: number;
  sunAzAtLow: number;
  minToSunEdge: number | null;
  isWeekend: boolean;
  isHoliday: boolean;
  score: number;
  band: "Exceptional" | "Great" | "Good" | "Fair" | "Skip";
  night: boolean;
  scoreParts: { depth: number; daylight: number; timing: number; season: number };
  conditions?: { tempF: number; forecast: string; asOf: number };
  curve: { t0: number; dt: number; vals: (number | null)[] };
}

export interface StationMeta {
  slug: string;
  noaaId: string;
  name: string;
  officialName: string;
  state: string;
  stateSlug: string;
  stateName: string;
  region: string;
  tz: string;
  kind: "harmonic" | "subordinate";
  spots: string[];
  blurb: string;
  lat: number;
  lng: number;
}

export interface StationData {
  station: StationMeta;
  generatedAt: number;
  method: string;
  species: { commonName: string | null; scientificName: string; count: number }[] | null;
  windows: TideWindow[];
}

export interface StationSummary extends StationMeta {
  windowCount: number;
  speciesCount: number;
  best30: TideWindow[];
  nextWindow: TideWindow | null;
}

export function fmtDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[m - 1]} ${d}, ${y}`;
}

export function fmtMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const names = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return `${names[m - 1]} ${y}`;
}

export function fmtStamp(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}
