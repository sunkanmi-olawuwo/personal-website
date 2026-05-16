import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import CertificationsGrid from "@/components/about/certifications-grid";
import type { Certification } from "@/lib/about-data";

const CERTS: Certification[] = [
  {
    code: "AI-103",
    name: "Azure AI Apps and Agents Developer Associate",
    issuer: "Microsoft Azure",
    issuerKind: "azure",
    year: "2026",
    status: "active",
    href: "https://learn.microsoft.com/credential/AI-103",
  },
  {
    name: "RAG Accelerator Training",
    issuer: "Internal program",
    issuerKind: "internal",
    year: "2025",
    status: "completed",
    href: "https://example.com/rag",
  },
  {
    name: "SAFe Agile Project Manager",
    issuer: "Scaled Agile",
    issuerKind: "safe",
    year: "2024",
    href: "https://www.scaledagile.com/",
  },
];

describe("CertificationsGrid", () => {
  it("renders one card per certification", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    const cards = document.querySelectorAll("[data-certification-card]");
    expect(cards).toHaveLength(3);
  });

  it("hero-renders the code when present, name when absent", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    expect(screen.getByText("AI-103")).toBeInTheDocument();
    expect(
      screen.getByText("Azure AI Apps and Agents Developer Associate"),
    ).toBeInTheDocument();

    expect(screen.getByText("RAG Accelerator Training")).toBeInTheDocument();
    expect(screen.getByText("SAFe Agile Project Manager")).toBeInTheDocument();
  });

  it("renders issuer, year, and status pill", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    expect(screen.getByText("Microsoft Azure")).toBeInTheDocument();
    expect(screen.getByText("Internal program")).toBeInTheDocument();
    expect(screen.getByText("Scaled Agile")).toBeInTheDocument();

    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();

    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("attaches the issuer kind as a data attribute on each card", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    const cards = document.querySelectorAll("[data-certification-card]");
    expect(cards[0]).toHaveAttribute("data-issuer", "azure");
    expect(cards[1]).toHaveAttribute("data-issuer", "internal");
    expect(cards[2]).toHaveAttribute("data-issuer", "safe");
  });

  it("renders each card as a clickable link to the verification URL", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    const verifyAzure = screen.getByRole("link", {
      name: /Verify AI-103 on the issuer's site/i,
    });
    expect(verifyAzure).toHaveAttribute(
      "href",
      "https://learn.microsoft.com/credential/AI-103",
    );
    expect(verifyAzure).toHaveAttribute("target", "_blank");

    const verifySafe = screen.getByRole("link", {
      name: /Verify SAFe Agile Project Manager/i,
    });
    expect(verifySafe).toHaveAttribute("href", "https://www.scaledagile.com/");
    expect(verifySafe).toHaveAttribute("target", "_blank");
  });

  it("shows the Verify affordance on every card", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    const cards = document.querySelectorAll("[data-certification-card]");
    for (const card of cards) {
      expect(card.textContent).toContain("Verify");
    }
  });

  it("sets the issuer accent CSS variable on each card", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    const azureCard = document.querySelector(
      '[data-certification-card][data-issuer="azure"]',
    ) as HTMLElement;
    expect(azureCard.style.getPropertyValue("--issuer-accent")).toBe(
      "hsl(212 92% 56%)",
    );

    const internalCard = document.querySelector(
      '[data-certification-card][data-issuer="internal"]',
    ) as HTMLElement;
    expect(internalCard.style.getPropertyValue("--issuer-accent")).toBe(
      "hsl(var(--accent))",
    );
  });

  it("scopes the year to its card so multiple cards with the same year don't clash", () => {
    render(<CertificationsGrid certifications={CERTS} />);

    const cards = document.querySelectorAll("[data-certification-card]");
    const ragCard = cards[1] as HTMLElement;
    expect(within(ragCard).getByText("2025")).toBeInTheDocument();
  });
});
