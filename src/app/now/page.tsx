import type { Metadata } from "next";
import Link from "next/link";

import { siteProfile } from "@/lib/site-profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Now · ${siteProfile.name}`,
  description: `What ${siteProfile.name} is focused on right now.`,
};

const FOCUS_AREAS = [
  {
    label: "Writing",
    body: "Shipping the new design pass for this site — premium hero, editorial article grid, sticky in-article TOC, and a softer footer.",
  },
  {
    label: "Engineering",
    body: "Building evaluation tooling for an internal RAG system. Most of the work lately is in dataset curation and retrieval quality.",
  },
  {
    label: "Reading",
    body: "Designing Data-Intensive Applications (re-read for the third time), and Rauchg's recent essays on infrastructure as a product surface.",
  },
];

export default function NowPage() {
  const lastUpdated = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <header className="page-reveal flex flex-col gap-4">
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
          Now
        </p>
        <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          What I&apos;m focused on.
        </h1>
        <p className="text-pretty text-base leading-8 text-muted-foreground">
          A short, honest snapshot of where my attention sits — updated whenever
          something material changes, never on a fixed cadence.
        </p>
        <p className="font-display text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
          Last updated · {lastUpdated}
        </p>
      </header>

      <section className="page-reveal page-reveal-delay-1 flex flex-col gap-5">
        {FOCUS_AREAS.map((area) => (
          <article
            key={area.label}
            className="rounded-[1.6rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] p-6 shadow-[var(--shadow-soft)]"
          >
            <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
              {area.label}
            </p>
            <p className="mt-3 text-base leading-8 text-foreground/90">
              {area.body}
            </p>
          </article>
        ))}
      </section>

      <p className="text-sm leading-7 text-muted-foreground">
        Inspired by{" "}
        <Link
          href="https://nownownow.com/about"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        >
          Derek Sivers&apos;s /now
        </Link>{" "}
        movement.
      </p>
    </main>
  );
}
