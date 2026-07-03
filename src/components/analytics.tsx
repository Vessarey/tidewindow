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
    defaults: "2025-05-24",
    // Cookieless-friendly: memory persistence until identified, no banners needed.
    persistence: "memory",
    capture_pageview: true,
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
