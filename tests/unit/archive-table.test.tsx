import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ArchiveTable from "@/components/archive/archive-table";
import type { Project } from "@/lib/about-data";

const PROJECTS: Project[] = [
  {
    title: "Recent project",
    description: "Most recent thing.",
    stack: ["TypeScript", "Postgres"],
    repoHref: "https://github.com/example/recent",
    liveHref: "https://example.com",
    year: "2026",
    madeAt: "Acme",
  },
  {
    title: "Older project",
    description: "A previous build.",
    stack: ["Go"],
    year: "2023",
    madeAt: "Globex",
    madeAtHref: "https://example.com/globex",
  },
];

describe("ArchiveTable", () => {
  it("renders one row per project with year, title, stack, and made-at", () => {
    render(<ArchiveTable projects={PROJECTS} />);

    const rows = document.querySelectorAll("[data-archive-row]");
    expect(rows).toHaveLength(2);

    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Recent project" })).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders the made-at company as a link when madeAtHref is set", () => {
    render(<ArchiveTable projects={PROJECTS} />);

    const globex = screen.getByRole("link", { name: "Globex" });
    expect(globex).toHaveAttribute("href", "https://example.com/globex");
    expect(globex).toHaveAttribute("target", "_blank");
  });

  it("renders the project title as a link to liveHref when present", () => {
    render(<ArchiveTable projects={PROJECTS} />);

    const recent = screen.getByRole("link", { name: "Recent project" });
    expect(recent).toHaveAttribute("href", "https://example.com");
  });

  it("renders both external and repo icon links when both hrefs are set", () => {
    render(<ArchiveTable projects={PROJECTS} />);

    const rows = document.querySelectorAll("[data-archive-row]");
    const firstRow = rows[0] as HTMLElement;

    expect(
      within(firstRow).getByRole("link", { name: /Open Recent project live/i }),
    ).toBeInTheDocument();
    expect(
      within(firstRow).getByRole("link", { name: /Open Recent project repository/i }),
    ).toBeInTheDocument();
  });

  it("renders column headers", () => {
    render(<ArchiveTable projects={PROJECTS} />);

    expect(screen.getByText("Year")).toBeInTheDocument();
    expect(screen.getByText("Project")).toBeInTheDocument();
    expect(screen.getByText("Made at")).toBeInTheDocument();
    expect(screen.getByText("Built with")).toBeInTheDocument();
    expect(screen.getByText("Link")).toBeInTheDocument();
  });
});
