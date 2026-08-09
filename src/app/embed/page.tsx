import Link from "next/link";
import type { Metadata } from "next";
import EmbedGenerator from "./embed-gen";
import { getStationOptions } from "@/lib/station-options";

export const metadata: Metadata = {
  title: "Embed a live tide badge",
  description:
    "Put a “next great low tide” badge on your site — auto-updating daily from NOAA predictions, free, one copy-paste iframe.",
  alternates: { canonical: "./" },
};

export default function EmbedPage() {
  return (
    <div>
      <h1 className="text-3xl sm:text-4xl">Embed a live tide badge</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Run a surf shop, aquarium, park friends-group, or coastal blog? Drop this badge on your site and it shows your
        beach&apos;s next great low-tide window, refreshed every day from NOAA predictions. Free forever; the small
        “Computed by Tidewindow” credit is the only ask.
      </p>
      <div className="mt-6">
        <EmbedGenerator stations={getStationOptions()} />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-ink/15 bg-white/60 p-5">
          <h2 className="text-xl">What it shows</h2>
          <p className="mt-2 text-[0.93rem] text-ink-soft">
            The station&apos;s single best low-tide window over the next 30 days — the date, the predicted low in feet,
            the time, and its 0–100 score. Scores weight depth, daylight, and timing exactly as described in the{" "}
            <Link href="/methodology/">methodology</Link>; these are astronomical predictions, not observations.
          </p>
        </div>
        <div className="rounded-lg border border-ink/15 bg-white/60 p-5">
          <h2 className="text-xl">How it stays current</h2>
          <p className="mt-2 text-[0.93rem] text-ink-soft">
            The same daily refresh that rebuilds this site regenerates every badge each morning from NOAA CO-OPS
            predictions. You paste the iframe once; the badge keeps itself up to date with no maintenance on your end.
          </p>
        </div>
        <div className="rounded-lg border border-ink/15 bg-white/60 p-5">
          <h2 className="text-xl">What it costs</h2>
          <p className="mt-2 text-[0.93rem] text-ink-soft">
            Nothing, with no catch planned later. The “Computed by Tidewindow” credit stays visible, and the badge links
            to the station&apos;s beach page — that link is the whole trade.
          </p>
        </div>
      </div>

      <h2 className="mt-10 text-2xl">Who it fits</h2>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Anyone whose readers ask “when should we go?” — park friends-groups and volunteer naturalist programs, surf and
        paddle shops, nature centers, tour operators, coastal inns, and beach-town blogs. If the badge answers a
        question your visitors email you about, it belongs on your site.
      </p>

      <h2 className="mt-10 text-2xl">The fine print</h2>
      <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 text-[0.93rem] text-ink-soft">
        <li>
          The badge is a small static HTML page in an iframe (320 × 86 by default — adjust the iframe attributes to
          taste). It sets no cookies and does no visitor tracking.
        </li>
        <li>
          Each load sends one ping — the badge&apos;s station name and your site&apos;s domain — so we know which
          badges are actually in use. The ping carries no visitor identifier and stores nothing in the visitor&apos;s
          browser.
        </li>
        <li>
          Tide numbers are NOAA astronomical predictions; real water levels vary with weather. Anyone planning a trip
          from the badge lands on a station page that says so.
        </li>
      </ul>

      <p className="mt-8 max-w-2xl text-ink-soft">
        Don&apos;t see your beach in the list? Station requests are welcome — <Link href="/contact/">tell us which
        NOAA station covers your shore</Link> and it goes into the coverage queue. Prefer dates in a calendar instead?
        Every station page offers a free <Link href="/beaches/">subscribable tide-window calendar</Link>.
      </p>
    </div>
  );
}
