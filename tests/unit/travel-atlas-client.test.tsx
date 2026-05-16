import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type ImgHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TravelAtlasPageClient from "@/components/travel/travel-atlas-client";
import { travelCountries } from "@/lib/travel-data";

vi.mock("@/components/travel/travel-globe-shell", () => ({
  default: ({
    selectedCountry,
  }: {
    selectedCountry: {
      name: string;
    };
  }) => (
    <div data-testid="travel-globe-shell">
      Globe focus: {selectedCountry.name}
    </div>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/travel",
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

vi.mock("next/image", () => ({
  default: ({
    src,
    alt,
    fill,
    priority,
    sizes,
    ...props
  }: ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean;
    priority?: boolean;
    sizes?: string;
  }) => {
    void fill;
    void priority;
    void sizes;

    return createElement("img", {
      src: String(src),
      alt: alt ?? "",
      ...props,
    });
  },
}));

describe("TravelAtlasPageClient", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/travel?country=nigeria");
  });

  it("renders the editorial hero with visible H1 and stats line", () => {
    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    expect(
      screen.getByRole("heading", { level: 1, name: /Notes from the road/i }),
    ).toBeVisible();

    const stats = screen.getByLabelText("Travel statistics");
    expect(within(stats).getAllByText("countries")).toHaveLength(2);
    expect(within(stats).getAllByText("continents")).toHaveLength(2);
    expect(within(stats).getAllByText("cities")).toHaveLength(2);
    expect(within(stats).getAllByText("memories")).toHaveLength(2);
  });

  it("sets the per-country accent CSS variable on the main wrapper", () => {
    const { container } = render(
      <TravelAtlasPageClient initialCountrySlug="nigeria" />,
    );

    const main = container.querySelector("main") as HTMLElement;
    expect(main).not.toBeNull();
    expect(main.style.getPropertyValue("--country-accent")).toBe(
      travelCountries[0].themeColor,
    );
  });

  it("renders the spotlight as a country wordmark with summary and pullquote", () => {
    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    const heading = screen.getByRole("heading", { level: 3, name: "Nigeria" });
    expect(heading).toBeVisible();

    const aside = heading.closest("aside") as HTMLElement;
    expect(aside).not.toBeNull();

    expect(
      within(aside).getByText(travelCountries[0].summary),
    ).toBeInTheDocument();

    const blockquote = aside.querySelector("blockquote");
    expect(blockquote).not.toBeNull();
    expect(blockquote?.className).toContain("editorial-pullquote");
  });

  it("demotes 'View Gallery' to a text link with a same-page anchor", () => {
    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    const link = screen.getByRole("link", { name: /View gallery/i });
    expect(link).toHaveAttribute("href", "#travel-gallery");
  });

  it("updates the selected country and URL from rail interaction", async () => {
    const user = userEvent.setup();

    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    await user.click(
      screen.getByRole("button", { name: "Select United Kingdom" }),
    );

    expect(
      screen.getByRole("heading", { level: 3, name: "United Kingdom" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("travel-globe-shell")).toHaveTextContent(
      "Globe focus: United Kingdom",
    );
    expect(window.location.search).toBe("?country=united-kingdom");
  });

  it("groups visited countries by continent", () => {
    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    expect(screen.getByText("Africa")).toBeInTheDocument();
    expect(screen.getByText("Europe")).toBeInTheDocument();
  });

  it("cycles countries with arrow keys when the globe frame has focus", async () => {
    const user = userEvent.setup();

    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    const frame = document.querySelector(
      "[data-travel-globe-frame]",
    ) as HTMLElement;
    expect(frame).not.toBeNull();

    frame.focus();
    expect(frame).toHaveFocus();

    await user.keyboard("{ArrowRight}");

    expect(
      screen.getByRole("heading", { level: 3, name: "United Kingdom" }),
    ).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");

    expect(
      screen.getByRole("heading", { level: 3, name: "Nigeria" }),
    ).toBeInTheDocument();
  });

  it("opens the gallery lightbox with the memory quote and a thumbnail strip", async () => {
    const user = userEvent.setup();

    window.history.replaceState(null, "", "/travel?country=united-kingdom");
    render(<TravelAtlasPageClient initialCountrySlug="united-kingdom" />);

    await user.click(
      screen.getByRole("button", { name: "Open London riverside walk" }),
    );

    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("Other memories")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", {
        name: /Show London riverside walk/,
      }),
    ).toHaveAttribute("aria-current", "true");

    expect(
      within(dialog).getByText(
        travelCountries[1].memory,
        { exact: false },
      ),
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", { name: /Show Edinburgh close/ }),
    );

    expect(
      within(dialog).getByRole("heading", { name: "Edinburgh close" }),
    ).toBeInTheDocument();
  });
});
