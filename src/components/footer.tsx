import { getBlogName } from "@/lib/requests";
import { siteProfile } from "@/lib/site-profile";

import FooterTop from "./footer-top";

const READ_LINKS = [
  { label: "Latest essays", href: "/#latest-writing" },
  { label: "Backend", href: "/?tag=backend#latest-writing" },
  { label: "AI applications", href: "/?tag=ai-applications#latest-writing" },
  { label: "Testing", href: "/?tag=testing#latest-writing" },
];

const ABOUT_LINKS = [
  { label: "About", href: "/about" },
  { label: "Archive", href: "/archive" },
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
        <FooterTop
          columns={[
            { title: "Read", links: READ_LINKS },
            { title: "About", links: ABOUT_LINKS },
            {
              title: "Elsewhere",
              links: [
                ...social.map((link) => ({
                  label: link.label,
                  href: link.href,
                  external: link.external,
                })),
                ...ELSEWHERE_LINKS,
              ],
            },
          ]}
        />

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
