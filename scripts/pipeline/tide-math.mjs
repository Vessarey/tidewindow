/**
 * Deterministic tide-window math. All heights are feet MLLW, all times are
 * epoch milliseconds UTC unless suffixed Local.
 */

export const WALKABLE_FT = 1.0; // window threshold, ft MLLW

/**
 * Linear-interpolate the time at which the series crosses `threshold`
 * between two samples. Series must bracket the crossing.
 */
function interpCrossing(t1, h1, t2, h2, threshold) {
  const frac = (threshold - h1) / (h2 - h1);
  return t1 + frac * (t2 - t1);
}

function roundTo5Min(ms) {
  const five = 5 * 60 * 1000;
  return Math.round(ms / five) * five;
}

/**
 * Window bounds from an hourly height series around a low-tide time.
 * Returns null when the low never dips below the walkable threshold.
 */
export function windowFromHourly(series, lowTimeMs) {
  // find index nearest the low
  let i = series.findIndex((p) => p.t >= lowTimeMs);
  if (i <= 0) return null;
  if (series[i - 1] && Math.abs(series[i - 1].t - lowTimeMs) < Math.abs(series[i].t - lowTimeMs)) i -= 1;
  if (series[i].v >= WALKABLE_FT) return null;
  let a = i;
  while (a > 0 && series[a - 1].v < WALKABLE_FT) a--;
  let b = i;
  while (b < series.length - 1 && series[b + 1].v < WALKABLE_FT) b++;
  if (a === 0 || b === series.length - 1) return null; // window truncated by data range
  const start = interpCrossing(series[a - 1].t, series[a - 1].v, series[a].t, series[a].v, WALKABLE_FT);
  const end = interpCrossing(series[b].t, series[b].v, series[b + 1].t, series[b + 1].v, WALKABLE_FT);
  return { start: roundTo5Min(start), end: roundTo5Min(end) };
}

/**
 * Cosine-interpolated height between two consecutive tide extremes —
 * the standard approximation for subordinate stations that only publish
 * high/low events. h(t) = h1 + (h2-h1) * (1 - cos(pi * (t-t1)/(t2-t1))) / 2
 */
export function cosineHeight(t, ext1, ext2) {
  const phase = (t - ext1.t) / (ext2.t - ext1.t);
  return ext1.v + ((ext2.v - ext1.v) * (1 - Math.cos(Math.PI * phase))) / 2;
}

/** Solve cosineHeight(t) == threshold for t within [ext1.t, ext2.t]. */
function cosineCrossing(ext1, ext2, threshold) {
  const ratio = (2 * (threshold - ext1.v)) / (ext2.v - ext1.v) - 1;
  if (ratio < -1 || ratio > 1) return null;
  const phase = Math.acos(-ratio) / Math.PI;
  return ext1.t + phase * (ext2.t - ext1.t);
}

/**
 * Window bounds from the hilo extremes list for a low at index `i`.
 * extremes: sorted [{t, v, type: 'H'|'L'}].
 */
export function windowFromExtremes(extremes, i) {
  const low = extremes[i];
  if (low.v >= WALKABLE_FT) return null;
  const prev = extremes[i - 1];
  const next = extremes[i + 1];
  if (!prev || !next) return null;
  // falling limb: prev (high) -> low; rising limb: low -> next (high)
  const start = prev.v > WALKABLE_FT ? cosineCrossing(prev, low, WALKABLE_FT) : prev.t;
  const end = next.v > WALKABLE_FT ? cosineCrossing(low, next, WALKABLE_FT) : next.t;
  if (start == null || end == null) return null;
  return { start: roundTo5Min(start), end: roundTo5Min(end) };
}

/** Overlap in minutes between [aStart,aEnd] and [bStart,bEnd] (ms inputs). */
export function overlapMinutes(aStart, aEnd, bStart, bEnd) {
  const ms = Math.min(aEnd, bEnd) - Math.max(aStart, bStart);
  return Math.max(0, Math.round(ms / 60000));
}

/**
 * Score a window per the published methodology.
 * depth: 0pts at +0.5ft -> 50pts at -2.0ft (clamped)
 * daylight: 0 under 30min overlap -> 30pts at >=180min (linear)
 * timing: Sat/Sun/holiday +10, Fri +5
 * season: 0-10 fixed regional table
 */
export function scoreWindow({ lowHeight, daylightMin, dayOfWeek, isHoliday, seasonComfort }) {
  const depth = Math.max(0, Math.min(50, ((0.5 - lowHeight) / 2.5) * 50));
  if (daylightMin < 30) {
    return { score: 0, depth: Math.round(depth), daylight: 0, timing: 0, season: 0, night: daylightMin === 0 };
  }
  const daylightPts = Math.min(30, (daylightMin / 180) * 30);
  const timing = isHoliday || dayOfWeek === 0 || dayOfWeek === 6 ? 10 : dayOfWeek === 5 ? 5 : 0;
  const score = Math.round(depth + daylightPts + timing + seasonComfort);
  return {
    score,
    depth: Math.round(depth),
    daylight: Math.round(daylightPts),
    timing,
    season: seasonComfort,
    night: false,
  };
}

/**
 * Build a height-at-time function for a station: linear interpolation over
 * the hourly series when available, cosine interpolation between extremes
 * otherwise.
 */
export function makeHeightAt(hourly, extremes) {
  if (hourly) {
    return (t) => {
      let lo = 0, hi = hourly.length - 1;
      if (t <= hourly[0].t || t >= hourly[hi].t) return null;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (hourly[mid].t <= t) lo = mid;
        else hi = mid;
      }
      const a = hourly[lo], b = hourly[hi];
      return a.v + ((b.v - a.v) * (t - a.t)) / (b.t - a.t);
    };
  }
  return (t) => {
    let lo = 0, hi = extremes.length - 1;
    if (t <= extremes[0].t || t >= extremes[hi].t) return null;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (extremes[mid].t <= t) lo = mid;
      else hi = mid;
    }
    return cosineHeight(t, extremes[lo], extremes[hi]);
  };
}

/**
 * Sample a compact curve for sparkline rendering:
 * { t0, dt (min), vals[] } from start to end inclusive.
 */
export function sampleCurve(heightAt, startMs, endMs, stepMin = 20) {
  const vals = [];
  const step = stepMin * 60000;
  for (let t = startMs; t <= endMs; t += step) {
    const v = heightAt(t);
    vals.push(v === null ? null : Math.round(v * 100) / 100);
  }
  return { t0: startMs, dt: stepMin, vals };
}

export function band(score) {
  if (score >= 90) return "Exceptional";
  if (score >= 75) return "Great";
  if (score >= 60) return "Good";
  if (score >= 40) return "Fair";
  return "Skip";
}
