export type TravelPhotoOrientation = "landscape" | "portrait" | "square";

export type TravelPhoto = {
  src: string;
  alt: string;
  caption: string;
  location?: string;
  takenOn?: string;
  orientation?: TravelPhotoOrientation;
  width: number;
  height: number;
};

export type TravelCountry = {
  slug: string;
  name: string;
  isoNumeric: string;
  continent: string;
  flagEmoji: string;
  focusLat: number;
  focusLng: number;
  summary: string;
  memory: string;
  visitLabel: string;
  cities: readonly string[];
  highlights: readonly string[];
  coverPhoto: TravelPhoto;
  photos: readonly TravelPhoto[];
  themeColor: string;
};

const nigeriaPhotos = [
  {
    src: "/travel/nigeria/lagos-island.jpg",
    alt: "A view across Lagos Island.",
    caption: "Lagos Island",
    location: "Lagos",
    orientation: "landscape",
    width: 2400,
    height: 1350,
  },
  {
    src: "/travel/nigeria/lagos-church.jpg",
    alt: "A historic church in Lagos.",
    caption: "Church on the island",
    location: "Lagos",
    orientation: "landscape",
    width: 2400,
    height: 1619,
  },
  {
    src: "/travel/nigeria/ibadan-brown-roof.jpg",
    alt: "Ibadan's signature sea of rust-brown rooftops.",
    caption: "Ibadan brown roofs",
    location: "Ibadan",
    orientation: "landscape",
    width: 2400,
    height: 1600,
  },
] as const satisfies readonly TravelPhoto[];

const unitedKingdomPhotos = [
  {
    src: "/travel/united-kingdom/london-riverside.png",
    alt: "A cool-toned riverside memory of London with soft city silhouettes.",
    caption: "London riverside walk",
    location: "London",
    takenOn: "Blue hour",
    orientation: "landscape",
    width: 1280,
    height: 880,
  },
  {
    src: "/travel/united-kingdom/edinburgh-close.png",
    alt: "A dusky Edinburgh close rendered as a layered architectural memory.",
    caption: "Edinburgh close",
    location: "Edinburgh",
    takenOn: "Late afternoon",
    orientation: "landscape",
    width: 1280,
    height: 880,
  },
  {
    src: "/travel/united-kingdom/rail-window.png",
    alt: "A rail-window inspired landscape crossing the United Kingdom.",
    caption: "Rail window northbound",
    location: "United Kingdom",
    takenOn: "In transit",
    orientation: "landscape",
    width: 1280,
    height: 880,
  },
] as const satisfies readonly TravelPhoto[];

export const travelCountries = [
  {
    slug: "nigeria",
    name: "Nigeria",
    isoNumeric: "566",
    continent: "Africa",
    flagEmoji: "🇳🇬",
    focusLat: 9.082,
    focusLng: 8.6753,
    summary:
      "A bright, kinetic archive of family roots, city energy, generous tables, and long conversations that stretch past sunset.",
    memory:
      "Nigeria feels like a place where memory has volume: Lagos moving at full tempo, Abuja easing into evening, and familiar voices turning a simple visit into a living map.",
    visitLabel: "Family roots and return visits",
    cities: ["Lagos", "Abuja", "Ibadan"],
    highlights: ["Lagoon light", "Market color", "Warm evenings", "Family tables"],
    coverPhoto: nigeriaPhotos[0],
    photos: nigeriaPhotos,
    themeColor: "#14b8a6",
  },
  {
    slug: "united-kingdom",
    name: "United Kingdom",
    isoNumeric: "826",
    continent: "Europe",
    flagEmoji: "🇬🇧",
    focusLat: 55.3781,
    focusLng: -3.436,
    summary:
      "A layered chapter of riverside walks, rail windows, stone streets, and the everyday rhythm of building a life between cities.",
    memory:
      "The United Kingdom sits in the atlas as a quieter kind of travel: familiar train stations, old streets after rain, and the feeling of discovering new detail in places that start to know you back.",
    visitLabel: "Home base and slow exploration",
    cities: ["London", "Manchester", "Edinburgh"],
    highlights: ["Riverside walks", "Rail journeys", "Old stone streets", "Rainy light"],
    coverPhoto: unitedKingdomPhotos[0],
    photos: unitedKingdomPhotos,
    themeColor: "#3b82f6",
  },
] as const satisfies readonly TravelCountry[];

export const defaultTravelCountrySlug = travelCountries[0].slug;

export type TravelStats = {
  countryCount: number;
  continentCount: number;
  cityCount: number;
  photoCount: number;
};

function normalizeCountrySlugParam(
  param: string | string[] | null | undefined,
) {
  const rawParam = Array.isArray(param) ? param[0] : param;

  return rawParam?.trim().toLowerCase() || undefined;
}

export function getTravelCountryBySlug(slug: string | null | undefined) {
  const normalizedSlug = normalizeCountrySlugParam(slug);

  return travelCountries.find((country) => country.slug === normalizedSlug);
}

export function resolveTravelCountryFromParam(
  countryParam: string | string[] | null | undefined,
) {
  return (
    getTravelCountryBySlug(normalizeCountrySlugParam(countryParam)) ??
    travelCountries[0]
  );
}

export function resolveTravelCountrySlugFromParam(
  countryParam: string | string[] | null | undefined,
) {
  return resolveTravelCountryFromParam(countryParam).slug;
}

export function getTravelStats(
  countries: readonly TravelCountry[] = travelCountries,
): TravelStats {
  return {
    countryCount: countries.length,
    continentCount: new Set(countries.map((country) => country.continent)).size,
    cityCount: countries.reduce(
      (total, country) => total + country.cities.length,
      0,
    ),
    photoCount: countries.reduce(
      (total, country) => total + country.photos.length,
      0,
    ),
  };
}

export function getNextPhotoIndex(currentIndex: number, photoCount: number) {
  if (photoCount <= 0) {
    return -1;
  }

  return (currentIndex + 1) % photoCount;
}

export function getPreviousPhotoIndex(currentIndex: number, photoCount: number) {
  if (photoCount <= 0) {
    return -1;
  }

  return (currentIndex - 1 + photoCount) % photoCount;
}
