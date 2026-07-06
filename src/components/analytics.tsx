"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { siteConfig } from "@/lib/site-config";

let initialized = false;

export function initAnalytics() {
  if (initialized || !siteConfig.posthogKey || typeof window === "undefined") {
    return;
  }
  posthog.init(siteConfig.posthogKey, {
    api_host: siteConfig.posthogHost,
    ui_host: "https://us.posthog.com",
    defaults: "2026-05-30",
    person_profiles: "identified_only",
    // Cookieless-friendly: memory persistence until identified, no banners needed.
    persistence: "memory",
    // "history_change", not bare `true`: this is a Next.js static export, so
    // internal navigation is client-side history (pushState). posthog-js gates
    // its History API monitor on capture_pageview === "history_change", so with
    // `true` that monitor is disabled — only hard page loads recorded a $pageview
    // and soft route changes recorded none (root cause of the 2026-07-05 zero-
    // pageviews incident, alongside the separately-fixed /ingest proxy outage).
    // "history_change" keeps the initial pageview (still truthy -> the load-time
    // capture path) and adds soft navigations; it is also exactly what the
    // defaults:"2026-05-30" preset resolves capture_pageview to on its own.
    capture_pageview: "history_change",
    capture_pageleave: true,
    autocapture: true,
  });
  initialized = true;
}

export function captureEmailSignup(email: string, source: string) {
  if (!siteConfig.posthogKey) return;
  initAnalytics();
  posthog.identify(email, { email });
  posthog.capture(siteConfig.emailCaptureEvent, { email, source });
}

export function capture(event: string, props?: Record<string, unknown>) {
  if (!siteConfig.posthogKey) return;
  initAnalytics();
  posthog.capture(event, props);
}

export default function Analytics() {
  useEffect(() => {
    initAnalytics();
  }, []);
  return null;
}
