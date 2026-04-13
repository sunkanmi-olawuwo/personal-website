import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Posts from "@/components/posts";
import type { PostEdge, Tag } from "@/lib/types";

const getPostsMock = vi.hoisted(() => vi.fn());

vi.mock("@/lib/requests", () => ({
  getPosts: getPostsMock,
}));

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

vi.mock("@/components/blog-card", () => ({
  default: ({ post }: { post: { title: string } }) => (
    <article>{post.title}</article>
  ),
}));

function createTag(name: string, slug: string): Tag {
  return {
    id: `tag-${slug}`,
    name,
    slug,
  };
}

function createPostEdge({
  cursor,
  title,
  slug,
  tags,
}: {
  cursor: string;
  title: string;
  slug: string;
  tags: Tag[];
}): PostEdge {
  return {
    cursor,
    node: {
      title,
      slug,
      subtitle: `${title} subtitle`,
      content: {
        text: `${title} preview`,
      },
      coverImage: {
        url: "https://example.com/post.jpg",
      },
      author: {
        name: "Sunkanmi Olawuwo",
      },
      tags,
    },
  };
}

function renderPosts(tagSlug?: string) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <Posts tagSlug={tagSlug} />
    </QueryClientProvider>,
  );
}

afterEach(() => {
  getPostsMock.mockReset();
});

describe("Posts", () => {
  it("requests and presents a filtered tag view", async () => {
    const testingTag = createTag("Testing", "testing");
    const backendTag = createTag("Backend", "backend");

    getPostsMock.mockResolvedValueOnce([
      createPostEdge({
        cursor: "post-1",
        title: "Testing the happy path is not enough",
        slug: "testing-the-happy-path-is-not-enough",
        tags: [testingTag, backendTag],
      }),
    ]);

    renderPosts("testing");

    expect(await screen.findByText("Testing the happy path is not enough")).toBeInTheDocument();
    expect(getPostsMock).toHaveBeenCalledWith({
      pageParam: "",
      tagSlug: "testing",
    });
    expect(
      screen.getByText((content) => content.includes("Showing 1 article tagged")),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "All Articles" })).toHaveAttribute(
      "href",
      "/#latest-writing",
    );
  });

  it("shows a clear empty state when a tag has no matches", async () => {
    getPostsMock.mockResolvedValueOnce([]);

    renderPosts("ai-applications");

    expect(
      await screen.findByText((content) =>
        content.includes("No articles yet for AI Applications."),
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Show all articles" })).toHaveAttribute(
      "href",
      "/#latest-writing",
    );
  });
});
