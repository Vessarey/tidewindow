import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticles, getArticle } from "@/lib/content";
import { markdownToHtml } from "@/lib/markdown";
import { fmtDate } from "@/lib/windows";
import { ArticleJsonLd, BreadcrumbJsonLd, FaqJsonLd } from "@/components/json-ld";
import EmailSignup from "@/components/email-signup";

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return {
    title: a.title,
    description: a.description,
    alternates: { canonical: "./" },
    openGraph: { title: a.title, description: a.description, type: "article", publishedTime: a.date, modifiedTime: a.updated ?? a.date },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const html = await markdownToHtml(a.body);

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

      <EmailSignup
        source="end_article"
        headline="The Minus Tide Alert"
        blurb="One email a week: the exact hours your coast is worth the drive — computed from NOAA data, never padded. Starting this season."
        cta="Join the list"
      />
    </div>
  );
}
