"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import NewsletterSignupForm from "./newsletter-signup-form";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumnData = {
  title: string;
  links: FooterLink[];
};

type Props = {
  columns: FooterColumnData[];
};

const HIDE_NEWSLETTER_PREFIXES = ["/about", "/archive", "/travel"];

function shouldHideNewsletter(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return HIDE_NEWSLETTER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function FooterColumn({ title, links }: FooterColumnData) {
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

export default function FooterTop({ columns }: Props) {
  const pathname = usePathname();
  const hideNewsletter = shouldHideNewsletter(pathname);

  return (
    <section
      data-footer-top
      data-newsletter={hideNewsletter ? "hidden" : "visible"}
      className={cn(
        "grid gap-10 rounded-[2rem] border border-border/70 bg-[hsl(var(--surface)/0.94)] px-6 py-8 shadow-[var(--shadow-soft)] sm:px-9 sm:py-10 lg:gap-12",
        hideNewsletter
          ? "lg:grid-cols-3"
          : "lg:grid-cols-[1.1fr_repeat(3,_minmax(0,1fr))]",
      )}
    >
      {hideNewsletter ? null : (
        <div className="flex flex-col gap-4">
          <p className="font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/75">
            Stay in touch
          </p>
          <h2 className="text-balance font-display text-xl font-bold tracking-[-0.04em] sm:text-2xl">
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
      )}

      {columns.map((column) => (
        <FooterColumn key={column.title} title={column.title} links={column.links} />
      ))}
    </section>
  );
}
