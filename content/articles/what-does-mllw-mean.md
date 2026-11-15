---
title: "What Does MLLW Mean on a Tide Table? Mean Lower Low Water, Explained"
description: "MLLW means Mean Lower Low Water, the zero on US tide tables. How NOAA computes it, how far it sits from mean sea level, and what a negative height is not."
date: "2026-11-15"
category: "tide-basics"
tags: ["MLLW", "mean lower low water", "tide datum", "tide basics", "seattle"]
faq:
  - q: "What does MLLW stand for?"
    a: "MLLW stands for Mean Lower Low Water. Per NOAA's datum definitions, it is the average of the lower low water height of each tidal day observed over the National Tidal Datum Epoch, a specific 19-year period — currently 1983 through 2001. It is the zero point that US tide predictions measure heights from, and it is computed separately for each station."
  - q: "Is 0.0 ft MLLW the same as mean sea level?"
    a: "No. Mean sea level (MSL) averages all hourly water levels over the epoch, while MLLW averages only each day's lower low, so MLLW sits below MSL. How far below depends on the station: at NOAA station 9447130 (Seattle), accepted datum values put MSL 6.64 ft above MLLW. A height on a US tide table is measured from MLLW, not from mean sea level."
  - q: "Does a negative tide height mean negative water depth?"
    a: "No. A negative height means the predicted sea surface is below the station's long-run average of daily lower lows — a reference level, not the seafloor. It does not state the depth over any particular rock, which terrain is exposed, or whether a route is open. At Seattle, the November 25, 2026 prediction of −3.844 ft simply means 3.844 ft below that local average; it occurs at 11:11 PM."
  - q: "Why does the datum use the lower low instead of all low tides?"
    a: "Because NOAA describes the US West Coast as tending to have mixed semidiurnal tides: two highs and two lows of unequal height each tidal day. Mean Low Water (MLW) averages all lows; MLLW averages only each day's lower one, so it sits lower. At Seattle the accepted values are 2.83 ft apart, and NOAA lists the station's mean diurnal low water inequality as 2.84 ft."
  - q: "Does MLLW ever change?"
    a: "Yes, by revision rather than drift. NOAA computes datums over the National Tidal Datum Epoch — presently 1983–2001 — and states the epoch is actively considered for revision every 20 to 25 years. Seattle's current accepted datum values date to April 17, 2003. When a new epoch is adopted, published datum values change and the same physical water level gets a slightly different number."
sources:
  - "https://tidesandcurrents.noaa.gov/datum_options.html"
  - "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9447130/datums.json"
  - "https://tidesandcurrents.noaa.gov/stationhome.html?id=9447130"
  - "https://oceanservice.noaa.gov/education/tutorial_tides/tides07_cycles.html"
---

**MLLW means Mean Lower Low Water: the average of each tidal day's lower low tide, computed over the 1983–2001 National Tidal Datum Epoch. It is the zero that US tide predictions measure from — a local reference level, not water depth. At NOAA station 9447130 (Seattle), mean sea level sits 6.64 ft above MLLW, and November 25, 2026 carries two predicted lows almost 12 ft apart: 8.105 ft at 11:06 AM and −3.844 ft at 11:11 PM.**

## The zero on a tide table is an average, not "no water"

Every height on a US tide table is measured from a fixed local reference called a datum. NOAA's [datum definitions](https://tidesandcurrents.noaa.gov/datum_options.html) define MLLW as the average of the lower low water height of each tidal day observed over the National Tidal Datum Epoch — a specific 19-year averaging period, presently 1983 through 2001. The same page names MLLW as the reference datum NOAA uses for predictions and nautical charting.

So 0.0 ft MLLW is not an empty beach or a dry seafloor. It is where the sea surface sits on an *average* day's lower low tide, averaged across 19 years. On any particular day the water can stop well above that mark or dip below it, and the number on the table tells you which — relative to that local average, nothing more.

The word *local* is doing real work. Each station's datums are computed from its own observations, so the distances between them differ from place to place. Here is the accepted ladder at Seattle (NOAA station 9447130, values accepted April 17, 2003, epoch 1983–2001), restated relative to MLLW:

| Datum | Height above MLLW at Seattle |
|---|---|
| MHHW — Mean Higher-High Water | +11.36 ft |
| MHW — Mean High Water | +10.49 ft |
| MSL — Mean Sea Level | +6.64 ft |
| MLW — Mean Low Water | +2.83 ft |
| MLLW — Mean Lower Low Water | 0.00 ft |

*Computed from the station datums NOAA publishes for 9447130 (values on the station datum are 19.3, 18.43, 14.58, 10.77 and 7.94 ft respectively). These are Seattle's values; other stations differ.*

Two of those rows answer the most common confusion directly. A tide-table height is **not** measured from mean sea level — at Seattle, MSL is more than six and a half feet above the tide table's zero. And it is not measured from the average of *all* low tides either; that is MLW, a separate datum 2.83 ft higher.

## Why "lower low"?

NOAA's tide classification describes the US West Coast as tending toward **mixed semidiurnal** tides: two high tides and two low tides of unequal size each tidal day. One of the day's two lows is routinely much lower than the other, and MLLW averages only that lower one.

Wednesday, November 25, 2026 at Seattle shows how unequal "unequal" can get. The day's predicted lows are **8.105 ft at 11:06 AM** and **−3.844 ft at 11:11 PM** — a spread of 11.9 ft between two events that a tide table lists under the same label, *Low*. The morning low barely dips below the day's highs; the night low is the deepest of the month. NOAA quantifies this long-run gap as the mean diurnal low water inequality, which it lists at 2.84 ft for Seattle — and the gap on a spring-tide day like this one runs far wider than that average.

That is why the datum is pinned to the lower low. Averaging all lows would put the zero 2.83 ft higher at this station, and ordinary lower lows would read as negative numbers all year. For how a full day of table rows works — and what a row does not tell you — see the [tide-table walkthrough](/guides/how-to-read-a-tide-table/).

## A negative height is not depth, and not access

A minus sign on a tide table means one thing: the predicted sea surface is below the station's long-run average of daily lower lows. Seattle's −3.844 ft on November 25 is 3.844 ft below that local average. It is not a statement about the depth over any particular rock, which terrain will be exposed, or whether a beach, sandbar or route is passable — the datum is a water-level reference, and [what is exposed at a given height varies by beach](/guides/what-is-a-minus-tide/).

It is also not a statement about what you can see. The deepest predicted lows at Seattle in November and December 2026 all land late at night:

| Date | Lower low (ft MLLW) | Time of low |
|---|---|---|
| Thu, Dec 24 | −3.928 | 10:58 PM |
| Wed, Dec 23 | −3.845 | 10:10 PM |
| Wed, Nov 25 | −3.844 | 11:11 PM |

*The three deepest predicted lows at NOAA station 9447130 across November–December 2026, computed from Tidewindow's November 15 fact sheets. Times are local. Predictions, not observations.*

Stretch the range across the whole October 2026–March 2027 king-tide season and the contrast sharpens: among Seattle's modeled windows with at least 30 minutes of daylight overlap, the deepest low is just **−0.65 ft, on Thursday, March 25, 2027 at 1:45 PM**. The season's deepest lows outright reach nearly −4 ft — close to midnight. The minus sign measures distance below a reference; the clock decides whether anyone sees it. That intersection is what the [Tide Window Finder](/tools/tide-window-finder/) computes per date, and the [Seattle station page](/beaches/wa/seattle-wa/) lists for Alki and Constellation Park, scored as described in the [methodology](/methodology/).

## Does MLLW move?

By revision, not drift. NOAA recomputes datums when it adopts a new National Tidal Datum Epoch, and its datum documentation states the epoch is actively considered for revision every 20 to 25 years. Seattle's accepted values date to April 17, 2003, on the 1983–2001 epoch. When the next epoch is adopted, each station's published datums will shift slightly, and the same physical water level will map to a slightly different tide-table number — one more reminder that the heights are coordinates in a local reference frame, not measurements of the ground beneath the water.
