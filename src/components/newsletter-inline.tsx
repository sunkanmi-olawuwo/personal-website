import { siteProfile } from "@/lib/site-profile";

import NewsletterSignupForm from "./newsletter-signup-form";

type Props = {
  newsletterEnabled: boolean;
};

export default function NewsletterInline({ newsletterEnabled }: Props) {
  if (!newsletterEnabled) {
    return null;
  }

  return (
    <aside
      data-newsletter-inline
      aria-label="Subscribe to the newsletter"
      className="mt-2 flex flex-col gap-4 rounded-[1.5rem] border border-border/60 bg-[hsl(var(--surface)/0.78)] px-6 py-6 sm:px-8 sm:py-7"
    >
      <p className="section-eyebrow text-primary/80">
        {siteProfile.newsletterEyebrow ?? "Newsletter"}
      </p>
      <h2 className="text-balance font-display text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
        New essays, no noise.
      </h2>
      <NewsletterSignupForm
        className="flex-col gap-3 sm:flex-row sm:items-center"
        inputClassName="h-11 rounded-xl border-border/70 bg-background/75 px-4 text-sm shadow-none placeholder:text-muted-foreground/80 dark:border-white/10 dark:bg-white/[0.04] dark:text-foreground dark:placeholder:text-foreground/45"
        buttonClassName="h-11 rounded-xl px-5 text-sm font-semibold sm:min-w-28"
        placeholder="email@address.com"
      />
    </aside>
  );
}
