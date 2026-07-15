import { siteConfig, absoluteUrl } from "@/lib/site-config";
import type { Article } from "@/lib/content";

function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/** Stable @id for the publishing organization; referenced from Article/WebApp publisher. */
export const ORG_ID = absoluteUrl("/#organization");

/** The organization logo Google uses for the site (favicon is separate; this feeds
 *  the logo in rich results and any knowledge panel). Square 512px brand mark. */
const orgLogo = {
  "@type": "ImageObject",
  "@id": absoluteUrl("/#logo"),
  url: absoluteUrl("/icon-512.png"),
  contentUrl: absoluteUrl("/icon-512.png"),
  width: 512,
  height: 512,
  caption: siteConfig.name,
};

export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": ORG_ID,
            name: siteConfig.name,
            url: absoluteUrl("/"),
            description: siteConfig.description,
            logo: orgLogo,
            image: { "@id": absoluteUrl("/#logo") },
          },
          {
            "@type": "WebSite",
            "@id": absoluteUrl("/#website"),
            name: siteConfig.name,
            description: siteConfig.description,
            url: absoluteUrl("/"),
            publisher: { "@id": ORG_ID },
          },
        ],
      }}
    />
  );
}

export function ArticleJsonLd({ article }: { article: Article }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.description,
        datePublished: article.date,
        dateModified: article.updated ?? article.date,
        author: {
          "@type": "Organization",
          name: siteConfig.name,
          url: absoluteUrl("/about"),
        },
        publisher: {
          "@type": "Organization",
          "@id": ORG_ID,
          name: siteConfig.name,
          logo: {
            "@type": "ImageObject",
            url: absoluteUrl("/icon-512.png"),
            width: 512,
            height: 512,
          },
        },
        mainEntityOfPage: absoluteUrl(`/guides/${article.slug}`),
      }}
    />
  );
}

export function FaqJsonLd({ faq }: { faq: { q: string; a: string }[] }) {
  if (!faq.length) return null;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      }}
    />
  );
}

export function StationDatasetJsonLd({
  station,
  generatedAt,
}: {
  station: { slug: string; stateSlug: string; name: string; noaaId: string; lat: number; lng: number };
  generatedAt: number;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Dataset",
        name: `${station.name} daylight low-tide windows`,
        description: `Computed daylight low-tide windows, scores, and calendar feed for ${station.name}, derived from NOAA CO-OPS station ${station.noaaId} tide predictions intersected with computed sunrise/sunset times.`,
        url: absoluteUrl(`/beaches/${station.stateSlug}/${station.slug}/`),
        dateModified: new Date(generatedAt).toISOString(),
        isBasedOn: `https://tidesandcurrents.noaa.gov/stationhome.html?id=${station.noaaId}`,
        license: "https://creativecommons.org/licenses/by/4.0/",
        creator: { "@type": "Organization", "@id": ORG_ID, name: siteConfig.name, url: absoluteUrl("/about/") },
        spatialCoverage: {
          "@type": "Place",
          geo: { "@type": "GeoCoordinates", latitude: station.lat, longitude: station.lng },
        },
        distribution: {
          "@type": "DataDownload",
          encodingFormat: "text/calendar",
          contentUrl: absoluteUrl(`/ics/${station.slug}.ics`),
        },
      }}
    />
  );
}

export function WebApplicationJsonLd({ name, description, path }: { name: string; description: string; path: string }) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name,
        description,
        url: absoluteUrl(path),
        applicationCategory: "UtilityApplication",
        operatingSystem: "Any (web)",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", "@id": ORG_ID, name: siteConfig.name },
      }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: absoluteUrl(item.path),
        })),
      }}
    />
  );
}
