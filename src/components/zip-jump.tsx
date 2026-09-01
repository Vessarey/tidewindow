"use client";

/**
 * Compact ZIP entry that hands off to the Tide Window Finder. The ZIP is
 * passed via sessionStorage, NOT the URL: a ?zip= query param would end up
 * in analytics ($current_url on $pageview), and the finder's published
 * privacy promise is that the ZIP never leaves the page and is not recorded.
 * The finder reads and clears the handoff key on mount and runs the lookup.
 */
import { useState } from "react";
import { useRouter } from "next/navigation";
import { capture } from "@/components/analytics";

export const ZIP_HANDOFF_KEY = "tw_zip_jump";

export default function ZipJump({
  origin,
  headline = "What does the tide give your coast?",
  blurb = "Enter a ZIP and the finder picks the nearest of our 12 NOAA stations — the lookup runs in your browser, and the ZIP is never sent or recorded.",
}: {
  /** Analytics tag for where this form lives (e.g. "home", "guide_footer"). */
  origin: string;
  headline?: string;
  blurb?: string;
}) {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = zip.replace(/\D/g, "");
    if (!/^\d{5}$/.test(normalized)) {
      setError("Enter a five-digit US ZIP code.");
      return;
    }
    try {
      sessionStorage.setItem(ZIP_HANDOFF_KEY, normalized);
    } catch {
      // Storage unavailable: still send them to the finder; they can retype.
    }
    capture("zip_lookup_used", { tool: origin, result: "redirected" });
    router.push("/tools/tide-window-finder/");
  }

  return (
    <form onSubmit={submit} className="rounded-lg border border-kelp/25 bg-foam-deep/60 p-4">
      <p className="font-semibold">{headline}</p>
      <p className="mt-1 text-[0.85rem] text-ink-soft">{blurb}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <input
          inputMode="numeric"
          autoComplete="postal-code"
          maxLength={5}
          pattern="[0-9]{5}"
          value={zip}
          onChange={(event) => {
            setZip(event.target.value.replace(/\D/g, "").slice(0, 5));
            if (error) setError("");
          }}
          className="w-36 rounded-md border border-ink/25 bg-white px-3 py-2.5 text-[0.95rem]"
          placeholder="e.g. 93950"
          aria-label="ZIP code"
        />
        <button className="btn btn-primary" type="submit">
          Find my next window
        </button>
      </div>
      {error && (
        <p className="mt-2 text-[0.85rem] text-anemone" aria-live="polite">
          {error}
        </p>
      )}
    </form>
  );
}
