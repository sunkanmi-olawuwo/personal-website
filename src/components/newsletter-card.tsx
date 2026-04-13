"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import { siteProfile } from "@/lib/site-profile";

import NewsletterSignupForm from "./newsletter-signup-form";

const NEWSLETTER_STORAGE_KEY = "newsletter";
const NEWSLETTER_NUDGE_DISMISSED_AT_KEY = "newsletterDismissedAt";
const NEWSLETTER_NUDGE_SESSION_KEY = "newsletterNudgeShown";
const NEWSLETTER_NUDGE_DELAY_MS = 20_000;
const NEWSLETTER_NUDGE_DISMISS_MS = 30 * 24 * 60 * 60 * 1000;
const NEWSLETTER_NUDGE_SCROLL_THRESHOLD = 0.6;
const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

type Props = {
  newsletterEnabled: boolean;
};

function readStorageValue(storage: Storage, key: string) {
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorageValue(storage: Storage, key: string, value: string) {
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage failures so the nudge never breaks the page.
  }
}

function hasRecentDismissal() {
  const dismissedAt = readStorageValue(
    window.localStorage,
    NEWSLETTER_NUDGE_DISMISSED_AT_KEY
  );

  if (!dismissedAt) {
    return false;
  }

  const dismissedAtTime = Number(dismissedAt);

  if (Number.isNaN(dismissedAtTime)) {
    return false;
  }

  return Date.now() - dismissedAtTime < NEWSLETTER_NUDGE_DISMISS_MS;
}

export default function NewsletterCard({ newsletterEnabled }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const forceNudge =
      new URLSearchParams(window.location.search).get("newsletterNudge") ===
      "force";

    if (!newsletterEnabled && !forceNudge) {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);

    if (!mediaQuery.matches) {
      return;
    }

    if (readStorageValue(window.localStorage, NEWSLETTER_STORAGE_KEY)) {
      return;
    }

    if (hasRecentDismissal()) {
      return;
    }

    if (readStorageValue(window.sessionStorage, NEWSLETTER_NUDGE_SESSION_KEY)) {
      return;
    }

    let shown = false;

    const cleanup = () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("scroll", handleScroll);
      mediaQuery.removeEventListener("change", handleViewportChange);
    };

    const showNudge = () => {
      if (shown) {
        return;
      }

      shown = true;
      writeStorageValue(window.sessionStorage, NEWSLETTER_NUDGE_SESSION_KEY, "1");
      cleanup();
      setOpen(true);
    };

    const handleScroll = () => {
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      if (scrollableHeight <= 0) {
        return;
      }

      if (window.scrollY / scrollableHeight >= NEWSLETTER_NUDGE_SCROLL_THRESHOLD) {
        showNudge();
      }
    };

    const handleViewportChange = (event: MediaQueryListEvent) => {
      if (!event.matches) {
        cleanup();
        setOpen(false);
      }
    };

    const timeoutId = window.setTimeout(showNudge, NEWSLETTER_NUDGE_DELAY_MS);

    window.addEventListener("scroll", handleScroll, { passive: true });
    mediaQuery.addEventListener("change", handleViewportChange);
    handleScroll();

    return cleanup;
  }, [newsletterEnabled]);

  function handleDismiss() {
    writeStorageValue(
      window.localStorage,
      NEWSLETTER_NUDGE_DISMISSED_AT_KEY,
      String(Date.now())
    );
    setOpen(false);
  }

  if (!open) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 hidden justify-end p-4 lg:flex lg:p-6">
      <aside className="section-shell pointer-events-auto w-full max-w-sm animate-in slide-in-from-bottom-5 fade-in-0 border-border/80 bg-[hsl(var(--surface)/0.96)] shadow-[var(--shadow-strong)] backdrop-blur-xl duration-300">
        <div className="relative flex flex-col gap-4 px-5 py-5">
          <button
            aria-label="Dismiss newsletter prompt"
            className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border border-transparent text-muted-foreground transition hover:border-border/80 hover:bg-background/75 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={handleDismiss}
            type="button"
          >
            <Cross2Icon className="h-4 w-4" />
          </button>

          <div className="space-y-3 pr-10">
            <p className="font-display text-[0.68rem] font-semibold uppercase tracking-[0.32em] text-primary/78">
              {siteProfile.newsletterEyebrow ?? "Newsletter"}
            </p>
            <h2 className="font-display text-xl font-extrabold tracking-[-0.03em] text-foreground">
              New essays, no noise.
            </h2>
            <p className="text-sm leading-6 text-muted-foreground dark:text-foreground/72">
              Practical essays on backend engineering, AI, and software that has
              to scale.
            </p>
          </div>

          <NewsletterSignupForm
            buttonClassName="h-11 w-full rounded-xl px-5 text-sm font-semibold shadow-[0_18px_35px_-24px_rgba(59,130,246,0.92)] dark:shadow-[0_24px_46px_-28px_rgba(37,99,235,0.95)]"
            className="gap-3"
            inputClassName="h-11 rounded-xl border-border/70 bg-background/75 px-4 text-sm shadow-none backdrop-blur-sm placeholder:text-muted-foreground/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground dark:placeholder:text-foreground/45"
            onSuccess={() => setOpen(false)}
            placeholder="email@address.com"
          />
        </div>
      </aside>
    </div>
  );
}
