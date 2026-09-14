"use client";

export default function PrintScheduleButton() {
  return (
    <div className="no-print mt-5">
      <button
        type="button"
        onClick={() => window.print()}
        className="btn btn-quiet cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-kelp"
      >
        Print this schedule
      </button>
      <p className="mt-2 max-w-prose text-sm text-ink-soft">
        Print the guide with its tide tables, notes and sources, or choose Save as PDF in your browser&apos;s print dialog.
      </p>
      <noscript>
        <p className="mt-2 text-sm text-ink-soft">Use your browser&apos;s Print menu when JavaScript is off.</p>
      </noscript>
    </div>
  );
}
