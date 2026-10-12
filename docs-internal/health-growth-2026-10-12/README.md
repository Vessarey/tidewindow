# October 12 health and discovery check

Snapshot cutoff: 2026-10-12 17:17:00 UTC for product analytics. Search
Console Web/final, all countries/devices, through October 10 (Pacific
reporting dates). `gsc-baseline.json` retains the returned page/query
baselines; `index-inspection.json` retains all 40 URL inspections;
`product-snapshot.json` records product counts and their limitations.

## One action and its limits

Playbook section 2a-prime weekly indexing check takes priority: the ready
queue still has five assignments, the morning operator already recovered
NOAA and corrected homepage labels, and there are no open reader issues.
Added one contextual paragraph from the national king-tide guide to the
Golden Hour tool, in its existing low-water planning section. It distinguishes
low-water photography from a high-water calendar and from beach access.

Only `updated` and this paragraph change. Title, description, original
publication date, tables, dated computation notes, canonicals, gates and
experiment surfaces remain unchanged. The October 12 date denotes an actual
navigation edit, not a fresh re-audit of all the September-computed tables.

| Candidate | Sep 13–Oct 10 clicks / impressions / CTR / position | Prior Aug 16–Sep 12 | Decision |
| --- | --- | --- | --- |
| National king tides -> Golden Hour | source 101 / 5,070 / 1.99% / 6.83; destination no page row | source 47 / 2,251 / 2.09% / 6.89; destination no row | Add one useful low-water photography pointer; preserve successful search framing |
| California guide / Trip Picker / La Push | indexing concerns remain | existing contextual paths from several leading guides | No duplicate link batch |
| How-to-plan guide | no current page row | seasonal/safety-language maintenance needed first | Do not promote stale August-as-upcoming copy |

Top five click-earning guides: national 101, Fitzgerald 39, WA 2027 32,
Seattle 27, OR 2027 23. Golden Hour was linked from Seattle but not the
national guide. Existing national links already cover California, Trip
Picker, Finder, heatmap and datasets. Thus this is an incremental path,
not a repair of an orphan page. Exact source query rows reveal primarily
king-tide date intent (155 rows, 22 clicks / 1,760 impressions currently;
47 rows, 13 / 875 prior), not demonstrated photography demand. These
revealed-query totals do not equal page totals. Golden Hour's page and
query responses contain no rows in either period: no observed search
activity in those responses, with CTR/position unavailable.

Hypothesis: a specific secondary next step can help some existing readers
and offer another crawl path. No claim that missing links caused exclusion,
that the link will cause indexing, or that traffic has improved because of
it. Check crawl/index state in the Oct 26 weekly pass, then directional
page-level search/tool observations over 2–4 weeks. Do not create an A/B
test on this unindexed, low-volume tool or waive playbook sample floors.

## Indexing evidence

GSC Pages UI, data updated Oct 8: all known 142 = 85 indexed / 57 excluded
(51 Discovered, 2 Crawled-not-indexed, 4 redirects). With All submitted
pages selected: 136 = 85 indexed / 51 Discovered (37.5%); all 51 example
rows inspected. Do not compare excluded URLs with a sitemap-only
denominator unless the report has that filter.

The configured inspection algorithm samples every third URL of the live
136-URL sitemap and truncates to 40; this is a deterministic prefix-spaced
sample, not random or full-sitemap coverage. Equivalent read-only logic
to `gsc-query.mjs inspect 40` retained extra API fields. Result: 27 indexed,
5 Discovered, 8 unknown (13/40 not indexed = 32.5%). The sampled Trip
Picker and California guide are Discovered, independently triggering the
guide/tool condition in section 2a-prime even though 32.5% is below a third.

The Oct 8 Pages report lists Golden Hour as Discovered; targeted URL
Inspection on Oct 12 says unknown, without a crawl timestamp. Preserve
that discrepancy, do not merge it into a single supposed real-time state.
National guide is PASS/Submitted and indexed, last crawl Oct 11 11:44:55Z,
matching Google/user canonicals. No noindex, robots or canonical blocker
was demonstrated. Sitemap includes the tool without a fabricated lastmod;
article lastmod follows its real edit date. No sitemap code changed.

## Health and measurement

- Morning operator `e772550` and NOAA recovery `a045f41` already on main.
  Recovery run 38248020584: 12:16:38–12:19:05Z; refresh commit created
  12:18:59.623Z and pushed 12:19:02.313Z. Output verifier passed at
  12:18:58.178Z, IndexNow 136 URLs / HTTP 200 at 12:18:59.437Z.
  Latest five Actions successful; latest 38279693086 correctly skipped at
  16:46:12.309Z. No duplicate dispatch. No open GitHub issues.
- Twelve live station JSONs match committed files byte-for-byte, generated
  Oct 12 12:17:02.045Z. Home, Finder, Trip Picker, Golden Hour, calendars,
  storm, California, Pillar Point and October newsletter HTTP 200. Actual
  homepage OG URL from metadata returns PNG/200; a guessed .png path's
  404 is not a site fault. No 90+ window in Oct 12–26.
- GSC 28d: 305 clicks / 15,423 impressions / 1.98% CTR / position 7.02,
  versus 179 / 11,943 / 1.50% / 7.97. Seven days Oct 4–10: 102 / 4,483 /
  2.28% / 6.84 versus Sep 27–Oct 3: 92 / 4,084 / 2.25% / 7.01.
  API rowLimit 25,000 was not reached (84 current pages, 58 prior, 528
  current property query rows). CTR is not the sole success criterion.
- PostHog 495836, production host and Regular classification, explicit
  half-open UTC bounds: 7d 577 pageviews / 534 distinct pageview IDs /
  3 signup events; 28d 1,961 / 1,824 / 10. Signup-events/pageview-IDs is
  about 0.56% / 0.55%, not a user conversion funnel. 7d/28d event counts:
  station selections 32/69, viewed windows 26/57, ZIP matches 18/41,
  Trip Picker 4/10, calendar-gate clicks 12/28, ICS reveals 1/2.
- All 577 7d pageviews carry Regular classification and UA; bot flag null
  506 / false 71 / true zero. Selected bot/agent UA markers zero. This
  does not prove human traffic. 24h LCP: 27 observations, p75 1,172 ms,
  p90 2,501.6 ms; below 30-observation floor.
- Two 7d exceptions on the Oregon 2027 guide (one distinct ID), at Oct 11
  21:02:41.814Z and 21:03:07.597Z: Safari WebKit
  `top.webkit.messageHandlers.foregroundToBackground.postMessage`
  TypeError, hidden webkit-masked-url frames, in_app=false. No app-source
  cause established. Live IAB guide renders with no captured console
  errors; this is not a Safari reproduction or proof of complete exception
  coverage. Project exception-autocapture opt-in is null.
- Native PostHog connector unauthorized; existing configured read-only
  API fallback used. Resend read-only: 20 contacts, 19 active, one unsubscribed;
  Oct 8 broadcast remains sent at 12:07:16.490381Z. Bounce/complaint rates
  unavailable from this response, not zero. No contact sync or send.
- Production dependency audit zero; full audit seven high dev-only
  entries in the existing braces/glob and compression/serve chains. No
  forced downgrade, dependency patch or override.

## Validation and release boundary

Isolated archive of e772550 plus only this article edit avoids the two
held article patches and other untracked work. Initial shared-node_modules
build used installed Next 16.3.3, not committed 16.3.8, so it is supplemental
only. Installed exact lockfile dependencies in the isolated directory with
`npm ci --ignore-scripts`, confirmed Next 16.3.8, then ran the supported
`npm run build -- --webpack` production build: 149 generated static pages,
136 sitemap URLs, 12 stations x 5 months; all 65 tests pass (42 facts,
6 math, 17 format). Lint and TypeScript pass. Main checkout dependencies
were not modified. Webpack matches the morning's documented local fallback.

Rendered output checks: exact paragraph, preserved canonical/indexability,
all article internal links resolve, true article lastmod, no static-tool
lastmod, and all 12 station JSONs unchanged. Source comparison confirms
all original content except updated date survives exactly.

Live browser before release: Golden Hour station selection loads current
La Jolla data, with before/after-sunset labels. Mobile 375px Finder ZIP
98101 selects Seattle; depth filter changes results; calendar gate opens
without submitting an email. Local 375px article link reaches Golden Hour,
which loads 20 La Jolla rows. No page-level horizontal overflow or captured
console errors in checked views. The link needed a fresh-state AX click
after a Playwright click did not navigate; successful destination observed.
No real subscription, broadcast, payment or outreach test.

Release commit, Vercel result and final public checks will be recorded in
the journal after deployment; local build success alone is not publication.

## Retained gates and next action

Storm-guide factual maintenance remains the highest ready editorial
assignment; Cabrillo, Pillar Point, sea-glass and Sunset Bay remain queued.
Do not use a fresh link as evidence that an article's stale claims are fixed.
Oct 15: final Seattle August title readout (one extension only) and official
Mora Road access recheck. [NPS road conditions](https://www.nps.gov/olym/planyourvisit/current-road-conditions.htm)
was fetched Oct 12 and still lists Mora Road closed for the Jul 8–Oct 15
construction period; page last updated Oct 10. The scheduled end is not
confirmed reopening. Nov 1: verify November-batch indexing before December
expansion. Exit-prompt owner-authority conflict and closed-unmeasurable
experiments remain unchanged.
