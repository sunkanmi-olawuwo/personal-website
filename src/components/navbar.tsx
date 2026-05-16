import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";

import { getBlogName } from "@/lib/requests";
import { siteProfile, type BrandLinkVariant } from "@/lib/site-profile";
import { cn } from "@/lib/utils";

import NavPrimaryLinks from "./nav-primary-links";
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
          <NavPrimaryLinks />
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <ThemeToggler />

          <Button
            asChild
            variant="outline"
            aria-label="GitHub"
            className="rounded-full border-border/80 bg-[hsl(var(--surface))] px-3 text-foreground hover:text-foreground sm:px-4"
          >
            <Link
              className="flex items-center gap-2"
              href={siteProfile.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
            >
              <GitHubLogoIcon /> <span className="hidden sm:inline">GitHub</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
