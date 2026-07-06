"use client";

import { useState } from "react";
import { captureEmailSignup } from "@/components/analytics";

export default function EmailSignup({
  source,
  headline,
  blurb,
  cta,
}: {
  source: string;
  headline: string;
  blurb: string;
  cta: string;
}) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setState("error");
      return;
    }
    captureEmailSignup(trimmed, source);
    try {
      const existing = JSON.parse(
        localStorage.getItem("newsletter_signups") ?? "[]"
      );
      localStorage.setItem(
        "newsletter_signups",
        JSON.stringify([...existing, { email: trimmed, source, at: Date.now() }])
      );
    } catch {
      // localStorage unavailable — the PostHog event above still records it.
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="signup-box" data-signup-source={source}>
        <p className="signup-done">
          You&apos;re on the list — first issue lands soon.
        </p>
      </div>
    );
  }

  return (
    <div className="signup-box" data-signup-source={source}>
      <p className="signup-headline">{headline}</p>
      <p className="signup-blurb">{blurb}</p>
      <form onSubmit={submit} className="signup-form">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@example.com"
          aria-label="Email address"
          className="signup-input"
        />
        <button type="submit" className="signup-button">
          {cta}
        </button>
      </form>
      {state === "error" && (
        <p className="signup-error">That doesn&apos;t look like an email.</p>
      )}
      <p className="signup-privacy">No spam. Unsubscribe anytime.</p>
    </div>
  );
}
