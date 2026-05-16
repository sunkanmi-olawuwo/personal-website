import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import MagneticButton from "@/components/magnetic-button";

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

beforeEach(() => {
  let frameBudget = 80;
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    (callback: FrameRequestCallback) => {
      if (frameBudget-- <= 0) {
        return 1;
      }
      callback(0);
      return 1;
    },
  );
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("MagneticButton", () => {
  it("renders children inside an inline-block wrapper", () => {
    mockMatchMedia(false);
    const { container } = render(
      <MagneticButton>
        <button type="button">Tap me</button>
      </MagneticButton>,
    );

    const wrapper = container.querySelector("[data-magnetic-button]");
    expect(wrapper).not.toBeNull();
    expect(wrapper?.querySelector("button")?.textContent).toBe("Tap me");
  });

  it("translates the child toward the pointer when within the magnetic radius", () => {
    mockMatchMedia(false);
    const { container } = render(
      <MagneticButton radius={100} strength={0.5}>
        <button type="button">Tap me</button>
      </MagneticButton>,
    );

    const wrapper = container.querySelector(
      "[data-magnetic-button]",
    ) as HTMLElement;
    const child = wrapper.querySelector("button") as HTMLElement;

    wrapper.getBoundingClientRect = () =>
      ({ left: 100, top: 100, width: 100, height: 40, right: 200, bottom: 140, x: 100, y: 100, toJSON: () => ({}) }) as DOMRect;

    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 160, clientY: 130 }),
      );
    });

    expect(child.style.transform).toContain("translate3d");
    expect(child.style.transform).not.toContain("0px, 0px");
  });

  it("is inert when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    const { container } = render(
      <MagneticButton>
        <button type="button">Tap me</button>
      </MagneticButton>,
    );

    const wrapper = container.querySelector(
      "[data-magnetic-button]",
    ) as HTMLElement;
    const child = wrapper.querySelector("button") as HTMLElement;

    act(() => {
      window.dispatchEvent(
        new PointerEvent("pointermove", { clientX: 50, clientY: 50 }),
      );
    });

    expect(child.style.transform).toBe("");
  });
});
