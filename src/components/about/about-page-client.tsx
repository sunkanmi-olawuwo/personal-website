"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { certifications, experience, projects } from "@/lib/about-data";
import { siteProfile } from "@/lib/site-profile";

import AboutSectionRail, { type AboutSection } from "./about-section-rail";
import AvailabilityPill from "./availability-pill";
import CertificationsGrid from "./certifications-grid";
import ExperienceTimeline from "./experience-timeline";
import ProjectsGrid from "./projects-grid";

type SectionAccentStyle = CSSProperties & { "--section-accent"?: string };

type AnchorProps = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  accent?: string;
  children: ReactNode;
  className?: string;
};

const PRINCIPLES = [
  {
    title: "Boring infrastructure, interesting product.",
    body: "Most reliability wins come from understanding the system you have, not adopting the system you read about last week.",
  },
  {
    title: "Tests are a design tool.",
    body: "Edge cases, empty states, slow requests — these reveal more about the product than any roadmap doc.",
  },
  {
    title: "Adoption beats elegance.",
    body: "Shipping a small, useful slice this sprint will outperform a perfect rewrite that lands next quarter.",
  },
];

const SECTIONS: AboutSection[] = [
  { id: "identity", label: "Intro", accent: "hsl(var(--primary))" },
  { id: "about", label: "About", accent: "hsl(var(--accent))" },
  { id: "experience", label: "Experience", accent: "hsl(var(--primary))" },
  { id: "projects", label: "Projects", accent: "hsl(var(--accent))" },
  { id: "credentials", label: "Credentials", accent: "hsl(212 92% 56%)" },
];

function AnchorSection({
  id,
  eyebrow,
  title,
  description,
  accent,
  children,
  className,
}: AnchorProps) {
  const accentStyle: SectionAccentStyle = accent ? { "--section-accent": accent } : {};

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      style={accentStyle}
      className={
        "page-reveal scroll-mt-32 " + (className ?? "flex flex-col gap-6 sm:gap-8")
      }
    >
      <div className="flex flex-col gap-2">
        <p className="font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-[var(--section-accent,hsl(var(--primary)))]">
          {eyebrow}
        </p>
        <h2
          id={`${id}-title`}
          className="text-balance font-display text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl"
        >
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-pretty text-base leading-8 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

export default function AboutPageClient() {
  return (
    <main
      data-about-page
      className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 pb-16 pt-6 sm:px-6 lg:grid lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-10 lg:px-8 lg:pt-10"
    >
      <div className="lg:col-start-1">
        <AboutSectionRail sections={SECTIONS} />
      </div>

      <div className="flex flex-col gap-16 lg:col-start-2">
        <section
          id="identity"
          aria-labelledby="identity-title"
          className="section-open page-reveal flex flex-col gap-8 scroll-mt-32 pt-6 sm:pt-8"
          style={{ "--section-accent": "hsl(var(--primary))" } as SectionAccentStyle}
        >
          <p className="section-eyebrow text-primary/80">About</p>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
            <div className="relative h-32 w-32 flex-none overflow-hidden rounded-[1.75rem] border border-[hsl(var(--hero-ring))] shadow-[var(--shadow-strong)] ring-4 ring-[hsl(var(--primary)/0.12)] sm:h-40 sm:w-40">
              <Image
                fill
                src={siteProfile.portraitSrc}
                alt={`Portrait of ${siteProfile.name}`}
                className="object-cover"
                sizes="(min-width: 640px) 160px, 128px"
                priority
              />
            </div>
            <div className="flex flex-col gap-3">
              <h1
                id="identity-title"
                className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.25rem]"
              >
                {siteProfile.name}
              </h1>
              <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Backend &amp; AI systems engineer · London
              </p>
              {siteProfile.availabilityStatus ? (
                <AvailabilityPill status={siteProfile.availabilityStatus} />
              ) : null}
            </div>
          </div>
          <div className="flex max-w-2xl flex-col gap-5 text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
            <p>
              I take pride in shipping thoughtful, durable products and have a
              sharp eye for the unglamorous details that keep production software
              honest. I do my best work at the intersection of distributed systems
              and applied AI, where good architecture meets shippable, testable
              code.
            </p>
            <p>
              Currently, I&apos;m on the platform team at{" "}
              {/* TODO(user): replace [Company] with your real employer or a link. */}
              <span className="font-semibold text-foreground">[Company]</span>,
              where I lead the engineering work behind our production AI
              features. I own the retrieval, evaluation, and cost guardrails
              around our LLM stack, partnering closely with research and product
              engineers to ensure correctness and reliability are built into the
              foundation of every release.
            </p>
            <p>
              Previously, I&apos;ve worked across a wide range of environments —
              from early-stage startups to scaled product teams — building
              ingestion pipelines, payments infrastructure, and the
              boring-but-load-bearing services in between. Outside of my
              day-to-day work, I write essays on this site about backend
              engineering, AI applications, and the practical tradeoffs behind
              software that has to scale. These experiences have shaped how I
              think about building systems that are both honest about their
              failure modes and genuinely useful in production.
            </p>
            <p>
              In my spare time, you can usually find me deep in a long-form
              essay, walking new neighborhoods in London, or somewhere along a
              slow train route — see{" "}
              <Link
                href="/travel"
                className="font-medium text-foreground underline decoration-primary/45 underline-offset-4 transition-colors hover:decoration-primary"
              >
                /travel
              </Link>{" "}
              for the atlas.
            </p>
          </div>
        </section>

        <AnchorSection
          id="about"
          eyebrow="What I believe"
          title="A few non-negotiables."
          description="The shorthand I lean on when scoping work and choosing where to spend my judgment."
          accent="hsl(var(--accent))"
        >
          <ol className="section-quiet flex flex-col">
            {PRINCIPLES.map((principle, index) => (
              <li
                key={principle.title}
                className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-baseline gap-x-2 gap-y-3 border-t border-border/60 py-7 first:border-t-0 sm:gap-x-4"
              >
                <span
                  aria-hidden
                  className="font-display text-base font-semibold tabular-nums text-[var(--section-accent,hsl(var(--accent)))]"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex flex-col gap-3">
                  <p className="text-balance font-display text-2xl font-bold leading-[1.15] tracking-[-0.02em] text-foreground sm:text-3xl">
                    {principle.title}
                  </p>
                  <p className="text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
                    {principle.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </AnchorSection>

        <AnchorSection
          id="experience"
          eyebrow="Where I've been"
          title="Experience."
          description="A short version of the roles, with the stack each one ran on."
          accent="hsl(var(--primary))"
        >
          <ExperienceTimeline entries={experience} />
        </AnchorSection>

        <AnchorSection
          id="projects"
          eyebrow="Selected work"
          title="Projects worth pointing at."
          description="A small slice of side and production work — full archive lives on /archive."
          accent="hsl(var(--accent))"
        >
          <ProjectsGrid projects={projects.slice(0, 6)} />
        </AnchorSection>

        <AnchorSection
          id="credentials"
          eyebrow="Training & certifications"
          title="Credentials."
          description="Vendor certifications and structured training programs that anchor the day-to-day work."
          accent="hsl(212 92% 56%)"
        >
          <CertificationsGrid certifications={certifications} />
        </AnchorSection>

        <section className="flex flex-wrap gap-3">
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
        </section>
      </div>
    </main>
  );
}
