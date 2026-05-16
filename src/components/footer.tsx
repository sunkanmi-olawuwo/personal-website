import Link from "next/link";

import { getBlogName } from "@/lib/requests";
import { siteProfile } from "@/lib/site-profile";

import NewsletterSignupForm from "./newsletter-signup-form";

const READ_LINKS = [
  { label: "Latest essays", href: "/#latest-writing" },
  { label: "Backend", href: "/?tag=backend#latest-writing" },
  { label: "AI applications", href: "/?tag=ai-applications#latest-writing" },
  { label: "Testing", href: "/?tag=testing#latest-writing" },
];

const ABOUT_LINKS = [
  { label: "About", href: "/about" },
  { label: "Now", href: "/now" },
  { label: "Articles", href: "/#latest-writing" },
];

const ELSEWHERE_LINKS = [
  { label: "RSS", href: "/rss.xml", external: false },
];

export default async function Footer() {
  const title = await getBlogName();
  const wordmark = title.displayTitle || title.title;
  const social = siteProfile.socialLinks ?? [];

  return (
    <footer className="page-reveal page-reveal-delay-3 mt-14 bg-background sm:mt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-10 pt-4 sm:px-6 lg:px-8">
        <section className="grid gap-10 rounded-[2rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-9 sm:py-10 lg:grid-cols-[1.1fr_repeat(3,_minmax(0,1fr))] lg:gap-12">
          <div className="flex flex-col gap-4">
            <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
              Stay in touch
            </p>
            <h2 className="font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl">
              Short list. Real essays. Never spam.
            </h2>
            <p className="text-sm leading-7 text-muted-foreground">
              One new post a month. Unsubscribe in one click.
            </p>
            <NewsletterSignupForm
              className="mt-1 flex-col gap-3 sm:flex-row sm:items-center"
              inputClassName="h-12 rounded-xl border-border/70 bg-background/75 px-4 text-sm shadow-none backdrop-blur-sm placeholder:text-muted-foreground/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground dark:placeholder:text-foreground/45"
              buttonClassName="h-12 rounded-xl px-6 text-sm font-semibold shadow-[0_18px_35px_-24px_hsl(var(--accent)/0.95)] disabled:opacity-100 disabled:bg-primary/55 disabled:text-primary-foreground/80 dark:hover:bg-primary/95 dark:disabled:bg-primary/45 sm:min-w-32"
              placeholder="email@address.com"
            />
          </div>

          <FooterColumn title="Read" links={READ_LINKS} />
          <FooterColumn title="About" links={ABOUT_LINKS} />
          <FooterColumn
            title="Elsewhere"
            links={[
              ...social.map((link) => ({
                label: link.label,
                href: link.href,
                external: link.external,
              })),
              ...ELSEWHERE_LINKS,
            ]}
          />
        </section>

        <div className="flex flex-col gap-3 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em] text-foreground">
            {wordmark}
          </p>
          <p className="font-display text-[0.7rem] uppercase tracking-[0.22em]">
            Built with Next.js 16 · Words my own · © {new Date().getFullYear()}{" "}
            {siteProfile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
        {title}
      </p>
      <ul className="flex flex-col gap-2.5 text-sm">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
