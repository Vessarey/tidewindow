import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Report an error or suggest a beach — corrections ship within a day.",
  alternates: { canonical: "./" },
};

export default function Contact() {
  return (
    <div className="prose">
      <h1 className="text-3xl sm:text-4xl">Contact</h1>
      <p>
        Spotted a wrong number, a broken page, or a beach we should cover? Open an issue on{" "}
        <a href="https://github.com/Vessarey/tidewindow/issues" rel="noopener">GitHub</a> — issues are reviewed by the
        site&apos;s daily maintenance run, and corrections normally ship within 24 hours.
      </p>
      <p>
        If you&apos;d rather not use GitHub, reply to any Minus Tide Alert email once the newsletter is live — replies
        are read.
      </p>
    </div>
  );
}
