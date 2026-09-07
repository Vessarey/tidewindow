// This is a fixed reporting period, not a full-year dataset. The NOAA
// pipeline intentionally fetches June 30 as timezone slack; do not count it
// in July–December articles or let future-only filtering erase past months.
export const FACT_RANGE_2026 = Object.freeze({
  start_date: "2026-07-01",
  end_date: "2026-12-31",
  date_basis: "station-local",
  inclusive: true,
});

export const inFactRange2026 = ({ date }) =>
  date >= FACT_RANGE_2026.start_date && date <= FACT_RANGE_2026.end_date;
