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
- [ ] NEWSLETTER GO-LIVE — pipeline CODE DONE 2026-07-05; sending blocked only
      on real signups + owner copy review (runbook:
      docs-internal/resend-newsletter.md):
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
      3) [ ] First issue: owner reviews rendered copy (CURRENT draft:
         newsletter-drafts/2026-07-18-minus-tide-alert.html), record approval
         in JOURNAL, run send-weekly.mjs --send --owner-reviewed; then update
         EmailSignup blurbs + /newsletter/ page from "starting this season" to
         live. Signup gate CLEARED 2026-07-18: first organic signup landed
         (07-17, /beaches/ca/ via Google); audience synced, 1 contact. Now
         blocked ONLY on owner copy review — re-check every run.
      4) [ ] Add weekly cadence note to JOURNAL template (send day: Thursday).
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
- [ ] August 2026 monthly-calendar batch: add "2026-09" to PUBLISHED_MONTHS on
      Aug 1 rollover per staged-rollout rule (2026-08 already published).
- [ ] "Sneaker waves explained" (quote NWS verbatim; safety-framed, non-YMYL).
- [ ] Winter 2026-27 seasonal preview (Nov): daylight afternoon lows arrive.

## P2 — product

- [ ] **2026-08-05: judge the 07-19 CTR retitle** against the GSC baseline
      (31 clicks / 1.84K impr / 1.7% / pos 10.7; pillar-point pages 394 impr,
      0 clicks; beach/month pages 0% at pos 5–8). Compare per-page CTR, not
      aggregate (movie-piracy junk queries pollute the aggregate). Do NOT
      iterate titles before this date — recrawl needs 1–2 weeks.
- [ ] /tools/tide-window-finder/ ranks pos ~52 on 67 impr/28d (GSC 07-19) —
      the landing copy targets no query; add intent-bearing H1/intro
      ("find the next low tide / minus tide near you") + internal links.
- [ ] "high tide acadia" / "acadia high tide time" queries land on our
      low-only pages at pos 20–45 (GSC 07-19) — highs aren't in fact sheets
      or pages; decide whether the pipeline should publish daily high/low
      pairs before writing anything.
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
- [ ] Exit-intent signup (desktop only, frequency-capped, 2nd pageview+).
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
      readers to Rialto Beach.
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
- [ ] Badge outreach page: a short "for websites" pitch on /embed/ aimed at
      park friends-groups and surf shops (no cold outreach — inbound only).
- [ ] Reddit/forum participation is OUT OF SCOPE for the agent (authenticity
      rule) — note for the owner instead in JOURNAL if opportunities appear.

## Done

- [x] 2026-07-02: Launch build — 12 stations, 4 tools, 20 articles, embed
      badges, ICS feeds, dataset #1, daily refresh cron, IndexNow.
