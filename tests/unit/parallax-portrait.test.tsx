import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ParallaxPortrait from "@/components/parallax-portrait";

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => ({
      matches: reducedMotion && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

function setScrollY(value: number) {
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value,
  });
}

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    (callback: FrameRequestCallback) => {
      callback(0);
      return 1;
    },
  );
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
  setScrollY(0);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ParallaxPortrait", () => {
  it("renders children inside a parallax wrapper", () => {
    mockMatchMedia(false);
    const { container } = render(
      <ParallaxPortrait>
        <span>portrait</span>
      </ParallaxPortrait>,
    );

    const wrapper = container.querySelector("[data-parallax-portrait]");
    expect(wrapper?.textContent).toBe("portrait");
  });

  it("updates the parallax CSS variable based on scroll distance", () => {
    mockMatchMedia(false);

    const { container } = render(
      <ParallaxPortrait maxOffset={15} factor={0.1}>
        <span>portrait</span>
      </ParallaxPortrait>,
    );

    const wrapper = container.querySelector(
      "[data-parallax-portrait]",
    ) as HTMLElement;

    wrapper.getBoundingClientRect = () =>
      ({ left: 0, top: 200, width: 320, height: 320, right: 320, bottom: 520, x: 0, y: 200, toJSON: () => ({}) }) as DOMRect;

    setScrollY(100);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    const offset = wrapper.style.getPropertyValue("--parallax-y");
    expect(offset).not.toBe("");
    expect(offset).not.toBe("0px");
  });

  it("clamps the offset to maxOffset under heavy scroll", () => {
    mockMatchMedia(false);

    const { container } = render(
      <ParallaxPortrait maxOffset={10} factor={1}>
        <span>portrait</span>
      </ParallaxPortrait>,
    );

    const wrapper = container.querySelector(
      "[data-parallax-portrait]",
    ) as HTMLElement;

    wrapper.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 320, height: 320, right: 320, bottom: 320, x: 0, y: 0, toJSON: () => ({}) }) as DOMRect;

    setScrollY(5_000);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(wrapper.style.getPropertyValue("--parallax-y")).toBe("-10.00px");
  });

  it("does nothing when the user prefers reduced motion", () => {
    mockMatchMedia(true);

    const { container } = render(
      <ParallaxPortrait>
        <span>portrait</span>
      </ParallaxPortrait>,
    );

    const wrapper = container.querySelector(
      "[data-parallax-portrait]",
    ) as HTMLElement;

    setScrollY(800);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(wrapper.style.getPropertyValue("--parallax-y")).toBe("");
  });
});
