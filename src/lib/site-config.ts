/**
 * Central site configuration. The daily agent may edit values here
 * (e.g. paste the PostHog key once the project exists) — everything
 * that reads config imports from this file only.
 */
export const siteConfig = {
  name: "Tidewindow",
  tagline: "Know the hours the ocean gives back.",
  description:
    "Tidewindow computes the exact daylight hours when the ocean pulls back far enough to make a coast trip worth it — scored, ranked minus-tide windows for US beaches, computed from NOAA predictions and exportable to your calendar.",
  // Production origin + basePath (GitHub Pages project site).
  url: "https://vessarey.github.io",
  basePath: "/tidewindow",
  locale: "en-US",
  // PostHog: paste the project API key (starts with "phc_") to enable
  // analytics. Leave empty to keep analytics off. Publishable key — safe
  // to commit.
  posthogKey: "",
  posthogHost: "https://us.i.posthog.com",
  // Email capture is recorded as PostHog events (identify + capture).
  emailCaptureEvent: "newsletter_signup",
};

export function absoluteUrl(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteConfig.url}${siteConfig.basePath}${p}`;
}

/** Prefix for client-side fetches of static assets (respects basePath). */
export function assetUrl(pathname: string): string {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteConfig.basePath}${p}`;
}
