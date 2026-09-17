# Tidewindow health check — September 16, 2026

Status: fixes and regenerated data are local, validated, and not deployed.
Starting checkout was clean. Fast-forwarded main to `34958d1`, including the
successful September 16 automated data refresh, before making changes.

## Fixes

- Production preview: `npm start` previously failed because `next start` does
  not support this static export. It now serves `out/` with `serve`.
- Station loading: all four tools previously stayed on “Loading NOAA data…”
  after a failed request. They now check HTTP status and the station response,
  display a recoverable error, offer retry, abort obsolete requests, and time
  out stalled requests after 15 seconds. Station selectors fit narrow screens.
- Golden Hour: lows before sunrise were labeled “after sunrise”; lows after
  sunset were labeled “before sunset.” Labels now compare the actual timestamps.
- Trip Picker: reversed dates now explain how to correct the date range instead
  of claiming that no qualifying tides exist.
- Embeds: changing stations clears the previous snippet's “Copied” status.
  Clipboard failures produce a manual-copy instruction instead of an unhandled
  promise rejection. Badge copy describes the best result in the next 30 days,
  rather than calling even a score-22 result “great.”
- Tide-window computation: reject estimates whose threshold crossings do not
  surround the predicted low or whose rounded duration is zero. Updated the
  methodology to explain unresolved shallow intervals and accurately describe
  interpolation and night labels.

## Data impact

Generated through the normal NOAA pipeline at **2026-09-16 12:39:57.757 UTC**;
generated files were not edited by hand. Window records went from **5,143 to
5,070**. All 73 excluded intervals scored 0 and had heights of at least +0.839 ft.
The complete NOAA high/low tide arrays are unchanged. Calendar feed event
contents are unchanged; only their refresh timestamps changed. Fact sheets,
station summaries, and badges were regenerated consistently.

## Verification

- `npm run lint`: passed.
- `PIPELINE_REFRESH=1 npm run build`: passed; 137 generated routes.
- Build output gate: 12 stations × 4 published months and 124 sitemap URLs;
  includes new interval-validity and badge-copy checks.
- 44 automated tests passed: 30 existing fact tests, 6 tide-math regression
  cases, and 8 solar-label cases. The new tests run automatically after builds.
- `npm audit`: zero findings, including development dependencies.
- 167 local page/data/download URLs returned HTTP 200; an unknown route
  returned 404. All static HTML links/assets resolved in the output scan.
- Browser: all 12 station selections, cached station changes, depth filters,
  valid/unknown ZIP lookup, and homepage ZIP handoff worked.
- Browser fault tests: blocked requests in all four tools, stalled request,
  HTTP 503, and mismatched station JSON displayed errors and recovered on retry.
- Native trip-date controls: valid ranking, reversed-date feedback, and the
  21-day range cap passed. Golden Hour's real Seattle before-sunrise and
  after-sunset cases display the correct directions.
- Embed preview, copy, station change, and simulated clipboard denial passed.
- Calendar form rejected an invalid email and revealed the correct ICS link
  with a reserved test address while PostHog traffic was blocked. No real
  subscription or email was sent. This checks the interface, not mail delivery.
- National schedule retained all five tables in print mode and hid navigation.
- Desktop (1280px) and phone (375px) checks covered home, station, archived
  month, national guide, data index, and the tool flows. No page-wide overflow
  or unexpected browser console warnings/errors were observed on these paths.
- Whitespace check passed with `git -c core.whitespace=cr-at-eol diff --check`,
  preserving the calendar format's CRLF line endings.

The five most recent GitHub Actions runs were successful, no open issues were
returned, and the live data index matched today's successful refresh. The live
site has not received these local fixes. Physical-device behavior and actual
newsletter delivery were not tested.
