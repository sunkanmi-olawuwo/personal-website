import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import ReadingProgress from "@/components/reading-progress";

function setScroll({
  innerHeight = 1_000,
  scrollHeight = 3_000,
  scrollY = 0,
}: {
  innerHeight?: number;
  scrollHeight?: number;
  scrollY?: number;
} = {}) {
  Object.defineProperty(window, "innerHeight", {
    configurable: true,
    value: innerHeight,
  });
  Object.defineProperty(window, "scrollY", {
    configurable: true,
    value: scrollY,
  });
  Object.defineProperty(document.documentElement, "scrollHeight", {
    configurable: true,
    value: scrollHeight,
  });
}

beforeEach(() => {
  vi.spyOn(window, "requestAnimationFrame").mockImplementation(
    (cb: FrameRequestCallback) => {
      cb(0);
      return 1;
    },
  );
  vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ReadingProgress", () => {
  it("renders a progress bar that scales with scroll position", () => {
    setScroll({ scrollY: 0 });
    const { container } = render(<ReadingProgress />);

    const bar = container.querySelector("[data-reading-progress] span") as HTMLElement;
    expect(bar).not.toBeNull();
    expect(bar.style.transform).toBe("scaleX(0)");

    setScroll({ scrollY: 1_000 });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(bar.style.transform).toBe("scaleX(0.5)");
  });

  it("clamps progress to 1 when scrolled past the bottom", () => {
    setScroll({ scrollY: 0 });
    const { container } = render(<ReadingProgress />);
    const bar = container.querySelector("[data-reading-progress] span") as HTMLElement;

    setScroll({ scrollY: 10_000 });
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(bar.style.transform).toBe("scaleX(1)");
  });
});
