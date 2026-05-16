"use client";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import {
  getNextPhotoIndex,
  getPreviousPhotoIndex,
  getTravelCountryBySlug,
  getTravelStats,
  resolveTravelCountryFromParam,
  travelCountries,
  type TravelCountry,
  type TravelPhoto,
} from "@/lib/travel-data";
import { cn } from "@/lib/utils";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import TravelGlobeShell from "./travel-globe-shell";

type TravelAtlasPageClientProps = {
  initialCountrySlug: string;
};

type AccentStyle = CSSProperties & {
  "--country-accent"?: string;
};

const CONTINENT_ORDER = [
  "Africa",
  "Europe",
  "Asia",
  "North America",
  "South America",
  "Oceania",
  "Antarctica",
] as const;

function groupCountriesByContinent(countries: readonly TravelCountry[]) {
  const groups = new Map<string, TravelCountry[]>();

  for (const country of countries) {
    const bucket = groups.get(country.continent) ?? [];
    bucket.push(country);
    groups.set(country.continent, bucket);
  }

  return [...groups.entries()].sort((a, b) => {
    const indexA = CONTINENT_ORDER.indexOf(
      a[0] as (typeof CONTINENT_ORDER)[number],
    );
    const indexB = CONTINENT_ORDER.indexOf(
      b[0] as (typeof CONTINENT_ORDER)[number],
    );
    const safeA = indexA === -1 ? CONTINENT_ORDER.length : indexA;
    const safeB = indexB === -1 ? CONTINENT_ORDER.length : indexB;

    return safeA - safeB;
  });
}

export default function TravelAtlasPageClient({
  initialCountrySlug,
}: TravelAtlasPageClientProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const countryParam = searchParams.get("country");
  const initialCountry = useMemo(
    () => getTravelCountryBySlug(initialCountrySlug) ?? travelCountries[0],
    [initialCountrySlug],
  );
  const [selectedSlug, setSelectedSlug] = useState(initialCountry.slug);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const selectedCountry =
    getTravelCountryBySlug(selectedSlug) ?? initialCountry;
  const stats = useMemo(() => getTravelStats(), []);
  const continentGroups = useMemo(
    () => groupCountriesByContinent(travelCountries),
    [],
  );

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    setSelectedSlug(resolveTravelCountryFromParam(countryParam).slug);
  }, [countryParam]);

  useEffect(() => {
    setLightboxIndex(null);
  }, [selectedCountry.slug]);

  const selectCountry = useCallback(
    (slug: string) => {
      const country = getTravelCountryBySlug(slug);

      if (!country) {
        return;
      }

      setSelectedSlug(country.slug);
      const params = new URLSearchParams(searchParams.toString());
      params.set("country", country.slug);
      window.history.pushState(null, "", `${pathname}?${params.toString()}`);
    },
    [pathname, searchParams],
  );

  const cycleCountry = useCallback(
    (direction: 1 | -1) => {
      const currentIndex = travelCountries.findIndex(
        (country) => country.slug === selectedCountry.slug,
      );

      if (currentIndex === -1) {
        return;
      }

      const length = travelCountries.length;
      const nextIndex = (currentIndex + direction + length) % length;

      selectCountry(travelCountries[nextIndex].slug);
    },
    [selectCountry, selectedCountry.slug],
  );

  const accentStyle: AccentStyle = {
    "--country-accent": selectedCountry.themeColor,
  };

  return (
    <main
      className="mx-auto flex w-full max-w-[52rem] flex-col gap-7 px-5 pb-12 pt-6 text-foreground sm:px-10 md:px-11 lg:max-w-[76rem] lg:gap-10 lg:px-8 lg:pt-9"
      data-travel-atlas-hydrated={isHydrated ? "true" : "false"}
      style={accentStyle}
    >
      <TravelHero supportingStats={stats} />

      <AtlasShell
        country={selectedCountry}
        onSelectCountry={selectCountry}
        onCycleCountry={cycleCountry}
      />

      <MemoryGallery
        country={selectedCountry}
        lightboxIndex={lightboxIndex}
        onOpenLightbox={setLightboxIndex}
        onCloseLightbox={() => setLightboxIndex(null)}
      />

      <VisitedCountriesGrid
        groups={continentGroups}
        selectedSlug={selectedCountry.slug}
        onSelectCountry={selectCountry}
      />
    </main>
  );
}

function TravelHero({
  supportingStats,
}: {
  supportingStats: ReturnType<typeof getTravelStats>;
}) {
  return (
    <section
      className="page-reveal flex flex-col gap-5"
      aria-labelledby="travel-hero-title"
    >
      <p className="w-fit rounded-full border border-border/70 bg-[hsl(var(--surface)/0.85)] px-3 py-1 font-display text-[0.66rem] font-semibold uppercase tracking-[0.32em] text-primary/85 shadow-[var(--shadow-soft)]">
        Travel
      </p>
      <h1
        id="travel-hero-title"
        className="font-display text-4xl font-bold tracking-[-0.035em] text-balance sm:text-5xl lg:text-6xl"
      >
        Notes from the road.
      </h1>
      <p className="max-w-2xl text-base leading-7 text-muted-foreground text-pretty sm:text-lg">
        A personal atlas of places that left texture behind — city light, long
        meals, rail windows, and the small details that make a trip stay with
        you.
      </p>
      <StatsLine stats={supportingStats} />
    </section>
  );
}

function StatsLine({
  stats,
}: {
  stats: ReturnType<typeof getTravelStats>;
}) {
  const items = [
    { value: stats.countryCount, label: "countries" },
    { value: stats.continentCount, label: "continents" },
    { value: stats.cityCount, label: "cities" },
    { value: stats.photoCount, label: "memories" },
  ];

  return (
    <dl
      className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground sm:text-sm"
      aria-label="Travel statistics"
    >
      {items.map((item, index) => (
        <div key={item.label} className="flex items-center gap-3">
          <div className="flex items-baseline gap-1.5">
            <dt className="sr-only">{item.label}</dt>
            <dd className="font-display text-base font-semibold text-foreground sm:text-lg">
              {item.value}
            </dd>
            <span aria-hidden className="font-display text-foreground/85">
              {item.label}
            </span>
          </div>
          {index < items.length - 1 ? (
            <span aria-hidden className="text-muted-foreground/45">
              ·
            </span>
          ) : null}
        </div>
      ))}
    </dl>
  );
}

function AtlasShell({
  country,
  onSelectCountry,
  onCycleCountry,
}: {
  country: TravelCountry;
  onSelectCountry: (slug: string) => void;
  onCycleCountry: (direction: 1 | -1) => void;
}) {
  const globeFrameRef = useRef<HTMLDivElement | null>(null);

  function handleGlobeKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      onCycleCountry(1);
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      onCycleCountry(-1);
    }
  }

  return (
    <section
      id="atlas"
      className="page-reveal page-reveal-delay-1 travel-shell px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
      aria-labelledby="travel-atlas-title"
    >
      <h2 id="travel-atlas-title" className="sr-only">
        Interactive travel atlas
      </h2>
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.85fr)] md:items-stretch lg:gap-8">
        <div
          ref={globeFrameRef}
          tabIndex={0}
          role="group"
          aria-label={`Interactive globe of visited countries — currently focused on ${country.name}. Use arrow keys to cycle.`}
          onKeyDown={handleGlobeKeyDown}
          className="travel-globe-frame -mx-2 sm:mx-0"
          data-travel-globe-frame
        >
          <TravelGlobeShell
            countries={travelCountries}
            selectedCountry={country}
            onSelectCountry={onSelectCountry}
          />
        </div>

        <SelectedCountryPanel country={country} />
      </div>
    </section>
  );
}

function SelectedCountryPanel({ country }: { country: TravelCountry }) {
  return (
    <aside
      aria-labelledby="selected-country-heading"
      className="relative flex flex-col gap-5 rounded-2xl border border-border/60 bg-[hsl(var(--surface)/0.92)] p-5 backdrop-blur-md sm:p-6"
    >
      <header className="flex flex-col gap-2">
        <p className="flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          <CountryFlagMark country={country} className="h-3.5 w-5" />
          <span>{country.visitLabel}</span>
        </p>
        <h3
          id="selected-country-heading"
          className="font-display text-3xl font-bold tracking-[-0.025em] text-foreground sm:text-4xl"
        >
          {country.name}
        </h3>
      </header>

      <p className="text-sm leading-6 text-muted-foreground sm:text-[0.95rem]">
        {country.summary}
      </p>

      <p className="flex flex-wrap items-baseline gap-x-1.5 gap-y-1 text-xs text-muted-foreground">
        <span className="font-display font-semibold uppercase tracking-[0.2em] text-foreground/65">
          Cities
        </span>
        <span aria-hidden className="text-muted-foreground/55">
          ·
        </span>
        <span className="text-foreground/90">{country.cities.join(", ")}</span>
      </p>

      <ul className="flex flex-wrap gap-1.5" aria-label="Highlights">
        {country.highlights.map((highlight) => (
          <li
            key={highlight}
            className="rounded-full border px-2.5 py-0.5 text-[0.66rem] font-medium text-foreground/85"
            style={{
              borderColor: `${country.themeColor}55`,
              backgroundColor: `${country.themeColor}14`,
            }}
          >
            {highlight}
          </li>
        ))}
      </ul>

      <blockquote className="editorial-pullquote text-sm sm:text-[0.95rem]">
        &ldquo;{country.memory}&rdquo;
      </blockquote>

      <a
        href="#travel-gallery"
        className="inline-arrow-link"
        onClick={(event) => {
          event.preventDefault();
          document
            .getElementById("travel-gallery")
            ?.scrollIntoView({ block: "start", behavior: "smooth" });
        }}
      >
        View gallery
      </a>
    </aside>
  );
}

function MemoryGallery({
  country,
  lightboxIndex,
  onOpenLightbox,
  onCloseLightbox,
}: {
  country: TravelCountry;
  lightboxIndex: number | null;
  onOpenLightbox: (index: number) => void;
  onCloseLightbox: () => void;
}) {
  function goToNextPhoto() {
    if (lightboxIndex === null) {
      return;
    }

    onOpenLightbox(getNextPhotoIndex(lightboxIndex, country.photos.length));
  }

  function goToPreviousPhoto() {
    if (lightboxIndex === null) {
      return;
    }

    onOpenLightbox(getPreviousPhotoIndex(lightboxIndex, country.photos.length));
  }

  return (
    <section
      id="travel-gallery"
      className="page-reveal page-reveal-delay-2 flex flex-col gap-4"
      aria-labelledby="travel-gallery-title"
    >
      <header className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Gallery
          </p>
          <h2
            id="travel-gallery-title"
            className="font-display text-2xl font-bold tracking-[-0.025em] sm:text-3xl"
          >
            {country.name} — {country.photos.length} memories
          </h2>
        </div>
        <span
          aria-hidden
          className="hidden h-px flex-1 self-end bg-gradient-to-r from-[var(--country-accent,hsl(var(--accent)))]/40 to-transparent sm:block"
        />
      </header>

      <EditorialGrid
        photos={country.photos}
        onOpenLightbox={onOpenLightbox}
      />

      <TravelLightbox
        country={country}
        lightboxIndex={lightboxIndex}
        onOpenChange={(open) => {
          if (!open) {
            onCloseLightbox();
          }
        }}
        onSelectPhoto={onOpenLightbox}
        onNext={goToNextPhoto}
        onPrevious={goToPreviousPhoto}
      />
    </section>
  );
}

function EditorialGrid({
  photos,
  onOpenLightbox,
}: {
  photos: readonly TravelPhoto[];
  onOpenLightbox: (index: number) => void;
}) {
  return (
    <div className="grid gap-3 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[14rem]">
      {photos.map((photo, index) => {
        const isHero = index === 0;

        return (
          <GalleryTile
            key={photo.src}
            photo={photo}
            index={index}
            isHero={isHero}
            onOpen={() => onOpenLightbox(index)}
            className={cn(
              "h-64 sm:h-72",
              isHero
                ? "lg:col-span-8 lg:row-span-2 lg:h-auto lg:min-h-[28rem]"
                : "lg:col-span-4 lg:h-auto",
            )}
          />
        );
      })}
    </div>
  );
}

function GalleryTile({
  photo,
  index,
  isHero,
  onOpen,
  className,
}: {
  photo: TravelPhoto;
  index: number;
  isHero: boolean;
  onOpen: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "gallery-tile group relative overflow-hidden rounded-2xl border border-border/60 bg-background text-left shadow-[var(--shadow-soft)] outline-none transition-[transform,border-color,box-shadow] duration-300",
        "hover:-translate-y-0.5 hover:shadow-[var(--shadow-medium)] focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      onClick={onOpen}
      aria-label={`Open ${photo.caption}`}
    >
      <Image
        fill
        src={photo.src}
        alt={photo.alt}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        sizes={
          isHero
            ? "(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw"
            : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        }
        priority={index === 0}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/45 to-transparent"
      />
      <span
        className={cn(
          "absolute inset-x-4 bottom-4 flex min-w-0 flex-col gap-1 text-white",
          isHero ? "sm:inset-x-6 sm:bottom-6" : null,
        )}
      >
        <span
          className={cn(
            "truncate font-display font-bold leading-tight tracking-[-0.02em]",
            isHero ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg",
          )}
        >
          {photo.caption}
        </span>
        {photo.location ? (
          <span
            className={cn(
              "truncate text-white/80",
              isHero ? "text-xs sm:text-sm" : "text-xs",
            )}
          >
            {photo.location}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function TravelLightbox({
  country,
  lightboxIndex,
  onOpenChange,
  onSelectPhoto,
  onNext,
  onPrevious,
}: {
  country: TravelCountry;
  lightboxIndex: number | null;
  onOpenChange: (open: boolean) => void;
  onSelectPhoto: (index: number) => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const photo = lightboxIndex === null ? undefined : country.photos[lightboxIndex];

  return (
    <Dialog open={Boolean(photo)} onOpenChange={onOpenChange}>
      {photo ? (
        <DialogContent className="max-h-[92vh] w-[min(94vw,72rem)] max-w-none overflow-hidden rounded-[1.75rem] border-white/12 bg-[hsl(var(--background))] p-0 text-foreground shadow-[var(--shadow-strong)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_22rem]">
            <div className="relative min-h-[54vh] bg-black lg:min-h-[78vh]">
              <Image
                fill
                src={photo.src}
                alt={photo.alt}
                className="object-contain"
                sizes="94vw"
                priority
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <button
                  type="button"
                  onClick={onPrevious}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Previous photo"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <button
                  type="button"
                  onClick={onNext}
                  className="grid h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-md transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label="Next photo"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5 border-t border-border/40 bg-[hsl(var(--surface))] px-5 py-6 lg:border-l lg:border-t-0 lg:px-6 lg:py-8">
              <p className="flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                <CountryFlagMark country={country} className="h-3.5 w-5" />
                {country.name}
              </p>
              <DialogTitle className="font-display text-2xl font-bold tracking-[-0.025em] text-foreground">
                {photo.caption}
              </DialogTitle>
              <DialogDescription className="text-sm leading-6 text-muted-foreground">
                {[photo.location, photo.takenOn].filter(Boolean).join(" · ")}
              </DialogDescription>

              <blockquote className="editorial-pullquote text-sm sm:text-[0.92rem]">
                &ldquo;{country.memory}&rdquo;
              </blockquote>

              <div className="mt-auto flex flex-col gap-2">
                <p className="font-display text-[0.6rem] font-semibold uppercase tracking-[0.32em] text-muted-foreground">
                  Other memories
                </p>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {country.photos.map((thumb, index) => {
                    const isActive = index === lightboxIndex;

                    return (
                      <button
                        key={thumb.src}
                        type="button"
                        onClick={() => onSelectPhoto(index)}
                        className={cn(
                          "relative h-14 w-20 flex-none overflow-hidden rounded-md border bg-background transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                          isActive
                            ? "scale-[1.02] border-2"
                            : "border-border/60 hover:border-[var(--country-accent,hsl(var(--accent)))] hover:scale-[1.02]",
                        )}
                        style={
                          isActive
                            ? { borderColor: country.themeColor }
                            : undefined
                        }
                        aria-label={`Show ${thumb.caption}`}
                        aria-current={isActive ? "true" : undefined}
                      >
                        <Image
                          fill
                          src={thumb.src}
                          alt=""
                          className="object-cover"
                          sizes="80px"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

function VisitedCountriesGrid({
  groups,
  selectedSlug,
  onSelectCountry,
}: {
  groups: Array<[string, TravelCountry[]]>;
  selectedSlug: string;
  onSelectCountry: (slug: string) => void;
}) {
  return (
    <section
      className="page-reveal page-reveal-delay-3 flex flex-col gap-6"
      aria-labelledby="visited-countries-title"
    >
      <header className="flex flex-col gap-1">
        <p className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          The atlas
        </p>
        <h2
          id="visited-countries-title"
          className="font-display text-2xl font-bold tracking-[-0.025em] sm:text-3xl"
        >
          Visited countries
        </h2>
      </header>

      <div className="flex flex-col gap-6">
        {groups.map(([continent, items]) => (
          <div key={continent} className="flex flex-col gap-3">
            <p className="flex items-center gap-3 font-display text-[0.62rem] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              <span>{continent}</span>
              <span aria-hidden className="text-muted-foreground/45">
                · {items.length}
              </span>
              <span
                aria-hidden
                className="h-px flex-1 bg-gradient-to-r from-border to-transparent"
              />
            </p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {items.map((country) => (
                <CountryTile
                  key={country.slug}
                  country={country}
                  isSelected={country.slug === selectedSlug}
                  onSelect={() => onSelectCountry(country.slug)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CountryTile({
  country,
  isSelected,
  onSelect,
}: {
  country: TravelCountry;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group flex min-h-12 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm shadow-[var(--shadow-soft)] transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isSelected
          ? "bg-[hsl(var(--surface)/0.95)]"
          : "border-border/60 bg-[hsl(var(--surface)/0.78)] hover:-translate-y-0.5 hover:border-[var(--country-accent,hsl(var(--accent)))]/45 hover:shadow-[var(--shadow-medium)]",
      )}
      style={
        isSelected
          ? {
              borderColor: country.themeColor,
              backgroundColor: `${country.themeColor}10`,
            }
          : undefined
      }
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={`Select ${country.name}`}
    >
      <span className="flex min-w-0 items-center gap-2.5 font-display text-sm font-semibold text-foreground">
        <CountryFlagMark country={country} />
        <span className="truncate">{country.name}</span>
      </span>
      <span
        className={cn(
          "h-2 w-2 shrink-0 rounded-full transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-60",
        )}
        style={{ backgroundColor: country.themeColor }}
        aria-hidden
      />
    </button>
  );
}

function CountryFlagMark({
  country,
  className,
}: {
  country: TravelCountry;
  className?: string;
}) {
  if (country.slug === "nigeria") {
    return (
      <span
        aria-hidden
        className={cn(
          "h-3.5 w-5 shrink-0 rounded-[2px] border border-white/40 bg-[linear-gradient(90deg,#16a34a_0_33%,#f8fafc_33%_66%,#16a34a_66%_100%)] shadow-sm",
          className,
        )}
      />
    );
  }

  if (country.slug === "united-kingdom") {
    return (
      <span
        aria-hidden
        className={cn(
          "relative h-3.5 w-5 shrink-0 overflow-hidden rounded-[2px] border border-white/40 bg-[#1d4ed8] shadow-sm",
          className,
        )}
      >
        <span className="absolute inset-y-0 left-1/2 w-1.5 -translate-x-1/2 bg-white" />
        <span className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 bg-white" />
        <span className="absolute inset-y-0 left-1/2 w-0.5 -translate-x-1/2 bg-red-600" />
        <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-red-600" />
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className={cn(
        "h-3.5 w-5 shrink-0 rounded-[2px] border border-white/40 shadow-sm",
        className,
      )}
      style={{ backgroundColor: country.themeColor }}
    />
  );
}
