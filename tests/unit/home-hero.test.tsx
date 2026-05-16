import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import HomeHero from "@/components/home-hero";
import { siteProfile } from "@/lib/site-profile";

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    },
  );
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({
      matches: false,
      media: "",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("HomeHero", () => {
  it("does not render an empty eyebrow paragraph above the headline", () => {
    const { container } = render(<HomeHero />);

    const heading = container.querySelector("#home-hero-title") as HTMLElement;
    expect(heading).not.toBeNull();

    const previousSibling = heading.previousElementSibling;
    if (previousSibling instanceof HTMLElement) {
      expect(previousSibling.textContent?.trim()).not.toBe("");
    }
  });

  it("renders the noun phrase as a gradient highlight span", () => {
    const { container } = render(<HomeHero />);

    const heading = container.querySelector("#home-hero-title") as HTMLElement;
    expect(heading.textContent).toBe(siteProfile.heroHeadline);

    const highlightSpan = within(heading).getByText(
      siteProfile.heroHighlight ?? "reliable software systems",
      { exact: false },
    );

    expect(highlightSpan.tagName).toBe("SPAN");
    expect(highlightSpan.className).toMatch(/text-transparent/);
    expect(highlightSpan.className).toMatch(/bg-clip-text/);
  });

  it("wraps the primary CTA in a magnetic button", () => {
    render(<HomeHero />);

    const primary = screen.getByRole("link", {
      name: siteProfile.primaryCta.label,
    });

    const magneticWrapper = primary.closest("[data-magnetic-button]");
    expect(magneticWrapper).not.toBeNull();
  });

  it("renders the portrait inside the parallax wrapper", () => {
    const { container } = render(<HomeHero />);

    const parallax = container.querySelector("[data-parallax-portrait]");
    expect(parallax).not.toBeNull();
    expect(parallax?.querySelector("img")).not.toBeNull();
  });
});
