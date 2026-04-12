import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getMockPostBySlug,
  getMockPostsPage,
  mockPostEdges,
  mockPostSlugs,
  mockPublication,
} from "@/lib/mock-blog-data";

const requestMock = vi.hoisted(() => vi.fn());

vi.mock("graphql-request", () => ({
  default: requestMock,
  request: requestMock,
  gql: (strings: TemplateStringsArray, ...values: unknown[]) =>
    strings.reduce(
      (result, current, index) => result + current + (values[index] ?? ""),
      "",
    ),
}));

const ORIGINAL_ENV = { ...process.env };

async function importRequests(
  envOverrides: Record<string, string | undefined> = {},
) {
  vi.resetModules();

  process.env = { ...ORIGINAL_ENV };
  delete process.env.NEXT_PUBLIC_BLOG_DATA_MODE;
  delete process.env.NEXT_PUBLIC_HASHNODE_ENDPOINT;
  delete process.env.NEXT_PUBLIC_HASHNODE_PUBLICATION_ID;

  for (const [key, value] of Object.entries(envOverrides)) {
    if (value === undefined) {
      delete process.env[key];
      continue;
    }

    process.env[key] = value;
  }

  return import("@/lib/requests");
}

afterEach(() => {
  process.env = { ...ORIGINAL_ENV };
  requestMock.mockReset();
});

describe("requests", () => {
  it("returns mock blog data in mock mode without calling Hashnode", async () => {
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
    });

    await expect(getBlogName()).resolves.toEqual(mockPublication);
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("returns mock blog data in auto mode when Hashnode config is missing", async () => {
    const { getBlogName } = await importRequests();

    await expect(getBlogName()).resolves.toEqual(mockPublication);
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("returns mock blog data in auto mode when the request fails", async () => {
    requestMock.mockRejectedValueOnce(new Error("network down"));
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getBlogName()).resolves.toEqual(mockPublication);
    expect(requestMock).toHaveBeenCalledOnce();
  });

  it("returns live blog data when auto mode request succeeds", async () => {
    requestMock.mockResolvedValueOnce({
      publication: {
        title: "Live Title",
        displayTitle: "Live Display Title",
        favicon: "https://example.com/favicon.ico",
      },
    });
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getBlogName()).resolves.toEqual({
      title: "Live Title",
      displayTitle: "Live Display Title",
      favicon: "https://example.com/favicon.ico",
    });
  });

  it("throws in live mode when Hashnode config is missing", async () => {
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "live",
    });

    await expect(getBlogName()).rejects.toThrow(
      "Live blog data mode requires NEXT_PUBLIC_HASHNODE_ENDPOINT and NEXT_PUBLIC_HASHNODE_PUBLICATION_ID.",
    );
  });

  it("surfaces live mode request failures", async () => {
    requestMock.mockRejectedValueOnce(new Error("network down"));
    const { getBlogName } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "live",
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getBlogName()).rejects.toThrow("network down");
  });

  it("returns the first mock posts page in mock mode", async () => {
    const { getPosts } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
    });

    await expect(getPosts({ first: 9 })).resolves.toEqual(
      getMockPostsPage({ first: 9 }),
    );
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("returns the next mock posts page with a stable cursor", async () => {
    const { getPosts } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
    });

    await expect(
      getPosts({ first: 9, pageParam: mockPostEdges[8].cursor }),
    ).resolves.toEqual(getMockPostsPage({ first: 9, pageParam: mockPostEdges[8].cursor }));
  });

  it("returns mock posts in auto mode when the request fails", async () => {
    requestMock.mockRejectedValueOnce(new Error("network down"));
    const { getPosts } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getPosts({ first: 9 })).resolves.toEqual(
      getMockPostsPage({ first: 9 }),
    );
  });

  it("returns live posts when auto mode request succeeds", async () => {
    requestMock.mockResolvedValueOnce({
      publication: {
        posts: {
          edges: [
            {
              cursor: "cursor-1",
              node: {
                title: "Live Post",
                slug: "live-post",
                subtitle: "Subtitle",
                content: { text: "Preview" },
                coverImage: { url: "https://example.com/post.jpg" },
                author: {
                  name: "Author",
                  profilePicture: "https://example.com/author.jpg",
                },
              },
            },
          ],
        },
      },
    });
    const { getPosts } = await importRequests({
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getPosts({ first: 9 })).resolves.toEqual([
      expect.objectContaining({
        cursor: "cursor-1",
        node: expect.objectContaining({
          title: "Live Post",
          slug: "live-post",
        }),
      }),
    ]);
  });

  it("returns a mock post by slug in mock mode", async () => {
    const { getPostBySlug } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
    });

    await expect(getPostBySlug(mockPostSlugs[0])).resolves.toEqual(
      getMockPostBySlug(mockPostSlugs[0]),
    );
  });

  it("returns null for an unknown slug in mock mode", async () => {
    const { getPostBySlug } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
    });

    await expect(getPostBySlug("missing-post")).resolves.toBeNull();
  });

  it("resolves every mock slug to a full post", async () => {
    const { getPostBySlug } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
    });

    for (const slug of mockPostSlugs) {
      await expect(getPostBySlug(slug)).resolves.toEqual(
        expect.objectContaining({
          title: expect.any(String),
          content: expect.objectContaining({
            html: expect.stringContaining("<p>"),
          }),
        }),
      );
    }
  });

  it("returns a live post when the request succeeds", async () => {
    requestMock.mockResolvedValueOnce({
      publication: {
        post: {
          title: "Live Post",
          subtitle: "Live Subtitle",
          coverImage: { url: "https://example.com/post.jpg" },
          content: { html: "<p>Live content</p>" },
          author: {
            name: "Live Author",
            profilePicture: "https://example.com/author.jpg",
          },
        },
      },
    });
    const { getPostBySlug } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "live",
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(getPostBySlug("live-post")).resolves.toEqual(
      expect.objectContaining({
        title: "Live Post",
        content: { html: "<p>Live content</p>" },
      }),
    );
  });

  it("throws when subscribing in mock mode", async () => {
    const { subscribeToNewsletter } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "mock",
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(
      subscribeToNewsletter("reader@example.com"),
    ).rejects.toThrow(
      "Newsletter signups are unavailable until the Hashnode environment variables are configured.",
    );
    expect(requestMock).not.toHaveBeenCalled();
  });

  it("submits the newsletter request when Hashnode config exists outside mock mode", async () => {
    requestMock.mockResolvedValueOnce({
      subscribeToNewsletter: { status: "PENDING" },
    });
    const { subscribeToNewsletter } = await importRequests({
      NEXT_PUBLIC_BLOG_DATA_MODE: "live",
      NEXT_PUBLIC_HASHNODE_ENDPOINT: "https://gql.hashnode.com",
      NEXT_PUBLIC_HASHNODE_PUBLICATION_ID: "publication-id",
    });

    await expect(
      subscribeToNewsletter("reader@example.com"),
    ).resolves.toEqual({
      subscribeToNewsletter: { status: "PENDING" },
    });
    expect(requestMock).toHaveBeenCalledOnce();
  });
});
