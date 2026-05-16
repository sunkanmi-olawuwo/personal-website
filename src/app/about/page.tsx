import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { siteProfile } from "@/lib/site-profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `About · ${siteProfile.name}`,
  description: siteProfile.heroSummary,
};

const PRINCIPLES = [
  {
    title: "Boring infrastructure, interesting product",
    body: "Most reliability wins come from understanding the system you have, not adopting the system you read about last week.",
  },
  {
    title: "Tests are a design tool",
    body: "Edge cases, empty states, slow requests — these reveal more about the product than any roadmap doc.",
  },
  {
    title: "Adoption beats elegance",
    body: "Shipping a small, useful slice this sprint will outperform a perfect rewrite that lands next quarter.",
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section
        className="section-shell page-reveal flex flex-col gap-8 px-6 py-9 sm:px-9 sm:py-10 lg:px-12 lg:py-12"
        aria-labelledby="about-title"
      >
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
          About
        </p>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(180px,15rem)] lg:items-center">
          <div className="flex flex-col gap-5">
            <h1
              id="about-title"
              className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl"
            >
              Backend & AI systems engineer writing about the work it takes to keep
              software honest.
            </h1>
            <p className="text-pretty text-lg leading-8 text-muted-foreground">
              {siteProfile.heroSummary}
            </p>
            <p className="text-pretty text-base leading-8 text-muted-foreground">
              I lead infrastructure and AI initiatives for production teams. Most of
              my work lives at the intersection of large language models, distributed
              systems, and the practical decisions that keep them from collapsing into
              themselves.
            </p>
          </div>
          <div className="mx-auto w-44 overflow-hidden rounded-[1.75rem] border border-[hsl(var(--hero-ring))] shadow-[var(--shadow-strong)] sm:w-56 lg:w-full">
            <div className="relative aspect-square">
              <Image
                fill
                src={siteProfile.portraitSrc}
                alt={`Portrait of ${siteProfile.name}`}
                className="object-cover"
                sizes="(min-width: 1024px) 14rem, 14rem"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-reveal page-reveal-delay-1 flex flex-col gap-6">
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
          What I believe
        </p>
        <ul className="grid gap-5 sm:grid-cols-3">
          {PRINCIPLES.map((principle) => (
            <li
              key={principle.title}
              className="rounded-[1.5rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] p-6 shadow-[var(--shadow-soft)]"
            >
              <p className="font-display text-lg font-bold tracking-[-0.02em]">
                {principle.title}
              </p>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {principle.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="page-reveal page-reveal-delay-2 flex flex-col gap-4">
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
          Get in touch
        </p>
        <div className="flex flex-wrap gap-3">
          {siteProfile.socialLinks?.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="interactive-surface inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface))] px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#latest-writing"
            className="interactive-surface inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 font-display text-xs font-semibold uppercase tracking-[0.18em] text-primary"
          >
            Read the journal →
          </Link>
        </div>
      </section>
    </main>
  );
}
