import type { Metadata } from "next";

import TravelAtlasPageClient from "@/components/travel/travel-atlas-client";
import { resolveTravelCountrySlugFromParam } from "@/lib/travel-data";

export const metadata: Metadata = {
  title: "Travel Atlas",
  description: "A personal atlas of visited countries and travel memories.",
};

export default async function TravelPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string | string[] | undefined }>;
}) {
  const { country } = await searchParams;

  return (
    <TravelAtlasPageClient
      initialCountrySlug={resolveTravelCountrySlugFromParam(country)}
    />
  );
}
