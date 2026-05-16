import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const getBlogNameMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/requests", () => ({
  getBlogName: getBlogNameMock,
  subscribeToNewsletter: vi.fn(),
}));

vi.mock("@/lib/env", () => ({
  isNewsletterConfigured: false,
}));

import Footer from "@/components/footer";
import Providers from "@/components/providers";
import { siteProfile } from "@/lib/site-profile";

async function renderFooter() {
  getBlogNameMock.mockResolvedValueOnce({
    displayTitle: "Sunkanmi Olawuwo",
    title: "Sunkanmi Olawuwo",
  });

  const tree = await Footer();
  return render(<Providers>{tree}</Providers>);
}

describe("Footer", () => {
  it("renders the three structural columns and signature row", async () => {
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
      within(footer).getByRole("link", { name: "Latest essays" }),
    ).toHaveAttribute("href", "/#latest-writing");
    expect(within(footer).getByRole("link", { name: "About" })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(within(footer).getByRole("link", { name: "Now" })).toHaveAttribute(
      "href",
      "/now",
    );
    expect(within(footer).getByRole("link", { name: "RSS" })).toHaveAttribute(
      "href",
      "/rss.xml",
    );

    const socialLinks = siteProfile.socialLinks ?? [];
    expect(
      within(footer).getByRole("link", { name: socialLinks[0].label }),
    ).toHaveAttribute("href", socialLinks[0].href);

    expect(
      within(footer).getByText(/Built with Next\.js 16/),
    ).toBeInTheDocument();
  });
});
