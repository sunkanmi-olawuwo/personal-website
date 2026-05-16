import { render, screen, within } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import BlogCard from "@/components/blog-card";
import type { PostMetadata, Tag } from "@/lib/types";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

function createTag(name: string, slug: string): Tag {
  return { id: `tag-${slug}`, name, slug };
}

function createPost(overrides: Partial<PostMetadata> = {}): PostMetadata {
  return {
    title: "Testing the happy path is not enough",
    slug: "testing-the-happy-path-is-not-enough",
    subtitle: "Subtitle copy that should be visible",
    publishedAt: "2026-05-12T09:00:00Z",
    readingMinutes: 6,
    content: { text: "Body preview text" },
    coverImage: { url: "https://example.com/cover.jpg" },
    author: { name: "Sunkanmi Olawuwo" },
    tags: [createTag("Testing", "testing"), createTag("Backend", "backend")],
    ...overrides,
  };
}

describe("BlogCard", () => {
  it("renders date and reading time meta for the default variant", () => {
    render(<BlogCard post={createPost()} />);

    expect(
      screen.getByRole("heading", {
        name: /Testing the happy path is not enough/,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/12 May 2026/)).toBeInTheDocument();
    expect(screen.getByText(/6 min read/)).toBeInTheDocument();
  });

  it("marks the featured variant with a span flag and badge", () => {
    render(<BlogCard post={createPost()} variant="featured" />);

    const card = screen.getByRole("heading", {
      name: /Testing the happy path is not enough/,
    }).closest("[data-blog-card]");
    expect(card).not.toBeNull();
    expect(card?.getAttribute("data-variant")).toBe("featured");
    expect(within(card as HTMLElement).getByText(/Featured essay/i)).toBeInTheDocument();
  });

  it("falls back to computing reading time when none is provided", () => {
    const post = createPost({
      readingMinutes: undefined,
      content: {
        text: Array.from({ length: 660 }, () => "word").join(" "),
      },
    });

    render(<BlogCard post={post} />);

    expect(screen.getByText(/3 min read/)).toBeInTheDocument();
  });

  it("uses the slug-derived view-transition-name on the cover container", () => {
    const { container } = render(
      <BlogCard post={createPost({ slug: "my-essay" })} />,
    );

    const cover = container.querySelector(".interactive-media") as HTMLElement | null;
    expect(cover).not.toBeNull();
    expect((cover?.style as CSSStyleDeclaration & { viewTransitionName: string }).viewTransitionName).toBe(
      "post-cover-my-essay",
    );
  });
});
