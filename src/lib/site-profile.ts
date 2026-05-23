export type ProfileCta = {
  label: string;
  href: string;
  external?: boolean;
};

export type ProfileLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type BrandLinkVariant = "underline" | "lift" | "shine";

export type AvailabilityTone = "open" | "writing" | "heads-down";

export type AvailabilityStatus = {
  label: string;
  tone?: AvailabilityTone;
};

export type SiteProfile = {
  name: string;
  wordmark?: string;
  brandLinkVariant: BrandLinkVariant;
  heroHeadline: string;
  heroHighlight?: string;
  heroSummary: string;
  newsletterEyebrow?: string;
  newsletterSummary?: string;
  portraitSrc: string;
  primaryCta: ProfileCta;
  secondaryCta: ProfileCta;
  socialLinks?: ProfileLink[];
  availabilityStatus?: AvailabilityStatus;
  resumeHref?: string;
};

export const siteProfile = {
  name: "Sunkanmi Olawuwo",
  wordmark: "S.O.",
  brandLinkVariant: "shine",
  heroHeadline: "Building reliable software systems for real-world products.",
  heroHighlight: "reliable software systems",
  heroSummary:
    "Essays on backend, AI systems, and what production software actually costs to keep honest.",
  newsletterEyebrow: "The weekly digest",
  newsletterSummary:
    "Practical essays on backend engineering, AI application development, cloud architecture, testing, and the tradeoffs behind software that has to scale.",
  portraitSrc: "/sunkanmi-olawuwo-headshot-cropped.png",
  primaryCta: {
    label: "Read the journal",
    href: "#latest-writing",
  },
  secondaryCta: {
    label: "GitHub",
    href: "https://github.com/atharvadeosthale/hashnode-headless-blog",
    external: true,
  },
  socialLinks: [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/sunkanmi-olawuwo/",
      external: true,
    },
    {
      label: "GitHub",
      href: "https://github.com/atharvadeosthale/hashnode-headless-blog",
      external: true,
    },
  ],
  availabilityStatus: {
    label: "Available for consulting",
    tone: "open",
  },
  // TODO(user): replace with a hosted résumé URL when ready.
  resumeHref: "https://www.linkedin.com/in/sunkanmi-olawuwo/",
} satisfies SiteProfile;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sunkanmi.olawuwo.com";
