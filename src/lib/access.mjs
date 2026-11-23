/** Sourced destination access constraints, separate from NOAA predictions and scores.
 * NPS hours, checked 2026-11-23: Thanksgiving Day and Christmas Day have
 * no public access. Dates below are station-local calendar dates, not UTC instants.
 * San Diego's other nearby beaches do not inherit a Cabrillo recommendation.
 */
export const CABRILLO_ACCESS_SOURCE = "https://www.nps.gov/cabr/planyourvisit/hours.htm";
export function accessClosure(slug, date) {
  if (slug !== "san-diego-ca") return null;
  const [year, month, day] = date.split("-").map(Number);
  const firstThursday = 1 + (4 - new Date(Date.UTC(year, 10, 1)).getUTCDay() + 7) % 7;
  const holiday = month === 11 && day === firstThursday + 21 ? "Thanksgiving Day"
    : month === 12 && day === 25 ? "Christmas Day" : null;
  return holiday ? `Cabrillo closed — ${holiday}; no public access.` : null;
}
export function visitWindows(slug, windows) {
  return windows.filter((w) => !accessClosure(slug, w.date));
}
