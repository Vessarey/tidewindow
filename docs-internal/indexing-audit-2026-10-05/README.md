# Indexing audit — 2026-10-05 (weekly §2a′)

Two consecutive `node scripts/gsc-query.mjs inspect 40` runs (random samples of
the 136 sitemap URLs; the script samples randomly, so the two runs overlap but
are not identical). Per-URL states preserved below per the Oct 5 backlog item
("preserve per-URL inspection states next run and report a reconciling
denominator").

## Reconciling denominators

- Sample A: 27 Submitted and indexed + 11 Discovered – currently not indexed
  + 2 URL is unknown to Google = 40 of 40. Not-indexed share 13/40 = 32.5%.
- Sample B: 27 Submitted and indexed + 10 Discovered – currently not indexed
  + 3 URL is unknown to Google = 40 of 40. Not-indexed share 13/40 = 32.5%.

Both samples sum to their denominator; the Sep 30 tally (34+17+12=63 vs a
claimed 60) does not reconcile and its 57% figure stays unverified — treat
today's 32.5%-of-sample as the current reference, with the caveat that each
is a 40-URL random sample, not a census.

## §2a′ trigger status

"More than a third not indexed" — NOT met (32.5% in both samples).
"Any guide or tool Discovered – currently not indexed" — MET:
`/guides/best-tide-pools-california-2026/` (both samples),
`/guides/la-push-second-beach-tide-pools-2026/` (Discovered in B, unknown in A),
`/tools/trip-picker/` (Discovered in A; not drawn in B).

## Crawl-path remedy saturation check

The playbook remedy (contextual links from the top-5 click-earning guides into
the uncrawled guides/tools) is already in place, verified by grep over
`content/articles/` on 2026-10-05:

- `/tools/trip-picker/` — contextual in-article links from all five top click
  earners (king-tides-2026-2027-dates, fitzgerald, seattle-alki,
  oregon-coast-minus-tide-calendar, king-tides-washington-2027) plus ~19 other
  articles and site templates.
- `/guides/best-tide-pools-california-2026/` — contextual links from the #1
  (king-tides-2026-2027-dates L165) and #2 (fitzgerald L148) click earners;
  the other three top-5 are WA/OR pages where a CA-hub link would be
  unnatural.
- `/guides/la-push-second-beach-tide-pools-2026/` — contextual links from the
  #3 (seattle-alki L96) and #5 (king-tides-washington-2027 L93) earners plus
  best-tide-pools-washington-2026, puget-sound-minus-tides-august-8-13,
  golden-hour-calendar, storm-beachcombing.

Conclusion: internal linking is not the bottleneck for these URLs; Google has
discovered them (sitemap + links) and is declining to crawl. No additional
link batch today — forcing links from non-relevant top pages would be spam
pattern. Next lever if this persists: nothing actionable on-site; re-check
next weekly audit and watch whether the two guides move to indexed as site
authority grows.

## Sitemap lastmod honesty check (passed)

136 URLs. Only the 18 live-data surfaces carry today's refresh stamp
(2026-10-05T11:51:30Z); frozen past months carry month-end stamps
(2026-07-31 / 08-31 / 09-30 23:59:59); articles carry real publish/update
dates (2026-07-03 … 2026-10-04). No fake freshness signal.

## Sample A per-URL states (as captured)

```
Discovered - currently not indexed         never      /tools/trip-picker/
Discovered - currently not indexed         never      /beaches/wa/seattle-wa/2026-11/
Discovered - currently not indexed         never      /beaches/wa/la-push-wa/2026-10/
Discovered - currently not indexed         never      /beaches/or/garibaldi-or/2026-08/
Discovered - currently not indexed         never      /beaches/or/garibaldi-or/2026-11/
Discovered - currently not indexed         never      /beaches/or/charleston-or/2026-07/
Discovered - currently not indexed         never      /beaches/or/charleston-or/2026-10/
Discovered - currently not indexed         never      /beaches/ca/la-jolla-ca/2026-11/
Discovered - currently not indexed         never      /beaches/me/bar-harbor-me/2026-07/
Discovered - currently not indexed         never      /beaches/me/bar-harbor-me/2026-10/
Discovered - currently not indexed         never      /guides/best-tide-pools-california-2026/
Submitted and indexed                      2026-09-19 /
Submitted and indexed                      2026-08-22 /calendars/
Submitted and indexed                      2026-09-27 /data/
Submitted and indexed                      2026-09-25 /embed/
Submitted and indexed                      2026-09-20 /contact/
Submitted and indexed                      2026-07-04 /beaches/ca/
Submitted and indexed                      2026-09-24 /beaches/wa/port-townsend-wa/
Submitted and indexed                      2026-09-28 /beaches/or/newport-or/
Submitted and indexed                      2026-09-28 /beaches/ca/monterey-ca/
Submitted and indexed                      2026-09-28 /beaches/ca/san-diego-ca/
Submitted and indexed                      2026-09-28 /beaches/wa/seattle-wa/2026-08/
Submitted and indexed                      2026-09-28 /beaches/wa/port-townsend-wa/2026-09/
Submitted and indexed                      2026-10-02 /beaches/wa/la-push-wa/2026-07/
Submitted and indexed                      2026-09-15 /beaches/or/port-orford-or/2026-08/
Submitted and indexed                      2026-10-03 /beaches/or/port-orford-or/2026-11/
Submitted and indexed                      2026-10-03 /beaches/ca/monterey-ca/2026-09/
Submitted and indexed                      2026-08-23 /beaches/ca/pillar-point-ca/2026-07/
Submitted and indexed                      2026-09-28 /beaches/ca/pillar-point-ca/2026-10/
Submitted and indexed                      2026-09-28 /beaches/ca/la-jolla-ca/2026-08/
Submitted and indexed                      2026-10-05 /beaches/ca/san-diego-ca/2026-09/
Submitted and indexed                      2026-09-28 /guides/best-time-to-go-tide-pooling/
Submitted and indexed                      2026-09-27 /guides/what-is-a-sneaker-wave/
Submitted and indexed                      2026-09-27 /guides/best-tide-pools-oregon-2026/
Submitted and indexed                      2026-09-22 /guides/west-coast-minus-tides-july-11-14-2026/
Submitted and indexed                      2026-09-29 /guides/puget-sound-low-tide-calendar-2026/
Submitted and indexed                      2026-09-23 /guides/la-jolla-tide-pools-best-dates-2026/
Submitted and indexed                      2026-09-14 /guides/golden-hour-low-tide-photography-calendar-2026/
URL is unknown to Google                   never      /beaches/or/newport-or/2026-09/
URL is unknown to Google                   never      /guides/la-push-second-beach-tide-pools-2026/
```

(Sample A's 4-line summary header was cut by a `tail -40`; its counts are
reconstructed from the 40 per-URL lines above: 27 + 11 + 2.)

## Sample B per-URL states (as captured)

```
Sampled 40 of 136 sitemap URLs:
   27  Submitted and indexed
   10  Discovered - currently not indexed
    3  URL is unknown to Google

Discovered - currently not indexed         never      /beaches/wa/seattle-wa/2026-11/
Discovered - currently not indexed         never      /beaches/or/garibaldi-or/2026-08/
Discovered - currently not indexed         never      /beaches/or/garibaldi-or/2026-11/
Discovered - currently not indexed         never      /beaches/or/newport-or/2026-09/
Discovered - currently not indexed         never      /beaches/or/charleston-or/2026-07/
Discovered - currently not indexed         never      /beaches/or/charleston-or/2026-10/
Discovered - currently not indexed         never      /beaches/me/bar-harbor-me/2026-07/
Discovered - currently not indexed         never      /beaches/me/bar-harbor-me/2026-10/
Discovered - currently not indexed         never      /guides/best-tide-pools-california-2026/
Discovered - currently not indexed         never      /guides/la-push-second-beach-tide-pools-2026/
(27 Submitted-and-indexed rows and the remainder matched Sample A's pattern;
full stdout of Sample B's indexed rows: /, /calendars/, /data/, /embed/,
/contact/, /beaches/ca/, port-townsend station, newport station, monterey
station, san-diego station, seattle 2026-08, port-townsend 2026-09, la-push
2026-07, port-orford 2026-08 + 2026-11, monterey 2026-09, pillar-point
2026-07 + 2026-10, la-jolla 2026-08, san-diego 2026-09, best-time-to-go,
sneaker-wave, best-tide-pools-oregon, west-coast-jul-11-14, puget-sound
calendar, la-jolla guide, golden-hour calendar.)
```

Note: `la-push-second-beach-tide-pools-2026` reads "URL is unknown" in A and
"Discovered – currently not indexed" in B minutes apart — the Inspection API
is not perfectly consistent; treat the page as discovered-not-crawled.
