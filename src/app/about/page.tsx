import type { Metadata } from "next";

import AboutPageClient from "@/components/about/about-page-client";
import { siteProfile } from "@/lib/site-profile";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `About · ${siteProfile.name}`,
  description: siteProfile.heroSummary,
};

export default function AboutPage() {
  return <AboutPageClient />;
}
