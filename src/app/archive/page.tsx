import type { Metadata } from "next";
import Link from "next/link";

import ArchiveTable from "@/components/archive/archive-table";
import { projects } from "@/lib/about-data";
import { siteProfile } from "@/lib/site-profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Archive · ${siteProfile.name}`,
  description: `A big list of things ${siteProfile.name} has worked on.`,
};

export default function ArchivePage() {
  return (
    <main
      data-archive-page
      className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10"
    >
      <header className="page-reveal flex flex-col gap-4">
        <Link
          href="/about#projects"
          className="interactive-surface inline-flex w-fit items-center rounded-full border border-border/70 bg-[hsl(var(--surface)/0.8)] px-4 py-2 font-display text-xs font-semibold uppercase tracking-[0.28em] text-primary/80 shadow-[var(--shadow-soft)] transition-colors hover:text-primary"
        >
          ← Back to about
        </Link>
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/80">
          Archive
        </p>
        <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl">
          All the things I&apos;ve built.
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
          A growing list of the production work, side projects, and the
          boring-but-load-bearing services that don&apos;t make it to the
          /about page.
        </p>
      </header>

      <ArchiveTable projects={projects} />
    </main>
  );
}
