/**
 * Central site configuration. The daily agent may edit values here
 * (e.g. analytics settings) — everything that reads config imports from
 * this file only.
 */
export const siteConfig = {
  name: "Tidewindow",
  tagline: "Know the hours the ocean gives back.",
  description:
    "Tidewindow computes the exact daylight hours when the ocean pulls back far enough to make a coast trip worth it — scored, ranked minus-tide windows for US beaches, computed from NOAA predictions and exportable to your calendar.",
  // Production origin (Vercel, custom domain). basePath is "" since the
  // GitHub Pages /tidewindow era ended 2026-07-03 (old URLs 301-stub there).
  url: "https://thetidewindow.com",
  basePath: "",
  locale: "en-US",
  // PostHog project key (publishable, safe to commit).
  posthogKey: "phc_DkedwnjqYT23MHadQyjUhfQ83jhvudqujZqRG8utdui9",
  // NOTE: same-origin "/ingest" proxying is BROKEN under output:"export" +
  // trailingSlash — Vercel serves 404.html for the extensionless ingestion
  // paths (/e/, /flags, /decide/), so zero events reached PostHog from the
  // 2026-07-03 domain migration until this fix (2026-07-05). Only the .js
  // asset GETs (config.js, /static/*) proxied, so the SDK loaded but every
  // capture POST 404'd silently. Pointing api_host straight at PostHog Cloud
  // restores capture (us-assets.i.posthog.com is derived automatically).
  // First-party proxying can be revisited (BACKLOG) for content-blocker
  // resilience — it needs a real proxy that forwards extensionless POSTs.
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
