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

export type SiteProfile = {
  name: string;
  brandLinkVariant: BrandLinkVariant;
  heroHeadline: string;
  heroSummary: string;
  newsletterEyebrow?: string;
  newsletterSummary?: string;
  portraitSrc: string;
  primaryCta: ProfileCta;
  secondaryCta: ProfileCta;
  socialLinks?: ProfileLink[];
};

export const siteProfile = {
  name: "Sunkanmi Olawuwo",
  brandLinkVariant: "shine",
  heroHeadline: "Building reliable software systems for real-world products.",
  heroSummary:
    "I write about backend engineering, AI systems, cloud architecture, testing, and the practical decisions behind production software, explained in simple and practical terms.",
  newsletterEyebrow: "The weekly digest",
  newsletterSummary:
    "Practical essays on backend engineering, AI application development, cloud architecture, testing, and the tradeoffs behind software that has to scale.",
  portraitSrc: "/sunkanmi-olawuwo-headshot-cropped.png",
  primaryCta: {
    label: "Articles",
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
} satisfies SiteProfile;
