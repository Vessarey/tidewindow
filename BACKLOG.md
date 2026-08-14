# Backlog

Prioritized queue for the daily agent. One primary item per run. Check items off
with the date; add discoveries at the appropriate tier.

## P0 — unblockers

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
      Next rollover: 2026-10 on Sep 1, same GSC gate.
- [x] 2026-07-26: "Sneaker waves explained" LAUNCHED
      (content/articles/what-is-a-sneaker-wave.md, tide-basics) — NWS/Oregon
      State Parks/NPS safety strictly verbatim-quoted (re-verified at write
      time); causes section from Li et al. 2023 (NHESS) + OSU release
      (infragravity waves, far-off storms, the 20-second spacing signal);
      tied to tide math via the dawn/dusk histogram (115 of 414 daylight
      minus tides in the 5–7 AM hours) and the Aug 12 outer-coast table.
      Beach Hazards Statement product specifics CUT (no clean official
      definition page verifiable) — kept a neutral weather.gov pointer.
- [ ] Winter 2026-27 seasonal preview (Nov): daylight afternoon lows arrive.
- [ ] Refresh-pass queue (priority e, not additions): next candidates are
      the remaining two 07-03 CA guides — cabrillo, la-jolla — then
      pacific-grove (07-05).
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

- [ ] **Judge the 2026-08-07 article_gate experiment** (~08-21, or once
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

- [x] 2026-08-05: **07-19 CTR retitle JUDGED — qualified win, titles stay**
      (see JOURNAL 2026-08-05). Site CTR 1.66%→1.94%, month pages 0→~12
      clicks (seattle-08 1.6%, pt-08 3.6%, la-push-08 2.0%), king-tides
      4.3%, Acadia 2.3% @ ~8. Still 0%: pillar-point 0/129 and la-jolla
      2026-08 0/128 — but query drill-down shows intent mismatch (NOAA
      highs+lows table seekers / fully-anonymized queries), NOT title
      weakness → routed to the high/low-pairs item below; no re-retitle.
      Finder landing (07-22): 0/49 @ 41.5, still junk-dominated, <100
      impr → tiny-n window extended to ~08-19.
- [x] 2026-07-22: /tools/tide-window-finder/ landing copy DONE (commit
      386e4e6) — intent-bearing title/H1 ("Find the next low tide near
      you"), three sections below the tool linking depth explainers,
      methodology, all 4 state hubs, and sibling tools. Baseline to judge
      against in ~2 weeks: 67 impr / pos ~52 / 0 clicks (GSC 07-19).
- [ ] "high tide acadia" / "acadia high tide time" queries land on our
      low-only pages at pos 20–45 (GSC 07-19) — highs aren't in fact sheets
      or pages; decide whether the pipeline should publish daily high/low
      pairs before writing anything. ALSO (2026-07-24): the windows dataset
      only carries lows below ~+1.0 ft (77 of ~400 days have no entry at Bar
      Harbor), so a full "Bar Island crossing schedule" page is equally
      blocked; the same pipeline decision unblocks both, plus the flywheel
      query "acadia national park tide schedule" (pos 19, GSC 07-24).
      MORE EVIDENCE (2026-08-05, retitle post-mortem): pillar-point's only
      visible GSC queries post-retitle hunt NOAA annual tide-table PDFs for
      station 9414131 (highs+lows) — the cluster's 0/129 CTR looks like
      this same lows-only intent gap, not titles. Three query families now
      point at one fix; this is the strongest-evidenced P2 product item.
- [x] 2026-07-05: iNat taxa filter DONE — terrestrial strays (Garden Snail,
      Pacific Banana Slug, land Helicidae, woodlice) excluded by ancestry.
      scripts/pipeline/species.mjs owns fetchSpecies + a TERRESTRIAL_CLADE_IDS
      ancestor-id blocklist (Stylommatophora, Insecta, Arachnida, Myriapoda,
      Entognatha/Collembola, Oniscidea); over-fetches per_page=30 then filters to
      top 10. scripts/pipeline/refresh-species.mjs re-ran the 12 stations from
      stored lat/lng (species-only diff, no NOAA churn). Verified Garden Snail
      gone from Seattle; marine sea slugs (incl. Hopkins' Rose) retained.
- [ ] NDBC buoy swell for 7-day conditions row (spec §4f full version).
- [ ] ZIP → nearest-station lookup for the finder (static lookup table).
- [ ] Per-station OG images (station name + mini heatmap via ImageResponse).
- [ ] **Article/guide pages emit NO `og:image`** (discovered 2026-07-14 while
      auditing the favicon). The root `app/opengraph-image.tsx` covers the
      homepage, but nested `/guides/[slug]` pages inherit no og:image in the
      static export, and `/opengraph-image` itself 308-redirects. Add a
      per-article (or at least a stable site-wide) og:image so social shares and
      article rich-result thumbnails have an image. Pairs with the per-station
      OG-image item above. NB: Article JSON-LD `image` was intentionally left
      unset for now (a square logo makes a poor thumbnail) — set it to the real
      OG image when this lands.
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
- [ ] **~2026-08-24 (extended 2026-08-10; was 08-10): judge the
      exit-intent prompt** — at 08-10 check-in: 12 impressions all-time,
      0 signups — below the §5 ~100-impression floor, so the window was
      extended per the tiny-n rule (re-check at ~100 impressions or
      08-24). Original spec: in PostHog compare
      `exit_intent_shown` count vs `newsletter_signup` where
      source="exit-intent" (host-filtered) over the first 2 weeks. If
      impressions accumulate with zero signups, revisit copy; if it
      converts, consider extending eligibility (e.g. 1st pageview).
- [ ] "Tidepooling 101 in 5 days" email course content (ships with Resend).
- [ ] Print stylesheet polish for month pages (page-break rules).
- [ ] 2-4 new stations: Crescent City CA (9419750), Westport WA (9441102),
      Woods Hole MA (8447930), Crystal River FL? — verify ids + tidepool
      relevance first; prefer harmonic.

## P2 — infra / reliability (discovered 2026-07-03)

- [ ] TIME-BOMB: **Rialto Beach / Hole-in-the-Wall closed Jul 8–Oct 15, 2026**
      (NPS Mora Road construction — verified 2026-07-09 on nps.gov/olym
      conditions). The La Push guide (la-push-second-beach-tide-pools-2026.md)
      routes readers to Second Beach and states this closure verbatim. AFTER
      ~Oct 15: re-check the NPS conditions page; if reopened, refresh the La Push
      guide to restore Rialto/Hole-in-the-Wall as the marquee spot (and drop or
      soften the advisory). Until then, do NOT publish any content directing
      readers to Rialto Beach. ALSO (noticed 2026-07-22): the tools' station
      dropdown labels La Push with "Rialto Beach / Hole-in-the-Wall" — the spot
      string lives in scripts/pipeline/stations.mjs and flows into committed
      data-json, so fixing it is a pipeline data change; fold into the same
      post-Oct-15 revisit (or earlier if a reader flags it).
- [x] 2026-08-14: gh CLI auth WORKING again (`gh run list` + `gh issue list`
      both succeed, no 401) — owner appears to have re-authed; item closed.
      (Was: token invalid since 2026-07-25, operator used the public API.)
- [ ] `npm run lint` fails with one pre-existing react-hooks/set-state-in-effect
      error (src/components/tools-shared.tsx:25 — setData inside useEffect cache
      hit; discovered 2026-07-05, present on clean main). Build is unaffected;
      fix by moving the cache read into initial state or useSyncExternalStore.
- [ ] CI Node deprecation: Actions log warns actions/checkout, setup-node,
      upload-pages-artifact, upload-artifact, deploy-pages target Node 20 (forced
      to 24). Non-blocking now; bump to current major versions before GitHub drops
      the Node-20 shim.
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
