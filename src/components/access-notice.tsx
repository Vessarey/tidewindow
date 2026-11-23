import { CABRILLO_ACCESS_SOURCE } from "@/lib/access.mjs";

export default function AccessNotice({ slug }: { slug: string }) {
  if (slug !== "san-diego-ca") return null;
  return <p className="my-3 text-[0.9rem] text-ink-soft">
    <strong>Cabrillo holiday closures:</strong> Thanksgiving Day and Christmas Day have no public access.
    Closed dates remain in tide charts as predictions, but are excluded from visit recommendations and calendar events.
    Other dates are not access clearance: check current park hours and conditions.{" "}
    <a className="underline" href={CABRILLO_ACCESS_SOURCE}>NPS operating hours</a> (checked November 23, 2026).
  </p>;
}
