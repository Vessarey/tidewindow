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
  /** Sampled height curve; null on past windows (kept only for month-page records). */
  curve: { t0: number; dt: number; vals: (number | null)[] } | null;
}

export interface TideExtreme {
  date: string;
  weekday: string;
  time: number;
  timeLocal: string;
  height: number;
  type: "H" | "L";
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
  tides?: TideExtreme[];
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

/**
 * "Now" for live tools: the visitor's clock, floored at the data stamp. A
 * client clock running behind `generatedAt` would resurrect windows the data
 * itself already treats as past; a clock ahead of it is taken at face value.
 */
export function liveNow(clientNow: number, generatedAt: number): number {
  return Math.max(clientNow, generatedAt);
}

/**
 * Windows still worth acting on at `now`: future, or ongoing (the low may have
 * passed but the walkable window has not ended). The horizon caps how far out
 * a low may be; ongoing windows that started before `now` stay eligible.
 */
export function liveWindows(windows: TideWindow[], now: number, days: number): TideWindow[] {
  const horizon = now + days * 86400_000;
  return windows.filter((w) => w.windowEnd > now && w.lowTime < horizon);
}

/** One-sentence summary for the Finder: counts only windows live at `now`. */
export function synthesis(data: StationData, days: number, now: number, selectedWindows?: TideWindow[]): string {
  const lows = liveWindows(selectedWindows ?? data.windows, now, days);
  const minusDaylight = lows.filter((w) => w.isMinusTide && w.daylightMin >= 30);
  const best = [...lows].sort((a, b) => b.score - a.score)[0];
  if (!best) return selectedWindows
    ? `No lows match this depth filter in the next ${days} days at this station.`
    : `No lows below +1.0 ft in the next ${days} days at this station.`;
  const bestStr = `${best.weekday} ${best.date.slice(5).replace("-", "/")} at ${best.lowTimeLocal} (${best.lowHeight.toFixed(1)} ft, score ${best.score})`;
  if (minusDaylight.length === 0) {
    return `None of the next ${days} days' ${lows.length} qualifying lows is a daylight minus tide — the best available is ${bestStr}.`;
  }
  return `Only ${minusDaylight.length} of the next ${days} days' ${lows.length} qualifying lows ${minusDaylight.length === 1 ? "is a" : "are"} daylight minus tide${minusDaylight.length === 1 ? "" : "s"}; the best is ${bestStr}.`;
}

/** Describe the nearest solar event using the actual order of the timestamps. */
export function fmtSunEdge(w: Pick<TideWindow, "lowTime" | "sunrise" | "sunset">): string {
  const edges = [
    { name: "sunrise", time: w.sunrise },
    { name: "sunset", time: w.sunset },
  ].filter((edge): edge is { name: string; time: number } => edge.time !== null);
  edges.sort((a, b) => Math.abs(w.lowTime - a.time) - Math.abs(w.lowTime - b.time));
  const edge = edges[0];
  if (!edge) return "Unavailable";
  const minutes = Math.round(Math.abs(w.lowTime - edge.time) / 60_000);
  if (minutes === 0) return `At ${edge.name}`;
  return `${minutes} min ${w.lowTime < edge.time ? "before" : "after"} ${edge.name}`;
}
