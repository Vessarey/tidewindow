# Backlog

Prioritized queue for the daily agent. One primary item per run. Check items off
with the date; add discoveries at the appropriate tier.

## P0 — unblockers

<!-- heartbeat-2026-09-22:start -->
- [x] **2026-09-22 heartbeat — ready-now queue refilled (§2a), docs only.**
      Glass Beach shipped this morning, leaving only Seattle snippet and
      Sunset Bay independently writable now. Added three bounded maintenance
      assignments below from fresh GSC page exposure and verified stale
      claims: minus-tide explainer, tide-table explainer, Washington comparison.
      This restores five ready-now assignments; they are not three newly
      discovered query clusters. Large chart/king-tide clusters already have
      recent work or pending readouts, so no duplicate pages/retitles queued.
      Haystack remains implemented locally and awaiting explicit publication
      approval; La Jolla opens Sep 28. The Sep 21 notes were committed by
      today's operator, superseding their historical "uncommitted" status.
      Live Glass Beach desktop/mobile, 40-row chart, calendar gate and October
      navigation verified. Preserve Sep 24 newsletter, Sep 28 crawl checkpoint,
      Sep 30 indexing comparison and Oct 1 owner/month gates.
<!-- heartbeat-2026-09-22:end -->

<!-- heartbeat-2026-09-21:start -->
- [x] **2026-09-21 heartbeat — operational handoff corrected locally.**
      Today is Monday Sep 21; the next Thursday newsletter ritual is
      **Sep 24, not Sep 25** (Friday). This supersedes the morning journal's
      weekday/date labels; no newsletter action or schedule mutation today.
      Three assignments are independently ready now: Seattle snippet,
      Glass Beach chart, Sunset Bay. Haystack is already implemented locally
      and awaiting owner publication approval; do not duplicate or publish
      it through another change. La Jolla opens Sep 28, not this week.
      Preserve the Sep 28 crawl checkpoint and Oct 1 owner/month gates.
      Completed missing live homepage QA: 1280/375px layout, all eight
      section links, keyboard focus, Trip Picker and calendar gate passed.
      Owner's article and evidence packet preserved. Heartbeat changes are
      journal/backlog notes only, uncommitted; no push or deployment.
<!-- heartbeat-2026-09-21:end -->

- [x] 2026-09-21: **Weekly `inspect 40` failed the one-third test again →
      §2a′ homepage crawl path shipped (798c7d5) + §2a refill.** Sample:
      20 Submitted-and-indexed / 19 Discovered-never-crawled / 1 unknown
      (/embed/). Every guide that received Sep 13–14 contextual article
      links (best-time-to-go, sneaker-wave, best-tide-pools-OR/CA,
      how-low) is STILL never-crawled a week later; /data/ and /embed/
      stay uncrawled despite site-wide footer/nav links, so boilerplate
      links earn nothing here. Escalated per the Sep 14 plan: the homepage
      (last crawl Sep 19, previously zero in-body guide links) now carries
      a "Know before you go" section with contextual links to
      best-time-to-go, how-low, sneaker-wave, Trip Picker, OR + CA
      comparisons and Cabrillo. Pointer copy has no tide numbers or
      stale-able dates. **Recheck at the next weekly inspect (~Sep 28):**
      exact-URL inspect those seven targets; if still never-crawled after
      a homepage path, treat as Google-side crawl-budget lag, stop adding
      link passes, and let the ~Sep 30 `inspect 60` comparison judge it.
      Refill: three demand-backed P1 items added below (Glass Beach chart
      equity, Haystack Rock roll-forward, La Jolla remaining-dates
      verification) — queue back to 5 writable with Seattle equity and
      Sunset Bay. Checked and NOT re-added: Fitzgerald chart cluster
      (chart + title shipped Sep 17, pos 8.9 with clicks), bare "king
      tides 2026" (Sep 11 schedule section, readout ~Oct 5), Puget chart
      (rolled Sep 19), Acadia chart cluster (chart shipped Sep 20).
- [x] 2026-09-19: **Queue refilled from demand (§2a) — five writable items
      again.** At session start only Acadia inline H/L and Sunset Bay were
      writable (<3 → refill outranks everything). Fresh `flywheel 28`,
      full 314-row query dump and query→page mapping (GSC Aug 20–Sep 17)
      found three demand-backed assignments, added to P1 below: (1) Port
      Townsend generic tides/chart cluster (~55 impressions, pos 20–42,
      landing on the station page, not the guide); (2) Seattle "low tides
      2026" schedule intent (~48 impressions, pos 5–8, 0 clicks on the
      Constellation guide); (3) Puget Sound chart page September→October
      roll (its charts go stale Oct 1; Fitzgerald's equivalent rolled
      Sep 17). Checked and NOT re-added: king-tide clusters (national/WA/OR
      pages hold pos 7–9.5; bare-2026 schedule section shipped Sep 11,
      readout pending), Fitzgerald chart (rolled Sep 17), La Push/Olympic
      chart queries (~12 impressions landing on the archived 2026-08 month
      page — tiny demand, journaled, no page); `seaside clam tides` ignored
      per the shellfish blocklist. No article or production code changed in
      this refill.
- [x] 2026-09-15 heartbeat: **Ready-now queue restored to five items.**
      After the operator completed Constellation Park, only Acadia inline
      H/L and Sunset Bay were writable now. Fitzgerald is explicitly held
      until late September; a generic conversion pass is not a P1 content
      assignment. Fresh `flywheel 28` / `queries 28` plus exact Aug 17–Sep 13
      query+page data found the leading chart/king-tide clusters already
      covered. Do not manufacture overlapping pages or repeat their retitles.
      Added three concrete, demand-informed freshness assignments below:
      Oregon calendar, Port Townsend/North Beach, and La Push. Each existing
      guide still presents passed September dates as upcoming. This is a
      maintenance refill, not three newly discovered uncovered SEO clusters.
      The five ready-now items are those three plus Acadia and Sunset Bay;
      no article or production code changed in this refill.
- [x] 2026-09-14: **Queue refilled (§2a) + weekly `inspect 40` run — result
      flipped the day to §2a′ crawl paths.** Refill: three demand items added
      to P1 below (national print view, Fitzgerald October chart roll-forward,
      Constellation Park equity), bringing the nominal queue to 5 with Acadia
      inline H/L and Sunset Bay (4 writable then; Fitzgerald was future-dated).
      Two hypothesized items were already shipped
      and were NOT re-added: the Puget page already titled "Puget Sound Tide
      Chart 2026" (Sep 9) and the Seattle guide already titled "Constellation
      Park Tide Pools 2026" (Sep 8). Inspect 40 of 124: 20 indexed / 14
      discovered-never-crawled / 6 unknown — 50% unindexed, so §2a′ made
      crawl paths the primary action (see JOURNAL 09-14). Exact-URL checks:
      Oregon king-tides guide still Discovered–never crawled (inbound links
      shipped only Sep 13 — recheck next weekly pass before escalating);
      Glass Beach INDEXED Sep 13 (crawled 14:03Z, 1 day after Sep 12 publish);
      Finder indexed (crawled Sep 2). Trip Picker, /data/, /embed/ remain
      never-crawled despite existing inbound links.
- [x] 2026-09-11: **Content queue refilled from demand (§2a).** Ran fresh
      `flywheel 28` + `queries 28` and added three qualified P1 items, each
      with cluster, impressions, position and target: (1) Glass Beach Port
      Townsend NEW page — investigated per the note below: the PT guide
      covers Fort Worden/North Beach only, no Glass Beach mention anywhere
      except a stray line in king-tides-washington-2027, so a separate page
      is justified; (2) "king tides 2026" schedule section on the national
      page (~140 impressions across the bare-2026 cluster, 0 clicks on the
      81-impression head query); (3) Oregon king-tides retitle to
      2026 & 2027, mirroring WA's pattern. Fitzgerald/Puget chart work
      correctly excluded as done. Refill brought the queue to 5 writable
      items (3 new + Acadia inline H/L + Sunset Bay refresh). The later
      Sep 11 heartbeat completed the national schedule, leaving 4.
- [x] 2026-07-06: **$pageview CAPTURE FIXED** (commit 1e88dbc) —
      `capture_pageview: true` → `"history_change"` in src/components/analytics.tsx.
      Root cause (verified in posthog-js 1.396.5 source): the History API monitor
      that records soft (pushState) navigations is gated on
      `capture_pageview === "history_change"`; with bare `true` it is disabled, so
      on this Next.js static export only hard page loads emitted a $pageview and
      client-side route changes emitted none (that is the "zero capture requests
      on route change" symptom). NB: the earlier "0 all-time" was pre-proxy-fix;
      by 2026-07-06 hard-load pageviews were already landing (4 all-time). Verified
      end-to-end: fix present in the deployed bundle; a live pushState soft-nav to
      /guides/ then /tools/ produced a /i/v0/e/ capture POST (200) and both
      $pageview events landed in PostHog within seconds (they would not have with
      `true`). Two test pageviews (/guides/, /tools/, ~08:14 ET 07-06) are from
      this verification — filter them from today's metrics.
- [x] 2026-07-05: PostHog /ingest proxy outage FIXED (commit 2159b6e) — the
      same-origin proxy 404'd all ingestion endpoints under output:"export" +
      trailingSlash, so zero events reached PostHog from the 2026-07-03 domain
      migration until this fix. Now posts direct to us.i.posthog.com; $pageleave
      + custom events verified landing. NOTE: this invalidates the earlier
      "PostHog fully wired (capture live)" item below — capture was dark.
- [x] 2026-07-03: Verify Pages deploy serves /tidewindow/ correctly — homepage
      renders live windows, automation disclosure intact, /data-json/index.json
      valid; no 404s.
- [x] 2026-07-03: Confirm IndexNow returns 200 in daily-refresh logs — "submitted
      83 URLs — HTTP 200".
- [x] 2026-07-03: PostHog fully wired (capture live + agent query key saved).
- [x] 2026-07-23: NEWSLETTER GO-LIVE COMPLETE — first Broadcast
      7883454d-0ac2-4b75-a1f6-78483a4b15e5 sent 12:07Z to 1 subscriber
      (Jul 23–29 issue, 22 Good+ windows); signup copy flipped site-wide to
      "Sent every Thursday" (commit 5a51925). Weekly Thursday send is now a
      standing ritual: sync-audience → dry-run → recompute-check → send.
      History (runbook: docs-internal/resend-newsletter.md):
      1) [x] 2026-07-05 scripts/newsletter/sync-audience.mjs — HogQL-exports
         distinct newsletter_signup emails from PostHog (host-filtered; shared
         project), upserts additively into Resend Audience "Minus Tide Alert"
         (created via API, id ff50e851-e711-4ad6-b861-5774682c8d5a, empty as
         expected — 0 signup events). Never touches existing/unsubscribed
         contacts. Verified against both live APIs.
      2) [x] 2026-07-05 scripts/newsletter/send-weekly.mjs — composes the
         weekly digest per region from public/data-json (best Good+ daylight
         window per station, species via iNat facts, prediction disclaimer,
         Resend unsubscribe placeholder). --dry-run renders to
         docs-internal/newsletter-drafts/ with zero network calls; sending
         requires --send AND --owner-reviewed AND a non-empty audience (all
         three gates verified live; sample issue committed).
      3) [x] 2026-07-23 SENT. **OWNER APPROVED 2026-07-19** ("proceed with what you see fit";
         recorded in JOURNAL) — all gates cleared. First send is the REQUIRED
         primary of the **Thursday 2026-07-23 run** (chosen over a same-day
         send because the Jul 19-25 week is neap-thin — 0 Great, nothing in
         the subscriber's CA — while Jul 23-29 renders 22 Good+ windows):
         sync-audience, then send-weekly.mjs --send --owner-reviewed, then
         flip EmailSignup blurbs + /newsletter/ page from "starting this
         season" to live, journal the Broadcast id.
      4) [x] 2026-07-19: Weekly cadence set — send day is Thursday.
- [x] 2026-07-05: Resend Receiving MX now "verified" (GET /domains/b06d98e7-…
      shows domain verified with DKIM, SPF MX+TXT, and Receiving MX all
      verified; recorded in docs-internal/resend-newsletter.md).

## P1 — content queue (one per day max; ≤5/week)

<!-- heartbeat-2026-09-22-refill:start -->
- [ ] **Minus-tide explainer — reconcile period, counts and daylight meaning**
      (Sep 22 maintenance refill; ready now, first new priority).
      Target `what-is-a-minus-tide`; exact GSC Aug 24–Sep 20: 2 clicks /
      179 impressions / position 5.93. Visible page-specific queries are only
      `what is a minus tide` (2 impressions / pos 2.5) and `negative low tide`
      (1 / pos 6); most page exposure is not disclosed at query level. Do not
      attribute the whole-site 11-impression head query to this page.
      The Jul 3 article calls 940 west-coast minus tides / 535 daylight windows
      a full-year 2026 total. Current fact sheets explicitly cover Jul 1–Dec 31
      and report 953 / 548; the Aug 2 note below predates both historical-window
      backfill and the Sep 7 range fix. Reconcile provenance, then recompute
      all coast totals, percentages and hour bins with the shared explicit
      range; label it as a partial-year dataset, never silently relabel old
      numbers as full-year facts. Distinguish ≥30-minute window/daylight overlap
      from the low itself occurring in daylight. Verify NOAA datum sources at
      write time. Update body, lead and FAQs consistently; preserve title,
      slug and gates. This is factual maintenance, not a conversion experiment.
- [ ] **Tide-table explainer — retire the passed "still ahead" premise**
      (Sep 22 maintenance refill; ready now). Target `how-to-read-a-tide-table`;
      exact GSC Aug 24–Sep 20: 0 clicks / 48 impressions / position 7.77;
      page-specific query read returned no rows, not proof of zero demand.
      Updated Jul 27, it still calls Aug 12 the deepest low "still ahead" and
      the deepest daylight low "left" in 2026. Preserve the useful Aug 10–15
      worked example explicitly as historical; remove remaining-year/full-year
      overclaims. Recompute example/December comparison from current Newport
      facts with the documented date scope and daylight definition, checking
      body and FAQ values together. Keep title/slug/gates unchanged; a dated
      teaching example does not need replacement merely because it is past.
- [ ] **Washington three-coast guide — remaining-season framing**
      (Sep 22 maintenance refill; ready now). Target
      `best-tide-pools-washington-2026`; exact GSC Aug 24–Sep 20: 1 click /
      37 impressions / position 5.92. Only visible query is `how about october 4`
      (1 impression / pos 3), so this is exposed-page freshness evidence, not
      a new high-volume search cluster. The Sep 8 lead, FAQ and "remaining
      morning run" still promote Sep 9–12. Mark that run historical and lead
      with the actual remaining-season differences among La Push, Port Townsend
      and Seattle, recomputed from all three current station facts. Keep the
      comparison scope; do not duplicate Seattle's separately queued snippet
      or the recently shipped PT/Glass Beach charts. Recheck NPS access at write
      time; Mora closure does not automatically expire Oct 15. Preserve the
      existing title/slug/gates in this bounded body/description/FAQ refresh;
      do not add a title experiment to an under-floor surface.

All three are demand-informed maintenance, not newly uncovered keyword pages.
Use a plain build plus fact/math/format tests and rendered-output checks at
implementation; preserve historical evidence and the owner's Haystack hold.
<!-- heartbeat-2026-09-22-refill:end -->

- [x] **Glass Beach tide chart equity — refresh, not a new page** (added
      2026-09-21 refill).
      **Done 2026-09-22 operator:** new "Glass Beach tide chart: Port
      Townsend predictions, September 22 – October 31, 2026" H2 with the
      complete 40-date daily H/L table script-rendered from
      `daily_extremes_current_and_next_month` (fact sheet generated
      2026-09-22) and recompute-checked row-for-row, 0 mismatches. Framing
      is walk-timing (what the chart cannot answer: passability, daylight),
      NOT the Fort Worden guide's tide-pool framing — that guide is linked
      instead. Prose claims verified against committed window data: exactly
      4 of 40 dates have ≥30 min daylight overlap below +1 ft (Sep 22,
      Oct 5–7, matching the existing windows table); all 18 minus tides
      land 10:15 PM–5:48 AM; deepest −2.77 ft Oct 29 12:19 AM. Description
      updated to carry "tide chart" (145 chars); NO retitle, per the item's
      own preference after the PT-guide retitle closed unmeasurable.
      `updated: 2026-09-22`. Build + verify-output green (124 URLs), 56
      tests pass. Ship baseline (GSC 28d, Sep 21 read): cluster `glass
      beach port townsend tide chart` 18 impressions / pos 14.0 / 0 clicks;
      page indexed since Sep 13. Judge on cluster clicks + position landing
      on this page; the page's own prior verdict closed unmeasurable, so
      treat movement as observation, not a promised experiment readout.
      Original item: Cluster (GSC 28d): `glass beach port townsend
      tide chart` 18 impressions / pos 14.0 / 0 clicks, plus `glass beach
      tides` and `glass beach port townsend tide` 1 each — chart intent,
      but the page (`glass-beach-port-townsend-low-tide-2026`, INDEXED
      since Sep 13, title "Glass Beach Tides: Timing the Walk from North
      Beach in Port Townsend") has no chart and no chart/schedule H2.
      Target: inline current+next-month daily H/L chart for station
      9444900 script-rendered from `daily_extremes_current_and_next_month`
      (proven Fitzgerald/PT pattern) + explicit tide-chart H2. Do NOT
      duplicate the Fort Worden guide's chart framing — link it; the two
      pages already cross-link. A retitle is optional and if done is an
      experiment: record fresh page baselines at ship (§5); note the PT
      guide's retitle verdict closed unmeasurable, so prefer H2/content
      equity over another title bet.
- [ ] **Haystack Rock roll-forward — stalest indexed guide with real
      exposure** (added 2026-09-21 refill). GSC 28d: 2 clicks / 30
      impressions / pos 5.5 / 6.7% CTR. The guide (`haystack-rock-
      tidepool-windows-2026`, updated 2026-07-28) still leads with the
      PASSED "August 11–14 dawn run" as its four-mornings premise and
      description. §2e refresh: recompute remaining-2026 windows from the
      current Garibaldi fact sheet, rewrite lead/answer/description to
      the actual remaining season, keep Marine Garden rules sourced as-is
      (re-fetch official sources at write time), honest `updated:`.
      **Sep 21 owner-requested SEO refresh: implemented and validated
      locally; publication pending.** The working-tree article now covers
      all eight remaining minus-tide windows with daylight overlap and
      explicitly says every low itself is after sunset. Summer rows retained;
      stale monthly counts, FAQs and station-offset assurances corrected.
      Current exact baseline Aug 23–Sep 19: 2 clicks / 29 impressions /
      6.90% CTR / position 5.66; no visible query rows. Build, lint, 56 tests,
      metadata/schema, mobile/desktop and navigation checks passed. See
      `docs-internal/seo-refresh-2026-09-21/README.md` and exact patch.
      Do not duplicate this local edit or mark it shipped until deployment
      is authorized and live output verified.
- [ ] **La Jolla remaining-dates verification pass** (added 2026-09-21
      refill). GSC 28d: 1 click / 44 impressions / pos 5.7; updated
      Aug 18. Its ranked "best remaining 2026 dates" begin at Sep 27 —
      about to be passed. After Sep 27, re-verify every listed date/
      height against the current fact sheet, drop or re-mark passed
      dates as historical, refresh the December-run framing. Smaller
      than Haystack; schedule after it (writable from Sep 28).
- [x] **Port Townsend tide chart equity — refresh, not a new page** (added
      2026-09-19 demand refill).
      **Done 2026-09-20 operator (5c96392):** inline Sep 20–Oct 31 daily
      H/L chart (42 rows / 156 extremes) script-rendered from
      `daily_extremes_current_and_next_month` and recompute-checked 0
      mismatches; explicit tide chart / low tide schedule H2; Glass Beach
      guide chart pointer (link-only). Retitle SHIPPED as an experiment:
      "Port Townsend Tide Chart 2026: Low Tide Schedule & Tide Pools at
      Fort Worden and North Beach" — baselines at ship (GSC 28d): guide
      page no row returned (Sep 15 read 0 clicks / 9 impr / pos 4.56),
      station page 11 / 464 / 10.6, cluster ~55 impressions pos 20–42
      with ~0 clicks. Judge on cluster clicks + position landing on the
      guide, ~Nov 8 earliest (§5 floor); attribution shared with the
      Sep 18 refresh package. Next chart roll ~Nov 1 alongside
      Fitzgerald/Puget. Original item: Cluster (GSC 28d, query→page): `port
      townsend tides` 17 impressions / pos 30.6, `tide schedule port
      townsend` 5 / 22.2, `tides port townsend` 4 / 35.3, `tides port
      townsend wa` 4 / 31.0, `tide chart for port townsend` 3 / 26.3,
      `port townsend tide table(s)` 7 across variants / pos 20–30, plus
      today/tomorrow and ~10 more 1–2-impression variants — ~55
      impressions, ~0 clicks, nearly ALL landing on the station page
      `/beaches/wa/port-townsend-wa/` at pos 20–42, not the guide. Also
      `glass beach port townsend tide chart` 12 / 16.3 lands 8-of-12 on
      the station page rather than the Glass Beach guide. Target: existing
      `port-townsend-fort-worden-tide-pools-2026` — add an inline
      current+next-month daily H/L chart section script-rendered from
      `daily_extremes_current_and_next_month` (the proven Fitzgerald
      Sep 17 pattern), explicit tide-table/schedule H2 phrasing, and a
      chart pointer from the Glass Beach guide. Weigh a "Tide Chart" title
      element (Fitzgerald/Puget precedent); a retitle is an experiment —
      record the guide's fresh GSC baseline at ship (§5). Do not duplicate
      the Puget Sound chart page's Puget-wide framing; link it. Station
      page baseline: 11 clicks / 444 impressions / pos 10.6 (28d).
      **Sep 20 heartbeat measurement correction (§5):** exact guide-page
      read for Aug 22–Sep 18 returns 0 clicks / 9 impressions / position
      5.22. Its own rate is 9/28 = 0.32 impressions/day, so even all guide
      queries need ~311 days to reach 100; the intended narrower cluster
      cannot be credited with unrelated station-page impressions. Close
      the standalone retitle verdict as **unmeasurable at current traffic**,
      superseding the Nov 8 forecast, not as a loss. Keep today's useful
      free chart and title unchanged; monitor normal discovery without
      promising a causal title result or repeatedly extending the verdict.
- [ ] **Seattle "low tides 2026" schedule intent on the Constellation
      guide — description/answer-box equity, NO retitle** (added
      2026-09-19 demand refill). Cluster: `seattle low tides 2026` 28
      impressions / pos 6.3 / 0 clicks, `seattle low tide 2026` 9 / 6.8,
      `low tides seattle 2026` 5 / 7.8, `lowest tide seattle 2026` 3 /
      5.0, plus `lowest tide(s) of the year 2026` 5 / pos 2–8 — ~50
      impressions, all landing on
      `seattle-alki-constellation-park-tide-pools-2026`, 0 clicks. The
      page ranks but its snippet sells a park guide while the searcher
      wants the 2026 date schedule — and the honest schedule answer is
      that Seattle's 2026 daylight minus-tide season ended Sep 10 (verified
      zero daylight minus tides after Sep 10 through year-end, per the
      Sep 8 refresh): make the remaining-2026 (night lows only) status and
      the 2027 return ladder (Feb 15 → Apr 10–11) visible in the meta
      description and answer box, recomputed from current fact sheets at
      write time. HARD constraint: no retitle and no gate changes — the
      Sep 8 retitle readout (~Oct 1) and the Sep 15 at-a-glance H2 already
      share this surface; any new edit joins that package for attribution
      (§5). Record cluster baseline at ship; judge on cluster clicks +
      position, not CTR.
- [x] **Puget Sound chart page: roll both station charts September →
      October** (added 2026-09-19 demand refill; writable now). Cluster:
      `puget sound tide chart 2026` 17 impressions / pos 11.2 / 1 click;
      page `puget-sound-low-tide-calendar-2026` 4 clicks / 248
      impressions / pos 6.0 (GSC 28d, 2026-09-19). Both its daily H/L
      chart sections cover remaining-September only and go stale Oct 1
      (standing backlog note). Mirror the owner's Sep 17 Fitzgerald roll:
      regenerate Seattle + Port Townsend sections from
      `daily_extremes_current_and_next_month` (current month remainder +
      full October), script-rendered and recompute-checked row-for-row
      against fact sheets; honest `updated:`; title, slug and gates
      unchanged. Cross-link the Port Townsend guide's inline chart if the
      PT equity item ships first.
      **Done Sep 19 heartbeat:** both charts now run Sep 9–Oct 31,
      retaining all 44 earlier September rows and adding 62 October rows
      from the fact sheets (106 rows / 402 extremes verified). Current
      planning range is Sep 19 onward; old rows are explicitly historical.
      Passed season-close lead/FAQ corrected; daylight overlap separated
      from daylight at the low and access; July–December Seattle count
      repaired 128 → 126 (53/126 ≈42%). Historical tables, title, slug,
      publish date and gate preserved. `updated: 2026-09-19`. Build,
      56 tests, 203 content checks, 14 linked routes and mobile gate QA
      passed. This maintenance joins the Sep 9 package for attribution,
      not a new retitle or conversion experiment. Exact GSC Aug 20–Sep 16:
      page 4 clicks / 248 impressions / 6.03; exact query on this page
      1 / 6 / 10.17 (property-wide query 1 / 17 / 11.24 differs).
      Preserve the Oct 7 package checkpoint subject to §5; query-only
      rate is too small for a standalone verdict. Next chart roll ~Nov 1.
- [x] **Oregon minus-tide calendar: retire the passed September lead —
      first ready-now refresh.** Added Sep 15 heartbeat. Target existing
      `oregon-coast-minus-tide-calendar-2026`, not a new page. Exact GSC
      Aug 17–Sep 13: `minus tides oregon 2026` 8 impressions / pos 7.88,
      `negative tides oregon coast 2026` 5 / 8.60, both 0 clicks, both
      landing on this guide. Page: 11 clicks / 366 impressions / pos 6.44;
      PostHog production Regular: 13 pageviews in the seven days to Sep 15
      17:15:33Z. Its answer box and first FAQ still say Sep 9–12 is "still
      ahead"; the weekend FAQ also presents Sep 12 as a future option.
      Roll the lead/FAQs/weekend section to remaining dates from current
      fact sheets, preserve passed runs and honest computation stamps as
      history, and separate daylight-window overlap from daylight at low
      water. Keep the established title, slug and gates. Recheck cited park
      guidance at write time; do not add shellfish/clam advice from stray
      search terms. Exact URL inspection Sep 15: indexed, last crawl Sep 6.
      **Done Sep 17 heartbeat:** lead/FAQs/weekend prose now distinguish
      passed mornings from October/December windows. Recomputed the complete
      July–December totals (206, not 198) and Exceptional count (15, not 13);
      retained all historical event tables and computation stamps. Clarified
      daylight overlap versus daylight at low water, removed the false
      coast-wide best-remaining-weekend claim and all-dates-in-ICS promise,
      and linked September/October full charts. Title, slug, publish date
      and gates unchanged. Current facts, 212 content checks, 44 build tests,
      27 internal routes, five official sources and 375px QA passed.
      Baseline: 13 Regular production pageviews/7d; exact GSC Aug 18–Sep 14
      14 clicks / 369 impressions / position 6.37. Freshness maintenance,
      not a new experiment. Roll the September 27 pointer after that date.

- [x] **Port Townsend / North Beach: post-Labor-Day refresh and access
      distinction.** **Done 2026-09-18 (dce21e3):** lead/description/FAQs/
      closing rolled to a season-close summary; complete remaining-2026 set
      (four Skip windows) recompute-checked 4/4; Labor Day + July tables
      kept as history; new North Beach county-park H2 with quoted Jefferson
      County sourcing; "tide is your only clock" replaced with verified
      state-park day-use hours; "deepest of year" scoped to Jul 1 dataset
      start; species re-ranked to current 60-day log. Title/slug/gates
      unchanged. Original item:
      **Port Townsend / North Beach: post-Labor-Day refresh and access
      distinction.** Added Sep 15 heartbeat. Target existing
      `port-townsend-fort-worden-tide-pools-2026`. Exact GSC Aug 17–Sep 13:
      `north beach port townsend tides` 7 impressions / pos 10.43 / 0 clicks
      currently lands on the station page, not this guide; `port townsend
      tide pools` 2 / 1.0 / 1 click also lands there. The guide itself has
      0 clicks / 9 impressions / pos 4.56 and 0 production Regular
      pageviews/7d; do not claim those station clicks as article traffic.
      Replace the still-upcoming Sep 5–10/Labor Day lead, FAQs and closing
      with a current fact-sheet-based season summary. Preserve the run as
      history; verify any "first/only/next" statement against the complete
      relevant range. Add a clear North Beach section distinguishing its
      county access from Fort Worden/Point Wilson, with current official
      sources. Remove the unsupported "tide is your only clock" / no-gate
      implication unless explicitly verified. Preserve the Glass Beach link
      and do not infer route clearance from the station window. Keep title,
      slug and gate. Sep 15 URL inspection: indexed, last crawl Jul 8.

- [x] **La Push / Olympic tide chart: current dates without reopening
      Rialto.** Added Sep 15 heartbeat. Target existing
      `la-push-second-beach-tide-pools-2026`. Exact GSC Aug 17–Sep 13:
      `olympic tide chart` 2 impressions / pos 9.0 / 0 clicks and `la push
      tide chart` 4 / 27.25 / 0 clicks land on the archived La Push August
      month page, not this guide. Tiny demand; no retitle or new page is
      justified. Guide: no GSC page row returned; 3 production Regular
      pageviews/7d. Its description, answer box and rest-of-2026 FAQ still
      sell Sep 9–12 as future mornings. Roll those surfaces and dated prose
      to remaining fact-sheet dates, preserving old tables as history.
      Add a concise, explicitly station-specific chart-finding section
      linking existing current-month/full H/L tables; no duplicated chart
      code is needed. Re-fetch NPS conditions and trail/access sources at
      write time. The Sep 15 conditions check still closes Mora Road beyond
      the campground July 8–Oct 15; do not promise reopening on that date or
      equate La Push station tides with certified route access. Sep 15 URL
      inspection: Discovered–currently not indexed, never crawled. This is
      factual maintenance, not a conversion pass; keep crawl follow-up in
      the Sep 21 weekly check and do not re-add already-shipped inbound links.
      **Done Sep 18 heartbeat:** retired the passed-morning lead, description
      and FAQs; added a seven-date Sep–Dec comparison and links to the full
      September/October station charts. All three historical tables and their
      computation stamps retained unchanged. Separated daylight overlap from
      low-time daylight (Dec 21 is the narrow exception), scoped the historical
      depth ranking to Jul–Dec, and removed route-clearance/arrival implications.
      Current NPS closure is beyond Mora Campground, not a verified October
      reopening; trail lengths, parking fee and brief official safety quotes
      reverified. Species snapshot updated. Title, slug, publish date and gate
      unchanged. Build: 56 tests, 124 sitemap routes; 283 content/source checks,
      25 table rows, 11 internal links, seven official sources and 375px QA pass.
      Baseline: 2 Regular production pageviews/7d; exact GSC Aug 19–Sep 15
      returns no guide page row. No experiment or indexing-success claim.

- [x] **Print-friendly view of the national king-tide schedule — refresh,
      not a new page** (added 2026-09-14 demand refill). Cluster: `king
      tides 2026 2027 predictions pdf` 21 impressions / pos 8.6 / 0 clicks,
      plus `king tides 2026-2027` 10 / 8.2 (GSC 28d, 2026-09-14). Target:
      `king-tides-2026-2027-dates`. The "pdf" modifier recurs (also queued
      Sep 11, deferred as optional); serve it with a print stylesheet
      (@media print: hide nav/gates/tools, keep the three monthly tables
      and the Oct–Mar low-window table) and a visible "print this
      schedule" line. NEVER claim a downloadable PDF that doesn't exist.
      Baseline before change: 47 clicks / 2,259 impressions / pos 6.9
      (GSC 28d pages, 2026-09-14). Code change → PIPELINE_REFRESH build.
      **Done Sep 14 heartbeat:** visible print button and scoped print CSS;
      all five tables (53 data rows), context, FAQs and sources retained.
      Navigation, gates, forms and related-tools blocks stay off the printout.
      Letter/A4 eight-page previews visually checked; native Chrome print
      dialog opens; 375px screen view fits. This uses the browser's Save as
      PDF option, not a hosted PDF download. No article numbers, metadata or
      today's operator links changed. Fresh-NOAA and production-input builds,
      30 fact tests and the extended output gate passed. Exact page+PDF-query
      read at the heartbeat: 19 impressions / 8.63 / 0 clicks over Aug 15–Sep 12;
      do not mix this with the operator's broader query-only count above.
- [x] 2026-09-17 **Fitzgerald monthly tide chart rolled forward** (owner
      request): chart section now covers Sep 17–Oct 31 from the new
      `daily_extremes_current_and_next_month` fact field (facts.mjs +
      facts.test.mjs); December daylight-minus count corrected 15 → 14 after
      the 09-16 validity fix (remaining total 39 → 38). Next roll: ~Nov 1
      (drop October, add November) — the fact field makes that a script job.
      Original item:
      **Fitzgerald monthly tide chart: roll September forward to October**
      (added 2026-09-14 demand refill; writable from late September).
      Cluster: `fitzgerald marine reserve tide chart` 230 impressions /
      pos 9.0 / 3 clicks + `tide schedule` 14 / 9.1 + `tide table` 7 /
      15.3 (GSC 28d, 2026-09-14) — the property's largest non-king
      cluster. Target: `fitzgerald-marine-reserve-tide-pooling-2026`, whose
      complete-extremes chart section is titled "September 2026" and goes
      stale Oct 1. Note: fact sheets carry monthly *summaries* only; the
      daily H/L rows need a facts.mjs extension (per-day extremes for the
      current month) so every number stays traceable to docs-internal/facts
      — do that extension as part of this item, extend verify/tests if the
      surface warrants, and update `updated:` honestly (real data change).
- [x] 2026-09-15: **Constellation Park query equity DONE** (459f166).
      Shipped exactly as specced: "Constellation Park at a glance" H2
      (station 9447130, access point/address, Aquarium below-2-ft and
      eelgrass thresholds, cobble-footing quote, parking/restrooms — all
      from claims already cited on the page) placed directly after the
      answer box, plus descriptive-anchor inbound links ("Constellation
      Park tide pools") from the Puget Sound calendar and WA king-tides
      guide (link-only edits, no `updated:` bump there). NO retitle, per
      spec. Side-fix in the same file: rolled the stale Sep 8-10
      season-close lead/FAQ to past tense (real change → `updated:`
      2026-09-15); every restated number verified against committed
      predictions (zero daylight minus tides after Sep 10 2026; Feb 15
      2027 −0.47 ft 5:52 PM; Apr 10–11 2027 −1.92/−1.80 ft). Judge on
      GSC position for the cluster (baseline 19 impr / pos 9.8 / 0 clicks
      28d on 2026-09-14), not CTR; §5 minimum-sample applies — the Sep 8
      retitle experiment readout (~10-01) now shares this surface with
      today's change, so attribute cluster movement to the package, not
      either edit alone.
      Original item (added 2026-09-14 demand refill): cluster
      `constellation park tide pools` 19 impressions / pos 9.8 / 0 clicks
      (28d; 26 / 10.1 over 90d) + `constellation park low tide` 6 / 8.0 /
      1 click; descriptive-anchor inbound links + at-a-glance H2 so the
      page answers the park-named query directly.

- [x] 2026-09-12: **Glass Beach (Port Townsend) low-tide access guide —
      LAUNCHED** (content/articles/glass-beach-port-townsend-low-tide-2026.md,
      commit a38def5). Cluster: `glass beach port townsend tide chart`
      10 impressions / pos 17.3 and `glass beach tides` 1 / pos 10.0
      (GSC 28d, 2026-09-11). Category is **beachcombing**, not
      station-guides as sketched here: getStationGuide() resolves the
      station's guide by `category === "station-guides"` and a second PT
      entry would have contended with the Fort Worden guide for that slot;
      the station calendar gate still renders via `station:` frontmatter.
      **Sep 12 heartbeat correction, 68cad44:** the four Sep 22/Oct 5–7
      rows have ≥30 minutes of daylight overlap, not four verified
      opportunities to complete the Glass Beach walk. Oct 5's low is
      before sunrise. Nov–Dec have zero qualifying windows, not an
      established beach closure. The five king-season lows are a
      depth-ranked subset; Mar 15's 270 minutes are not the first fully
      daylight window or a walking-duration guarantee. Removed the
      unsupported +1-ft route cutoff, turnaround and reopening claims.
      Jefferson County supports the public-access description; the
      Spokesman-Review (2017) and Beachcombing Magazine (2020) support
      explicitly historical route context, not today's access conditions.
      PDN/Leader sources and unverified detailed history removed after
      this run could not fetch them. All four retained source links 200.
      Both inbound guide links now distinguish predictions from access;
      their nav-only updated dates remain unchanged.
      **Performance verdict CLOSED — unmeasurable at current traffic:**
      baseline cluster 11 impressions / 0 clicks / pos ~17 (28d) gives
      11/28 = 0.39 impressions/day; 100-impression floor ≈255 days,
      beyond §5's 60-day limit. Do not start/extend an Oct 12 conversion
      or position experiment. Keep the free page and check discovery /
      indexing in the normal weekly review (next Sep 14).
- [x] **"King tides 2026" schedule intent on the national page — refresh,
      not a new page** (added 2026-09-11 demand refill). Cluster: `king
      tides 2026` 81 impressions / pos 9.6 / 0 clicks, `king tides 2026
      predictions` 20 / 8.1, `king tides 2026 2027 predictions pdf`
      16 / 8.8, `king tide 2026` 15 / 14.3, plus schedule variants —
      ~140 impressions (GSC 28d, 2026-09-11). Target:
      `king-tides-2026-2027-dates`. The page answers "2026 & 2027 coast by
      coast" but has no month-by-month late-2026 schedule a bare-"2026"
      searcher can land on. Add an Oct/Nov/Dec 2026 per-station schedule
      section from the fact sheets, and consider a print-friendly view
      (print CSS) to serve the recurring "pdf" modifier — never claim a
      downloadable PDF that doesn't exist. Title already carries 2026; keep
      slug. Record baselines before the change (39 clicks / 1,829
      impressions / pos 6.9, GSC 28d pages).
      **Done 2026-09-11, 36aebb1:** 36 Oct/Nov/Dec monthly high-tide
      peaks across all 12 stations, generated from new monthly
      `highest_tide` facts using complete high predictions (no daylight
      filter). 12 new regression tests cover 72 monthly maxima. Updated
      title/description, retained slug/date/gates, corrected the low-table
      daylight-overlap definition and Newport/Bar Harbor after-sunset
      claims. Access and flooding kept separate. No new PDF or print-view
      promise; print CSS was optional and not added. Search readout below.
- [x] **Oregon king tides: carry the 2026 half of the season in the
      title — refresh, not a new page** (added 2026-09-11 demand refill).
      Cluster: `king tides oregon coast 2027` 17 / 7.5 and `king tides
      oregon 2026 predictions` 2 / 12.5 (GSC 28d, 2026-09-11). Target:
      `king-tides-oregon-2027`. Title says 2027 only, but the season's
      first highs land Nov–Dec 2026 and WA's equivalent page — titled
      "King Tides Washington 2026 & 2027" — now draws the property's
      single largest query, `king tides washington 2026`, at 198
      impressions / pos 7.3. Mirror that proven pattern: retitle to
      "King Tides Oregon Coast 2026 & 2027" and make the late-2026 dates
      explicit in the lead. Small-n today but seasonally rising into
      October. Retitle = experiment: record baseline in JOURNAL on the day
      it ships (§5 minimum-sample rule applies).
      **Sep 11 carryover:** apply the national guide's daylight-overlap
      distinction here too: the selected Port Orford Dec 24 low is at
      6:14 PM with 69 daylight minutes elsewhere in the window, not a
      low occurring in daylight. Recompute every title/description/table
      claim from current facts during this same queued refresh.
      **Done Sep 13 heartbeat, fd7f62d — discoverability and factual refresh.**
      Title now carries both years; original slug and Sep 2 publication
      date retained, updated Sep 13. Official project photo series verified
      on oregonkingtides.net: Nov 23–27 / Dec 22–26, 2026 and Jan 20–24,
      2027, distinct from four NOAA peak-high rows and twenty qualifying
      low-window rows. Corrected after-sunset labeling (19/20; Port Orford
      Jan 21 is the exception), unsupported access/arrival claims and
      calendar promises. Added a contextual inbound path from the top-5
      click-earning agate guide; strengthened the national guide's existing
      link. Nav-only source dates unchanged. Shared guide attribution now
      specifies tide heights/times, not every date/number on the page.
      **Do not start the proposed retitle/conversion experiment:** exact
      GSC inspection Sep 13 reports Discovered – currently not indexed,
      no last crawl. Query+page data for Aug 14–Sep 11 sends all seven
      revealed Oregon king-tide queries (137 impressions / 1 click) to
      the NATIONAL guide, not this regional URL; the Oregon minus-tide
      calendar's 9 clicks are a different page. First measure discovery /
      crawl status in the normal weekly review. Indexing success and any
      search uplift remain unverified; the page has no established target
      query rate from which to forecast a 100-impression verdict date.
- [x] 2026-07-04: Weekly regional roundup format LAUNCHED — inaugural instance
      is the time-sensitive West Coast Jul 11–14 run
      (content/articles/west-coast-minus-tides-july-11-14-2026.md), triggered by
      priority (b) (coast-wide 90+ within 14 days). Recurring going forward:
      refresh weekly with the highest-scoring upcoming region; doubles as the
      future newsletter body.
- [x] 2026-07-05: Monterey / Pacific Grove station guide LAUNCHED
      (content/articles/pacific-grove-tide-pools-2026.md) — covers Point Pinos,
      Asilomar, Lovers Point; dawn/dusk split; 3 no-take MPAs verified via CDFW.
- [x] 2026-07-07: Port Townsend / Fort Worden station guide LAUNCHED
      (content/articles/port-townsend-fort-worden-tide-pools-2026.md) — NOAA
      9444900; timed to the Jul 11–16 Exceptional run (Sat/Sun 100, Mon/Tue
      −3.48 ft year-deepest); Discover Pass + Fort Worden access via parks.wa.gov,
      etiquette via NPS, gumboot-chiton claim web-verified. First of the WA
      station guides toward the "Best tide pools in WA" hub.
- [x] 2026-07-09: La Push station guide LAUNCHED
      (content/articles/la-push-second-beach-tide-pools-2026.md) — NOAA 9442396,
      timed to the Jul 12–17 Exceptional run (deepest daylight low of the year
      −3.00 ft Tue Jul 14). PIVOTED the on-the-ground focus to **Second Beach**
      (0.7-mi trail off La Push Road, open) because **Rialto Beach /
      Hole-in-the-Wall is CLOSED via Mora Road Jul 8–Oct 15, 2026** (NPS
      construction; verbatim quote from the nps.gov/olym conditions page, verified
      at write time). Article leads with a cited closure advisory so the
      "hole in the wall rialto beach low tide" searcher gets the fact they need.
      2nd WA station guide toward the "Best tide pools in WA" hub (needs ≥3; next
      WA guide is Seattle/Alki). See reliability note below to revisit after the
      closure lifts.
- [x] 2026-07-12: Seattle / Alki + Constellation Park station guide LAUNCHED
      (content/articles/seattle-alki-constellation-park-tide-pools-2026.md) —
      NOAA 9447130, timed to the Jul 12–16 Exceptional run (year-deepest daylight
      low −3.80 ft Tue Jul 14). Constellation Park access + "below 2 ft / eelgrass
      below 1 ft" best-tide-level cited to the Seattle Aquarium one-pager; Beach
      Naturalist program (Lincoln Park Jul 13) and marine reserve cited. Led on
      the Puget Sound midday-lows differentiator vs the outer-coast dawn lows.
      **3rd WA station guide → the "Best tide pools in WA" hub is now unlockable.**
- [x] 2026-07-16: Charleston / Sunset Bay + Cape Arago station guide LAUNCHED
      (content/articles/sunset-bay-cape-arago-tide-pools-2026.md) — NOAA 9432780,
      published on the day of the year's only remaining Exceptional window
      (−2.00 ft, 8:22 AM, score 90). Angles: deepest-vs-usable (Dec 24 −2.05 ft
      lands after dark), Aug 11–14 last dawn run, 8-of-10 iNat species are sea
      slugs. Parks quotes verbatim from stateparks.oregon.gov; North Cove
      seal-pup closure (Mar 1–Jun 30, reopened Jul 1) and Simpson Reef NWR
      access rules cited. 2nd OR station guide (with Haystack Rock).
- [x] 2026-07-17: Newport / Yaquina Head + Otter Rock station guide LAUNCHED
      (content/articles/yaquina-head-otter-rock-tide-pools-2026.md) — NOAA
      9435380, published on the month's best window (−1.66 ft, 9:15 AM,
      score 88, the year's only fully-daylight deep window). Angles: Aug 12 vs
      Dec 23 deepest-low photo finish (0.003 ft), Yaquina Head 8 AM gate math
      vs Otter Rock dawn access, all-10-nudibranch iNat top ten. BLM +
      state parks + ODFW marine reserve claims quoted verbatim. 3rd OR station
      guide — **OR hub now unlockable (earliest 07-19 per velocity cap).**
- [x] 2026-07-14: **"Best Tide Pools in Washington 2026" hub LAUNCHED**
      (content/articles/best-tide-pools-washington-2026.md, regional-calendars) —
      groups the 3 WA station guides (Port Townsend + La Push + Seattle) around the
      Jul 14–17 year-deepest run and the propagation lag that staggers the same low
      ~4h from La Push (−3.00 ft, 7:15 AM) to Seattle (−3.80 ft, 11:20 AM). NPS
      Rialto/Mora closure re-verified verbatim; routes to Second Beach. First
      state hub; pattern proven.
- [x] 2026-07-15: **"Best Tide Pools in California 2026" hub LAUNCHED**
      (content/articles/best-tide-pools-california-2026.md, regional-calendars)
      — groups the 5 CA guides across 4 stations around the upside-down-calendar
      angle: year-deepest daylight lows at ALL FOUR stations land Christmas Eve
      Dec 24 (−1.83 to −1.90 ft, afternoon), vs dawn minus tides in July; plus
      the south→north ~80-min lag and the Cabrillo/Fitzgerald gate flip.
      featuredRoundup on /beaches/ca/ through Jul 17. Second state hub.
- [x] 2026-07-19: **"Best Tide Pools in Oregon 2026" hub LAUNCHED**
      (content/articles/best-tide-pools-oregon-2026.md, regional-calendars) —
      groups the 3 OR guides (Haystack Rock + Newport + Charleston) around the
      Aug 11-14 last-deep-dawn-run (all four OR stations peak Aug 12,
      south→north lag 45 min) and the king-season depth staircase (−2.21 ft
      Port Orford → −1.66 ft Garibaldi) whose summer/winter crossover lands at
      Newport by 0.003 ft. featuredRoundup on /beaches/or/ through Aug 14.
      Third state hub; ME still needs ≥2 more guides (only Acadia). Port
      Orford is now the only OR station without a guide — noted in the hub.
- [x] 2026-07-21: **Port Orford station guide LAUNCHED — OR set complete (4/4)**
      (content/articles/port-orford-tide-pools-2026.md) — NOAA 9431647, the
      inversion station: winter beats summer by 0.47 ft (−2.21 ft Dec 24 vs
      −1.74 ft Aug 12, Oregon's biggest margin), Jan 21 2027 is the coast's
      only Great-band king window, Aug 11–14 last dawn run. Redfish Rocks
      no-take + Battle Rock/Tseriadun/Paradise Point access quoted verbatim
      from verified sources. Species section honestly frames the 2-observation
      iNat record as an under-observed shore. OR hub link updated.
- [x] 2026-08-01: August monthly-calendar batch DONE (commit ad32a5b) —
      "2026-09" added to PUBLISHED_MONTHS; gate passed via GSC (month pages
      indexed + clicking; Bing site: is captcha-walled to fetches now, GSC is
      the better signal anyway). 12 pages live, IndexNow 108 URLs HTTP 200.
      Next rollover: 2026-10 on Sep 1, same GSC gate. DONE 2026-08-31 (one
      day early, in the owner review pass — gate was already judged passed
      08-30; PUBLISHED_MONTHS moved to src/lib/published-months.json, the
      shared source of truth). Next rollover: 2026-11 on Oct 1.
- [x] 2026-07-26: "Sneaker waves explained" LAUNCHED
      (content/articles/what-is-a-sneaker-wave.md, tide-basics) — NWS/Oregon
      State Parks/NPS safety strictly verbatim-quoted (re-verified at write
      time); causes section from Li et al. 2023 (NHESS) + OSU release
      (infragravity waves, far-off storms, the 20-second spacing signal);
      tied to tide math via the dawn/dusk histogram (115 of 414 daylight
      minus tides in the 5–7 AM hours) and the Aug 12 outer-coast table.
      Beach Hazards Statement product specifics CUT (no clean official
      definition page verifiable) — kept a neutral weather.gov pointer.
- [x] 2026-09-02 **King tides 2027** — `king tides 2027` (25 impr, pos 7.4),
      `king tides 2026 2027` (43, 6.7), `king tides 2026` (38, 8.3): retitled
      the existing guide to carry both years explicitly and folded the
      12-station season table into it (the `/king-tides/2026-2027/` hub is now a
      301 to the guide — it had 1 click at pos 11.9 and was cannibalizing).
- [x] 2026-09-02 **King tides Oregon 2027** — `king tides oregon 2027` (22, 7.2),
      `king tides 2027 oregon coast` (19, 6.9), `oregon king tides 2027` (9,
      8.8), `king tides oregon coast 2027` (9, 7.2; the cluster's only click):
      `/guides/king-tides-oregon-2027/`, highs + daylight lows at all four OR
      stations, featured on the OR hub through 12-25.
- [x] 2026-09-04 **King tides Washington 2026/27** LAUNCHED
      (`/guides/king-tides-washington-2027/`) — targeted `king tides
      washington 2026` (51 impr, pos 6.6, 1 click, biggest revealed query).
      Highs + king-season daylight lows at all three WA stations from fact
      sheets; the honest "Puget Sound's deep lows are at night" half (Seattle
      + PT: zero daylight windows Nov-Dec) with La Push as the winter
      exception; WA King Tides Program (Washington Sea Grant / MyCoast)
      verified at write time. Featured on /beaches/wa/ through 12-28; linked
      from the national guide's Seattle section.
- [x] 2026-09-06 **"Best time to go tide pooling" LAUNCHED** (5cc8321,
      `/guides/best-time-to-go-tide-pooling/`, tide-basics) — answer-first
      page for the seven-query cluster at pos 51-62 that had been matching
      how-low-does-the-tide-need-to-be. Hour histogram (548 daylight minus
      windows Jul–Dec, 44% at 4–8 AM vs 33% at 2–6 PM, scope corrected in
      0070618 after excluding 11 June 30 backfill windows) plus the monthly
      AM-share flip table (93% Jul → 2% Oct → 0% Nov/Dec; the lone Oct AM
      window is Port Townsend Oct 5) computed 2026-09-06 from data-json;
      Puget Sound midday + East Coast semidiurnal exceptions; all-four-CA
      Christmas Eve fact; NPS Acadia 1.5-hour quote re-verified at write
      time. Judge on GSC position for the cluster ~10-06. NOTE: monthly
      table is Jul–Dec 2026 — roll or re-frame at the 2027 January refresh.
      Original spec: time of year by coast, time of day, arrive-an-hour-early
      rule. Slug: best-time-to-go-tide-pooling.
- [x] 2026-09-05 **Fitzgerald "tide chart" refresh DONE** — by refresh day the
      cluster had grown to the property's biggest flywheel target (~79 impr:
      `fitzgerald marine reserve tide chart` 62 @ 8.9, `… tide schedule` 6 @
      9.7, `… tide table` 5 @ 15.8, `jv fitzgerald …` 4 @ 10.5). Title now
      leads with "Tide Chart 2026"; added a full September daily H/L chart +
      Sep–Dec monthly summary (all generated programmatically from data-json),
      rolled the stale August answer box/tables forward (15-row best-remaining
      table with posted-hours math; Dec 23 corrected −1.86→−1.85 per current
      predictions; Dec daylight-minus count 14→15), species re-pulled, SMC
      hours ladder re-verified at write time, new tide-table FAQ. Judge on
      GSC clicks+position ~10-01. NOTE: the September chart goes stale Oct 1 —
      roll the chart section forward at the October refresh pass.
      Original item: guide earned 20 clicks but ranked 8.8-15.5 for the
      chart/schedule/table cluster; add monthly H/L chart + retitle.
- [x] 2026-09-08: **Constellation Park cluster (Seattle guide refresh)** DONE
      (8442c37) — retitled to "Constellation Park Tide Pools 2026: Seattle &
      Alki Point Low-Tide Guide"; new spine is the Sep 8–10 last daylight
      minus-tide run of 2026 (deepest −1.02 ft Tue Sep 8; verified zero
      daylight minus tides after Sep 10 through year-end), July 12–16 kept
      as record, 2027 return dates added (Feb 15 dusk → Mar 13–14 Good →
      Apr 10–11 first Exceptional → May 7–9 deep run), species list rolled
      to current iNat 60d, naturalist season past tense (re-verified page:
      2026 dates ran May–Jul). 22 script assertions vs committed data.
      Judge title change on GSC clicks+position ~10-01 (baseline: cluster
      11+3+2 impressions, pos ~10, 0 clicks on 2026-09-05).
      Original item: `constellation park tide pools` (11 impr, pos 10.1),
      `low tide constellation park` (3, 11.3), `constellation park low
      tide` (2, 10.0) per GSC 28d on 2026-09-05; title led with
      "Seattle / Alki"; also next-oldest in the §2e queue (vintage 07-12).
- [x] 2026-09-09 **Puget Sound tide chart 2026 DONE** (0bfaa9d) — retitled to
      "Puget Sound Tide Chart 2026: Seattle & Port Townsend Low-Tide
      Calendar"; added remaining-September daily H/L charts for both
      stations (from data-json tides), an Oct–Dec deepest-low-at-night
      table, and a 2027 return ladder (PT Jan 17 / Seattle Feb 15 / first
      Exceptional weekend Apr 10–11; deepest daylight low in dataset Jul 4
      −3.93 ft, matching Dec 24 2026's night record to the hundredth).
      Rolled the Labor Day lead to season close; corrected July monthly
      counts to the repaired fact-range contract (Seattle 24/20, PT 25/21;
      sums now 53 windows / 128 lows / 41%, 33-of-39 = 85%). 135 script
      assertions vs committed data. Judge on GSC clicks+position ~10-07
      (baseline: cluster 15 impr, pos 11.9, 1 click on 2026-09-08).
      NOTE: the September charts go stale Oct 1 — roll both chart sections
      forward at the October refresh pass, alongside Fitzgerald's.
      **Superseded Sep 19 heartbeat:** October added with September history
      retained; next chart roll ~Nov 1. Above 128/41% historical snapshot
      is superseded by current facts: 126 / ≈42%. The Sep 19 freshness
      changes share this page's attribution; do not isolate the title's
      effect at the Oct 7 readout or waive §5's sample floor.
      Original item: `puget sound tide chart 2026` (10 impr, pos 12.1,
      1 click — 10% CTR when shown; GSC 28d 2026-09-05). Give
      puget-sound-low-tide-calendar-2026 the Fitzgerald treatment: "tide
      chart" into the title plus a monthly H/L chart section generated from
      seattle-wa / port-townsend-wa data-json. Refresh, not a new page.
- [x] **Acadia tide chart / schedule** — `acadia tide chart` (pos 19.0) and
      `acadia tide schedule` (pos 16.0) surfaced in GSC 28d on 2026-09-05;
      same intent as the long-noted flywheel query `acadia national park tide
      schedule` (pos 19, 2026-07-24), unblocked since the pipeline stores H/L
      extremes (2026-08-30). Refresh acadia-tide-pools-bar-island-ship-harbor
      with a Bar Harbor (8413320) monthly H/L chart section and Bar Island
      crossing framing; weigh "tide chart" in the title against the current
      title's ranking. Refresh, not a new page.
      **09-20 heartbeat: inline-chart/freshness portion DONE.** Added the
      complete Sep 20–Oct 31 Bar Harbor H/L chart (42 dates / 163 extremes)
      from current facts; replaced the passed Sep 11 lead with Sep 27,
      preserving the historical eight-window comparison. Whole-month
      Nov/Dec below-1-ft counts corrected to 38/42; species and official
      NPS guidance rechecked. Title/slug/original date/gates retained; no
      title experiment. GSC Aug 22–Sep 18: 7 clicks / 779 impressions /
      0.90% CTR / position 7.53; production Regular 7d: 7 PV / 7 IDs.
      This closes the remaining inline-table assignment below. Revisit
      the dated lead after Sep 27; chart rollover due Nov 1. No causal
      SEO or conversion result claimed at publication.
      **09-09 heartbeat: freshness/safety portion DONE (b2a7792).** Replaced
      August-as-upcoming with eight Sep/Oct fact-sheet lows and whole-month
      Sep–Dec totals; original title/slug retained. Removed unsupported
      no-stranding/identical-local-timing claims and crossing-clearance
      implications; NPS quotes reverified. Complete daily H/L tables are
      linked on the September/October calendar pages, not duplicated inline.
      The originally requested inline full H/L chart remains unimplemented;
      keep this item open. Article tide values stay within current fact sheets.
      Baseline: guide 4 pv/7d in production Regular traffic; GSC 28d guide
      4 clicks/498 impressions/pos 7.7; two chart/schedule queries 1 impression
      each, pos 19/16. Build, 18 fact tests, 55 content/source checks and live
      deployment passed. Roll the dated near-term lead after Sep 13.
- [ ] Winter 2026-27 seasonal preview (Nov): daylight afternoon lows arrive.
- [x] **2026-09-10 CA hub refresh DONE (8b53e98)** —
      `best-tide-pools-california-2026`: replaced July-as-upcoming with
      Sep 27 / Oct 25 comparisons, whole-month Sep–Dec daylight-minus
      counts, and rechecked Dec 22–25 lows. Explicit July–December scope
      and 30-minute daylight-overlap threshold; northern Christmas Eve
      lows are after sunset, not daylight at low water. Current official
      Cabrillo/Fitzgerald hours and holiday closures replace unrestricted
      access claims. Original title/slug/publish date and gates retained;
      stale July featuredRoundup removed. Build, 18 fact tests, 120 checks,
      20 internal links, 10 official sources, Vercel and live browser passed.
      Production Regular baseline: 0 pv in the preceding 7d. Roll the
      near-term September lead after Sep 27; do not expand beyond the
      fact-sheet date scope without new data.
- [ ] **Sunset Bay refresh** — existing refresh-queue candidate below,
      `sunset-bay-cape-arago-tide-pools-2026` (07-16). This is writable now;
      roll the passed August lead and recheck official park access guidance.
- [ ] Refresh-pass queue (priority e, not additions): choose the next oldest
      exposed guide after the completed California pass. Next-oldest
      explicit candidate by vintage: Sunset Bay (07-16).
      Sep 20 heartbeat: PT chart (operator), Puget roll (Sep 19 heartbeat),
      and Acadia inline H/L are complete. **Two ready-now assignments
      remain: Seattle low-tides-2026 equity and Sunset Bay.** Refill under
      §2a at the next run's start; do not duplicate completed chart/title
      work. Sep 21 weekly indexing batch is also due after higher priorities.
      Sep 19: §2a refill done — **five ready-now assignments: PT tide chart
      equity, Seattle low-tides-2026 equity, Puget October chart roll,
      Acadia inline H/L, Sunset Bay.** The generic refresh queue is still
      not a separate assignment and November's preview is not writable this
      week.
      Sep 18: operator completed Port Townsend and heartbeat completed La Push.
      The generic refresh queue is not a third assignment and November's
      preview is not writable this week. Section 2a demand-led refill is the
      next run's first priority; do not duplicate shipped title/chart work.
      Sep 17 heartbeat completed the Oregon calendar assignment; four
      ready-now items remain (Port Townsend, La Push, Acadia and Sunset Bay).
      Done 2026-09-10 heartbeat (8b53e98): CA hub (07-15) — see its
      checked item above. Sep 15 heartbeat added three specific post-run
      refresh assignments above; five ready-now P1 items now remain.
      Done 2026-09-08 heartbeat (2e2a55c): WA hub (07-14) refreshed to
      Sep 9–12 station-specific times and autumn daylight limits; July/August
      retained as past comparisons with July–December scope, not full-year
      records. NPS closure rechecked; Second Beach parking fee corrected.
      Build + 18 fact tests + 62 content/link checks passed; Vercel and live
      page verified. Roll its dated September lead after Sep 12 alongside
      La Push. Related-guide cards still expose old August framing from
      best-tide-pools-oregon-2026 and west-coast-minus-tides-july-11-14-2026;
      inspect those source descriptions during later refresh passes.
      Done 2026-09-08 (8442c37): seattle-alki (07-12) refreshed — see the
      checked Constellation Park item above for details.
      Done 2026-09-07 (second session, 2000e19): oregon-coast-minus-tide-
      calendar-2026 rolled past Aug 29 — the answer box, both dated FAQ
      answers, the August section, and the weekend section now lead with
      the Sep 9–12 last-morning run (deepest Wed Sep 9 Newport −0.95 ft
      5:39 AM; Sat Sep 12 last weekend morning, Garibaldi/Newport grazing
      the line) and hand off to the Oct 25 / Nov 22 / Dec dusk story
      already in the tables. Aug 29 preserved as record. All 10 shipped
      numbers script-asserted against 09-07 public/data-json, including
      "no AM daylight minus tide after Sep 12" across all four stations.
      Monthly tables verified still current — no changes needed there.
      Original NOTE: stale since ~Aug 30; it still sold Sat Aug 29 as
      "the best window still ahead" (last rolled 08-21; top-8 click
      earner, 8 clicks/28d).
      Done 2026-09-01: la-push-second-beach-tide-pools-2026 (e2a4b26) —
      rolled to the Sep 9–12 last-morning-minus-tide run (verified against
      the dataset: no AM daylight-minus windows remain after Sep 12 in
      2026); July/Aug preserved as record; Rialto closure re-verified and
      the NPS quote updated to the page's current wording (closure language
      stays until Oct 15); NPS trail figures corrected; species re-pulled;
      Mar 23–26 2027 return pointer; finder/month-page/Puget pathways.
      Done 2026-08-31: port-townsend-fort-worden-tide-pools-2026 (f99a545) —
      rolled to the Sep 5–10 Labor Day run (year's last; Mon Sep 7 −1.11 ft
      Great 80), July 11–16 preserved as record, species re-pulled, after-Sep
      darkness quantified, dead www.parks.wa.gov source host fixed →
      parks.wa.gov, North Beach adjacency cited to Jefferson County.
      Done 2026-08-30: pacific-grove-tide-pools-2026 — rolled the lead and
      ranked tables through Dec 2026, refreshed the iNaturalist snapshot,
      rechecked NOAA/CDFW/California State Parks sources, and added direct
      pathways into the finder, Trip Picker, calendars, and Monterey chart.
      Done 2026-08-25: cabrillo-tide-pools-2026 (df090e5) — July/Aug dawn
      lows retired to record (07-03 stamps preserved; rolling window can't
      recompute them), ranked table now the six remaining usable dates
      (Nov 24 −1.36 ft 3:09 PM added; Dec 26 after-close near-miss row),
      new Sep–Dec month-cadence table (Nov's and Dec's best windows both
      land on the two park-closed holidays), species note honestly rolled
      (sea hares out of the 60d log, Pismo clams in), all five external
      sources re-fetched and claims re-verified, July month link → Sep.
      Done 2026-08-23: puget-sound-low-tide-calendar-2026 FULL
      roll-forward (64160c4) — answer box, description, first table,
      FAQs, weekend section, station comparison, and closing now lead
      with the Sep 5–10 Labor Day run (PT −1.11 ft Labor Day, Great 80;
      Seattle −1.02 ft Sep 8; the year's last run, a Puget-Sound-only
      event — outer-coast lows land pre-dawn). July/Aug preserved as
      record with honest stamps; run-link now targets the 2026-09
      month page.
      Done 2026-08-21: oregon-coast-minus-tide-calendar-2026 second pass
      (43e04e8) — rolled past the Aug 11–14 run (page was still selling
      it as upcoming a week after it ended, at #2 traffic 26 pv/7d;
      picked over cabrillo on exposure). Now leads with Sat Aug 29
      (best remaining 2026 weekend window), Oct 25, Nov 22 Port Orford
      dusk, plus next-Great pointers (Jan 21 2027 Port Orford; coast-wide
      May 7–9 2027).
      Done 2026-08-18: la-jolla-tide-pools-best-dates-2026 (9d347c2) —
      ranked table now the remaining Nov–Dec afternoon lows (July run
      retired to record-book note), month table Sep–Dec + honest
      partial-August line, Oct 10–12 zero-line stretch and Oct 25
      opener as near-term guidance, species re-pulled (Hamann's Aeolid
      new #1, 111 obs), FAQs rest-of-2026, July month links → Sep
      calendar. Picked over cabrillo: it's the king-tides guide's
      default gate station (top page, 54 pv/7d).
      Done 2026-08-11: fitzgerald-marine-reserve (0463709) — July table
      replaced by rest-of-2026 inside-posted-hours table (Aug 11-14 run
      vs the 8 AM gate; Oct 25 / Nov 24 / Dec 23 afternoon windows);
      SMC close schedule re-verified (four-step ladder); FAQs to
      rest-of-2026; species re-tallied.
      Done 2026-08-10: pillar-point-tide-pools-2026 (af4719a) — best-8
      table rolled to the Aug 11–14 last-dawn-run + Sep dusk pivot,
      July retired to record-book caption, partial-Aug month row,
      Nov 22–27 preview, species re-pulled (Heath's Dorid in).
      Done 2026-08-08: puget-sound-low-tide-calendar-2026 (b025d62).
      Done 2026-08-04: oregon-coast-minus-tide-calendar-2026 (123e903) —
      answer box/FAQ/weekend section now lead with Aug 11–14; July preserved
      as history; Sat Aug 15 flagged as 2026's best remaining weekend window;
      verified no Great-band daylight window after Aug 14. NOTE 2026-08-02:
      what-is-a-minus-tide was listed here but is NOT actually stale — its
      tables are calendar-2026 aggregate constants (940 minus tides / 535
      daylight etc.), no passed dates; the "Computed 2026-07-03" stamps stay
      honest, and the annual counts can no longer be recomputed anyway (the
      rolling data-json window starts at today). Done so far:
      how-to-read-a-tide-table 2026-07-27, Haystack Rock 2026-07-28 (234a8b6),
      how-to-plan-a-tidepooling-trip 2026-07-29 (64c12ae),
      golden-hour-low-tide-photography-calendar 2026-08-02 (all 24 windows
      were passed July dates → rewritten to the Aug 10-13 last-dawn-run story;
      Rialto/Mora closure advisory added; north-vs-south light split is the
      new angle).

## P2 — product

- [x] 2026-09-13 **Prediction-versus-route-access vocabulary audit — DONE
      with a scoped verdict** (commit c1a02bd). Audited Finder, Trip
      Picker, tide-curve labels and methodology together. Shipped: a
      shared PredictionCaveat line rendered with results in both tools
      ("predictions say when the water is low, not whether a beach,
      trail, or shore is open or reachable — check the land manager")
      plus a matching Honest Limitations bullet on /methodology/.
      Deliberately KEPT "walkable" and "arrive by": they are the site's
      defined terms, documented in /methodology/ and used on ~20
      surfaces (home, hubs, station pages, ICS, newsletter); renaming
      them only in tools would fragment vocabulary, and a site-wide
      rename is a large churn with no demonstrated reader harm. The
      defect the Glass Beach incident exposed was undisclosed access
      implications, now disclosed at point of use. Reopen only if a
      reader report shows the retained terms still mislead.
      Original item follows. ~~Finder and Trip Picker still label the
      shared +1-ft threshold "walkable" and emit generic "arrive by" /
      "be on the beach by" instructions. These are calculations, not
      verified clearance or walking-time rules for every listed spot.
      Audit the shared labels, curve accessible names and methodology
      together; use neutral threshold/window language and preserve the
      underlying predictions. Apply the new §4 claim gates before
      shipping. The Glass Beach article correction did not change tool
      code or certify other guides.~~

- [x] 2026-09-02 **CLOSED — unmeasurable at current traffic** (largest gate
      source is 9 clicks in 26 days against a 30-event floor; §5 new rule).
      Gates stay; they are the calendar-feed path. Original item follows.
      ~~**Judge the 2026-08-07 article_gate experiment** (~08-21, or once
      station-guide uniques post-change reach ~100 — tiny-n rule applies).
      All 13 station-guide articles now end in the station's CalendarGate
      (source `article_gate`) instead of the generic signup (commit
      a2e2377). Baseline 7d at ship: 27 pv / 27 uniques across the 13
      guides, 0 calendar_gate_clicked (any source), 0 signups. Query
      calendar_gate_clicked + newsletter_signup + ics_url_revealed by
      `source` in PostHog. If article_gate outperforms, consider the same
      treatment for regional-calendars articles (multi-station — would
      need a different design). UPDATE 2026-08-12: that multi-station
      design SHIPPED early on the king-tides guide only (commit 8491e72,
      f-pass — the page is 35% of traffic; see JOURNAL) as
      `MultiStationGate` + `gateStations` frontmatter, source
      **article_gate_multi** so this readout stays clean. At the ~08-21
      readout, tally article_gate_multi separately (baseline at ship:
      69 pv/7d on the page, 0 gate events any source); if it converts,
      extend gateStations to the state hubs / other regional-calendars
      articles. UPDATE 2026-08-14: month pages now also carry an
      EmailSignup with source **month_page** plus plan-a-visit links
      (commit c7d676c, f-pass — month pages are the GSC click landers);
      tally month_page separately at the readout (baseline at ship:
      seattle 2026-08 was the top month page at 8 pv/7d).
      UPDATE 2026-08-21: readout ran — ALL THREE ARMS EXTENDED per the
      §5 tiny-n rule: article_gate 52 uniques since ship / 0-0-0 in
      production (yesterday's "1 click" was localhost verification
      noise — host-filter gate queries); article_gate_multi 57 uniques
      since 08-12 with one full 1/1/1 chain; month_page 0 signups.
      Re-tally at ~100 post-ship uniques per surface (multi likely
      first, ~08-28). UPDATE 2026-08-22: a fifth arm exists — the new
      /calendars/ hub (commit 634f5b6) runs CalendarGate with source
      **calendars_page** (baseline at ship: 0 events, page brand-new);
      tally it separately alongside the others.
      UPDATE 2026-08-30: **article_gate_multi readout ran at floor**
      (106 uniques since 08-12, 1/1/1 chain — the site's only
      article-surface signup; not separable from article_gate's 0/96,
      but strictly better-targeted than the generic end_article signup
      it replaces). Treatment EXTENDED (commit 57c5c22): gateStations
      added to the 3 state hubs + oregon-coast-minus-tide-calendar +
      puget-sound-low-tide-calendar; measure per-pathname so king-tides
      stays clean. Remaining arms all extended (below floor):
      article_gate 96 uniques 1/0/0, calendars_page 4 uniques,
      month_page 0 signups. FOLLOW-UP later 2026-08-30: article_gate
      crossed the surface floor at 102 uniques with 2 clicks / 0 reveals /
      0 signups. Only two click events still means no defensible treatment
      change; extend and re-tally after meaningful click volume. The newly
      extended multi-gate surfaces remain below floor.

- [x] 2026-08-05: **07-19 CTR retitle JUDGED — qualified win, titles stay**
      (see JOURNAL 2026-08-05). Site CTR 1.66%→1.94%, month pages 0→~12
      clicks (seattle-08 1.6%, pt-08 3.6%, la-push-08 2.0%), king-tides
      4.3%, Acadia 2.3% @ ~8. Still 0%: pillar-point 0/129 and la-jolla
      2026-08 0/128 — but query drill-down shows intent mismatch (NOAA
      highs+lows table seekers / fully-anonymized queries), NOT title
      weakness → routed to the high/low-pairs item below; no re-retitle.
      Finder landing (07-22): 0/49 @ 41.5, still junk-dominated, <100
      impr → tiny-n window extended to ~08-19. UPDATE 2026-08-20:
      re-check ran — /tools/tide-window-finder/ now returns zero rows
      in GSC pages 28d (baseline was 67 impr @ ~52). No verdict at
      n=0; no re-title. The ZIP→nearest-station lookup (P3) is the
      more plausible lever for this surface.
- [x] 2026-07-22: /tools/tide-window-finder/ landing copy DONE (commit
      386e4e6) — intent-bearing title/H1 ("Find the next low tide near
      you"), three sections below the tool linking depth explainers,
      methodology, all 4 state hubs, and sibling tools. Baseline to judge
      against in ~2 weeks: 67 impr / pos ~52 / 0 clicks (GSC 07-19).
- [x] 2026-08-30: **Full high/low tide sequence published.** "high tide acadia"
      / "acadia high tide time" queries had landed on our
      low-only pages at pos 20–45 (GSC 07-19). At the time, highs weren't in
      fact sheets or pages, so the pipeline decision came before new copy.
      ALSO (2026-07-24): the windows dataset
      only carries lows below ~+1.0 ft (77 of ~400 days have no entry at Bar
      Harbor), so a full "Bar Island crossing schedule" page is equally
      blocked; the same pipeline decision unblocks both, plus the flywheel
      query "acadia national park tide schedule" (pos 19, GSC 07-24).
      MORE EVIDENCE (2026-08-05, retitle post-mortem): pillar-point's only
      visible GSC queries post-retitle hunt NOAA annual tide-table PDFs for
      station 9414131 (highs+lows) — the cluster's 0/129 CTR looks like
      this same lows-only intent gap, not titles. Three query families now
      pointed at one fix. The NOAA pipeline now stores daily H/L extremes;
      station pages expose the next seven days and every published month page
      includes a complete high-and-low table. Metadata now names that intent.
- [x] 2026-07-05: iNat taxa filter DONE — terrestrial strays (Garden Snail,
      Pacific Banana Slug, land Helicidae, woodlice) excluded by ancestry.
      scripts/pipeline/species.mjs owns fetchSpecies + a TERRESTRIAL_CLADE_IDS
      ancestor-id blocklist (Stylommatophora, Insecta, Arachnida, Myriapoda,
      Entognatha/Collembola, Oniscidea); over-fetches per_page=30 then filters to
      top 10. scripts/pipeline/refresh-species.mjs re-ran the 12 stations from
      stored lat/lng (species-only diff, no NOAA churn). Verified Garden Snail
      gone from Seattle; marine sea slugs (incl. Hopkins' Rose) retained.
- [ ] NDBC buoy swell for 7-day conditions row (spec §4f full version).
- [x] 2026-08-30: ZIP → nearest-station lookup for the finder — generated
      static table from the official 2025 Census ZCTA Gazetteer; lookup and
      distance math run locally in the browser and analytics never receive the
      submitted ZIP.
- [x] 2026-08-30: Per-station OG images — generated 1200×630 PNGs with station
      name, next-window fact, and mini annual heatmap during every build.
- [x] 2026-08-30: **Article/guide `og:image` coverage completed.** (Discovered
      2026-07-14 while
      auditing the favicon). The root `app/opengraph-image.tsx` covers the
      homepage, but nested `/guides/[slug]` pages inherit no og:image in the
      static export, and `/opengraph-image` itself 308-redirects. Add a
      per-article (or at least a stable site-wide) og:image so social shares and
      article rich-result thumbnails have an image. Pairs with the per-station
      OG-image item above. NB: Article JSON-LD `image` was intentionally left
      unset until the real image landed; it now references each generated guide
      card, matching Open Graph and Twitter metadata.
- [x] 2026-07-05: Featured-roundup slot on /beaches/[state] hubs DONE — data
      driven from article frontmatter (new optional `featuredRoundup: {states,
      event, until, teaser}`; getActiveRoundup() in src/lib/content.ts). Renders a
      kelp-accented .roundup-card under the answer-box only while `until` >= build
      date, so it clears itself on the daily rebuild after the event. The West
      Coast Jul 11-14 roundup now surfaces on wa/or/ca hubs and is absent from me.
- [x] 2026-07-27: **OWNER-DIRECTED exit-intent signup SHIPPED** (commit
      bf8f73b) — desktop pointers only (hover+fine media query), real
      top-edge exits only, 2nd pageview or later (tw_pageviews localStorage
      counter), once per visitor ever (tw_exit_prompt cap), suppressed while
      any inline .signup-box is in viewport (without burning the cap) and
      for visitors with a prior local signup; dismiss via close button,
      Escape, or backdrop click; copy matches "Sent every Thursday".
      Signups go through the shared EmailSignup with **source:
      "exit-intent"** (NB: the measurable property on newsletter_signup is
      `source`, not `form` — existing inline forms already use it) and a
      capped `exit_intent_shown` event records prompt impressions. All six
      behavior gates verified in-browser against the built site;
      exit_intent_shown verified landing in PostHog (from localhost —
      host-filtered out of production metrics).
- [x] 2026-09-02 **CLOSED — unmeasurable at current traffic** (playbook §5, new
      rule: a verdict date is never extended twice). Surface left as is; it
      costs nothing. Original item follows.
      ~~**~2026-09-21 (extended 2026-08-24, before that 08-10): judge the
      exit-intent prompt** — at 08-24 check-in: 25 impressions all-time,
      0 signups — still below the §5 ~100-impression floor, extended
      again per the tiny-n rule (re-check at ~100 impressions or ~09-21;
      accrual rate is ~6/week). At 08-10: 12 impressions, 0 signups.
      Original spec: in PostHog compare
      `exit_intent_shown` count vs `newsletter_signup` where
      source="exit-intent" (host-filtered) over the first 2 weeks. If
      impressions accumulate with zero signups, revisit copy; if it
      converts, consider extending eligibility (e.g. 1st pageview).
      **PRE-REGISTERED DECISION (owner review 2026-08-31): hard deadline
      2026-10-01 — if still <100 impressions by then, RETIRE the prompt
      instead of extending again.** Rationale: desktop-pointer-only by
      design while 44% of traffic is mobile, and ~6 impressions/week can
      never reach the floor in useful time; the ZIP pathways shipped
      2026-08-31 serve the same intent on every device.
- [ ] "Tidepooling 101 in 5 days" email course content (ships with Resend).
- [ ] **2026-10-01 exit-intent owner deadline:** the experiment remains
      closed-unmeasurable, but the 08-31 owner instruction above still calls
      for retiring the prompt if it has fewer than 100 impressions on Oct 1.
      Reconcile that surface-removal instruction at the deadline; do not
      silently treat the 09-02 experiment closure as cancellation or restart
      the experiment. No prompt change made in the 09-08 heartbeat.
- [ ] Print stylesheet polish for month pages (page-break rules).
- [ ] 2-4 new stations: Crescent City CA (9419750), Westport WA (9441102),
      Woods Hole MA (8447930), Crystal River FL? — verify ids + tidepool
      relevance first; prefer harmonic.

## P2 — infra / reliability (discovered 2026-07-03)

- [x] **2026-09-07: fact-sheet date scope fixed and regression-gated (6bca506).**
      Shared `fact-range.mjs` now filters station/coast aggregates to the
      inclusive Jul 1–Dec 31 station-local range. All 16 fact files expose
      `range_2026`; notes explicitly say this is not a full-year record.
      Original 09-06 discovery: `date.startsWith("2026")` included the
      pipeline's intentional June 30 timezone slack, yielding 559 west-coast
      daylight minus windows versus 548 in the monthly sheets. Corrected
      global = 548; total minus tides = 953 (was 964). The best-time guide
      had already been corrected separately in 0070618.
      `npm run test:facts` now runs 18 boundary/station/coast/regional checks
      automatically after every build; prebuild regenerates fact sheets
      from the current dataset. Regression demonstrated 559 !== 548 before
      the fix, then passed on committed and fresh NOAA data. Full
      `PIPELINE_REFRESH=1 npm run build` passed in an isolated copy, so the
      operator's public data/ICS/badges and today's editorial work stayed
      untouched. When expanding the reporting period, change the explicit
      range, monthly fields, and boundary expectations together.

- [ ] **Validate production exception instrumentation before reporting a zero.**
      The 2026-09-04 PostHog project check says exception autocapture / Error
      Tracking is not enabled, while the shipped SDK config has
      `capture_exceptions: true`; `$exception` exists in the event taxonomy but
      has not been seen in the last 30 days, and the active issue list is empty.
      That is instrumentation-uncertain, not a proven observed zero. Use one
      controlled production exception tagged as Automation (or first confirm
      the project-level Error Tracking setting) and verify that it lands before
      restoring exception counts to the health report. Do not pollute Regular
      traffic or infer health from the empty issues view in the meantime.
      **Sep 14 read-only evidence:** production Regular pageviews in the
      trailing seven days report `$exception_capture_enabled_server_side`
      false on 62 events, missing on 266, true on none. Project opt-in is
      null; no `$exception` seen in 30 days. This supports disabled remote
      capture where reported, not a production zero-error conclusion.
      No setting change or synthetic production exception was made.
      **Sep 15 read-only follow-up:** 63 Regular production pageviews report
      remote capture false, 273 omit the property, none report true (7d to
      17:15:33Z). Project opt-in remains null and active issues are empty;
      the instrumentation caveat remains, with no settings change.

- [x] **2026-09-05 CLOSED — production LCP recovered with a real sample.**
      **09-06 measurement correction:** the 63 below counted all
      `$web_vitals` events, not 63 LCP observations, so the asserted sample
      floor was not established. Exact trailing 24h to 09-06 21:34:22Z is
      p75 1,680 ms on 13 events with a nonnegative LCP value (production
      host + Regular traffic). No persistent slowdown demonstrated; keep
      tuning paused and count only LCP-bearing events for future readouts.
      **09-10 heartbeat:** latest 24h p90 5,630.4ms on 27 actual LCP-bearing
      events. This is not a p75 comparison or a demonstrated regression;
      below the 30-observation floor. Monitor the long tail with consistent
      percentiles before profiling or changing code.
      The recheck reached p75 844 ms across 63 `$web_vitals` events in the
      latest 24h, comfortably below the 2.5s intervention threshold and above
      the planned ~30-sample floor. The 09-03 spike did not persist; no code
      change is warranted. Original watch item follows. The 09-03 heartbeat
      measured p75 3.84s across 44 `$web_vitals` events/24h versus 0.73s on 32
      events the prior day. Slow slices were Port Townsend 6.93s (n=2), Seattle
      5.51s (n=5), methodology 4.60s (n=4), calendars 3.36s (n=2), and trip
      picker 3.40s (n=2), while the two highest-traffic guides remained ~0.68s
      and a live-browser route sweep produced no warnings/errors. Do not tune
      on these tiny per-route samples. If station-page LCP stays above 2.5s
      with ~30+ samples, profile the station payload/font/render path before
      changing code.

- [x] 2026-09-02 **Sitemap `lastmod` told the truth for 57 of 121 URLs** — the
      other 64 (all beach/tool/hub/static pages) carried the daily refresh
      timestamp regardless of change; Google discounts an unreliable lastmod.
      Now: real-change pages keep the refresh stamp, articles/index/categories
      use frontmatter dates, finished months keep month-end, everything else
      omits it (src/app/sitemap.ts).
- [x] 2026-09-02 **NOAA station id out of station `<title>`** (kept in
      description and body) — pillar-point-ca: 924 impr / 0 clicks, every
      revealed query NOAA-metadata for 2025. Judge on clicks+position ~09-30.
- [x] 2026-09-02 **Related-guides block on every article** (4 links: same
      category first) — 15 guides were "Discovered – currently not indexed";
      sibling links from indexed guides are the crawl-priority lever we own.
- [x] 2026-09-02 `gsc-query.mjs inspect [n]` — URL Inspection API sample of
      sitemap coverage state; first run: 2 of 6 never crawled, 1 unknown.
- [ ] **~2026-09-30: re-run `inspect 60`** and compare against the 08-27
      baseline (58 indexed / 55 not; 50 never crawled). If the never-crawled
      share has not moved, next lever is consolidating the thinnest month
      pages (Seattle 2026-10 has 2 daylight windows; Port Townsend 2026-10
      has 3) into their station page rather than noindexing — no month page
      is actually empty (audit correction: "0 daylight minus tides" was the
      stricter metric; every month still has daylight windows under +1.0 ft).
- [ ] **~2026-10-01: judge the 09-17 month-page retitle** (`{Station} Tide
      Chart, {Month Year}: Low Tide Times and Daylight Windows`) on clicks and
      position, baselines in JOURNAL 2026-09-17 (bar-harbor-me 2026-09 5 /
      952 / pos 7.7; seattle-wa 2026-08 5 / 956 / 7.4). Same run: confirm
      `/guides/king-tides-washington-2027/` and `/guides/king-tides-oregon-2027/`
      moved off "Discovered – never crawled" after the 09-17 national-guide
      by-state pointer; if not, the next lever is the Sep 21 inspect finding.

- [x] 2026-08-31: **Past-month pages fixed — they had been publishing wrong
      numbers** (owner review pass). The rolling windows dataset had dropped
      July/August, so every published past-month page said "0 low tides"
      (July pages wrong since ~Aug 1; seattle 2026-08 was 1,291 GSC impr/28d).
      Pipeline now backfills windows to the earliest month in
      published-months.json (past windows stored curve-less to hold file size);
      ended months render an archival banner + past tense and keep real
      numbers; ICS/index.json/calendars/trip-picker got explicit forward
      floors so no surface regresses to past windows. Guarded forever by the
      new **postbuild gate `scripts/verify-output.mjs`** (rendered numbers
      vs data, no retro ICS events, sitemap↔out parity) which runs locally,
      in the cron, and on Vercel. Cron drift also mitigated: 4 staggered
      schedule slots (04:47/07:17/10:17/13:47Z) + skip guard, so a refresh
      should land before the agent session without manual dispatch — watch
      the first few days.
- [ ] **~2026-10-05: read the Sep 11 national king-tides schedule refresh**
      (`36aebb1`) on GSC query/page/date data. Baseline: page 39 clicks /
      1,829 impressions / position 6.9 over 28d; bare-2026 target cluster
      ~140 impressions (head query 81 / 9.6 / 0 clicks; predictions
      20 / 8.1, PDF variant 16 / 8.8, singular king tide 15 / 14.3).
      ~140/28 = 5 impressions/day; 100-impression floor takes ~20 days,
      within the 60-day limit. Wait for at least 100 new target-cluster
      impressions, account for GSC lag, and compare clicks/position—not
      site-wide CTR or PostHog referrer views. This is an observational
      content/title refresh, not a randomized test or an isolated title
      effect. One extension maximum; retire as unmeasurable if needed.
      The old gated-signup experiment remains closed.
      **Sep 14:** the same guide gained a print utility, with title, tables
      and article dates unchanged. Include this concurrent surface change in
      the Oct 5 observational readout; no isolated print/conversion test began.
- [x] **2026-09-14: read the 2026-08-30/31 search+conversion pass on GSC
      date-dimension data** (tiny-n rules apply). Baselines at ship
      (GSC 28d to 08-29): site CTR ~1.3%, clicks ~3-5/day, impressions
      300-500/day; pillar-point station page 0 clicks / 897 impr;
      la-jolla 2026-08 month page 0 / 837; seattle 2026-08 10 / 1291.
      Things shipped against them: full H/L tables + metadata (08-30),
      past-month integrity + archival forward-routing (08-31), ZIP
      pathways (08-31). Also tally the new PostHog sources:
      zip_lookup_used tool=home/guide_footer (result=redirected),
      station_selected selection_method=zip, and signups by source.
      **Attribution note: before 2026-08-31, month-page and station-page
      CalendarGates reported source=tool_gate** (no prop passed) — the
      "tool_gate = finder" readouts in earlier journal entries conflate
      those surfaces. From 08-31 they report month_gate / station_gate;
      segment all gate readouts at that date.
      **Completed Sep 14 heartbeat, observational/no isolated gain established.**
      Equal 12-day date windows (Aug 18–29 vs Sep 1–12; exclude both change
      days): site 54→102 clicks, 4,220→6,426 impressions, position 8.73→7.43.
      Pillar Point station 0→0 clicks / 359→558 impressions / 7.75→7.74;
      La Jolla August 0→0 / 407→34 / 7.35→8.65 (post period below floor);
      Seattle August 5→0 / 582→267 / 7.37→7.04. Ended-month seasonality,
      Sept 2 retitles, new content and crawl links confound attribution.
      Keep the factual fixes and ZIP utility; don't claim the package caused
      the site-wide rise or judge the low-sample La Jolla page. Since Sep 1
      00:00 EDT: home ZIP redirects 14, guide-footer redirects 1, Finder ZIP
      matches 26 / misses 1, ZIP station selections 26; four signups (tool_gate
      3, end_article_gated 1) are too few for a conversion verdict. The already
      retired signup variants remain closed; Sept 30 indexing/title and Oct 5
      national-query readouts remain separate.
- [x] 2026-09-02 **CLOSED — unmeasurable at current traffic** (needs ~100+
      pv on one page; the site does ~7 signups per 28 days). Signup stays.
      Original item follows.
      ~~**~2026-09-16: judge the 09-02 end_article_gated signup on the
      king-tides guide** (tiny-n rules apply; needs ~100+ pv on the page
      since 09-02). Baselines at ship: guide 124 pv since 08-12 with
      article_gate_multi 1 click / 1 signup all-time; site signups÷uniques
      0.47% (1/214) trailing 7d vs 1.5% target. Compare newsletter_signup
      source=end_article_gated against the gate's continued readout; if
      both stay near zero at real volume the article-end surface itself is
      the suspect, not the component.

- [x] 2026-08-30: **Next.js August security release applied** — upgraded
      `next` + `eslint-config-next` from 16.2.10 to 16.3.3 after the official
      08-25 release and a production audit flagged the pinned version. Build
      green on 16.3.3, 122/122 pages. Production-only audit dropped from
      6 findings (5 high, 1 moderate) to 2 transitive findings; direct Next.js
      and bundled sharp findings cleared.
- [x] 2026-08-30: Residual audit findings cleared — removed gray-matter and its
      old js-yaml chain in favor of a narrow YAML frontmatter parser, upgraded
      PostHog/sharp directly, then applied npm's reviewed three-package
      transitive fix. Both full and production-only audits report zero findings.

- [ ] TIME-BOMB: **Rialto Beach / Hole-in-the-Wall closed Jul 8–Oct 15, 2026**
      (NPS Mora Road construction — verified 2026-07-09 on nps.gov/olym
      conditions). The La Push guide (la-push-second-beach-tide-pools-2026.md)
      routes readers to Second Beach and states this closure verbatim. AFTER
      ~Oct 15: re-check the NPS conditions page; if reopened, refresh the La Push
      guide and shared station metadata to restore Rialto/Hole-in-the-Wall only
      if access is confirmed (and drop or soften the advisory). Until then, do
      NOT publish any content directing readers to Rialto Beach.
      **2026-08-27 interim fix:** removed Rialto/Hole-in-the-Wall from the shared
      La Push `spots` and blurb in scripts/pipeline/stations.mjs, then regenerated
      committed data/ICS/fact outputs. Finder, beach, and calendar surfaces now
      lead with Second Beach and Third Beach; the post-Oct-15 recheck remains.
- [x] 2026-08-14: gh CLI auth WORKING again (`gh run list` + `gh issue list`
      both succeed, no 401) — owner appears to have re-authed; item closed.
      (Was: token invalid since 2026-07-25, operator used the public API.)
- [x] 2026-08-30: `npm run lint` is green. Fixed the pre-existing
      react-hooks/set-state-in-effect
      error (src/components/tools-shared.tsx:25 — setData inside useEffect cache
      hit) by deriving cache/loading state without a synchronous effect write;
      generated worktrees/stubs are excluded from the lint surface.
- [x] 2026-08-30: CI Node deprecation cleared in source — Actions log had warned
      actions/checkout, setup-node,
      upload-pages-artifact, upload-artifact, deploy-pages target Node 20 (forced
      to 24). Workflow refs now use the official current majors: checkout v7,
      setup-node v7, upload-pages-artifact v5, and deploy-pages v5.
- [x] 2026-07-18: Deploys now build from committed data (commit 4365733) —
      done as the fix for the day's service-wide NOAA predictions outage, which
      failed the cron and would have failed any Vercel deploy. Plain builds use
      committed public/data-json; only PIPELINE_REFRESH=1 (the cron) fetches
      NOAA. The cron also retries 6x over ~100 min through upstream blips.
      `.pipeline-stamp` gating removed. Local builds no longer churn data files.

## P3 — distribution

- [ ] Quarterly dataset #2 (Oct 2026): "Weekend Window Scarcity Index" — share of
      Exceptional windows that land on weekends, by station.
- [ ] Submit site to relevant directories (tool directories, dark-sky-style
      hobby lists, awesome-lists) — only genuinely relevant ones, no spam.
      2026-08-26: FIRST submission — PR to chrisleaman/awesome-coastal
      (USA section; intertidal-fieldwork framing; owner account, no
      personas): https://github.com/chrisleaman/awesome-coastal/pull/64 —
      MERGED 2026-08-28 08:20Z ("Thank you for the suggestion!") — first
      live external listing; watch PostHog referrers for github.com.
      Channel note: GitHub-PR-based lists are the only directory type an
      autonomous run can submit to (no account creation / third-party
      forms); other candidates surveyed 08-26 were poor fits
      (open-sustainable-technology, awesome-open-geoscience: software/
      research focus; awesome-marine-hacking: dead since 2018). Directories
      needing accounts/forms → owner task, note in JOURNAL if one looks
      high-value.
- [x] 2026-08-09: Badge outreach page DONE (priority-f pass #2 of the week) —
      /embed/ now carries the full "for websites" pitch: what-it-shows /
      stays-current / costs-nothing cards, who-it-fits, honest fine print
      (verified against the actual badge HTML: static iframe, no cookies, one
      per-load ping with station + referrer domain and no visitor identifier),
      station-request CTA to /contact/, calendar cross-link. Inbound only, per
      this item's rule.
- [ ] Reddit/forum participation is OUT OF SCOPE for the agent (authenticity
      rule) — note for the owner instead in JOURNAL if opportunities appear.

## Done

- [x] 2026-07-02: Launch build — 12 stations, 4 tools, 20 articles, embed
      badges, ICS feeds, dataset #1, daily refresh cron, IndexNow.
