---
title: "How to Read a Tide Table (and What It Won't Tell You)"
description: "What tide-table heights above MLLW mean, why the two daily lows differ, and how one Newport, OR table row becomes a five-hour beach window."
date: "2026-07-02"
category: "tide-basics"
tags: ["tide table", "MLLW", "tide basics", "newport oregon", "window score"]
faq:
  - q: "What do the numbers on a tide table mean?"
    a: "Each line is a time and a predicted water height in feet relative to MLLW (Mean Lower Low Water), the 19-year average of each day's lowest tide — not water depth. At Newport, OR (NOAA station 9435380), the July 15, 2026 entry of −2.5 ft at 7:50 AM means the sea surface drops about 2.5 feet below that long-run average."
  - q: "Why are there two low tides of different heights each day?"
    a: "The US West Coast has mixed semidiurnal tides: two highs and two lows of unequal size every lunar day. Plan around the lower low — it's the one that exposes ground. The datum name says as much: Mean Lower Low Water averages only the lower of each day's two lows."
  - q: "How long does a low tide last on the beach?"
    a: "The listed time is one minute of minimum water; the walkable stretch is much longer. At Newport, OR (NOAA station 9435380) on July 15, 2026, a −2.522 ft low at 7:50 AM opens a computed window from 5:25 to 10:30 AM — 305 minutes, 285 of them in daylight. Arriving about an hour before the low, 6:50 AM, uses the window best."
  - q: "Is the lowest tide always the best day to go?"
    a: "No. At Newport, OR in 2026, August 12 (−1.913 ft at 6:46 AM) and December 23 (−1.91 ft at 5:53 PM) are near-twins on the tide table, but the August window holds 179 daylight minutes and scores 88 while the December window holds 60 and scores 61. Daylight, not depth, is the usual bottleneck."
sources:
  - "https://tidesandcurrents.noaa.gov/datum_options.html"
  - "https://oceanservice.noaa.gov/education/tutorial_tides/tides07_cycles.html"
  - "https://oceanservice.noaa.gov/facts/springtide.html"
  - "https://tidesandcurrents.noaa.gov/stationhome.html?id=9435380"
  - "https://api.tidesandcurrents.noaa.gov/mdapi/prod/webapi/stations/9435380.json"
---

**A tide table gives you two facts per line: a time and a height measured from a zero called MLLW. Everything you plan around — how long the beach is walkable, whether it's light out — must be computed. At NOAA station 9435380 (Newport, OR), the entry for July 15, 2026 reads −2.5 ft at 7:50 AM. Computed out, that line becomes a five-hour window, 5:25 to 10:30 AM, with 285 daylight minutes.**

## What does the height number actually mean?

The feet on a tide table are not water depth. They are the predicted height of the sea surface relative to a fixed local zero called a datum. US tide predictions use **MLLW** — Mean Lower Low Water. NOAA takes each day's lower low tide and averages it over a 19-year span called the National Tidal Datum Epoch, currently 1983 through 2001. That average becomes 0.0 ft.

This sets the intuition everything else hangs on: 0.0 ft is not "no water." It is an ordinary day's lowest water. A +6 ft high tide means the surface sits six feet above that mark. A −2.5 ft low means the surface drops two and a half feet *below* the average daily minimum, and ground that stays submerged through most low tides gets a few hours of open air. The negative numbers are the ones worth circling. Newport's July 15 low, −2.522 ft, is the deepest daylight low on the station's whole 2026 calendar.

## Why does the table list two lows a day, and why is one deeper?

Because on the US West Coast the tide is **mixed semidiurnal**: two highs and two lows of different size every lunar day, in NOAA's classification. A Newport tide table typically shows four events per date, and the day's two lows can sit far apart in height. The datum already told you which one matters — it is Mean *Lower* Low Water — and so should your plan. The lower low opens ground; the higher low is often barely an event. Every low quoted in this article is a day's lower low.

The good lows also arrive in runs. Around new and full moons, the sun's pull stacks with the moon's — spring tides, when, as NOAA puts it, "high tides are a little higher and low tides are a little lower than average" — so lows deepen for several consecutive days, then flatten toward the quarter moons. One such run is in the next table.

## How do you read one real row?

Take that deepest daylight low of Newport's year: Wednesday, July 15, 2026. The raw table row says, in effect, *Low — 7:50 AM — −2.5 ft*. Standing on the sand at South Beach, here is what each part means:

- **−2.522 ft.** At the bottom of the tide, the surface sits about 2.5 feet below the long-run average of daily lowest tides. Ledges and boulder fields that a 0.0 ft low never uncovers are briefly walkable.
- **7:50 AM.** The single minute of minimum water — not the visit. The tide is low *enough* for a long stretch on either side of it.
- **What the row doesn't say.** Computed against the walkable threshold and the sun, this low opens a window from **5:25 AM to 10:30 AM**: 305 minutes, 285 of them after sunrise. Arrive by **6:50 AM**, an hour ahead of the low, and you follow the water out and walk back in with the flood.

Now the run that row sits inside:

| Date | Lower low (ft MLLW) | Time of low | Walkable window | Daylight min | Score |
|---|---|---|---|---|---|
| Sun, Jul 12 | −1.713 | 5:22 AM | 3:00–8:00 AM | 137 | 87 |
| Mon, Jul 13 | −2.234 | 6:15 AM | 3:50–9:00 AM | 196 | 90 |
| Tue, Jul 14 | −2.517 | 7:04 AM | 4:35–9:50 AM | 246 | 90 |
| Wed, Jul 15 | −2.522 | 7:50 AM | 5:25–10:30 AM | 285 | 90 |
| Thu, Jul 16 | −2.233 | 8:33 AM | 6:15–11:10 AM | 295 | 90 |
| Fri, Jul 17 | −1.664 | 9:15 AM | 7:05–11:35 AM | 270 | 88 |

*Computed 2026-07-03 from NOAA station 9435380 (South Beach, Newport, OR) predictions.*

Two patterns here hold at every station, so they are worth internalizing. First, the lows deepen toward the middle of the run and relax after — July 14 and 15 differ by five thousandths of a foot. Second, each day's low lands later than the last, by 42 to 53 minutes across this run; the tide keeps its own clock and drifts against ours. If Wednesday at 7:50 doesn't fit your week, Thursday at 8:33 nearly repeats it. July is a generous month for this: [Newport's July calendar](/tidewindow/beaches/or/newport-or/2026-07/) holds 24 lows below +1.0 ft, 19 of them with daylight windows, 17 of those minus tides.

## Why isn't the lowest number automatically the best day?

Because a tide table is silent about the sun. Two Newport lows in 2026 make the point better than any argument:

| | Wed, Aug 12 | Wed, Dec 23 |
|---|---|---|
| Predicted lower low | −1.913 ft | −1.910 ft |
| Time of low | 6:46 AM | 5:53 PM |
| Walkable window | 4:30–9:15 AM | 3:40–8:20 PM |
| Daylight minutes in window | 179 | 60 |
| Window Score | 88 | 61 |

*Computed 2026-07-03 from NOAA station 9435380 (South Beach, Newport, OR) predictions.*

On the tide table these are twins; the depths differ by 0.003 ft. On the beach they are not. The August low bottoms out mid-morning and hands you three hours of lit, walkable shore. The December window runs 280 minutes but only 60 of them in daylight — all at the front end, while the water is still on its way down. By the 5:53 PM low itself, the light is gone. Scanning a printed table for the year's most negative number would send you to the beach in the dark.

That is the hidden filter in every tide table: depth and daylight are separate columns, and the table only prints one of them. To read it properly you'd check sunrise and sunset against every candidate row, every time.

## Is the Window Score just a shortcut?

Yes. That is the design, and it is worth being plain about. The score compresses the arithmetic above into a 0–100 rating: how deep the low goes, how much of the walkable window overlaps daylight, and how the timing sits within the day. July 15's 90 ("Exceptional") and December 23's 61 ("Good") are the two tables above, pre-computed. Every input is either a NOAA harmonic prediction or the sun's calculated position, and the formulas are public on the [methodology page](/tidewindow/methodology/).

Be equally plain about what the score is not. It knows nothing of swell, wind, rain, fog, or how carefully you move on wet rock. A 90 during a storm is still a bad trip. The score ranks tide-and-light geometry, nothing more — it saves you the sunrise arithmetic, not the judgment.

Used that way, it turns table-reading from a chore into a glance. The [Tide Window Finder](/tidewindow/tools/tide-window-finder/) lists upcoming windows with their arrive-by times, the [Trip Picker](/tidewindow/tools/trip-picker/) compares candidate days side by side, and the [Newport station page](/tidewindow/beaches/or/newport-or/) keeps the running calendar for spots like Yaquina Head and Otter Rock.

None of this replaces the tide table; it finishes it. Read the height against MLLW, trust the lower low, then do the daylight arithmetic — or let a score that shows its work do it for you.
