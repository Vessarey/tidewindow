import Link from "next/link";
import type { Metadata } from "next";
import { computeIndexDataset } from "@/lib/index-dataset";
import { fmtMonth, fmtStamp } from "@/lib/windows";
import { BreadcrumbJsonLd } from "@/components/json-ld";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "The Daylight Minus-Tide Index 2026–27",
  description:
    "US coastal sites ranked by total explorable daylight low-tide hours over the next 12 months — an original dataset computed from NOAA CO-OPS predictions. Free CSV download, CC BY 4.0.",
  alternates: { canonical: "./" },
};

export default function IndexDatasetPage() {
  const { generatedAt, rows } = computeIndexDataset();
  return (
    <div>
      <BreadcrumbJsonLd
        items={[
          { name: "Data", path: "/data/" },
          { name: "Daylight Minus-Tide Index", path: "/data/daylight-minus-tide-index/" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Dataset",
            name: "The Daylight Minus-Tide Index 2026–27",
            description:
              "US coastal sites ranked by total daylight low-tide window hours over 12 months, computed from NOAA CO-OPS harmonic predictions intersected with solar geometry.",
            url: absoluteUrl("/data/daylight-minus-tide-index/"),
            dateModified: new Date(generatedAt).toISOString(),
            license: "https://creativecommons.org/licenses/by/4.0/",
            creator: { "@type": "Organization", name: siteConfig.name },
            isBasedOn: "https://tidesandcurrents.noaa.gov/",
            distribution: {
              "@type": "DataDownload",
              encodingFormat: "text/csv",
              contentUrl: absoluteUrl("/data/daylight-minus-tide-index/data.csv"),
            },
          }),
        }}
      />
      <nav className="text-[0.85rem] text-ink-soft">
        <Link href="/data/" className="hover:text-anemone">Data</Link> / Daylight Minus-Tide Index
      </nav>
      <h1 className="mt-2 text-3xl sm:text-4xl">The Daylight Minus-Tide Index, 2026–27</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Not all coasts are equal: over the next 12 months, the top station below gets{" "}
        <strong className="num">{rows[0].totalDaylightHours} hours</strong> of walkable daylight low tide, while the
        bottom gets <strong className="num">{rows[rows.length - 1].totalDaylightHours}</strong>. This index ranks each
        covered site by total explorable hours — the number that actually decides how often a trip pays off.
      </p>
      <p className="mono mt-2 text-[0.78rem] text-ink-soft">
        Launch edition ({rows.length} stations, expanding) · computed {fmtStamp(generatedAt)} · CC BY 4.0 ·{" "}
        <a href="./data.csv" className="underline" download>
          download CSV
        </a>
      </p>

      <div className="mt-6 overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Station</th>
              <th>State</th>
              <th>Daylight window hours / yr</th>
              <th>Daylight minus tides / yr</th>
              <th>Deepest daylight low</th>
              <th>Best month</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.slug}>
                <td className="num">{r.rank}</td>
                <td>
                  <Link href={`/beaches/${r.stateSlug}/${r.slug}/`} className="underline hover:text-anemone">
                    {r.station}
                  </Link>
                </td>
                <td>{r.state}</td>
                <td className="num">{r.totalDaylightHours}</td>
                <td className="num">{r.daylightMinusTides}</td>
                <td className="num">{r.deepestDaylightLow.toFixed(1)} ft</td>
                <td className="num">{r.bestMonth === "—" ? "—" : fmtMonth(r.bestMonth)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose mt-8">
        <h2>Method</h2>
        <p>
          For every station we sum the daylight overlap (sunrise–sunset, computed for the station&apos;s coordinates)
          of every window in which NOAA-predicted height sits below +1.0 ft MLLW, over the 365 days following the
          computation date. Full formulas on the <Link href="/methodology/">methodology page</Link>. Cite as:
          “Tidewindow, Daylight Minus-Tide Index, computed from NOAA CO-OPS predictions.”
        </p>
      </div>
    </div>
  );
}
