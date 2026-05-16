"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { type GlobeMethods } from "react-globe.gl";
import { Color, MeshPhongMaterial } from "three";
import { feature } from "topojson-client";
import countriesTopology from "world-atlas/countries-110m.json";

import type { TravelCountry } from "@/lib/travel-data";

type TravelGlobeProps = {
  countries: readonly TravelCountry[];
  selectedCountry: TravelCountry;
  onSelectCountry: (slug: string) => void;
};

type CountryFeature = {
  id: string | number;
  properties?: {
    name?: string;
  };
  geometry: {
    type: string;
    coordinates: unknown;
  };
};

type FeatureCollection = {
  features: CountryFeature[];
};

type GlobePalette = {
  atmosphere: string;
  globe: string;
  emissive: string;
  visitedCountry: string;
  visitedHover: string;
  unvisitedCountry: string;
  unvisitedHover: string;
  strokeVisited: string;
  strokeUnvisited: string;
  side: string;
  selectedPoint: string;
  shininess: number;
};

function readToken(name: string) {
  if (typeof window === "undefined") {
    return "";
  }

  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function hslToken(name: string, alpha?: number) {
  const value = readToken(name);

  if (!value) {
    return alpha === undefined ? "#000000" : "rgba(0,0,0,0)";
  }

  // Three.js Color and some color parsers expect the legacy comma-separated
  // syntax — `hsl(h, s%, l%)` — rather than the space-separated modern form.
  const commaSeparated = value.split(/\s+/).filter(Boolean).join(", ");

  return alpha === undefined
    ? `hsl(${commaSeparated})`
    : `hsla(${commaSeparated}, ${alpha})`;
}

function buildPalette(isDark: boolean): GlobePalette {
  if (isDark) {
    return {
      atmosphere: hslToken("--primary"),
      globe: hslToken("--background"),
      emissive: hslToken("--background"),
      visitedCountry: hslToken("--primary", 0.78),
      visitedHover: hslToken("--accent", 0.82),
      unvisitedCountry: hslToken("--foreground", 0.14),
      unvisitedHover: hslToken("--foreground", 0.28),
      strokeVisited: hslToken("--foreground", 0.78),
      strokeUnvisited: hslToken("--foreground", 0.38),
      side: hslToken("--background", 0.55),
      selectedPoint: hslToken("--foreground"),
      shininess: 18,
    };
  }

  return {
    atmosphere: hslToken("--primary"),
    globe: hslToken("--surface-strong"),
    emissive: hslToken("--primary"),
    visitedCountry: hslToken("--primary", 0.72),
    visitedHover: hslToken("--accent", 0.82),
    unvisitedCountry: hslToken("--surface", 0.85),
    unvisitedHover: hslToken("--muted", 0.7),
    strokeVisited: hslToken("--foreground", 0.45),
    strokeUnvisited: hslToken("--primary", 0.22),
    side: hslToken("--primary", 0.18),
    selectedPoint: hslToken("--foreground"),
    shininess: 14,
  };
}

function getFeatureIso(featureData: CountryFeature) {
  return String(featureData.id).padStart(3, "0");
}

function buildCountryFeatures() {
  const topology = countriesTopology as {
    objects: {
      countries: unknown;
    };
  };
  const geoJson = feature(
    countriesTopology,
    topology.objects.countries,
  ) as FeatureCollection;

  return geoJson.features;
}

const FALLBACK_DARK_PALETTE: GlobePalette = {
  atmosphere: "#5b9dff",
  globe: "#0b1426",
  emissive: "#020617",
  visitedCountry: "rgba(96, 165, 250, 0.78)",
  visitedHover: "rgba(251, 191, 36, 0.82)",
  unvisitedCountry: "rgba(226, 232, 240, 0.14)",
  unvisitedHover: "rgba(226, 232, 240, 0.28)",
  strokeVisited: "rgba(226, 232, 240, 0.78)",
  strokeUnvisited: "rgba(226, 232, 240, 0.38)",
  side: "rgba(11, 20, 38, 0.55)",
  selectedPoint: "#f8fafc",
  shininess: 18,
};

const FALLBACK_LIGHT_PALETTE: GlobePalette = {
  atmosphere: "#2563eb",
  globe: "#dbeafe",
  emissive: "#2563eb",
  visitedCountry: "rgba(37, 99, 235, 0.72)",
  visitedHover: "rgba(245, 158, 11, 0.82)",
  unvisitedCountry: "rgba(248, 250, 252, 0.85)",
  unvisitedHover: "rgba(219, 234, 254, 0.92)",
  strokeVisited: "rgba(15, 23, 42, 0.45)",
  strokeUnvisited: "rgba(37, 99, 235, 0.22)",
  side: "rgba(37, 99, 235, 0.18)",
  selectedPoint: "#0f172a",
  shininess: 14,
};

function safeBuildPalette(isDark: boolean) {
  if (typeof window === "undefined") {
    return isDark ? FALLBACK_DARK_PALETTE : FALLBACK_LIGHT_PALETTE;
  }

  return buildPalette(isDark);
}

export default function TravelGlobe({
  countries,
  selectedCountry,
  onSelectCountry,
}: TravelGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredIso, setHoveredIso] = useState<string | null>(null);
  const [size, setSize] = useState({
    width: 720,
    height: 360,
  });
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [paletteVersion, setPaletteVersion] = useState(0);
  const palette = useMemo(
    () => safeBuildPalette(isDarkTheme),
    // paletteVersion forces a re-build when CSS custom properties change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isDarkTheme, paletteVersion],
  );

  // The selected country's themeColor is the source of truth for accents on
  // the globe — it matches the `--country-accent` CSS variable set on the
  // travel page wrapper, without paying the cost of reading inherited
  // custom properties from a different element.
  const countryAccent = selectedCountry.themeColor;
  const ringColor = selectedCountry.themeColor;

  const countryFeatures = useMemo(() => buildCountryFeatures(), []);
  const visitedByIso = useMemo(
    () => new Map(countries.map((country) => [country.isoNumeric, country])),
    [countries],
  );
  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color(palette.globe || "#dbeafe"),
        emissive: new Color(palette.emissive || "#2563eb"),
        shininess: palette.shininess,
      }),
    [palette],
  );

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const width = Math.max(280, Math.floor(entry.contentRect.width));
      const height = Math.max(300, Math.floor(entry.contentRect.height));

      setSize({
        width,
        height,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const syncTheme = () => {
      setIsDarkTheme(root.classList.contains("dark"));
      setPaletteVersion((value) => value + 1);
    };
    const observer = new MutationObserver(syncTheme);

    syncTheme();
    observer.observe(root, {
      attributeFilter: ["class", "style"],
      attributes: true,
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    globeRef.current?.pointOfView(
      {
        lat: selectedCountry.focusLat,
        lng: selectedCountry.focusLng,
        altitude: 1.48,
      },
      950,
    );
  }, [selectedCountry]);

  useEffect(() => {
    return () => {
      globeMaterial.dispose();
    };
  }, [globeMaterial]);

  function getVisitedCountry(featureData: CountryFeature) {
    return visitedByIso.get(getFeatureIso(featureData));
  }

  function getCountryColor(featureData: CountryFeature) {
    const country = getVisitedCountry(featureData);
    const featureIso = getFeatureIso(featureData);

    if (country?.slug === selectedCountry.slug) {
      return countryAccent;
    }

    if (featureIso === hoveredIso && country) {
      return palette.visitedHover;
    }

    if (country) {
      return palette.visitedCountry;
    }

    if (featureIso === hoveredIso) {
      return palette.unvisitedHover;
    }

    return palette.unvisitedCountry;
  }

  return (
    <div
      ref={containerRef}
      data-travel-globe
      role="img"
      aria-label={`Interactive globe focused on ${selectedCountry.name}`}
      className="relative min-h-[19rem] overflow-hidden sm:min-h-[22rem] md:min-h-[28rem] lg:min-h-[30rem]"
    >
      <Globe
        ref={globeRef}
        width={size.width}
        height={size.height}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl={null}
        bumpImageUrl={null}
        globeMaterial={globeMaterial}
        showAtmosphere
        atmosphereColor={palette.atmosphere}
        atmosphereAltitude={isDarkTheme ? 0.16 : 0.11}
        polygonsData={countryFeatures}
        polygonGeoJsonGeometry={(polygon) =>
          (polygon as CountryFeature).geometry as {
            type: string;
            coordinates: number[];
          }
        }
        polygonCapColor={(polygon) =>
          getCountryColor(polygon as CountryFeature)
        }
        polygonSideColor={() => palette.side}
        polygonStrokeColor={(polygon) =>
          getVisitedCountry(polygon as CountryFeature)
            ? palette.strokeVisited
            : palette.strokeUnvisited
        }
        polygonAltitude={(polygon) => {
          const country = getVisitedCountry(polygon as CountryFeature);

          if (country?.slug === selectedCountry.slug) {
            return 0.035;
          }

          return country ? 0.022 : 0.006;
        }}
        polygonLabel={(polygon) => {
          const country = getVisitedCountry(polygon as CountryFeature);
          const fallbackName =
            (polygon as CountryFeature).properties?.name ?? "Country";

          if (!country) {
            return fallbackName;
          }

          return `${country.name}<br />${country.visitLabel}`;
        }}
        polygonsTransitionDuration={420}
        onPolygonHover={(polygon) => {
          setHoveredIso(
            polygon ? getFeatureIso(polygon as CountryFeature) : null,
          );
        }}
        onPolygonClick={(polygon) => {
          if (!polygon) {
            return;
          }

          const country = getVisitedCountry(polygon as CountryFeature);

          if (country) {
            onSelectCountry(country.slug);
          }
        }}
        pointsData={countries as object[]}
        pointLat="focusLat"
        pointLng="focusLng"
        pointAltitude={(point) =>
          (point as TravelCountry).slug === selectedCountry.slug ? 0.08 : 0.045
        }
        pointRadius={(point) =>
          (point as TravelCountry).slug === selectedCountry.slug ? 0.46 : 0.28
        }
        pointColor={(point) =>
          (point as TravelCountry).slug === selectedCountry.slug
            ? palette.selectedPoint
            : (point as TravelCountry).themeColor
        }
        pointLabel={(point) => (point as TravelCountry).name}
        ringsData={[selectedCountry] as object[]}
        ringLat="focusLat"
        ringLng="focusLng"
        ringAltitude={0.07}
        ringColor={() => ringColor}
        ringMaxRadius={4.5}
        ringPropagationSpeed={1.1}
        ringRepeatPeriod={1800}
        enablePointerInteraction
        showPointerCursor={(objectType, objectData) =>
          objectType === "polygon" &&
          Boolean(getVisitedCountry(objectData as CountryFeature))
        }
        onGlobeReady={() => {
          globeRef.current?.pointOfView(
            {
              lat: selectedCountry.focusLat,
              lng: selectedCountry.focusLng,
              altitude: 1.48,
            },
            0,
          );

          const controls = globeRef.current?.controls();

          if (!controls) {
            return;
          }

          controls.autoRotate = true;
          controls.autoRotateSpeed = 0.26;
          controls.enableDamping = true;
          controls.dampingFactor = 0.08;
        }}
      />
    </div>
  );
}
