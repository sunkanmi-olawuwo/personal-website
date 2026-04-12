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

export type SiteProfile = {
  name: string;
  heroHeadline: string;
  heroSummary: string;
  newsletterEyebrow?: string;
  newsletterHeading?: string;
  newsletterSummary?: string;
  portraitSrc: string;
  primaryCta: ProfileCta;
  secondaryCta: ProfileCta;
  socialLinks?: ProfileLink[];
};

export const siteProfile = {
  name: "Sunkanmi Olawuwo",
  heroHeadline: "Building reliable software systems for real-world products.",
  heroSummary:
    "I write about backend engineering, AI systems, cloud architecture, testing, and the practical decisions behind production software, explained in simple and practical terms.",
  newsletterEyebrow: "The weekly digest",
  newsletterHeading: "Notes on backend, AI, and software in production.",
  newsletterSummary:
    "Join the weekly digest for practical essays on backend engineering, AI application development, cloud architecture, testing, and the tradeoffs behind software that has to work in production.",
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
