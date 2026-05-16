import Image from "next/image";
import Link from "next/link";

import { siteProfile } from "@/lib/site-profile";

import { Button } from "./ui/button";

export default function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="section-shell interactive-surface page-reveal group px-5 py-6 backdrop-blur sm:px-8 sm:py-8 lg:px-12 lg:py-12"
    >
      <div aria-hidden className="hero-grid-overlay" />
      <div aria-hidden className="hero-signature-glow" />
      <div aria-hidden className="surface-noise" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-background/10 to-transparent"
      />

      <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,20rem)]">
        <div className="order-2 flex flex-col gap-6 text-center lg:order-1 lg:text-left">
          <div className="flex flex-col gap-4">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
            </p>
            <h1
              id="home-hero-title"
              className="font-display text-4xl font-extrabold leading-[0.96] tracking-[-0.04em] sm:text-5xl lg:text-7xl"
            >
              <span className="text-primary">{siteProfile.heroHeadline}</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground lg:mx-0 lg:max-w-xl lg:text-lg">
              {siteProfile.heroSummary}
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              asChild
              className="rounded-full px-6 py-6 text-sm font-semibold tracking-[0.02em] shadow-[var(--shadow-medium)]"
            >
              <Link href={siteProfile.primaryCta.href}>
                {siteProfile.primaryCta.label}
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-border/80 bg-background/60 px-6 py-6 text-sm font-semibold tracking-[0.02em] hover:bg-background"
            >
              <Link
                href={siteProfile.secondaryCta.href}
                target={siteProfile.secondaryCta.external ? "_blank" : undefined}
                rel={siteProfile.secondaryCta.external ? "noreferrer" : undefined}
              >
                {siteProfile.secondaryCta.label}
              </Link>
            </Button>
          </div>
        </div>

        <div className="order-1 mx-auto lg:order-2 lg:justify-self-end">
          <div className="interactive-media motion-safe-float relative isolate mx-auto aspect-square w-44 overflow-hidden rounded-[1.75rem] border border-[hsl(var(--hero-ring))] bg-[linear-gradient(180deg,rgba(46,80,144,0.2),rgba(15,23,42,0.55))] shadow-[var(--shadow-strong)] sm:w-56 lg:w-[20rem]">
            <div
              aria-hidden
              className="absolute inset-x-8 bottom-4 h-10 rounded-full bg-black/35 blur-2xl"
            />
            <div
              aria-hidden
              data-media-target
              className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-white/6"
            />
            <Image
              fill
              priority
              src={siteProfile.portraitSrc}
              alt={`Portrait of ${siteProfile.name}`}
              className="object-cover"
              sizes="(min-width: 1024px) 20rem, (min-width: 640px) 14rem, 11rem"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
