import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Analytics from "@/components/analytics";
import { WebSiteJsonLd } from "@/components/json-ld";
import { siteConfig, absoluteUrl } from "@/lib/site-config";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["opsz"] });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-plex-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url + siteConfig.basePath),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: {
    types: { "application/rss+xml": absoluteUrl("/feed.xml") },
  },
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    locale: "en_US",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Browser-UI tint on mobile; matches the icon/manifest ink.
  themeColor: "#0f3038",
};

const nav = [
  { href: "/tools/", label: "Tools" },
  { href: "/beaches/", label: "Beaches" },
  { href: "/guides/", label: "Guides" },
  { href: "/data/", label: "Data" },
  { href: "/newsletter/", label: "Newsletter" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>
        <WebSiteJsonLd />
        <Analytics />
        <header className="border-b border-ink/15 bg-foam">
          <div className="mx-auto flex max-w-5xl flex-wrap items-baseline gap-x-8 gap-y-2 px-5 py-4">
            <Link href="/" className="text-2xl" style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}>
              Tidewindow
            </Link>
            <nav className="flex flex-wrap gap-x-5 gap-y-1 text-[0.95rem]">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="text-ink-soft hover:text-anemone">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-5 pb-20 pt-8">{children}</main>
        <footer className="border-t border-ink/15 bg-foam-deep">
          <div className="mx-auto max-w-5xl px-5 py-10 text-[0.9rem] text-ink-soft">
            <hr className="waterline !my-0 mb-6" />
            <div className="grid gap-8 sm:grid-cols-3">
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 600 }} className="text-ink">
                  Tidewindow
                </p>
                <p className="mt-1">{siteConfig.tagline}</p>
                <p className="mt-2 text-[0.8rem]">
                  Every number computed from NOAA CO-OPS tide predictions. Predictions are not observations — always
                  check local conditions and never turn your back on the ocean.
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <Link href="/methodology/" className="hover:text-anemone">Methodology</Link>
                <Link href="/about/" className="hover:text-anemone">About</Link>
                <Link href="/contact/" className="hover:text-anemone">Contact</Link>
                <Link href="/embed/" className="hover:text-anemone">Embed a badge</Link>
              </div>
              <div className="flex flex-col gap-1">
                <Link href="/feed.xml" className="hover:text-anemone">RSS feed</Link>
                <Link href="/data/" className="hover:text-anemone">Open datasets</Link>
                <a href="https://tidesandcurrents.noaa.gov/" rel="noopener" className="hover:text-anemone">
                  NOAA CO-OPS (data source)
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
