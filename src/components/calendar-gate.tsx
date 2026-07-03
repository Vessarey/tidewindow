"use client";

import { useState } from "react";
import { capture, captureEmailSignup } from "@/components/analytics";
import { assetUrl, siteConfig } from "@/lib/site-config";

/**
 * Two-step opt-in: click reveals the email form; submitting reveals the
 * station's iCal subscription URL + printable calendar link. The on-screen
 * results above this component are never gated.
 */
export default function CalendarGate({ stationSlug, stationName }: { stationSlug: string; stationName: string }) {
  const [step, setStep] = useState<"closed" | "form" | "open">("closed");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const icsPath = assetUrl(`/ics/${stationSlug}.ics`);
  const icsAbsolute = `${siteConfig.url}${icsPath}`;

  if (step === "closed") {
    return (
      <button
        className="btn"
        onClick={() => {
          capture("calendar_gate_clicked", { station_id: stationSlug, asset: "ics" });
          setStep("form");
        }}
      >
        Get my 12-month calendar for {stationName} →
      </button>
    );
  }

  if (step === "form") {
    return (
      <div className="signup-box !my-4">
        <p className="signup-headline">Your {stationName} tide calendar</p>
        <p className="signup-blurb">
          Every Good-or-better daylight window for the next 12 months — as a calendar feed you can subscribe to, plus
          a printable year view. We&apos;ll also send the weekly Minus Tide Alert for your coast (starting this
          season). No spam, unsubscribe anytime.
        </p>
        <form
          className="signup-form"
          onSubmit={(e) => {
            e.preventDefault();
            const trimmed = email.trim();
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
              setError(true);
              return;
            }
            captureEmailSignup(trimmed, "tool_gate");
            capture("ics_url_revealed", { station_id: stationSlug });
            setStep("open");
          }}
        >
          <input
            type="email"
            required
            className="signup-input"
            placeholder="you@example.com"
            aria-label="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(false);
            }}
          />
          <button type="submit" className="signup-button">
            Get the calendar
          </button>
        </form>
        {error && <p className="signup-error">That doesn&apos;t look like an email.</p>}
      </div>
    );
  }

  return (
    <div className="answer-box !my-4">
      <span className="stamp">Your calendar is ready</span>
      <p className="mb-2">
        <strong>Subscribe in your calendar app</strong> (Apple/Google: “Add calendar → from URL”) so new windows
        appear automatically:
      </p>
      <p className="num mb-3 break-all rounded bg-white/70 px-3 py-2 text-[0.85rem]">{icsAbsolute}</p>
      <p className="flex flex-wrap gap-3">
        <a className="btn" href={icsPath} download>
          Download .ics file
        </a>
        <button className="btn btn-quiet" onClick={() => window.print()}>
          Print this page&apos;s calendar
        </button>
      </p>
    </div>
  );
}
