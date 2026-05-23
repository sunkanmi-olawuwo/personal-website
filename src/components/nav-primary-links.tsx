"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type NavPrimaryLink = {
  href: string;
  label: string;
  match: (pathname: string | null) => boolean;
};

const NAV_LINKS: NavPrimaryLink[] = [
  {
    href: "/",
    label: "Blog",
    match: (pathname) => pathname === "/" || pathname?.startsWith("/blog") === true,
  },
  {
    href: "/about",
    label: "About",
    match: (pathname) => pathname?.startsWith("/about") === true,
  },
  {
    href: "/now",
    label: "Now",
    match: (pathname) => pathname?.startsWith("/now") === true,
  },
  {
    href: "/travel",
    label: "Travel",
    match: (pathname) => pathname?.startsWith("/travel") === true,
  },
];

export default function NavPrimaryLinks() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="-mx-1 flex min-w-0 items-center gap-1.5 overflow-x-auto px-1 sm:gap-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {NAV_LINKS.map((link) => {
        const isActive = link.match(pathname);

        return (
          <Link
            key={link.href}
            href={link.href}
            data-active={isActive ? "true" : undefined}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "nav-pill rounded-full border border-border/70 bg-[hsl(var(--surface))]/70 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
