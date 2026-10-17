// Pure reporting helpers. API contract (inclusive Pacific dates and pagination):
// https://developers.google.com/webmaster-tools/v1/searchanalytics/query
const DAY_MS = 86_400_000;

export function reportWindow(value = 28, now = new Date()) {
  const days = Number(value);
  if (!Number.isSafeInteger(days) || days < 1) throw new Error('days must be a positive integer');
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(now).map(p => [p.type, p.value]));
  // Keep the established two-calendar-day lag, but do not claim it guarantees
  // complete data. GSC may finalize later; omitted date rows are not zeroes.
  const end = Date.UTC(+parts.year, +parts.month - 1, +parts.day) - 2 * DAY_MS;
  return {
    startDate: new Date(end - (days - 1) * DAY_MS).toISOString().slice(0, 10),
    endDate: new Date(end).toISOString().slice(0, 10),
    days,
  };
}

export async function readReportRows(request, body, { pageSize = 25_000, maxPages = 10 } = {}) {
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 25_000) throw new Error('Invalid page size');
  if (!Number.isInteger(maxPages) || maxPages < 1) throw new Error('Invalid page limit');
  const rows = [];
  for (let page = 0; page < maxPages; page++) {
    const result = await request({ ...body, type: 'web', dataState: 'final', rowLimit: pageSize, startRow: rows.length });
    const batch = result.rows ?? [];
    if (!Array.isArray(batch) || batch.length > pageSize) throw new Error('Invalid Search Analytics rows');
    rows.push(...batch);
    if (batch.length < pageSize) return rows;
  }
  // Fail visibly instead of letting a capped opportunity list look complete.
  throw new Error(`Search Analytics pagination reached ${maxPages} full pages; report not emitted`);
}

export function selectReportRows(rows, command) {
  if (command === 'flywheel') {
    return rows.filter(r => r.position >= 8 && r.position <= 20)
      .toSorted((a, b) => b.impressions - a.impressions).slice(0, 40);
  }
  return command === 'dates' ? rows : rows.slice(0, 40);
}
