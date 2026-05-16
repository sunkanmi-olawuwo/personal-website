import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AboutSectionRail, {
  type AboutSection,
} from "@/components/about/about-section-rail";

type Observer = {
  callback: IntersectionObserverCallback;
};

const observers: Observer[] = [];

class FakeIntersectionObserver {
  callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
    observers.push({ callback });
  }

  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

const SECTIONS: AboutSection[] = [
  { id: "identity", label: "Intro", accent: "#3b82f6" },
  { id: "about", label: "About", accent: "#f59e0b" },
  { id: "experience", label: "Experience", accent: "#3b82f6" },
];

function makeEntry(id: string, ratio: number): IntersectionObserverEntry {
  const target = document.getElementById(id) as Element;

  return {
    target,
    isIntersecting: ratio > 0,
    intersectionRatio: ratio,
    boundingClientRect: target.getBoundingClientRect(),
    intersectionRect: target.getBoundingClientRect(),
    rootBounds: null,
    time: 0,
  } as IntersectionObserverEntry;
}

beforeEach(() => {
  observers.length = 0;

  for (const section of SECTIONS) {
    const node = document.createElement("section");
    node.id = section.id;
    document.body.appendChild(node);
  }

  Object.defineProperty(window, "IntersectionObserver", {
    configurable: true,
    value: FakeIntersectionObserver,
  });
});

afterEach(() => {
  for (const section of SECTIONS) {
    document.getElementById(section.id)?.remove();
  }
  vi.restoreAllMocks();
});

describe("AboutSectionRail", () => {
  it("renders one link per section in both vertical and horizontal nav", () => {
    render(<AboutSectionRail sections={SECTIONS} />);

    const intro = screen.getAllByRole("link", { name: "Intro" });
    expect(intro.length).toBe(2);

    const about = screen.getAllByRole("link", { name: "About" });
    expect(about.length).toBe(2);
  });

  it("marks the first section active by default", () => {
    render(<AboutSectionRail sections={SECTIONS} />);

    const introLinks = screen.getAllByRole("link", { name: "Intro" });
    for (const link of introLinks) {
      expect(link).toHaveAttribute("data-active", "true");
      expect(link).toHaveAttribute("aria-current", "location");
    }
  });

  it("updates the active section when IntersectionObserver fires", () => {
    render(<AboutSectionRail sections={SECTIONS} />);

    expect(observers.length).toBeGreaterThan(0);

    act(() => {
      observers[0].callback(
        [makeEntry("experience", 0.9), makeEntry("about", 0.2)],
        {} as IntersectionObserver,
      );
    });

    const experienceLinks = screen.getAllByRole("link", { name: "Experience" });
    for (const link of experienceLinks) {
      expect(link).toHaveAttribute("data-active", "true");
    }

    const introLinks = screen.getAllByRole("link", { name: "Intro" });
    for (const link of introLinks) {
      expect(link).not.toHaveAttribute("data-active");
    }
  });

  it("updates the location hash and scrolls when a link is clicked", () => {
    const target = document.getElementById("projects-target");

    if (target) {
      target.remove();
    }

    const projectsSection = document.createElement("section");
    projectsSection.id = "projects-target";
    projectsSection.scrollIntoView = vi.fn();
    document.body.appendChild(projectsSection);

    const sectionsWithProjects: AboutSection[] = [
      ...SECTIONS,
      { id: "projects-target", label: "Projects" },
    ];

    render(<AboutSectionRail sections={sectionsWithProjects} />);

    const link = screen
      .getAllByRole("link", { name: "Projects" })[0] as HTMLAnchorElement;

    fireEvent.click(link);

    expect(projectsSection.scrollIntoView).toHaveBeenCalledWith(
      expect.objectContaining({ behavior: "smooth" }),
    );
    expect(window.location.hash).toBe("#projects-target");

    projectsSection.remove();
  });
});
