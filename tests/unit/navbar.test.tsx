import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const getBlogNameMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/requests", () => ({
  getBlogName: getBlogNameMock,
}));

import Navbar from "@/components/navbar";
import Providers from "@/components/providers";

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
  it("renders the brand link, theme menu, and GitHub link", async () => {
    await renderNavbar({
      displayTitle: "Design System Journal",
      title: "Fallback Title",
    });

    expect(
      screen.getByRole("link", { name: "Design System Journal" }),
    ).toHaveAttribute("href", "/");
    expect(
      screen.getByRole("button", { name: "Theme menu" }),
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
});
