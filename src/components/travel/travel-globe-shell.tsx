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
      className="flex min-h-[19rem] items-center justify-center sm:min-h-[22rem] md:min-h-[28rem] lg:min-h-[30rem]"
      role="status"
      aria-label="Loading travel globe"
    >
      <div className="relative aspect-square w-60 rounded-full bg-[radial-gradient(circle_at_34%_28%,hsl(var(--surface)/0.88),hsl(var(--primary)/0.18)_22%,hsl(var(--primary)/0.42)_52%,hsl(var(--primary)/0.78)_100%)] shadow-[0_0_92px_-30px_hsl(var(--primary)/0.6)] sm:w-72 lg:w-80">
        <div className="absolute inset-8 rounded-full border border-primary/15" />
        <span className="sr-only">Loading atlas</span>
      </div>
    </div>
  );
}

function TravelGlobeFallback() {
  return (
    <div className="flex min-h-[19rem] items-center justify-center sm:min-h-[22rem] md:min-h-[28rem] lg:min-h-[30rem]">
      <div
        className="aspect-square w-60 rounded-full bg-[radial-gradient(circle_at_30%_30%,hsl(var(--surface)/0.86),hsl(var(--primary)/0.2)_24%,hsl(var(--primary)/0.5)_58%,hsl(var(--primary)/0.82)_100%)] shadow-[0_0_88px_-26px_hsl(var(--primary)/0.6)] sm:w-72 lg:w-80"
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
