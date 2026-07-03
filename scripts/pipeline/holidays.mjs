/**
 * US federal holidays (observed dates) for the timing bonus.
 * Deterministic computation — no lookup tables to go stale.
 */

function nthWeekdayOfMonth(year, month, weekday, n) {
  const first = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const day = 1 + ((7 + weekday - first) % 7) + (n - 1) * 7;
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function lastWeekdayOfMonth(year, month, weekday) {
  const lastDay = new Date(Date.UTC(year, month + 1, 0));
  const diff = (7 + lastDay.getUTCDay() - weekday) % 7;
  const day = lastDay.getUTCDate() - diff;
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function observed(year, month, day) {
  const d = new Date(Date.UTC(year, month, day));
  let dd = day;
  if (d.getUTCDay() === 6) dd = day - 1; // Sat -> Fri
  if (d.getUTCDay() === 0) dd = day + 1; // Sun -> Mon
  const m = String(month + 1).padStart(2, "0");
  return `${year}-${m}-${String(dd).padStart(2, "0")}`;
}

/** Returns a Set of 'yyyy-mm-dd' observed federal holiday dates for a year. */
export function federalHolidays(year) {
  return new Set([
    observed(year, 0, 1), // New Year's Day
    nthWeekdayOfMonth(year, 0, 1, 3), // MLK Day: 3rd Mon Jan
    nthWeekdayOfMonth(year, 1, 1, 3), // Washington's Birthday: 3rd Mon Feb
    lastWeekdayOfMonth(year, 4, 1), // Memorial Day: last Mon May
    observed(year, 5, 19), // Juneteenth
    observed(year, 6, 4), // Independence Day
    nthWeekdayOfMonth(year, 8, 1, 1), // Labor Day: 1st Mon Sep
    nthWeekdayOfMonth(year, 9, 1, 2), // Columbus Day: 2nd Mon Oct
    observed(year, 10, 11), // Veterans Day
    nthWeekdayOfMonth(year, 10, 4, 4), // Thanksgiving: 4th Thu Nov
    observed(year, 11, 25), // Christmas
  ]);
}

export function holidaySetForRange(startYear, endYear) {
  const all = new Set();
  for (let y = startYear; y <= endYear; y++) {
    for (const d of federalHolidays(y)) all.add(d);
  }
  return all;
}
