import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import PostToc from "@/components/post-toc";

class IntersectionObserverMock {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn().mockReturnValue([]);
  constructor() {}
}

beforeEach(() => {
  // jsdom does not provide IntersectionObserver.
  (globalThis as unknown as { IntersectionObserver: typeof IntersectionObserverMock }).IntersectionObserver =
    IntersectionObserverMock;
});

afterEach(() => {
  delete (globalThis as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
});

describe("PostToc", () => {
  it("returns null when there are fewer than two h2 headings", () => {
    const { container } = render(
      <PostToc html="<p>plain</p><h2>Only one</h2>" />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders heading entries with anchor hrefs", () => {
    const html =
      "<h2>The architecture</h2><p>...</p><h2>Operational concerns</h2><p>...</p><h2>Closing thoughts</h2>";

    render(<PostToc html={html} />);

    const nav = screen.getByLabelText("Table of contents");
    expect(nav).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "The architecture" }),
    ).toHaveAttribute("href", "#the-architecture");
    expect(
      screen.getByRole("link", { name: "Operational concerns" }),
    ).toHaveAttribute("href", "#operational-concerns");
    expect(
      screen.getByRole("link", { name: "Closing thoughts" }),
    ).toHaveAttribute("href", "#closing-thoughts");
  });

  it("disambiguates repeated heading slugs", () => {
    const html = "<h2>Section</h2><h2>Section</h2>";
    render(<PostToc html={html} />);

    const links = screen.getAllByRole("link", { name: "Section" });
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "#section");
    expect(links[1]).toHaveAttribute("href", "#section-1");
  });
});
