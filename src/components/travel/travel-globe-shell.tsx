"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";

import type { TravelCountry } from "@/lib/travel-data";

type TravelGlobeShellProps = {
  countries: readonly TravelCountry[];
  selectedCountry: TravelCountry;
  onSelectCountry: (slug: string) => void;
};

const DynamicTravelGlobe = dynamic(() => import("./travel-globe"), {
  ssr: false,
  loading: () => <TravelGlobeLoading />,
});

type TravelGlobeBoundaryState = {
  hasError: boolean;
};

class TravelGlobeBoundary extends Component<
  { children: ReactNode },
  TravelGlobeBoundaryState
> {
  state: TravelGlobeBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return {
      hasError: true,
    };
  }

  componentDidCatch() {
    this.setState({
      hasError: true,
    });
  }

  render() {
    if (this.state.hasError) {
      return <TravelGlobeFallback />;
    }

    return this.props.children;
  }
}

export function TravelGlobeLoading() {
  return (
    <div
      className="flex min-h-[19rem] items-center justify-center sm:min-h-[22rem] md:min-h-[30rem] lg:min-h-[32rem]"
      role="status"
      aria-label="Loading travel globe"
    >
      <div className="relative aspect-square w-60 rounded-full bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.86),rgba(191,219,254,0.68)_20%,rgba(96,165,250,0.72)_48%,rgba(37,99,235,0.92)_100%)] shadow-[0_0_92px_-30px_rgba(37,99,235,0.86)] dark:bg-[radial-gradient(circle_at_34%_28%,rgba(255,255,255,0.26),rgba(45,212,191,0.22)_22%,rgba(8,47,73,0.98)_58%,rgba(2,6,23,1)_100%)] dark:shadow-[0_0_90px_-24px_rgba(45,212,191,0.72)] sm:w-72 lg:w-80">
        <div className="absolute inset-8 rounded-full border border-primary/10 dark:border-white/10" />
        <span className="sr-only">Loading atlas</span>
      </div>
    </div>
  );
}

function TravelGlobeFallback() {
  return (
    <div className="flex min-h-[19rem] items-center justify-center sm:min-h-[22rem] md:min-h-[30rem] lg:min-h-[32rem]">
      <div
        className="aspect-square w-60 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.86),rgba(191,219,254,0.68)_22%,rgba(96,165,250,0.72)_56%,rgba(37,99,235,0.92)_100%)] shadow-[0_0_92px_-30px_rgba(37,99,235,0.86)] dark:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.22),rgba(96,165,250,0.28)_25%,rgba(15,23,42,0.98)_62%,rgba(2,6,23,1)_100%)] dark:shadow-[0_0_88px_-24px_rgba(96,165,250,0.68)] sm:w-72 lg:w-80"
        aria-hidden
      />
      <p className="sr-only">
        The interactive globe is unavailable. Use the country list to browse the
        atlas.
      </p>
    </div>
  );
}

export default function TravelGlobeShell(props: TravelGlobeShellProps) {
  return (
    <TravelGlobeBoundary>
      <DynamicTravelGlobe {...props} />
    </TravelGlobeBoundary>
  );
}
