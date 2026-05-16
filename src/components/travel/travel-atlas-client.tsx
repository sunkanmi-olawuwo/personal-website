"use client";

import {
  CameraIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  GlobeIcon,
  ImageIcon,
  LayersIcon,
  SewingPinIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
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

import { Button } from "../ui/button";
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

  function scrollToGallery() {
    document
      .getElementById("travel-gallery")
      ?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  return (
    <main
      className="mx-auto flex w-full max-w-[52rem] flex-col gap-7 px-5 pb-10 pt-6 text-foreground sm:px-10 md:px-11 lg:max-w-[76rem] lg:gap-9 lg:px-8 lg:pt-9"
      data-travel-atlas-hydrated={isHydrated ? "true" : "false"}
    >
      <section className="page-reveal" aria-labelledby="travel-hero-title">
        <SrOnlyTitle id="travel-hero-title" as="h1">
          Travel Atlas
        </SrOnlyTitle>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_16rem] md:items-start lg:gap-8">
          <div className="flex flex-col gap-3">
            <p className="w-fit rounded bg-primary/10 px-2 py-1 font-display text-[0.62rem] font-semibold uppercase text-primary dark:bg-cyan-300/10 dark:text-cyan-200">
              Travel
            </p>
            <div className="space-y-3">
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground dark:text-slate-300 sm:text-base">
                A personal atlas of places that left texture behind: city light,
                long meals, rail windows, and the small details that make a trip
                stay with you.
              </p>
            </div>
          </div>

          <dl className="grid max-w-sm grid-cols-2 gap-2 md:max-w-none">
            <TravelStat
              icon={<GlobeIcon className="h-4 w-4" />}
              label="Countries"
              value={stats.countryCount}
              accentColor={selectedCountry.themeColor}
            />
            <TravelStat
              icon={<LayersIcon className="h-4 w-4" />}
              label="Continents"
              value={stats.continentCount}
              accentColor={selectedCountry.themeColor}
            />
            <TravelStat
              icon={<SewingPinIcon className="h-4 w-4" />}
              label="Cities"
              value={stats.cityCount}
              accentColor={selectedCountry.themeColor}
            />
            <TravelStat
              icon={<CameraIcon className="h-4 w-4" />}
              label="Memories"
              value={stats.photoCount}
              accentColor={selectedCountry.themeColor}
            />
          </dl>
        </div>
      </section>

      <section
        id="atlas"
        className="page-reveal page-reveal-delay-1"
        aria-labelledby="travel-atlas-title"
      >
        <SrOnlyTitle id="travel-atlas-title">
          Interactive Travel Atlas
        </SrOnlyTitle>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1.55fr)_minmax(17rem,0.85fr)] md:items-center lg:gap-8">
          <div className="relative isolate overflow-hidden rounded-md border border-primary/20 bg-[radial-gradient(ellipse_at_50%_46%,hsl(var(--primary)/0.18),transparent_58%),linear-gradient(135deg,hsl(var(--surface)/0.98)_0%,hsl(var(--surface-strong)/0.78)_48%,hsl(var(--background)/0.9)_100%)] shadow-[var(--shadow-medium)] dark:border-transparent dark:bg-[radial-gradient(circle_at_50%_45%,rgba(45,212,191,0.18),transparent_45%)] dark:shadow-none">
            <div
              aria-hidden
              className="absolute inset-x-8 bottom-5 -z-10 h-20 rounded-full bg-primary/18 blur-2xl dark:bg-cyan-300/15"
            />
            <TravelGlobeShell
              countries={travelCountries}
              selectedCountry={selectedCountry}
              onSelectCountry={selectCountry}
            />
          </div>

          <SelectedCountryPanel
            country={selectedCountry}
            onGalleryClick={scrollToGallery}
          />
        </div>
      </section>

      <MemoryGallery
        country={selectedCountry}
        lightboxIndex={lightboxIndex}
        onOpenLightbox={setLightboxIndex}
        onCloseLightbox={() => setLightboxIndex(null)}
      />

      <VisitedCountryRail
        countries={travelCountries}
        selectedSlug={selectedCountry.slug}
        onSelectCountry={selectCountry}
      />
    </main>
  );
}

function TravelStat({
  icon,
  label,
  value,
  accentColor,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  accentColor: string;
}) {
  return (
    <div
      className="rounded-md border bg-[hsl(var(--surface)/0.9)] px-3 py-3 shadow-[var(--shadow-soft)] backdrop-blur dark:bg-slate-900/40 dark:shadow-[0_0_42px_-28px_rgba(45,212,191,0.78)]"
      style={{
        borderColor: `${accentColor}2f`,
      }}
    >
      <dt className="flex min-w-0 items-center gap-1.5 font-display text-[0.56rem] font-semibold uppercase text-muted-foreground dark:text-cyan-100/70">
        <span
          aria-hidden
          className="grid h-6 w-6 shrink-0 place-items-center rounded"
          style={{
            backgroundColor: `${accentColor}18`,
            color: accentColor,
          }}
        >
          {icon}
        </span>
        <span className="truncate">{label}</span>
      </dt>
      <dd className="mt-2 font-display text-2xl font-semibold leading-none text-foreground dark:text-slate-100">
        {value}
      </dd>
    </div>
  );
}

function SectionTitle({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="font-display text-2xl font-medium text-foreground dark:text-slate-200"
    >
      {children}
    </h2>
  );
}

function SrOnlyTitle({
  id,
  as = "h2",
  children,
}: {
  id: string;
  as?: "h1" | "h2";
  children: ReactNode;
}) {
  const Tag = as;

  return (
    <Tag id={id} className="sr-only">
      {children}
    </Tag>
  );
}

function SelectedCountryPanel({
  country,
  onGalleryClick,
}: {
  country: TravelCountry;
  onGalleryClick: () => void;
}) {
  return (
    <aside className="relative flex flex-col gap-4 rounded-md border border-border/80 bg-[hsl(var(--surface)/0.96)] p-4 shadow-[var(--shadow-soft)] backdrop-blur-md dark:border-cyan-200/20 dark:bg-slate-900/60 dark:text-slate-100 dark:shadow-[0_26px_80px_-54px_rgba(103,232,249,0.76)]">
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground dark:text-cyan-100/75">
          Country Spotlight:
        </p>
        <h3
          id="selected-country-heading"
          className="flex items-center gap-2 font-display text-2xl font-medium leading-tight text-foreground dark:text-slate-100"
        >
          <CountryFlagMark country={country} className="h-4 w-6" />
          {country.name}
        </h3>
        <p className="text-xs font-medium text-muted-foreground dark:text-slate-300">
          {country.visitLabel}
        </p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground dark:text-slate-300">
          Cities:
        </p>
        <div className="flex flex-wrap gap-2">
          {country.cities.map((city) => (
            <span
              key={city}
              className="rounded-md border border-border/70 bg-muted/70 px-2 py-1 text-[0.68rem] font-medium text-muted-foreground dark:border-white/10 dark:bg-white/10 dark:text-slate-200"
            >
              {city}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground dark:text-slate-300">
          Highlights:
        </p>
        <div className="flex flex-wrap gap-2">
          {country.highlights.map((highlight) => (
            <span
              key={highlight}
              className="rounded-md border px-2 py-1 text-[0.68rem] font-medium text-foreground dark:text-slate-100"
              style={{
                borderColor: `${country.themeColor}55`,
                backgroundColor: `${country.themeColor}18`,
              }}
            >
              {highlight}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs leading-5 text-muted-foreground dark:text-slate-200">
        &quot;{country.memory}&quot;
      </p>

      <Button
        type="button"
        onClick={onGalleryClick}
        className="h-9 w-fit gap-2 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground shadow-none hover:bg-primary/90 dark:bg-cyan-300 dark:text-slate-950 dark:hover:bg-cyan-200 dark:hover:text-slate-950 dark:hover:shadow-none"
      >
        <ImageIcon className="h-3.5 w-3.5" />
        View Gallery
      </Button>
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
  const selectedPhoto =
    lightboxIndex === null ? undefined : country.photos[lightboxIndex];

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
      className="page-reveal page-reveal-delay-2"
      aria-labelledby="travel-gallery-title"
    >
      <SrOnlyTitle id="travel-gallery-title">
        {country.name} Travel Gallery
      </SrOnlyTitle>
      <div className="mb-3 flex items-center gap-3 text-[0.68rem] font-semibold uppercase text-muted-foreground dark:text-slate-300">
        <span className="inline-flex min-w-0 items-center gap-2">
          <CountryFlagMark country={country} className="h-3 w-4" />
          <span className="truncate">Gallery</span>
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-gradient-to-r from-border to-transparent dark:from-cyan-200/20"
        />
        <span className="shrink-0">{country.photos.length} memories</span>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        {country.photos.map((photo, index) => (
          <GalleryTile
            key={photo.src}
            photo={photo}
            index={index}
            onOpen={() => onOpenLightbox(index)}
          />
        ))}
      </div>

      <TravelLightbox
        country={country}
        photo={selectedPhoto}
        onOpenChange={(open) => {
          if (!open) {
            onCloseLightbox();
          }
        }}
        onNext={goToNextPhoto}
        onPrevious={goToPreviousPhoto}
      />
    </section>
  );
}

function GalleryTile({
  photo,
  index,
  onOpen,
}: {
  photo: TravelPhoto;
  index: number;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group relative h-56 overflow-hidden rounded-md border border-border/75 bg-background text-left shadow-[var(--shadow-soft)] outline-none transition-[transform,border-color,box-shadow] duration-200 focus-visible:ring-2 focus-visible:ring-ring sm:h-60 md:h-64 lg:h-72",
        "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[var(--shadow-medium)] dark:border-white/10 dark:bg-slate-900 dark:hover:border-cyan-200/35",
      )}
      onClick={onOpen}
      aria-label={`Open ${photo.caption}`}
    >
      <Image
        fill
        src={photo.src}
        alt={photo.alt}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={index === 0}
      />
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/86 to-transparent"
      />
      <span className="absolute inset-x-3 bottom-3 flex min-w-0 flex-col gap-0.5 text-white">
        <span className="truncate font-display text-sm font-medium">
          {photo.caption}
        </span>
        {photo.location ? (
          <span className="truncate text-xs text-slate-200">
            {photo.location}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function TravelLightbox({
  country,
  photo,
  onOpenChange,
  onNext,
  onPrevious,
}: {
  country: TravelCountry;
  photo?: TravelPhoto;
  onOpenChange: (open: boolean) => void;
  onNext: () => void;
  onPrevious: () => void;
}) {
  return (
    <Dialog open={Boolean(photo)} onOpenChange={onOpenChange}>
      {photo ? (
        <DialogContent className="max-h-[92vh] w-[min(94vw,72rem)] max-w-none overflow-hidden rounded-lg border-white/15 bg-slate-950 p-0 text-white shadow-[var(--shadow-strong)]">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="relative min-h-[54vh] bg-black lg:min-h-[76vh]">
              <Image
                fill
                src={photo.src}
                alt={photo.alt}
                className="object-contain"
                sizes="94vw"
                priority
              />
              <div className="absolute inset-y-0 left-4 flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onPrevious}
                  className="h-11 w-11 rounded-lg border-white/20 bg-black/45 text-white hover:bg-white/12 hover:text-white"
                  aria-label="Previous photo"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </Button>
              </div>
              <div className="absolute inset-y-0 right-4 flex items-center">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onNext}
                  className="h-11 w-11 rounded-lg border-white/20 bg-black/45 text-white hover:bg-white/12 hover:text-white"
                  aria-label="Next photo"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex flex-col justify-end gap-4 border-t border-white/10 bg-slate-950 px-5 py-6 lg:border-l lg:border-t-0 lg:px-6">
              <p className="font-display text-xs font-semibold uppercase text-cyan-200">
                {country.flagEmoji} {country.name}
              </p>
              <DialogTitle className="font-display text-2xl font-bold text-white">
                {photo.caption}
              </DialogTitle>
              <DialogDescription className="text-base leading-7 text-slate-300">
                {[photo.location, photo.takenOn].filter(Boolean).join(" / ")}
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}

function VisitedCountryRail({
  countries,
  selectedSlug,
  onSelectCountry,
}: {
  countries: readonly TravelCountry[];
  selectedSlug: string;
  onSelectCountry: (slug: string) => void;
}) {
  return (
    <section
      className="page-reveal page-reveal-delay-3"
      aria-labelledby="visited-countries-title"
    >
      <SectionTitle id="visited-countries-title">
        Visited Countries
      </SectionTitle>

      <div className="mt-4 grid gap-2">
        {countries.map((country) => {
          const isSelected = country.slug === selectedSlug;

          return (
            <button
              key={country.slug}
              type="button"
              className={cn(
                "group grid min-h-9 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md border px-3 py-2 text-left text-sm shadow-[var(--shadow-soft)] transition-[transform,border-color,background-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary/45 bg-primary/10 dark:border-cyan-200/30 dark:bg-cyan-300/10"
                  : "border-border/75 bg-[hsl(var(--surface)/0.82)] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[var(--shadow-medium)] dark:border-white/10 dark:bg-slate-900/40 dark:hover:border-cyan-200/25",
              )}
              onClick={() => onSelectCountry(country.slug)}
              aria-pressed={isSelected}
              aria-label={`Select ${country.name}`}
            >
              <span className="min-w-0">
                <span className="flex items-center gap-2 font-display text-sm font-medium text-foreground dark:text-slate-200">
                  <CountryFlagMark country={country} />
                  {country.name}
                </span>
              </span>
              <span
                className={cn(
                  "h-2 w-2 justify-self-end rounded-full opacity-0 transition-opacity",
                  isSelected && "opacity-100",
                )}
                style={{ backgroundColor: country.themeColor }}
                aria-hidden
              />
            </button>
          );
        })}
      </div>
    </section>
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
