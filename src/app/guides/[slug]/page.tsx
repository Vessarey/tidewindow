import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { fmtDate, getStationData } from "@/lib/windows";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/json-ld";
import EmailSignup from "@/components/email-signup";
import CalendarGate from "@/components/calendar-gate";
import MultiStationGate from "@/components/multi-station-gate";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const socialImage = `/og/guides/${a.slug}.png`;
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: "./" },
    openGraph: {
      title: a.title,
      description: a.description,
      type: "article",
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
      images: [{ url: socialImage, width: 1200, height: 630, alt: a.title }],
    },
    twitter: { card: "summary_large_image", images: [socialImage] },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const html = await markdownToHtml(a.body);
  const station = a.station ? getStationData(a.station).station : undefined;
  const gateStations = a.gateStations?.map((slug) => getStationData(slug).station);

  return (
    <div>
      <ArticleJsonLd article={a} />
      <BreadcrumbJsonLd
        items={[
          { name: "Guides", path: "/guides/" },
          { name: a.title, path: `/guides/${a.slug}/` },
        ]}
      />
      {a.faq && a.faq.length > 0 && <FaqJsonLd faq={a.faq} />}

      <nav className="text-[0.85rem] text-ink-soft">
        <Link href="/guides/" className="hover:text-anemone">Guides</Link> /{" "}
        <Link href={`/guides/category/${a.category}/`} className="hover:text-anemone">
          {a.category.replace(/-/g, " ")}
        </Link>
      </nav>
      <h1 className="mt-2 max-w-3xl text-3xl sm:text-4xl">{a.title}</h1>
      <p className="mono mt-3 text-[0.78rem] text-ink-soft">
        Published <time dateTime={a.date}>{fmtDate(a.date)}</time>
        {a.updated && a.updated !== a.date && (
          <>
            {" "}· updated <time dateTime={a.updated}>{fmtDate(a.updated)}</time>
          </>
        )}{" "}
        · {a.readingMinutes} min read · every number computed from NOAA predictions
      </p>

      <article className="prose mt-6" dangerouslySetInnerHTML={{ __html: html }} />

      {a.faq && a.faq.length > 0 && (
        <section className="prose mt-8">
          <h2>Quick answers</h2>
          {a.faq.map((f) => (
            <div key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
        </section>
      )}

      {a.sources && a.sources.length > 0 && (
        <section className="mt-8 text-[0.85rem] text-ink-soft">
          <h2 className="text-lg">Sources</h2>
          <ul className="mt-2 list-disc pl-6">
            {a.sources.map((s) => (
              <li key={s}>
                <a href={s} rel="noopener" className="break-all underline hover:text-anemone">{s}</a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {gateStations && gateStations.length > 0 ? (
        <div className="mt-8">
          <p className="mb-3 text-[0.95rem] text-ink-soft">
            Every date above comes from NOAA predictions. Take yours with you: each station&apos;s calendar feed puts
            every Good-or-better daylight window in your calendar app with its arrive-by time, and it updates itself
            as new predictions land.
          </p>
          <MultiStationGate
            stations={gateStations.map((s) => ({ slug: s.slug, name: s.name }))}
            source="article_gate_multi"
          />
        </div>
      ) : station ? (
        <div className="mt-8">
          <p className="mb-3 text-[0.95rem] text-ink-soft">
            Every date above comes from NOAA station {station.noaaId} predictions. Take them with you: the{" "}
            {station.name} calendar feed puts every Good-or-better daylight window in your calendar app, and it
            updates itself as new predictions land.
          </p>
          <CalendarGate stationSlug={station.slug} stationName={station.name} source="article_gate" />
        </div>
      ) : (
        <EmailSignup
          source="end_article"
          headline="The Minus Tide Alert"
          blurb="One email a week: the exact hours your coast is worth the drive — computed from NOAA data, never padded. Sent every Thursday."
          cta="Join the list"
        />
      )}

      <nav className="mt-8 rounded-lg border border-ink/15 bg-foam-deep/60 p-5" aria-label="Planning tools for this guide">
        <h2 className="text-xl">Put this guide to work</h2>
        <ul className="mt-3 grid gap-2 text-[0.95rem] sm:grid-cols-2">
          <li>
            <Link href="/tools/tide-window-finder/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Find the next low tide near you
            </Link>
          </li>
          <li>
            <Link href="/tools/trip-picker/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Compare fixed travel dates
            </Link>
          </li>
          <li>
            <Link href="/calendars/" className="underline decoration-kelp/50 hover:decoration-kelp">
              Add a tide-window calendar
            </Link>
          </li>
          {station && (
            <li>
              <Link href={`/beaches/${station.stateSlug}/${station.slug}/`} className="underline decoration-kelp/50 hover:decoration-kelp">
                Open the full {station.name} tide chart
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
