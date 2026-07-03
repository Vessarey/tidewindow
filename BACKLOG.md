# Backlog

Prioritized queue for the daily agent. One primary item per run. Check items off
with the date; add discoveries at the appropriate tier.

## P0 — unblockers

- [ ] Verify first Pages deploy serves /tidewindow/ correctly (all assets, ICS, badges).
- [ ] Confirm IndexNow submission returns 200 in the daily-refresh Action logs.
- [ ] PostHog: wire key when available (see AGENT_PLAYBOOK §6), then add a
      JOURNAL metrics-snapshot section template.

## P1 — content queue (one per day max; ≤5/week)

- [ ] Weekly regional roundup format: "This week on the {region} coast" — start
      with the region whose upcoming windows score highest; refresh weekly (this
      doubles as the future newsletter body).
- [ ] Monterey / Pacific Grove station guide article (station exists, no guide).
- [ ] Port Townsend / Fort Worden station guide article.
- [ ] La Push / Rialto Beach + Hole-in-the-Wall station guide article (strong
      query: "hole in the wall rialto beach low tide").
- [ ] Seattle / Alki + Constellation Park station guide article.
- [ ] Charleston / Sunset Bay + Cape Arago station guide article.
- [ ] Newport / Yaquina Head + Otter Rock station guide article.
- [ ] "Best tide pools in {state}" hub articles (OR, WA, CA, ME) once ≥3 station
      guides per state exist.
- [ ] August 2026 monthly-calendar batch: add "2026-09" to PUBLISHED_MONTHS on
      Aug 1 rollover per staged-rollout rule (2026-08 already published).
- [ ] "Sneaker waves explained" (quote NWS verbatim; safety-framed, non-YMYL).
- [ ] Winter 2026-27 seasonal preview (Nov): daylight afternoon lows arrive.

## P2 — product

- [ ] iNat taxa filter: land species occasionally slip in (e.g. Garden Snail at
      Seattle). Constrain to marine taxa ids or filter terrestrial families in
      the pipeline.
- [ ] NDBC buoy swell for 7-day conditions row (spec §4f full version).
- [ ] ZIP → nearest-station lookup for the finder (static lookup table).
- [ ] Per-station OG images (station name + mini heatmap via ImageResponse).
- [ ] Exit-intent signup (desktop only, frequency-capped, 2nd pageview+).
- [ ] "Tidepooling 101 in 5 days" email course content (ships with Resend).
- [ ] Print stylesheet polish for month pages (page-break rules).
- [ ] 2-4 new stations: Crescent City CA (9419750), Westport WA (9441102),
      Woods Hole MA (8447930), Crystal River FL? — verify ids + tidepool
      relevance first; prefer harmonic.

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
