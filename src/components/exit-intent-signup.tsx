"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import EmailSignup from "@/components/email-signup";
import { capture } from "@/components/analytics";

const PV_KEY = "tw_pageviews";
const CAP_KEY = "tw_exit_prompt";

// Exit-intent newsletter prompt. Deliberately narrow: desktop pointers only,
// second pageview or later, once per visitor ever (localStorage cap), never
// while an inline signup form is on screen, never for someone who already
// signed up here. Signups flow through the shared EmailSignup component with
// source "exit-intent", so PostHog keeps signups-by-form measurable.
export default function ExitIntentSignup() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const n = Number(localStorage.getItem(PV_KEY) ?? "0") + 1;
      localStorage.setItem(PV_KEY, String(n));
    } catch {
      // No storage means no frequency cap, so the prompt stays off entirely.
    }
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }

    function onMouseOut(e: MouseEvent) {
      // Only a real exit: the pointer left the document past the top edge,
      // toward the tab bar — not a move between elements on the page.
      if (e.relatedTarget !== null || e.clientY > 0) return;
      try {
        if (localStorage.getItem(CAP_KEY)) return;
        if (Number(localStorage.getItem(PV_KEY) ?? "0") < 2) return;
        const signups = JSON.parse(
          localStorage.getItem("newsletter_signups") ?? "[]"
        );
        if (Array.isArray(signups) && signups.length > 0) return;
        const inlineFormInView = Array.from(
          document.querySelectorAll(".signup-box")
        ).some((el) => {
          const r = el.getBoundingClientRect();
          return r.bottom > 0 && r.top < window.innerHeight;
        });
        if (inlineFormInView) return;
        localStorage.setItem(CAP_KEY, "shown");
      } catch {
        return;
      }
      capture("exit_intent_shown", { pathname: window.location.pathname });
      setOpen(true);
    }

    document.addEventListener("mouseout", onMouseOut);
    return () => document.removeEventListener("mouseout", onMouseOut);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="exit-overlay no-print"
      role="presentation"
      onClick={() => setOpen(false)}
    >
      <div
        className="exit-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Newsletter signup"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className="exit-close"
          aria-label="Close"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>
        <EmailSignup
          source="exit-intent"
          headline="Before you go — the Minus Tide Alert"
          blurb="One email a week with your coast's ranked daylight windows — computed from NOAA data, never padded. Sent every Thursday."
          cta="Join the list"
        />
      </div>
    </div>
  );
}
