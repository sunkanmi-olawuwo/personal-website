import { render, screen } from "@testing-library/react";
import { createElement, type ImgHTMLAttributes } from "react";
import { describe, expect, it, vi } from "vitest";

import ProjectsGrid from "@/components/about/projects-grid";
import type { Project } from "@/lib/about-data";

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    sizes,
    unoptimized,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    sizes?: string;
    unoptimized?: boolean;
  }) => {
    void fill;
    void sizes;
    void unoptimized;
    return createElement("img", { src: String(src), alt: alt ?? "", ...props });
  },
}));

const PROJECTS: Project[] = [
  {
    title: "Hashnode Headless Blog",
    description: "Personal blog wired to Hashnode GraphQL.",
    stack: ["Next.js", "React"],
    repoHref: "https://github.com/example/repo",
    liveHref: "/",
    year: "2026",
  },
  {
    title: "Travel atlas",
    description: "Interactive globe.",
    stack: ["Three.js"],
    liveHref: "/travel",
    year: "2026",
  },
];

describe("ProjectsGrid", () => {
  it("renders one card per project with title, description, and stack chips", () => {
    render(<ProjectsGrid projects={PROJECTS} />);

    const cards = document.querySelectorAll("[data-project-card]");
    expect(cards).toHaveLength(2);

    expect(screen.getByRole("heading", { name: "Hashnode Headless Blog" })).toBeInTheDocument();
    expect(screen.getByText("Interactive globe.")).toBeInTheDocument();
    expect(screen.getByText("Three.js")).toBeInTheDocument();
  });

  it("renders Live and Source links when project has hrefs", () => {
    render(<ProjectsGrid projects={PROJECTS} />);

    const liveLinks = screen.getAllByRole("link", { name: /Live/i });
    expect(liveLinks.length).toBeGreaterThan(0);

    const sourceLinks = screen.getAllByRole("link", { name: /Source/i });
    expect(sourceLinks).toHaveLength(1);
  });

  it("points the archive link at the internal /archive route", () => {
    render(<ProjectsGrid projects={PROJECTS} />);

    const archive = screen.getByRole("link", { name: /Browse the full archive/i });
    expect(archive).toHaveAttribute("href", "/archive");
    expect(archive).not.toHaveAttribute("target", "_blank");
  });
});
