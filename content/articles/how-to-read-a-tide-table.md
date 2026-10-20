---
title: "How to Read a Tide Table (and What It Won't Tell You)"
description: "What tide-table heights above MLLW mean, why the two daily lows differ, and how one Newport, OR table row becomes a 285-minute modeled window."
date: "2026-07-02"
updated: "2026-10-20"
category: "tide-basics"
tags: ["tide table", "MLLW", "tide basics", "newport oregon", "window score"]
faq:
  - q: "What do the numbers on a tide table mean?"
    a: "Each line is a time and a predicted water height in feet relative to MLLW (Mean Lower Low Water), the average of each day's lower low over a 19-year tidal datum epoch — not water depth. At Newport, OR (NOAA station 9435380), the August 12, 2026 entry of −1.9 ft at 6:46 AM predicted a sea surface about 1.9 feet below that long-run average; it was not an observation."
  - q: "Why are there two low tides of different heights each day?"
    a: "The US West Coast generally has mixed semidiurnal tides: two highs and two lows of unequal size every lunar day. The lower low predicts a lower water level, but does not establish beach access. The datum name says Mean Lower Low Water because it averages each day's lower low."
  - q: "How long does a low tide last on the beach?"
    a: "The listed time marks a predicted minimum, not a visit duration. At Newport, OR (NOAA station 9435380) on August 12, 2026, the −1.913 ft low at 6:46 AM had a modeled interval below +1.0 ft from 4:30 to 9:15 AM — 285 minutes, 179 in daylight. The one-hour-before-low offset was 5:46 AM, before sunrise at 6:15 AM: not a verified arrival time or evidence of beach access."
  - q: "Is the lowest tide always the best day to go?"
    a: "No. At Newport, OR in 2026, August 12 (−1.913 ft at 6:46 AM) and December 23 (−1.91 ft at 5:53 PM) are near-twins on the tide table, but their modeled windows have 179 and 60 daylight minutes respectively. December's low itself is after the 4:39 PM sunset. Across October 20–December 31, December 23 is the deepest low whose modeled window has at least 30 daylight minutes; that overlap does not establish access or daylight at the low."
sources:
  - "https://tidesandcurrents.noaa.gov/datum_options.html"
  - "https://oceanservice.noaa.gov/education/tutorial_tides/tides07_cycles.html"
  - "https://oceanservice.noaa.gov/facts/springtide.html"
  - "https://tidesandcurrents.noaa.gov/stationhome.html?id=9435380"
  - "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9435380.json"
---

**A tide table gives you a predicted time and a height measured from a zero called MLLW, not water depth or beach access. At NOAA station 9435380 (Newport, OR), August 12, 2026's −1.913 ft low at 6:46 AM had a modeled interval below +1.0 ft from 4:30 to 9:15 AM: 285 minutes, only 179 in daylight. Sunrise was 6:15 AM. The interval describes predicted water levels, not when a route is open or when to arrive.**

## What does the height number actually mean?

The feet on a tide table are not water depth. They are the predicted height of the sea surface relative to a fixed local zero called a datum. US tide predictions use **MLLW** — Mean Lower Low Water. NOAA takes each day's lower low tide and averages it over a 19-year span called the National Tidal Datum Epoch, currently 1983 through 2001. That average becomes 0.0 ft.

This sets the intuition everything else hangs on: 0.0 ft is not "no water." It is a long-run average, not a guarantee about any particular day. A positive height is above that mark; a −1.9 ft prediction is nearly two feet *below* it. Neither number tells you the depth over a particular rock or whether a route is passable. In Tidewindow's July–December 2026 data for Newport, the deepest low whose modeled window has at least 30 daylight minutes was July 15's −2.522 ft. For the remaining October 20–December 31 period, the two deepest lows — December 24 at −2.118 ft and November 25 at −2.077 ft — both fall about two hours after sunset, with only 15 and 5 daylight minutes respectively at the start of their modeled windows. The deepest remaining low whose window clears 30 daylight minutes is December 23's −1.91 ft, and it appears again below. Daylight overlap is a filter on the model, not an access assessment.

## Why does the table list two lows a day, and why is one deeper?

Because the US West Coast generally has **mixed semidiurnal** tides: two highs and two lows of different size every lunar day, in NOAA's classification. A Newport tide table typically shows four events per date, and the day's two lows can sit far apart in height. Mean *Lower* Low Water refers to the lower of those lows. Compare both the time and the height: the lower one can fall before sunrise or after sunset. Every individually quoted low in this article is a day's lower low.

The good lows also arrive in runs. Around new and full moons, the sun's pull stacks with the moon's — spring tides, when, as NOAA puts it, "high tides are a little higher and low tides are a little lower than average" — so lows deepen for several consecutive days, then flatten toward the quarter moons. One such run is in the next table.

## How do you read one real row?

Take Wednesday, August 12, 2026 — Newport's deepest August low with at least 30 daylight minutes in its modeled window. The dates have passed, but the row stays here as a worked example. The raw table row said, in effect, *Low — 6:46 AM — −1.9 ft*. Here is what each part means:

- **−1.913 ft.** The predicted minimum is nearly two feet below the long-run average of daily lower lows. This is a water-level prediction, not a measurement of exposed terrain.
- **6:46 AM.** The predicted time of minimum water, reported to the minute — not the start or duration of a visit.
- **What the row doesn't say.** Tidewindow models the interval below +1.0 ft as **4:30 AM to 9:15 AM**: 285 minutes, 179 after sunrise at **6:15 AM**. Its mechanical one-hour-before-low offset is **5:46 AM**, about 29 minutes before sunrise, not a verified arrival time. The low itself is about half an hour after sunrise. Neither the offset nor the interval supplies walking time, a return rule or verified beach access.

Now the run that row sits inside:

| Date | Lower low (ft MLLW) | Time of low | Modeled window below +1.0 ft | Daylight min | Score |
|---|---|---|---|---|---|
| Mon, Aug 10 | −1.374 | 5:10 AM | 2:55–7:40 AM | 87 | 62 |
| Tue, Aug 11 | −1.761 | 6:00 AM | 3:45–8:30 AM | 136 | 78 |
| Wed, Aug 12 | −1.913 | 6:46 AM | 4:30–9:15 AM | 179 | 88 |
| Thu, Aug 13 | −1.788 | 7:28 AM | 5:20–9:50 AM | 213 | 86 |
| Fri, Aug 14 | −1.378 | 8:06 AM | 6:05–10:15 AM | 237 | 83 |
| Sat, Aug 15 | −0.714 | 8:43 AM | 7:00–10:30 AM | 210 | 74 |

*Computed from NOAA station 9435380 (South Beach, Newport, OR) predictions; every numeric cell re-verified 2026-10-20 against Tidewindow's current data, unchanged. Times are local. A modeled interval is not a statement about access.*

Two patterns are visible in this particular run. First, the lows deepen toward the middle and relax after — the shoulder days, August 11 and 13, differ by under three hundredths of a foot. Second, each day's low lands later than the last, by 37 to 50 minutes across these six dates. Those are observations about this table, not universal rules for every station or date. [Newport's August calendar](/beaches/or/newport-or/2026-08/) lists 32 predicted lows below +1.0 ft. The model produces 29 bounded windows around such lows, of which 17 have at least 30 daylight minutes and 13 of those surround minus tides. The raw low count and the modeled-window count are different quantities.

## Why isn't the lowest number automatically the best day?

Because a tide table is silent about the sun. The deepest row of the run above has a near-twin on the December page of the same tide table, and the pair makes the point better than any argument:

| | Wed, Aug 12 | Wed, Dec 23 |
|---|---|---|
| Predicted lower low | −1.913 ft | −1.910 ft |
| Time of low | 6:46 AM | 5:53 PM |
| Modeled window below +1.0 ft | 4:30–9:15 AM | 3:40–8:20 PM |
| Relevant daylight boundary | Sunrise 6:15 AM | Sunset 4:39 PM |
| Daylight minutes in window | 179 | 60 |
| Window Score | 88 | 61 |

*Computed from NOAA station 9435380 (South Beach, Newport, OR) predictions; existing numeric cells re-verified 2026-10-20, unchanged. Sunrise and sunset are computed for the station. All times are local.*

On the tide table these are near-twins; the predicted heights differ by 0.003 ft. Their daylight is very different. The August low is shortly after sunrise, and its modeled interval has 179 daylight minutes. The December interval lasts 280 minutes but only 60 overlap daylight — all at the front end, before the low. The 5:53 PM low is over an hour after the 4:39 PM sunset. Across October 20–December 31, that December 23 row is the deepest low with at least 30 daylight minutes in its modeled window, even though the low itself is after sunset. A qualifying window does not mean a daylight low or an entirely daylight interval.

That is the hidden filter in every tide table: depth and daylight are separate columns, and the table only prints one of them. To read it properly you'd check sunrise and sunset against every candidate row, every time.

## Is the Window Score just a shortcut?

Yes, but it includes preferences as well as tide and daylight calculations. The 0–100 rating has four components: **depth (0–50), daylight overlap (0–30), weekday/weekend/holiday timing (0–10), and regional seasonal comfort (0–10)**. Timing gives Friday 5 points and weekends or US federal holidays 10; seasonal comfort comes from a fixed regional month table, not a weather forecast. Windows with under 30 daylight minutes score zero overall. The [methodology page](/methodology/) publishes the formula and provenance.

In the comparison above, August 12's rounded component points are 48 + 30 + 0 + 10 = **88 ("Great")**; December 23's are 48 + 10 + 0 + 3 = **61 ("Good")**. The displayed component sums match the total for these two examples; the code rounds the total from unrounded components. The difference includes both daylight and the seasonal preference, not just the sun. The score does not establish weather, conditions, opening hours, walking time or access.

The [Tide Window Finder](/tools/tide-window-finder/) compares upcoming modeled windows, the [Trip Picker](/tools/trip-picker/) compares candidate dates, and the [Newport station page](/beaches/or/newport-or/) keeps the running calendar. Treat any displayed arrive-by value as the model's one-hour offset, not a validated instruction for a particular beach.

Read the height against MLLW, compare the low's clock time with sunrise and sunset, and keep those predictions separate from access. A score can summarize its inputs; it cannot supply what they do not measure.
