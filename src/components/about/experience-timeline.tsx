import Link from "next/link";

import type { Experience } from "@/lib/about-data";
import { siteProfile } from "@/lib/site-profile";

type Props = {
  entries: readonly Experience[];
};

function ResumeLink() {
  if (!siteProfile.resumeHref) {
    return null;
  }

  const isExternal = siteProfile.resumeHref.startsWith("http");

  return (
    <Link
      href={siteProfile.resumeHref}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className="inline-arrow-link"
    >
      View full résumé
    </Link>
  );
}

function StackChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-strong)/0.55)] px-2.5 py-0.5 font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:border-[color-mix(in_srgb,var(--section-accent,hsl(var(--primary)))_55%,transparent)] hover:text-foreground">
      {label}
    </span>
  );
}

export default function ExperienceTimeline({ entries }: Props) {
  return (
    <div data-experience-timeline className="flex flex-col gap-8">
      <ol className="relative flex flex-col gap-10 border-l border-border/60 pl-6 sm:pl-8">
        {entries.map((entry, index) => (
          <li
            key={`${entry.role}-${entry.company}-${index}`}
            data-experience-entry
            className="relative flex flex-col gap-3"
          >
            <span
              aria-hidden
              className="absolute -left-[1.6rem] top-[0.45rem] h-2.5 w-2.5 rounded-full bg-[var(--section-accent,hsl(var(--primary)))] shadow-[0_0_0_4px_hsl(var(--background))] sm:-left-[2rem]"
            />
            <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
              {entry.period}
            </p>
            <p className="font-display text-xl font-bold leading-tight tracking-[-0.02em] text-foreground sm:text-2xl">
              {entry.companyHref ? (
                <Link
                  href={entry.companyHref}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--section-accent,hsl(var(--primary)))]"
                >
                  {entry.role}
                  <span className="text-muted-foreground"> · </span>
                  <span>{entry.company}</span>
                </Link>
              ) : (
                <>
                  {entry.role}
                  <span className="text-muted-foreground"> · </span>
                  <span>{entry.company}</span>
                </>
              )}
            </p>
            <ul className="flex flex-col gap-2 text-sm leading-7 text-muted-foreground sm:text-[0.95rem]">
              {entry.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span aria-hidden className="mt-2.5 h-1 w-1 flex-none rounded-full bg-[var(--section-accent,hsl(var(--primary)))]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {entry.stack.map((item) => (
                <StackChip key={item} label={item} />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <div>
        <ResumeLink />
      </div>
    </div>
  );
}
