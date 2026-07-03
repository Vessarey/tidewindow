"use client";

import { useState } from "react";
import { type StationOption, StationSelect } from "@/components/tools-shared";
import { siteConfig } from "@/lib/site-config";

export default function EmbedGenerator({ stations }: { stations: StationOption[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const src = slug ? `${siteConfig.url}${siteConfig.basePath}/embed-badge/${slug}/` : null;
  const snippet = src
    ? `<iframe src="${src}" title="Tidewindow low tide badge" width="320" height="86" style="border:0;border-radius:8px" loading="lazy"></iframe>`
    : null;

  return (
    <div>
      <StationSelect stations={stations} value={slug} onChange={setSlug} toolName="embed" />
      {src && snippet && (
        <>
          <p className="mb-2 mt-6 font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">Preview</p>
          <iframe src={`${siteConfig.basePath}/embed-badge/${slug}/`} title="Tidewindow badge preview" width={320} height={86} style={{ border: 0, borderRadius: 8 }} />
          <p className="mb-2 mt-6 font-mono text-[0.72rem] uppercase tracking-wider text-ink-soft">Copy-paste snippet</p>
          <pre className="overflow-x-auto rounded-md bg-ink p-4 text-[0.8rem] text-foam">{snippet}</pre>
          <button
            className="btn mt-3"
            onClick={() => {
              navigator.clipboard.writeText(snippet).then(() => setCopied(true));
            }}
          >
            {copied ? "Copied ✓" : "Copy snippet"}
          </button>
        </>
      )}
    </div>
  );
}
