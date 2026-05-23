import type { Metadata } from "next";
import Link from "next/link";

import { siteProfile } from "@/lib/site-profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Now · ${siteProfile.name}`,
  description: `What ${siteProfile.name} is focused on right now.`,
};

// Update these whenever the page is edited.
const LAST_UPDATED = "14 May 2026";
const PREVIOUS_UPDATE = "22 April 2026";

type FocusEntry = {
  label: string;
  body: string;
  accent?: boolean;
  variant?: "default" | "quote";
};

const FOCUS_ENTRIES: FocusEntry[] = [
  {
    label: "Place",
    body: "London — Hackney, mostly; a few weeks in Lagos earlier this year.",
  },
  {
    label: "Working on",
    body: "Evaluation tooling for an internal RAG system. Most of the work lately is in dataset curation and retrieval quality, not modeling.",
    accent: true,
  },
  {
    label: "Reading",
    body: "Designing Data-Intensive Applications (re-read for the third time), and Rauchg's recent essays on infrastructure as a product surface.",
  },
  {
    label: "Question I'm sitting with",
    body: "How much of \"AI reliability\" is actually just regular software reliability with a louder marketing campaign?",
    accent: true,
    variant: "quote",
  },
  {
    label: "Not doing",
    body: "Conference talks, side consulting, anything that pulls focus off the platform work. Saying no to most things until autumn.",
  },
];

export default function NowPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <header className="page-reveal flex flex-col gap-4">
        <p className="section-eyebrow text-primary/75">Now</p>
        <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          What I&apos;m focused on.
        </h1>
        <p className="text-pretty text-base leading-8 text-muted-foreground">
          A short, honest snapshot of where my attention sits — updated whenever
          something material changes, never on a fixed cadence.
        </p>
        <p className="flex flex-wrap items-center gap-x-2 font-display text-[0.72rem] uppercase tracking-[0.22em] text-muted-foreground">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-primary/80"
          />
          <span>Last edited {LAST_UPDATED}</span>
          <span aria-hidden className="text-muted-foreground/55">
            ·
          </span>
          <span>before that, {PREVIOUS_UPDATE}</span>
        </p>
      </header>

      <section className="page-reveal page-reveal-delay-1 flex flex-col">
        {FOCUS_ENTRIES.map((entry) => (
          <article
            key={entry.label}
            className="grid grid-cols-1 gap-3 border-t border-border/60 py-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-8"
          >
            <p
              className={
                "section-eyebrow " +
                (entry.accent ? "text-primary/85" : "text-muted-foreground")
              }
            >
              {entry.label}
            </p>
            {entry.variant === "quote" ? (
              <blockquote className="border-l-2 border-primary/55 pl-4 text-pretty font-display text-lg italic leading-8 text-foreground/90 sm:text-xl">
                {entry.body}
              </blockquote>
            ) : (
              <p className="text-pretty text-base leading-8 text-foreground/90">
                {entry.body}
              </p>
            )}
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
