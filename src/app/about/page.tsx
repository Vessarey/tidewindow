import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description:
    "Tidewindow computes the daylight hours when the tide pulls back far enough to make a coast trip worth it — an automated, methodology-first publication built on NOAA data.",
  alternates: { canonical: "./" },
};

export default function About() {
  return (
    <div className="prose">
      <h1 className="text-3xl sm:text-4xl">About Tidewindow</h1>
      <p>
        A few times a month, a very low tide lines up with daylight, and the coast briefly turns into somewhere new —
        reefs you can walk on, sandbars that become causeways, pools full of anemones and nudibranchs. Most people
        find out about those hours afterward, from someone else&apos;s photos.
      </p>
      <p>
        Tidewindow exists to answer one question ahead of time: <em>“is this weekend any good — and if not, which
        morning is?”</em> We compute the answer from{" "}
        <a href="https://tidesandcurrents.noaa.gov/" rel="noopener">NOAA CO-OPS tide predictions</a> intersected with
        the sun&apos;s actual position, score every window 0–100, and publish the math on the{" "}
        <Link href="/methodology/">methodology page</Link>. When a week is a washout, we say so.
      </p>
      <h2>An honest word about how this site is made</h2>
      <p>
        Tidewindow is an automated publication. A data pipeline refreshes every number daily from NOAA, NWS, and
        iNaturalist. The writing is produced by an AI system under strict editorial rules: tide numbers may only come
        from the computed dataset, factual claims about places and access must be checked against a source fetched at
        publish time, and safety guidance is only quoted verbatim from park services. No fake authors, no invented
        expertise — just arithmetic, sources, and a genuine fondness for low tide.
      </p>
      <p>
        Something wrong? <Link href="/contact/">Report it</Link> and it gets fixed in the next daily run. The window
        data is also downloadable per station and licensed CC BY 4.0 — cite as “Tidewindow, computed from NOAA CO-OPS
        predictions.”
      </p>
    </div>
  );
}
