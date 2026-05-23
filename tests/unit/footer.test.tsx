import { render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const getBlogNameMock = vi.hoisted(() => vi.fn());
const usePathnameMock = vi.hoisted(() => vi.fn().mockReturnValue("/"));

vi.mock("@/lib/requests", () => ({
  getBlogName: getBlogNameMock,
  subscribeToNewsletter: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  isNewsletterConfigured: false,
}));

vi.mock("next/navigation", () => ({
  usePathname: () => usePathnameMock(),
}));

import Footer from "@/components/footer";
import Providers from "@/components/providers";
import { siteProfile } from "@/lib/site-profile";

afterEach(() => {
  usePathnameMock.mockReturnValue("/");
});

async function renderFooter() {
  getBlogNameMock.mockResolvedValueOnce({
    displayTitle: "Sunkanmi Olawuwo",
    title: "Sunkanmi Olawuwo",
  });

  const tree = await Footer();
  return render(<Providers>{tree}</Providers>);
}

describe("Footer", () => {
  it("renders the newsletter signup and three structural columns on blog routes", async () => {
    usePathnameMock.mockReturnValue("/");

    await renderFooter();

    const footer = screen.getByRole("contentinfo");

    expect(within(footer).getByText("Stay in touch")).toBeInTheDocument();
    expect(
      within(footer).getByText("Short list. Real essays. Never spam."),
    ).toBeInTheDocument();
    expect(within(footer).getByPlaceholderText("email@address.com")).toBeInTheDocument();

    const columnHeadings = within(footer)
      .getAllByText(/^(Read|About|Elsewhere)$/)
      .filter((node) => node.tagName === "P");
    expect(columnHeadings.map((node) => node.textContent)).toEqual(
      expect.arrayContaining(["Read", "About", "Elsewhere"]),
    );

    expect(
      within(footer).getByRole("link", { name: "Start here" }),
    ).toHaveAttribute("href", "/start-here");
    expect(
      within(footer).getByRole("link", { name: "Latest essay" }),
    ).toHaveAttribute("href", "/#latest-writing");
    expect(within(footer).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(within(footer).getByRole("link", { name: "Now" })).toHaveAttribute(
      "href",
      "/now",
    );
    expect(
      within(footer).getByRole("link", { name: "Archive" }),
    ).toHaveAttribute("href", "/archive");
    expect(
      within(footer).getByRole("link", { name: "RSS feed" }),
    ).toHaveAttribute("href", "/rss.xml");

    const socialLinks = siteProfile.socialLinks ?? [];
    expect(
      within(footer).getByRole("link", { name: socialLinks[0].label }),
    ).toHaveAttribute("href", socialLinks[0].href);

    expect(
      within(footer).getByText(/Built with Next\.js 16/),
    ).toBeInTheDocument();
  });

  it("hides the newsletter signup on /about", async () => {
    usePathnameMock.mockReturnValue("/about");

    await renderFooter();

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).queryByText("Stay in touch")).not.toBeInTheDocument();
    expect(
      within(footer).queryByPlaceholderText("email@address.com"),
    ).not.toBeInTheDocument();

    // Link columns still render
    expect(within(footer).getByRole("link", { name: "Archive" })).toHaveAttribute(
      "href",
      "/archive",
    );
  });

  it("hides the newsletter signup on /archive", async () => {
    usePathnameMock.mockReturnValue("/archive");

    await renderFooter();

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).queryByText("Stay in touch")).not.toBeInTheDocument();
  });

  it("hides the newsletter signup on /travel", async () => {
    usePathnameMock.mockReturnValue("/travel");

    await renderFooter();

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).queryByText("Stay in touch")).not.toBeInTheDocument();
  });

  it("keeps the newsletter signup on a blog post detail page", async () => {
    usePathnameMock.mockReturnValue("/some-post-slug");

    await renderFooter();

    const footer = screen.getByRole("contentinfo");
    expect(within(footer).getByText("Stay in touch")).toBeInTheDocument();
  });
});
