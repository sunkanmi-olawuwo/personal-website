import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { getBlogName } from "@/lib/requests";
import { siteProfile, type BrandLinkVariant } from "@/lib/site-profile";
import { cn } from "@/lib/utils";

import ThemeToggler from "./theme-toggler";
import { Button } from "./ui/button";

const brandLinkVariantClassNames: Record<BrandLinkVariant, string> = {
  underline: "brand-link--underline",
  lift: "brand-link--lift",
  shine: "brand-link--shine",
};

export default async function Navbar() {
  const title = await getBlogName();

  return (
    <header className="w-full border-b border-border/70 bg-background/80 shadow-[var(--shadow-soft)] backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <div className="truncate font-display text-base font-extrabold uppercase tracking-[0.28em] sm:text-lg">
            <Link
              href="/"
              className={cn("brand-link", brandLinkVariantClassNames[siteProfile.brandLinkVariant])}
            >
              {title.displayTitle || title.title}
            </Link>
          </div>
          <nav
            aria-label="Primary navigation"
            className="flex shrink-0 items-center gap-2"
          >
            <Link
              href="/"
              className="rounded-full border border-border/70 bg-[hsl(var(--surface))]/70 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
            >
              Blog
            </Link>
            <Link
              href="/travel"
              className="rounded-full border border-border/70 bg-[hsl(var(--surface))]/70 px-3 py-2 font-display text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground shadow-[var(--shadow-soft)] transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
            >
              Travel
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggler />

          <Button
            asChild
            variant="outline"
            className="rounded-full border-border/80 bg-[hsl(var(--surface))] px-4 text-foreground hover:text-foreground"
          >
            <Link
              className="flex items-center gap-2"
              href={siteProfile.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubLogoIcon /> GitHub
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
