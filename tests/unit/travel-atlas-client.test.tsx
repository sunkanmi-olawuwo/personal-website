import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createElement, type ImgHTMLAttributes } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import TravelAtlasPageClient from "@/components/travel/travel-atlas-client";

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

  it("updates the selected country and URL from rail interaction", async () => {
    const user = userEvent.setup();

    render(<TravelAtlasPageClient initialCountrySlug="nigeria" />);

    expect(
      screen.getByRole("heading", { level: 3, name: "Nigeria" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Select United Kingdom" }));

    expect(
      screen.getByRole("heading", { level: 3, name: "United Kingdom" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("travel-globe-shell")).toHaveTextContent(
      "Globe focus: United Kingdom",
    );
    expect(window.location.search).toBe("?country=united-kingdom");
  });

  it("opens the gallery lightbox with the selected image and caption", async () => {
    const user = userEvent.setup();

    window.history.replaceState(null, "", "/travel?country=united-kingdom");
    render(<TravelAtlasPageClient initialCountrySlug="united-kingdom" />);

    await user.click(
      screen.getByRole("button", { name: "Open London riverside walk" }),
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "London riverside walk" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", {
        name: "A cool-toned riverside memory of London with soft city silhouettes.",
      }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next photo" }));

    expect(
      screen.getByRole("heading", { name: "Edinburgh close" }),
    ).toBeInTheDocument();
  });
});
