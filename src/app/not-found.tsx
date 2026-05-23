import Link from "next/link";

import { siteProfile } from "@/lib/site-profile";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const socials = siteProfile.socialLinks ?? [];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 pb-16 pt-16 sm:px-6 lg:px-8 lg:pt-24">
      <header className="page-reveal flex flex-col gap-5">
        <p className="section-eyebrow text-primary/80">404 · Not found</p>
        <h1 className="text-balance font-display text-4xl font-extrabold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
          Wrong turn somewhere.
        </h1>
        <p className="max-w-2xl text-pretty text-base leading-8 text-muted-foreground sm:text-lg">
          Either this URL never existed, the post moved, or my deploy script
          ate something it shouldn&apos;t have. Honestly, all three are about
          equally likely.
        </p>
      </header>

      <div className="page-reveal page-reveal-delay-1 flex flex-col gap-3 sm:flex-row">
        <Button
          asChild
          className="w-full rounded-full px-6 py-6 text-sm font-semibold tracking-[0.02em] shadow-[var(--shadow-medium)] sm:w-auto"
        >
          <Link href="/#latest-writing">← Back to the journal</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="w-full rounded-full border-border/80 bg-background/60 px-6 py-6 text-sm font-semibold tracking-[0.02em] hover:bg-background sm:w-auto"
        >
          <Link href="/archive">Browse the archive</Link>
        </Button>
      </div>

      {socials.length > 0 ? (
        <p className="page-reveal page-reveal-delay-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
          <span className="font-display text-[0.7rem] uppercase tracking-[0.22em]">
            Or find me on
          </span>
          {socials.map((link, index) => (
            <span key={link.label} className="flex items-center gap-x-3">
              <Link
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="font-medium text-foreground underline decoration-primary/45 underline-offset-4 hover:decoration-primary"
              >
                {link.label}
              </Link>
              {index < socials.length - 1 ? (
                <span aria-hidden className="text-muted-foreground/55">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </p>
      ) : null}
    </main>
  );
}
