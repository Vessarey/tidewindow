import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="mono text-[0.8rem] uppercase tracking-widest text-ink-soft">404 — high tide</p>
      <h1 className="mt-3 text-4xl">This page is underwater.</h1>
      <p className="mx-auto mt-4 max-w-md text-ink-soft">
        Whatever was here isn&apos;t walkable right now. The good news: we know exactly when the tide goes back out.
      </p>
      <p className="mt-6">
        <Link href="/tools/tide-window-finder/" className="btn">Find a real window</Link>
      </p>
    </div>
  );
}
