import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ExperienceTimeline from "@/components/about/experience-timeline";
import type { Experience } from "@/lib/about-data";

const ENTRIES: Experience[] = [
  {
    period: "2024 — Present",
    role: "Staff Backend Engineer",
    company: "Acme",
    bullets: [
      "Owned the platform reliability roadmap.",
      "Led the migration to event-driven ingestion.",
    ],
    stack: ["TypeScript", "Postgres", "Kafka"],
  },
  {
    period: "2021 — 2024",
    role: "Senior Engineer",
    company: "Globex",
    companyHref: "https://example.com/globex",
    bullets: ["Cut p95 latency by 80%."],
    stack: ["Go", "Redis"],
  },
];

describe("ExperienceTimeline", () => {
  it("renders one entry per role with period and stack chips", () => {
    render(<ExperienceTimeline entries={ENTRIES} />);

    const entries = document.querySelectorAll("[data-experience-entry]");
    expect(entries).toHaveLength(2);

    expect(screen.getByText("2024 — Present")).toBeInTheDocument();
    expect(screen.getByText("Staff Backend Engineer", { exact: false })).toBeInTheDocument();
    expect(screen.getByText("Owned the platform reliability roadmap.")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
    expect(screen.getByText("Postgres")).toBeInTheDocument();
    expect(screen.getByText("Kafka")).toBeInTheDocument();
  });

  it("links the company name when companyHref is provided", () => {
    render(<ExperienceTimeline entries={ENTRIES} />);

    const globexEntry = screen.getByText("Senior Engineer", { exact: false }).closest("p");
    expect(globexEntry).not.toBeNull();

    const link = within(globexEntry as HTMLElement).getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com/globex");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("shows the View full résumé link when siteProfile.resumeHref is set", () => {
    render(<ExperienceTimeline entries={ENTRIES} />);

    expect(
      screen.getByRole("link", { name: /View full résumé/i }),
    ).toBeInTheDocument();
  });
});
