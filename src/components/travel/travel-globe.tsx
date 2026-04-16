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

const darkGlobePalette = {
  atmosphere: "#67e8f9",
  globe: "#08243f",
  emissive: "#020b16",
  selectedCountry: "rgba(45, 212, 191, 0.86)",
  visitedCountry: "rgba(96, 165, 250, 0.58)",
  visitedHover: "rgba(125, 211, 252, 0.72)",
  unvisitedCountry: "rgba(148, 163, 184, 0.14)",
  unvisitedHover: "rgba(148, 163, 184, 0.32)",
  strokeVisited: "rgba(226, 232, 240, 0.5)",
  strokeUnvisited: "rgba(148, 163, 184, 0.12)",
  side: "rgba(15, 23, 42, 0.2)",
  selectedPoint: "#f8fafc",
  ring: "rgba(125, 211, 252, 0.64)",
  shininess: 18,
} as const;

const lightGlobePalette = {
  atmosphere: "#2563eb",
  globe: "#7fb7ea",
  emissive: "#2563eb",
  selectedCountry: "rgba(20, 184, 166, 0.92)",
  visitedCountry: "rgba(37, 99, 235, 0.72)",
  visitedHover: "rgba(29, 78, 216, 0.82)",
  unvisitedCountry: "rgba(241, 245, 249, 0.78)",
  unvisitedHover: "rgba(219, 234, 254, 0.92)",
  strokeVisited: "rgba(15, 23, 42, 0.46)",
  strokeUnvisited: "rgba(37, 99, 235, 0.28)",
  side: "rgba(37, 99, 235, 0.18)",
  selectedPoint: "#0f172a",
  ring: "rgba(14, 116, 144, 0.58)",
  shininess: 14,
} as const;

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
  const palette = isDarkTheme ? darkGlobePalette : lightGlobePalette;

  const countryFeatures = useMemo(() => buildCountryFeatures(), []);
  const visitedByIso = useMemo(
    () => new Map(countries.map((country) => [country.isoNumeric, country])),
    [countries],
  );
  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: new Color(palette.globe),
        emissive: new Color(palette.emissive),
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
    };
    const observer = new MutationObserver(syncTheme);

    syncTheme();
    observer.observe(root, {
      attributeFilter: ["class"],
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
      return palette.selectedCountry;
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
      className="relative min-h-[19rem] overflow-hidden sm:min-h-[22rem] md:min-h-[30rem] lg:min-h-[32rem]"
      aria-label="Interactive globe of visited countries"
    >
      <div
        aria-hidden
        className="absolute inset-x-10 bottom-7 h-20 rounded-full bg-primary/12 blur-2xl dark:bg-cyan-300/10"
      />
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
        ringColor={() => palette.ring}
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
