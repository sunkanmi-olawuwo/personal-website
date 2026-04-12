import Link from "next/link";

import { getBlogName } from "@/lib/requests";
import { siteProfile } from "@/lib/site-profile";

import NewsletterSignupForm from "./newsletter-signup-form";

export default async function Footer() {
  const title = await getBlogName();

  return (
    <footer className="page-reveal page-reveal-delay-3 mt-14 bg-background sm:mt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <section className="section-shell interactive-surface px-5 py-9 sm:px-8 lg:px-12 lg:py-11">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <div className="space-y-4">
              <p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                {siteProfile.newsletterEyebrow}
              </p>
              <h2 className="font-display text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl lg:text-5xl">
                {siteProfile.newsletterHeading}
              </h2>
              <p className="mx-auto max-w-2xl text-base leading-8 text-muted-foreground dark:text-foreground/76 sm:text-lg">
                {siteProfile.newsletterSummary}
              </p>
            </div>
            <div className="w-full max-w-2xl">
              <NewsletterSignupForm
                className="flex-col gap-3 sm:flex-row sm:items-center sm:justify-center"
                inputClassName="h-14 rounded-2xl border-border/70 bg-background/75 px-5 text-base shadow-none backdrop-blur-sm placeholder:text-muted-foreground/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground dark:placeholder:text-foreground/45"
                buttonClassName="h-14 rounded-2xl px-8 text-base font-semibold shadow-[0_20px_35px_-24px_rgba(59,130,246,0.95)] disabled:opacity-100 disabled:bg-primary/55 disabled:text-primary-foreground/80 dark:shadow-[0_26px_52px_-28px_rgba(37,99,235,0.95)] dark:hover:bg-primary/95 dark:disabled:bg-primary/45 sm:min-w-40"
                placeholder="email@address.com"
              />
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-5 border-t border-border/70 pt-6 text-sm text-muted-foreground dark:text-foreground/65 lg:flex-row lg:items-center lg:justify-between">
          <p className="font-display text-sm font-bold uppercase tracking-[0.18em] text-foreground">
            {title.displayTitle || title.title}
          </p>

          <div className="flex flex-wrap items-center gap-6">
            {siteProfile.socialLinks?.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="interactive-link font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground dark:text-foreground/78"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <p className="text-sm">
            &copy; {new Date().getFullYear()} {siteProfile.name}. Designed for the
            web.
          </p>
        </div>
      </div>
    </footer>
  );
}
