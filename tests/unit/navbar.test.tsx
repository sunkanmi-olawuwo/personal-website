import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const getBlogNameMock = vi.hoisted(() => vi.fn());
const usePathnameMock = vi.hoisted(() => vi.fn().mockReturnValue("/"));

vi.mock("@/lib/requests", () => ({
  getBlogName: getBlogNameMock,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

afterEach(() => {
  usePathnameMock.mockReturnValue("/");
});

async function renderNavbar(
  blogName: {
    displayTitle?: string | null;
    title: string;
  } = {
    displayTitle: "Personal Website",
    title: "Personal Website",
  },
) {
  getBlogNameMock.mockResolvedValueOnce(blogName);
  const navbar = await Navbar();

  return render(<Providers>{navbar}</Providers>);
}

describe("Navbar", () => {
  it("renders the brand link, primary nav links, theme toggle, and GitHub link", async () => {
    await renderNavbar({
      displayTitle: "Design System Journal",
      title: "Fallback Title",
    });

    expect(
      screen.getByRole("link", { name: "Design System Journal" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Blog" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Travel" })).toHaveAttribute(
      "href",
      "/travel",
    );
    expect(
      within(
        screen.getByRole("navigation", { name: "Primary navigation" }),
      ).getAllByRole("link").map((link) => link.textContent),
    ).toEqual(["Blog", "Travel"]);
    expect(
      screen.getByRole("button", { name: /theme/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/atharvadeosthale/hashnode-headless-blog",
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });

  it("falls back to the base title when displayTitle is missing", async () => {
    await renderNavbar({
      displayTitle: null,
      title: "Base Title",
    });

    expect(screen.getByRole("link", { name: "Base Title" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("marks Blog as the active section on the home route", async () => {
    usePathnameMock.mockReturnValue("/");

    await renderNavbar();

    const blogLink = screen.getByRole("link", { name: "Blog" });
    expect(blogLink).toHaveAttribute("data-active", "true");
    expect(blogLink).toHaveAttribute("aria-current", "page");

    expect(screen.getByRole("link", { name: "Travel" })).not.toHaveAttribute(
      "data-active",
    );
  });

  it("marks Travel as the active section on the travel route", async () => {
    usePathnameMock.mockReturnValue("/travel");

    await renderNavbar();

    const travelLink = screen.getByRole("link", { name: "Travel" });
    expect(travelLink).toHaveAttribute("data-active", "true");
    expect(travelLink).toHaveAttribute("aria-current", "page");

    expect(screen.getByRole("link", { name: "Blog" })).not.toHaveAttribute(
      "data-active",
    );
  });
});
